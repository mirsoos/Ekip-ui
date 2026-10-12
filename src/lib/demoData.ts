import type {
  Profile, Group, GroupMember, GroupRequest, Conversation, Message,
  Notification, Badge, Mission, Friendship,
} from '@/types/database';

// Avatar + banner stock photos (Pexels)
const av = (seed: string) => `https://images.pexels.com/photos/${seed}/pexels-photo-${seed}.jpeg?auto=compress&cs=tinysrgb&w=256&h=256&fit=crop`;
const cover = (seed: string) => `https://images.pexels.com/photos/${seed}/pexels-photo-${seed}.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop`;

export const demoProfiles: Profile[] = [
  {
    id: 'me', username: 'aria.kova', first_name: 'Aria', last_name: 'Kovacs',
    email: 'aria@ekip.app', phone: '+1 415 555 0142', gender: 'female', age: 26,
    city: 'San Francisco', job: 'Product Designer', bio: 'Designing moments worth sharing. Coffee enthusiast, weekend hiker, and connector of people.',
    avatar_url: av('774909'), banner_url: cover('1103970'),
    interests: ['Design', 'Hiking', 'Coffee', 'Photography', 'Startups', 'Yoga'],
    personality_type: 'ENFJ-A', social_links: { instagram: 'aria.kova', linkedin: 'ariakovacs' },
    is_premium: true, is_verified: true, is_identity_verified: true,
    level: 12, xp: 847, xp_to_next: 1000, honor_score: 94, reputation_level: 'Trusted',
    mood: 'Energized', created_at: '2025-01-15T10:00:00Z',
  },
  {
    id: 'u2', username: 'marco.delsanto', first_name: 'Marco', last_name: 'Del Santo',
    email: null, phone: null, gender: 'male', age: 31, city: 'San Francisco',
    job: 'Software Engineer', bio: 'Building things that matter. Climbing things that don\'t.',
    avatar_url: av('220453'), banner_url: cover('355465'),
    interests: ['Climbing', 'Tech', 'Startups', 'Wine', 'Jazz'],
    personality_type: 'INTJ-A', social_links: { twitter: 'marco_ds' },
    is_premium: false, is_verified: true, is_identity_verified: false,
    level: 8, xp: 420, xp_to_next: 600, honor_score: 88, reputation_level: 'Trusted',
    mood: 'Focused', created_at: '2025-02-01T10:00:00Z',
  },
  {
    id: 'u3', username: 'leila.haddad', first_name: 'Leila', last_name: 'Haddad',
    email: null, phone: null, gender: 'female', age: 28, city: 'San Francisco',
    job: 'Photographer', bio: 'Chasing light around the world. Available for collabs.',
    avatar_url: av('762020'), banner_url: cover('167964'),
    interests: ['Photography', 'Travel', 'Art', 'Coffee', 'Yoga'],
    personality_type: 'INFP-T', social_links: { instagram: 'leila.haddad' },
    is_premium: true, is_verified: true, is_identity_verified: true,
    level: 15, xp: 1240, xp_to_next: 1500, honor_score: 97, reputation_level: 'Ambassador',
    mood: 'Inspired', created_at: '2024-12-10T10:00:00Z',
  },
  {
    id: 'u4', username: 'kenji.tanaka', first_name: 'Kenji', last_name: 'Tanaka',
    email: null, phone: null, gender: 'male', age: 34, city: 'San Francisco',
    job: 'Chef', bio: 'Ramen is a love language. Let me cook for you.',
    avatar_url: av('1043471'), banner_url: cover('1640777'),
    interests: ['Cooking', 'Food', 'Music', 'Surfing'],
    personality_type: 'ENFP-A', social_links: { tiktok: 'kenjicooks' },
    is_premium: false, is_verified: false, is_identity_verified: false,
    level: 6, xp: 280, xp_to_next: 400, honor_score: 76, reputation_level: 'Friendly',
    mood: 'Hungry', created_at: '2025-03-20T10:00:00Z',
  },
  {
    id: 'u5', username: 'sofia.ruiz', first_name: 'Sofia', last_name: 'Ruiz',
    email: null, phone: null, gender: 'female', age: 24, city: 'San Francisco',
    job: 'Marketing Lead', bio: 'Words, waves, and weekend adventures.',
    avatar_url: av('1130626'), banner_url: cover('2425567'),
    interests: ['Surfing', 'Marketing', 'Travel', 'Pilates'],
    personality_type: 'ESFJ-A', social_links: { instagram: 'sofiaruiz' },
    is_premium: true, is_verified: true, is_identity_verified: true,
    level: 10, xp: 670, xp_to_next: 800, honor_score: 91, reputation_level: 'Trusted',
    mood: 'Adventurous', created_at: '2025-01-28T10:00:00Z',
  },
  {
    id: 'u6', username: 'jamal.wright', first_name: 'Jamal', last_name: 'Wright',
    email: null, phone: null, gender: 'male', age: 29, city: 'San Francisco',
    job: 'Music Producer', bio: 'Making beats and finding good company.',
    avatar_url: av('1220794'), banner_url: cover('1677256'),
    interests: ['Music', 'Production', 'Basketball', 'Film'],
    personality_type: 'ESTP-T', social_links: { soundcloud: 'jamalbeats' },
    is_premium: false, is_verified: true, is_identity_verified: false,
    level: 7, xp: 350, xp_to_next: 500, honor_score: 82, reputation_level: 'Friendly',
    mood: 'Creative', created_at: '2025-02-14T10:00:00Z',
  },
];

