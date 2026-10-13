import { useState } from 'react';
import { useAppData } from '@/lib/appData';
import { GlassCard, GlassButton, GlassSegmented, GlassEmpty, GlassBackButton } from '@/components/Glass';
import { GlassSheet, Toast } from '@/components/Overlays';
import { StatBox } from '@/components/common/StatBox';
import { ProfileHeaderCard } from '@/components/profile/ProfileHeaderCard';
import { ProfileXpCard } from '@/components/profile/ProfileXpCard';
import { ProfileBadgesList } from '@/components/profile/ProfileBadgesList';
import { ProfileMissionsList } from '@/components/profile/ProfileMissionsList';
import { FriendsList } from '@/components/profile/FriendsList';
import { EkipCard } from '@/components/EkipCard';
import { getIcon } from '@/lib/icons';
import { useTheme } from '@/lib/theme';
import type { Group } from '@/types/database';

interface ProfileScreenProps {
  userId: string;
  isOwnProfile: boolean;
  onBack?: () => void;
  onOpenGroup: (group: Group) => void;
  onOpenSettings: () => void;
  onOpenPersonalInfo?: () => void;
  onOpenVerification?: () => void;
}

export function ProfileScreen({
  userId,
  isOwnProfile,
  onBack,
  onOpenGroup,
  onOpenSettings,
  onOpenPersonalInfo,
  onOpenVerification,
}: ProfileScreenProps) {
  const { me, profiles, groups, members, badges, missions, friends, addFriend, updateFriend, addNotification } = useAppData();
  const { theme, toggle } = useTheme();
  const [tab, setTab] = useState('activity');
  const [showActions, setShowActions] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showBlock, setShowBlock] = useState(false);
  const [toast, setToast] = useState('');

  const profile = profiles.find((p) => p.id === userId) ?? me;
  const isMe = profile.id === 'me';

  const myGroups = groups.filter((g) => {
    if (isMe) {
      return (
        g.owner_id === 'me' ||
        members.some((m) => m.group_id === g.id && m.user_id === 'me' && m.status === 'active')
      );
    }
    return g.owner_id === profile.id;
  });

  const myBadges = badges.filter((b) => b.user_id === profile.id || (isMe && b.user_id === 'me'));
  const myMissions = missions.filter((m) => m.user_id === profile.id || isMe);
  const myFriends = friends.filter(
    (f) => (f.user_id === profile.id || f.friend_id === profile.id) && f.status === 'accepted'
  );
  const existingFriend = friends.find(
    (f) => f.friend_id === profile.id || (f.user_id === profile.id && f.friend_id === 'me')
  );

  const Sun = getIcon('Sun');
  const Moon = getIcon('Moon');
  const Settings = getIcon('Settings');
  const Edit = getIcon('Edit');

  const handleAddFriend = () => {
    if (existingFriend) {
      updateFriend(existingFriend.id, 'accepted');
      setToast('Friend request accepted');
    } else {
      addFriend(profile.id);
      setToast('Friend added');
    }
    addNotification({
      type: 'friend_request',
      title: 'Friend update',
      body: `You are now friends with ${profile.first_name}.`,
      icon: 'UserCheck',
    });
    setShowActions(false);
    setTimeout(() => setToast(''), 2500);
  };

  return (
    <div className={`relative h-full overflow-y-auto no-scrollbar screen-enter-items ${isOwnProfile ? 'pb-32' : 'pb-8'}`}>
      {/* Banner */}
      <div className="relative h-44 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center scale-110"
          style={{ backgroundImage: `url(${profile.banner_url})` }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, rgb(0 0 0 / 0.25) 0%, transparent 40%, rgb(var(--bg-canvas) / 0.6) 100%)',
          }}
        />

        {!isOwnProfile && onBack && (
          <div className="absolute top-4 left-4 z-10">
            <GlassBackButton onClick={onBack} />
          </div>
        )}

        {isOwnProfile && (
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            {onOpenPersonalInfo && (
              <button
                type="button"
                onClick={onOpenPersonalInfo}
                aria-label="Edit Personal Info"
                className="px-3 h-10 rounded-full glass-thick glass-specular glass-edge flex items-center gap-1.5 spring-press cursor-pointer shadow-sm text-primary text-foot font-semibold"
              >
                <Edit size={15} strokeWidth={2.4} />
                <span>Edit</span>
              </button>
            )}
            <button
              type="button"
              onClick={toggle}
              aria-label="Toggle theme"
              className="w-10 h-10 rounded-full glass-thick glass-specular glass-edge flex items-center justify-center spring-press cursor-pointer shadow-sm text-primary"
            >
              {theme === 'dark' ? <Sun size={18} strokeWidth={2.2} /> : <Moon size={18} strokeWidth={2.2} />}
            </button>
            <button
              type="button"
              onClick={onOpenSettings}
              aria-label="Settings"
              className="w-10 h-10 rounded-full glass-thick glass-specular glass-edge flex items-center justify-center spring-press cursor-pointer shadow-sm text-primary"
            >
              <Settings size={18} strokeWidth={2.2} />
            </button>
          </div>
        )}
      </div>

      {/* Profile Header Details */}
      <ProfileHeaderCard
        profile={profile}
        isOwnProfile={isOwnProfile}
        isFriend={Boolean(existingFriend?.status === 'accepted')}
        onAddFriend={handleAddFriend}
        onOpenActions={() => setShowActions(true)}
        onOpenVerification={onOpenVerification}
      />

      <div className="px-5 mt-4 space-y-4">
        {/* Level and XP card */}
        <ProfileXpCard profile={profile} />

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2">
          <StatBox icon="Layers" value={myGroups.length} label="Ekips" />
          <StatBox icon="Users" value={myFriends.length} label="Friends" />
          <StatBox icon="Award" value={myBadges.length} label="Badges" />
        </div>

        {/* Segmented Sub-Tabs */}
        <GlassSegmented
          options={[
            { label: 'Ekips', value: 'activity', icon: 'Compass' },
            { label: 'Badges', value: 'badges', icon: 'Award' },
            { label: 'Missions', value: 'missions', icon: 'Target' },
            { label: 'Friends', value: 'friends', icon: 'Users' },
          ]}
          value={tab}
          onChange={setTab}
        />

        {/* Tab Views */}
        {tab === 'activity' && (
          <div className="space-y-3 animate-rise">
            {myGroups.length === 0 ? (
              <GlassEmpty
                icon="Layers"
                title="No active Ekips"
                subtitle="Join or create an Ekip to see it here."
              />
            ) : (
              myGroups.map((g) => (
                <EkipCard key={g.id} group={g} onClick={() => onOpenGroup(g)} variant="compact" />
              ))
            )}
          </div>
        )}

        {tab === 'badges' && <ProfileBadgesList badges={myBadges} className="animate-rise" />}

        {tab === 'missions' && <ProfileMissionsList missions={myMissions} className="animate-rise" />}

        {tab === 'friends' && (
          <FriendsList
            friends={myFriends}
            onOpenProfile={(id) => {
              if (id === me.id) setTab('activity');
            }}
            className="animate-rise"
          />
        )}
      </div>

      {/* Action Sheet */}
      <GlassSheet open={showActions} onClose={() => setShowActions(false)} title="Profile actions">
        <div className="space-y-2">
          <GlassButton
            fullWidth
            variant="secondary"
            icon="UserPlus"
            onClick={handleAddFriend}
          >
            {existingFriend ? 'Accepted Friend' : 'Send Friend Request'}
          </GlassButton>
          <GlassButton
            fullWidth
            variant="secondary"
            icon="AlertCircle"
            onClick={() => {
              setShowActions(false);
              setShowReport(true);
            }}
          >
            Report Profile
          </GlassButton>
          <GlassButton
            fullWidth
            variant="danger"
            icon="ShieldAlert"
            onClick={() => {
              setShowActions(false);
              setShowBlock(true);
            }}
          >
            Block User
          </GlassButton>
        </div>
      </GlassSheet>

      {/* Report Modal */}
      <GlassSheet open={showReport} onClose={() => setShowReport(false)} title="Report User">
        <div className="space-y-3">
          <p className="text-foot text-secondary">Why are you reporting this user?</p>
          {['Spam or fake profile', 'Inappropriate behavior', 'Harassment', 'Other'].map((r) => (
            <GlassCard
              key={r}
              variant="thin"
              onClick={() => {
                setToast('Report submitted');
                setShowReport(false);
                setTimeout(() => setToast(''), 2500);
              }}
              className="rounded-2xl p-3 cursor-pointer spring-press text-sub text-primary font-medium"
            >
              {r}
            </GlassCard>
          ))}
        </div>
      </GlassSheet>

      {/* Block Modal */}
      <GlassSheet open={showBlock} onClose={() => setShowBlock(false)} title="Block User?">
        <div className="space-y-4">
          <p className="text-body text-secondary">
            You will no longer see this user or their Ekips.
          </p>
          <div className="flex gap-2">
            <GlassButton fullWidth variant="secondary" onClick={() => setShowBlock(false)}>
              Cancel
            </GlassButton>
            <GlassButton
              fullWidth
              variant="danger"
              onClick={() => {
                setToast('User blocked');
                setShowBlock(false);
                setTimeout(() => setToast(''), 2500);
              }}
            >
              Block
            </GlassButton>
          </div>
        </div>
      </GlassSheet>

      {/* Toast */}
      <Toast message={toast} visible={Boolean(toast)} />
    </div>
  );
}
