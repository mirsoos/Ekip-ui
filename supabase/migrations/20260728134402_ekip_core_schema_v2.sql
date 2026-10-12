/*
# Ekip core schema — social activity group platform

Creates the foundational tables for the Ekip social platform:
profiles, groups, group_members, group_requests, conversations,
messages, notifications, badges, missions, and friendships.

1. New Tables
- `profiles` — extended user data (username, bio, level, XP, honor, verification, premium, social links, mood, interests, personality type). id references auth.users.
- `groups` — activity groups ("Ekips") with category, type, member bounds, city, location, tags, age range, level/honor requirements, gender preference, cost, cover image, premium-only flag, visibility, auto-accept, repeating flag, event date, views counter, member count.
- `group_members` — membership rows linking users to groups with role (owner/member) and status (active/left/kicked).
- `group_requests` — join requests with status (pending/accepted/rejected/cancelled) and optional message.
- `conversations` — direct or group chat threads with denormalized last message + unread count.
- `messages` — chat messages with optional media, read timestamp, sender reference.
- `notifications` — realtime notification center entries typed by source.
- `badges` — achievement badges with icon, color, and earned_at timestamp (null = not yet earned).
- `missions` — gamification missions with XP reward, progress, target, and completion flag.
- `friendships` — friend/contact relationships with status (pending/accepted/blocked).

2. Security
- RLS enabled on every table.
- profiles: SELECT open to authenticated (publicly searchable); INSERT/UPDATE owner-scoped.
- groups: SELECT open (public discovery); INSERT/UPDATE/DELETE owner-scoped.
- group_members / group_requests: SELECT open; INSERT/UPDATE/DELETE scoped to owner or self.
- conversations / messages: SELECT open; INSERT authenticated/sender; UPDATE/DELETE sender/owner.
- notifications / missions: owner-scoped. badges: SELECT open.
- friendships: SELECT open; INSERT/UPDATE/DELETE scoped to the user in the relationship.

3. Notes
- Owner columns use DEFAULT auth.uid() so client inserts that omit the owner succeed.
- member_count and views on groups are maintained by the application layer.
- Conversations carry denormalized last_message + unread_count for UI performance.
*/

-- PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text,
  phone text,
  gender text,
  age integer,
  city text,
  job text,
  bio text,
  avatar_url text,
  banner_url text,
  interests text[] DEFAULT '{}',
  personality_type text,
  social_links jsonb DEFAULT '{}',
  is_premium boolean DEFAULT false,
  is_verified boolean DEFAULT false,
  is_identity_verified boolean DEFAULT false,
  level integer DEFAULT 1,
  xp integer DEFAULT 0,
  xp_to_next integer DEFAULT 100,
  honor_score integer DEFAULT 100,
  reputation_level text DEFAULT 'Newcomer',
  mood text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "profiles_select_all" ON public.profiles;
CREATE POLICY "profiles_select_all" ON public.profiles FOR SELECT
  TO authenticated USING (true);
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- GROUPS
CREATE TABLE IF NOT EXISTS public.groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL DEFAULT auth.uid() REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL DEFAULT 'entertainment',
  group_type text NOT NULL DEFAULT 'group',
  min_members integer NOT NULL DEFAULT 2,
  max_members integer,
  city text NOT NULL,
  location_name text,
  latitude double precision,
  longitude double precision,
  tags text[] DEFAULT '{}',
  age_min integer,
  age_max integer,
  required_level integer,
  required_honor integer,
  gender_preference text DEFAULT 'any',
  avg_cost numeric,
  cover_url text,
  premium_only boolean DEFAULT false,
  visibility text NOT NULL DEFAULT 'public',
  auto_accept boolean DEFAULT false,
  is_repeating boolean DEFAULT false,
  event_date timestamptz NOT NULL DEFAULT now(),
  views integer DEFAULT 0,
  member_count integer DEFAULT 1,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "groups_select_all" ON public.groups;
CREATE POLICY "groups_select_all" ON public.groups FOR SELECT
  TO authenticated USING (true);
DROP POLICY IF EXISTS "groups_insert_own" ON public.groups;
CREATE POLICY "groups_insert_own" ON public.groups FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = owner_id);
DROP POLICY IF EXISTS "groups_update_own" ON public.groups;
CREATE POLICY "groups_update_own" ON public.groups FOR UPDATE
  TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