const profileById = (id: string) => demoProfiles.find((p) => p.id === id)!;

export const demoGroups: Group[] = [
  {
    id: 'g1', owner_id: 'u3', title: 'Golden Hour Photo Walk',
    description: 'Bring your camera and let\'s chase the light through the city. All skill levels welcome — we\'ll share tips, explore hidden corners, and end with coffee. Meet at the Ferry Building.',
    category: 'entertainment', group_type: 'group', min_members: 4, max_members: 12,
    city: 'San Francisco', location_name: 'Ferry Building, Embarcadero',
    latitude: 37.7955, longitude: -122.3937,
    tags: ['Photography', 'Outdoor', 'Social', 'Beginner'],
    age_min: 18, age_max: 45, required_level: 1, required_honor: 50,
    gender_preference: 'any', avg_cost: 0, cover_url: cover('167964'),
    premium_only: false, visibility: 'public', auto_accept: false, is_repeating: true,
    event_date: '2026-08-02T17:30:00Z', views: 342, member_count: 7, created_at: '2026-07-20T10:00:00Z',
    owner: profileById('u3'),
  },
  {
    id: 'g2', owner_id: 'u2', title: 'Startup Founder Roundtable',
    description: 'Monthly gathering for early-stage founders. Share what you\'re building, get feedback, and find co-founders. This week: navigating your first fundraising round.',
    category: 'work', group_type: 'group', min_members: 5, max_members: 15,
    city: 'San Francisco', location_name: 'SoMa Tech Hub, 5th St',
    latitude: 37.7822, longitude: -122.4051,
    tags: ['Startups', 'Networking', 'Fundraising', 'Tech'],
    age_min: 21, age_max: 50, required_level: 3, required_honor: 70,
    gender_preference: 'any', avg_cost: 15, cover_url: cover('3184292'),
    premium_only: false, visibility: 'public', auto_accept: true, is_repeating: true,
    event_date: '2026-08-05T18:00:00Z', views: 521, member_count: 11, created_at: '2026-07-18T10:00:00Z',
    owner: profileById('u2'),
  },
  {
    id: 'g3', owner_id: 'u4', title: 'Ramen Night — Handmade Noodles',
    description: 'I\'m opening my kitchen for a hands-on ramen workshop. We\'ll make noodles from scratch, prepare two broths, and feast together. Limited spots.',
    category: 'entertainment', group_type: 'couple', min_members: 2, max_members: 6,
    city: 'San Francisco', location_name: 'Mission District (address shared on join)',
    latitude: 37.7599, longitude: -122.4148,
    tags: ['Cooking', 'Food', 'Workshop', 'Hands-on'],
    age_min: 21, age_max: 40, required_level: 2, required_honor: 60,
    gender_preference: 'any', avg_cost: 25, cover_url: cover('884600'),
    premium_only: true, visibility: 'public', auto_accept: false, is_repeating: false,
    event_date: '2026-08-08T19:00:00Z', views: 198, member_count: 4, created_at: '2026-07-25T10:00:00Z',
    owner: profileById('u4'),
  },
  {
    id: 'g4', owner_id: 'u5', title: 'Dawn Surf Session — Pacifica',
    description: 'Early morning surf at Linda Mar. Beginner-friendly waves. Bring your own board or rent at the beach. We\'ll grab smoothies after.',
    category: 'entertainment', group_type: 'group', min_members: 3, max_members: 8,
    city: 'San Francisco', location_name: 'Linda Mar Beach, Pacifica',
    latitude: 37.6152, longitude: -122.4925,
    tags: ['Surfing', 'Outdoor', 'Fitness', 'Beginner'],
    age_min: 18, age_max: 50, required_level: 1, required_honor: 40,
    gender_preference: 'any', avg_cost: 10, cover_url: cover('1654748'),
    premium_only: false, visibility: 'public', auto_accept: true, is_repeating: true,
    event_date: '2026-08-03T06:30:00Z', views: 267, member_count: 5, created_at: '2026-07-22T10:00:00Z',
    owner: profileById('u5'),
  },
  {
    id: 'g5', owner_id: 'u6', title: 'Studio Session — Open Beat Night',
    description: 'Come produce, jam, or just listen. I\'ve got the studio set up with synths, drums, and monitors. Bring USB drives for your stems.',
    category: 'entertainment', group_type: 'solo', min_members: 1, max_members: 5,
    city: 'San Francisco', location_name: 'Bayview Studio (DM for address)',
    latitude: 37.7096, longitude: -122.3933,
    tags: ['Music', 'Production', 'Creative', 'Jam'],
    age_min: 18, age_max: 45, required_level: 2, required_honor: 55,
    gender_preference: 'any', avg_cost: 0, cover_url: cover('1677256'),
    premium_only: false, visibility: 'public', auto_accept: false, is_repeating: true,
    event_date: '2026-08-06T20:00:00Z', views: 143, member_count: 3, created_at: '2026-07-26T10:00:00Z',
    owner: profileById('u6'),
  },
  {
    id: 'g6', owner_id: 'me', title: 'Design Critique & Portfolio Review',
    description: 'A focused evening for designers to share work in progress, get honest feedback, and sharpen portfolios. Bring 2-3 pieces and an open mind.',
    category: 'work', group_type: 'group', min_members: 3, max_members: 10,
    city: 'San Francisco', location_name: 'Mission Coffee, Valencia St',
    latitude: 37.7563, longitude: -122.4185,
    tags: ['Design', 'Portfolio', 'Feedback', 'Creative'],
    age_min: 20, age_max: 50, required_level: 1, required_honor: 50,
    gender_preference: 'any', avg_cost: 5, cover_url: cover('6952383'),
    premium_only: false, visibility: 'public', auto_accept: true, is_repeating: true,
    event_date: '2026-08-04T18:30:00Z', views: 89, member_count: 6, created_at: '2026-07-27T10:00:00Z',
    owner: profileById('me'),
  },
];

export const demoMembers: GroupMember[] = [
  { id: 'm1', group_id: 'g1', user_id: 'u3', role: 'owner', status: 'active', joined_at: '2026-07-20T10:00:00Z', profile: profileById('u3') },
  { id: 'm2', group_id: 'g1', user_id: 'me', role: 'member', status: 'active', joined_at: '2026-07-21T10:00:00Z', profile: profileById('me') },
  { id: 'm3', group_id: 'g1', user_id: 'u5', role: 'member', status: 'active', joined_at: '2026-07-22T10:00:00Z', profile: profileById('u5') },
  { id: 'm4', group_id: 'g2', user_id: 'u2', role: 'owner', status: 'active', joined_at: '2026-07-18T10:00:00Z', profile: profileById('u2') },
  { id: 'm5', group_id: 'g2', user_id: 'me', role: 'member', status: 'active', joined_at: '2026-07-19T10:00:00Z', profile: profileById('me') },
  { id: 'm6', group_id: 'g2', user_id: 'u6', role: 'member', status: 'active', joined_at: '2026-07-23T10:00:00Z', profile: profileById('u6') },
  { id: 'm7', group_id: 'g6', user_id: 'me', role: 'owner', status: 'active', joined_at: '2026-07-27T10:00:00Z', profile: profileById('me') },
  { id: 'm8', group_id: 'g6', user_id: 'u3', role: 'member', status: 'active', joined_at: '2026-07-28T10:00:00Z', profile: profileById('u3') },
  { id: 'm9', group_id: 'g6', user_id: 'u4', role: 'member', status: 'active', joined_at: '2026-07-28T10:00:00Z', profile: profileById('u4') },
];