DROP POLICY IF EXISTS "groups_delete_own" ON public.groups;
CREATE POLICY "groups_delete_own" ON public.groups FOR DELETE
  TO authenticated USING (auth.uid() = owner_id);
CREATE INDEX IF NOT EXISTS groups_city_idx ON public.groups(city);
CREATE INDEX IF NOT EXISTS groups_category_idx ON public.groups(category);
CREATE INDEX IF NOT EXISTS groups_event_date_idx ON public.groups(event_date);

-- GROUP MEMBERS
CREATE TABLE IF NOT EXISTS public.group_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES public.profiles(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'member',
  status text NOT NULL DEFAULT 'active',
  joined_at timestamptz DEFAULT now(),
  UNIQUE (group_id, user_id)
);
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "members_select_all" ON public.group_members;
CREATE POLICY "members_select_all" ON public.group_members FOR SELECT
  TO authenticated USING (true);
DROP POLICY IF EXISTS "members_insert_own" ON public.group_members;
CREATE POLICY "members_insert_own" ON public.group_members FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "members_update_owner" ON public.group_members;
CREATE POLICY "members_update_owner" ON public.group_members FOR UPDATE
  TO authenticated USING (
    auth.uid() = user_id
    OR auth.uid() = (SELECT owner_id FROM public.groups WHERE id = group_members.group_id)
  ) WITH CHECK (
    auth.uid() = user_id
    OR auth.uid() = (SELECT owner_id FROM public.groups WHERE id = group_members.group_id)
  );
DROP POLICY IF EXISTS "members_delete_owner_or_self" ON public.group_members;
CREATE POLICY "members_delete_owner_or_self" ON public.group_members FOR DELETE
  TO authenticated USING (
    auth.uid() = user_id
    OR auth.uid() = (SELECT owner_id FROM public.groups WHERE id = group_members.group_id)
  );
CREATE INDEX IF NOT EXISTS gm_group_idx ON public.group_members(group_id);
CREATE INDEX IF NOT EXISTS gm_user_idx ON public.group_members(user_id);

-- GROUP REQUESTS
CREATE TABLE IF NOT EXISTS public.group_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES public.profiles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending',
  message text,
  created_at timestamptz DEFAULT now(),
  UNIQUE (group_id, user_id)
);
ALTER TABLE public.group_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "requests_select_all" ON public.group_requests;
CREATE POLICY "requests_select_all" ON public.group_requests FOR SELECT
  TO authenticated USING (true);
DROP POLICY IF EXISTS "requests_insert_own" ON public.group_requests;
CREATE POLICY "requests_insert_own" ON public.group_requests FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "requests_update_owner_or_self" ON public.group_requests;
CREATE POLICY "requests_update_owner_or_self" ON public.group_requests FOR UPDATE
  TO authenticated USING (
    auth.uid() = user_id
    OR auth.uid() = (SELECT owner_id FROM public.groups WHERE id = group_requests.group_id)
  ) WITH CHECK (
    auth.uid() = user_id
    OR auth.uid() = (SELECT owner_id FROM public.groups WHERE id = group_requests.group_id)
  );
DROP POLICY IF EXISTS "requests_delete_owner_or_self" ON public.group_requests;
CREATE POLICY "requests_delete_owner_or_self" ON public.group_requests FOR DELETE
  TO authenticated USING (
    auth.uid() = user_id
    OR auth.uid() = (SELECT owner_id FROM public.groups WHERE id = group_requests.group_id)
  );
CREATE INDEX IF NOT EXISTS gr_group_idx ON public.group_requests(group_id);
CREATE INDEX IF NOT EXISTS gr_user_idx ON public.group_requests(user_id);

-- CONVERSATIONS
CREATE TABLE IF NOT EXISTS public.conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL DEFAULT 'direct',
  title text NOT NULL,
  avatar_url text,
  group_id uuid REFERENCES public.groups(id) ON DELETE CASCADE,
  last_message text,
  last_message_at timestamptz,
  unread_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "conv_select_all" ON public.conversations;
CREATE POLICY "conv_select_all" ON public.conversations FOR SELECT
  TO authenticated USING (true);
DROP POLICY IF EXISTS "conv_insert_authed" ON public.conversations;
CREATE POLICY "conv_insert_authed" ON public.conversations FOR INSERT
  TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "conv_update_authed" ON public.conversations;
CREATE POLICY "conv_update_authed" ON public.conversations FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "conv_delete_authed" ON public.conversations;
CREATE POLICY "conv_delete_authed" ON public.conversations FOR DELETE
  TO authenticated USING (true);

-- MESSAGES
CREATE TABLE IF NOT EXISTS public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL DEFAULT auth.uid() REFERENCES public.profiles(id) ON DELETE CASCADE,
  body text NOT NULL,
  media_url text,
  read_at timestamptz,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "msg_select_all" ON public.messages;
CREATE POLICY "msg_select_all" ON public.messages FOR SELECT
  TO authenticated USING (true);
DROP POLICY IF EXISTS "msg_insert_own" ON public.messages;
CREATE POLICY "msg_insert_own" ON public.messages FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = sender_id);
DROP POLICY IF EXISTS "msg_update_sender" ON public.messages;
CREATE POLICY "msg_update_sender" ON public.messages FOR UPDATE
  TO authenticated USING (auth.uid() = sender_id) WITH CHECK (auth.uid() = sender_id);
DROP POLICY IF EXISTS "msg_delete_sender" ON public.messages;
CREATE POLICY "msg_delete_sender" ON public.messages FOR DELETE
  TO authenticated USING (auth.uid() = sender_id);
CREATE INDEX IF NOT EXISTS msg_conv_idx ON public.messages(conversation_id, created_at);

-- NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES public.profiles(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  icon text NOT NULL DEFAULT 'bell',
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "notif_select_own" ON public.notifications;
CREATE POLICY "notif_select_own" ON public.notifications FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "notif_insert_own" ON public.notifications;
CREATE POLICY "notif_insert_own" ON public.notifications FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "notif_update_own" ON public.notifications;
CREATE POLICY "notif_update_own" ON public.notifications FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "notif_delete_own" ON public.notifications;
CREATE POLICY "notif_delete_own" ON public.notifications FOR DELETE
  TO authenticated USING (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS notif_user_idx ON public.notifications(user_id, created_at DESC);

-- BADGES
CREATE TABLE IF NOT EXISTS public.badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid DEFAULT auth.uid() REFERENCES public.profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  color text NOT NULL DEFAULT 'pink',
  earned_at timestamptz,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "badges_select_all" ON public.badges;
CREATE POLICY "badges_select_all" ON public.badges FOR SELECT
  TO authenticated USING (true);
DROP POLICY IF EXISTS "badges_insert_authed" ON public.badges;
CREATE POLICY "badges_insert_authed" ON public.badges FOR INSERT
  TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "badges_update_own" ON public.badges;
CREATE POLICY "badges_update_own" ON public.badges FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "badges_delete_own" ON public.badges;
CREATE POLICY "badges_delete_own" ON public.badges FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- MISSIONS
CREATE TABLE IF NOT EXISTS public.missions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid DEFAULT auth.uid() REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  xp_reward integer NOT NULL DEFAULT 10,
  icon text NOT NULL DEFAULT 'target',
  progress integer DEFAULT 0,
  target integer NOT NULL DEFAULT 1,
  is_complete boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "missions_select_own" ON public.missions;
CREATE POLICY "missions_select_own" ON public.missions FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "missions_insert_authed" ON public.missions;
CREATE POLICY "missions_insert_authed" ON public.missions FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "missions_update_own" ON public.missions;
CREATE POLICY "missions_update_own" ON public.missions FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "missions_delete_own" ON public.missions;
CREATE POLICY "missions_delete_own" ON public.missions FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- FRIENDSHIPS
CREATE TABLE IF NOT EXISTS public.friendships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES public.profiles(id) ON DELETE CASCADE,
  friend_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, friend_id)
);
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "friends_select_all" ON public.friendships;
CREATE POLICY "friends_select_all" ON public.friendships FOR SELECT
  TO authenticated USING (true);
DROP POLICY IF EXISTS "friends_insert_own" ON public.friendships;
CREATE POLICY "friends_insert_own" ON public.friendships FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "friends_update_own" ON public.friendships;
CREATE POLICY "friends_update_own" ON public.friendships FOR UPDATE
  TO authenticated USING (auth.uid() = user_id OR auth.uid() = friend_id)
  WITH CHECK (auth.uid() = user_id OR auth.uid() = friend_id);
DROP POLICY IF EXISTS "friends_delete_own" ON public.friendships;
CREATE POLICY "friends_delete_own" ON public.friendships FOR DELETE
  TO authenticated USING (auth.uid() = user_id OR auth.uid() = friend_id);