export const demoRequests: GroupRequest[] = [
  { id: 'r1', group_id: 'g6', user_id: 'u5', status: 'pending', message: 'Would love to join and share my brand work!', created_at: '2026-07-28T09:00:00Z', group: demoGroups[5], profile: profileById('u5') },
  { id: 'r2', group_id: 'g6', user_id: 'u2', status: 'pending', message: 'I do UI/UX — would be great to get feedback on a mobile app.', created_at: '2026-07-28T10:00:00Z', group: demoGroups[5], profile: profileById('u2') },
  { id: 'r3', group_id: 'g6', user_id: 'u6', status: 'pending', message: null, created_at: '2026-07-28T11:00:00Z', group: demoGroups[5], profile: profileById('u6') },
  { id: 'r4', group_id: 'g1', user_id: 'me', status: 'pending', message: 'Excited for this! I shoot on a Fuji X-T5.', created_at: '2026-07-28T08:00:00Z', group: demoGroups[0], profile: profileById('me') },
  { id: 'r5', group_id: 'g3', user_id: 'me', status: 'accepted', message: null, created_at: '2026-07-27T08:00:00Z', group: demoGroups[2], profile: profileById('me') },
];

export const demoConversations: Conversation[] = [
  { id: 'c1', type: 'direct', title: 'Leila Haddad', avatar_url: av('762020'), group_id: null, last_message: 'See you at the photo walk! 📸', last_message_at: '2026-07-28T11:30:00Z', unread_count: 2 },
  { id: 'c2', type: 'group', title: 'Golden Hour Photo Walk', avatar_url: cover('167964'), group_id: 'g1', last_message: 'Marco: anyone bringing a tripod?', last_message_at: '2026-07-28T10:15:00Z', unread_count: 5 },
  { id: 'c3', type: 'direct', title: 'Sofia Ruiz', avatar_url: av('1130626'), group_id: null, last_message: 'The surf forecast looks amazing for Saturday', last_message_at: '2026-07-28T09:00:00Z', unread_count: 0 },
  { id: 'c4', type: 'group', title: 'Startup Founder Roundtable', avatar_url: cover('3184292'), group_id: 'g2', last_message: 'Kenji: I just closed my pre-seed!', last_message_at: '2026-07-27T18:00:00Z', unread_count: 0 },
  { id: 'c5', type: 'direct', title: 'Kenji Tanaka', avatar_url: av('1043471'), group_id: null, last_message: 'You coming to ramen night?', last_message_at: '2026-07-27T14:00:00Z', unread_count: 0 },
];

export const demoMessages: Record<string, Message[]> = {
  c1: [
    { id: 'msg1', conversation_id: 'c1', sender_id: 'u3', body: 'Hey Aria! Are you coming to the photo walk on Saturday?', media_url: null, read_at: '2026-07-28T11:00:00Z', created_at: '2026-07-28T11:00:00Z', sender: profileById('u3') },
    { id: 'msg2', conversation_id: 'c1', sender_id: 'me', body: 'Absolutely! I just submitted my request. Shooting on the Fuji X-T5.', media_url: null, read_at: null, created_at: '2026-07-28T11:10:00Z', sender: profileById('me') },
    { id: 'msg3', conversation_id: 'c1', sender_id: 'u3', body: 'Nice! That camera takes gorgeous shots. I shoot Sony A7IV.', media_url: null, read_at: null, created_at: '2026-07-28T11:20:00Z', sender: profileById('u3') },
    { id: 'msg4', conversation_id: 'c1', sender_id: 'u3', body: 'See you at the photo walk! 📸', media_url: null, read_at: null, created_at: '2026-07-28T11:30:00Z', sender: profileById('u3') },
  ],
  c2: [
    { id: 'msg5', conversation_id: 'c2', sender_id: 'u3', body: 'Welcome everyone! A few spots still open. We meet at the Ferry Building steps.', media_url: null, read_at: null, created_at: '2026-07-28T09:00:00Z', sender: profileById('u3') },
    { id: 'msg6', conversation_id: 'c2', sender_id: 'me', body: 'Excited! What time exactly?', media_url: null, read_at: null, created_at: '2026-07-28T09:30:00Z', sender: profileById('me') },
    { id: 'msg7', conversation_id: 'c2', sender_id: 'u3', body: '5:30 PM — golden hour starts around 6:15.', media_url: null, read_at: null, created_at: '2026-07-28T09:45:00Z', sender: profileById('u3') },
    { id: 'msg8', conversation_id: 'c2', sender_id: 'u2', body: 'anyone bringing a tripod?', media_url: null, read_at: null, created_at: '2026-07-28T10:15:00Z', sender: profileById('u2') },
  ],
  c3: [
    { id: 'msg9', conversation_id: 'c3', sender_id: 'u5', body: 'The surf forecast looks amazing for Saturday', media_url: null, read_at: null, created_at: '2026-07-28T09:00:00Z', sender: profileById('u5') },
  ],
  c4: [
    { id: 'msg10', conversation_id: 'c4', sender_id: 'u6', body: 'I just closed my pre-seed!', media_url: null, read_at: null, created_at: '2026-07-27T18:00:00Z', sender: profileById('u6') },
  ],
  c5: [
    { id: 'msg11', conversation_id: 'c5', sender_id: 'u4', body: 'You coming to ramen night?', media_url: null, read_at: null, created_at: '2026-07-27T14:00:00Z', sender: profileById('u4') },
  ],
};

export const demoNotifications: Notification[] = [
  { id: 'n1', user_id: 'me', type: 'group_request', title: 'New join request', body: 'Sofia Ruiz wants to join Design Critique & Portfolio Review', icon: 'UserPlus', is_read: false, created_at: '2026-07-28T09:00:00Z' },
  { id: 'n2', user_id: 'me', type: 'chat', title: 'Leila Haddad', body: 'See you at the photo walk! 📸', icon: 'MessageCircle', is_read: false, created_at: '2026-07-28T11:30:00Z' },
  { id: 'n3', user_id: 'me', type: 'achievement', title: 'Badge earned!', body: 'You unlocked the "Connector" badge for 5 active Ekip memberships.', icon: 'Trophy', is_read: false, created_at: '2026-07-28T08:00:00Z' },
  { id: 'n4', user_id: 'me', type: 'friend_request', title: 'Friend request', body: 'Marco Del Santo sent you a friend request.', icon: 'UserPlus', is_read: true, created_at: '2026-07-27T16:00:00Z' },
  { id: 'n5', user_id: 'me', type: 'group_request', title: 'Request accepted', body: 'Kenji Tanaka accepted your request for Ramen Night.', icon: 'CheckCircle2', is_read: true, created_at: '2026-07-27T12:00:00Z' },
  { id: 'n6', user_id: 'me', type: 'subscription', title: 'Premium active', body: 'Your Premium membership renews on August 15.', icon: 'Crown', is_read: true, created_at: '2026-07-26T10:00:00Z' },
  { id: 'n7', user_id: 'me', type: 'discount', title: 'Sponsored location', body: 'Blue Bottle Coffee offers 20% off for your next Ekip meetup.', icon: 'Gift', is_read: true, created_at: '2026-07-25T14:00:00Z' },
];

export const demoBadges: Badge[] = [
  { id: 'b1', user_id: 'me', name: 'Connector', description: 'Join 5 active Ekips', icon: 'Users', color: 'pink', earned_at: '2026-07-28T08:00:00Z' },
  { id: 'b2', user_id: 'me', name: 'First Steps', description: 'Create your first Ekip', icon: 'Rocket', color: 'blue', earned_at: '2026-07-27T10:00:00Z' },
  { id: 'b3', user_id: 'me', name: 'Verified', description: 'Complete identity verification', icon: 'ShieldCheck', color: 'green', earned_at: '2026-07-20T10:00:00Z' },
  { id: 'b4', user_id: 'me', name: 'Social Butterfly', description: 'Send 50 messages', icon: 'MessageCircle', color: 'amber', earned_at: '2026-07-22T10:00:00Z' },
  { id: 'b5', user_id: 'me', name: 'Premium Member', description: 'Subscribe to Premium', icon: 'Crown', color: 'purple', earned_at: '2026-07-15T10:00:00Z' },
  { id: 'b6', user_id: 'me', name: 'Early Adopter', description: 'Join Ekip in beta', icon: 'Sparkles', color: 'pink', earned_at: '2025-01-15T10:00:00Z' },
  { id: 'b7', user_id: 'me', name: 'Honor Guard', description: 'Maintain 90+ honor for 30 days', icon: 'Shield', color: 'blue', earned_at: null },
  { id: 'b8', user_id: 'me', name: 'Level 20', description: 'Reach level 20', icon: 'Trophy', color: 'amber', earned_at: null },
  { id: 'b9', user_id: 'me', name: 'Globetrotter', description: 'Join Ekips in 5 different cities', icon: 'Plane', color: 'green', earned_at: null },
];

export const demoMissions: Mission[] = [
  { id: 'ms1', user_id: 'me', title: 'Create 2 more Ekips', description: 'Share your vibe with the community', xp_reward: 50, icon: 'Plus', progress: 1, target: 3, is_complete: false },
  { id: 'ms2', user_id: 'me', title: 'Send 10 messages today', description: 'Stay connected with your Ekip', xp_reward: 20, icon: 'MessageCircle', progress: 7, target: 10, is_complete: false },
  { id: 'ms3', user_id: 'me', title: 'Join a new Ekip', description: 'Discover something new this week', xp_reward: 30, icon: 'Compass', progress: 1, target: 1, is_complete: true },
  { id: 'ms4', user_id: 'me', title: 'Complete your profile', description: 'Add a bio, interests, and personality type', xp_reward: 15, icon: 'User', progress: 3, target: 3, is_complete: true },
  { id: 'ms5', user_id: 'me', title: 'Verify your identity', description: 'Get the verified badge', xp_reward: 40, icon: 'ShieldCheck', progress: 1, target: 1, is_complete: true },
];

export const demoFriends: Friendship[] = [
  { id: 'f1', user_id: 'me', friend_id: 'u3', status: 'accepted', created_at: '2025-02-01T10:00:00Z', profile: profileById('u3') },
  { id: 'f2', user_id: 'me', friend_id: 'u5', status: 'accepted', created_at: '2025-02-10T10:00:00Z', profile: profileById('u5') },
  { id: 'f3', user_id: 'me', friend_id: 'u4', status: 'accepted', created_at: '2025-03-01T10:00:00Z', profile: profileById('u4') },
  { id: 'f4', user_id: 'u2', friend_id: 'me', status: 'pending', created_at: '2026-07-27T16:00:00Z', profile: profileById('u2') },
  { id: 'f5', user_id: 'me', friend_id: 'u6', status: 'accepted', created_at: '2025-04-01T10:00:00Z', profile: profileById('u6') },
];

export const cities = [
  'San Francisco', 'New York', 'Los Angeles', 'Chicago', 'Seattle',
  'Austin', 'Miami', 'Boston', 'Denver', 'Portland',
];

export const allInterests = [
  'Design', 'Photography', 'Hiking', 'Coffee', 'Startups', 'Yoga', 'Music',
  'Cooking', 'Food', 'Travel', 'Art', 'Surfing', 'Climbing', 'Tech', 'Film',
  'Gaming', 'Fitness', 'Books', 'Wine', 'Jazz', 'Basketball', 'Pilates',
];

export const personalityTypes = [
  'ENFJ-A', 'ENFJ-T', 'ENFP-A', 'ENFP-T', 'ENTJ-A', 'ENTJ-T',
  'ENTP-A', 'ENTP-T', 'ESFJ-A', 'ESFJ-T', 'ESFP-A', 'ESFP-T',
  'ESTJ-A', 'ESTJ-T', 'ESTP-A', 'ESTP-T', 'INFJ-A', 'INFJ-T',
  'INFP-A', 'INFP-T', 'INTJ-A', 'INTJ-T', 'INTP-A', 'INTP-T',
  'ISFJ-A', 'ISFJ-T', 'ISFP-A', 'ISFP-T', 'ISTJ-A', 'ISTJ-T',
  'ISTP-A', 'ISTP-T',
];
