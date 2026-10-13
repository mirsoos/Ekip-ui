import { useState } from 'react';
import { useAppData } from '@/lib/appData';
import { GlassCard, GlassButton, GlassBackButton, GlassAvatar, GlassBadgeIcon } from '@/components/Glass';
import { GlassSheet, Toast } from '@/components/Overlays';
import { SettingsSection } from '@/components/settings/SettingsSection';
import { SettingsDivider } from '@/components/settings/SettingsDivider';
import { getIcon } from '@/lib/icons';

interface PrivacyScreenProps {
  onBack: () => void;
}

type Audience = 'everyone' | 'friends_of_friends' | 'friends';
type InviteAudience = 'everyone' | 'verified' | 'friends';

interface BlockedUser {
  id: string;
  name: string;
  username: string;
  avatar: string;
  blockedDate: string;
}

const INITIAL_BLOCKED_USERS: BlockedUser[] = [
  {
    id: 'block-1',
    name: 'Darius Vance',
    username: 'darius_v',
    avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=256&h=256&fit=crop',
    blockedDate: 'Jan 14, 2025',
  },
  {
    id: 'block-2',
    name: 'Sasha Miller',
    username: 'sasham',
    avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=256&h=256&fit=crop',
    blockedDate: 'Dec 02, 2024',
  },
];

export function PrivacyScreen({ onBack }: PrivacyScreenProps) {
  const { me, addNotification } = useAppData();

  // Privacy toggles state
  const [ghostMode, setGhostMode] = useState(false);
  const [privateProfile, setPrivateProfile] = useState(false);
  const [discoverySearch, setDiscoverySearch] = useState(true);
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [showInAttendeeList, setShowInAttendeeList] = useState(true);
  const [preciseLocation, setPreciseLocation] = useState(false);
  const [showCityNeighborhood, setShowCityNeighborhood] = useState(true);
  const [hideHonorScore, setHideHonorScore] = useState(false);

  // Audience select states
  const [dmAudience, setDmAudience] = useState<Audience>('friends_of_friends');
  const [inviteAudience, setInviteAudience] = useState<InviteAudience>('verified');

  // Blocked users drawer
  const [showBlockedSheet, setShowBlockedSheet] = useState(false);
  const [blockedList, setBlockedList] = useState<BlockedUser[]>(INITIAL_BLOCKED_USERS);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState('');

  // Icons
  const ShieldCheck = getIcon('ShieldCheck');
  const Lock = getIcon('Lock');
  const Eye = getIcon('Eye');
  const EyeOff = getIcon('EyeOff');
  const Users = getIcon('Users');
  const User = getIcon('User');
  const MapPin = getIcon('MapPin');
  const Check = getIcon('Check');
  const ChevronRight = getIcon('ChevronRight');
  const Sparkles = getIcon('Sparkles');
  const Ban = getIcon('Ban');
  const Fingerprint = getIcon('Fingerprint');

  const triggerHaptic = (ms: number = 8) => {
    if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
      try {
        navigator.vibrate(ms);
      } catch {
        // ignore
      }
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2800);
  };

  const handleToggle = (
    setter: React.Dispatch<React.SetStateAction<boolean>>,
    value: boolean,
    label: string
  ) => {
    triggerHaptic(8);
    setter(!value);
    showToast(`${label} ${!value ? 'enabled' : 'disabled'}`);
  };

  const handleUnblockUser = (id: string, name: string) => {
    triggerHaptic(12);
    setBlockedList((prev) => prev.filter((u) => u.id !== id));
    showToast(`Unblocked ${name}`);
    addNotification({
      type: 'system',
      title: 'User Unblocked',
      body: `You unblocked ${name}. They can now find and connect with you on Ekip.`,
      icon: 'UserCheck',
    });
  };

  const handleClearCache = () => {
    triggerHaptic(14);
    showToast('Search & discovery cache cleared');
  };

  const handleExportData = () => {
    triggerHaptic(12);
    showToast('Privacy data archive generated (downloading...)');
    addNotification({
      type: 'system',
      title: 'Data Archive Ready',
      body: 'Your encrypted personal privacy archive has been compiled successfully.',
      icon: 'Download',
    });
  };

  return (
    <div className="h-full overflow-y-auto no-scrollbar screen-enter-items pb-10">
      {/* Sticky Liquid Glass Navigation Header */}
      <div className="sticky top-0 z-30 glass glass-specular px-5 pt-3 pb-3 border-b border-white/20 dark:border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GlassBackButton onClick={onBack} />
            <div>
              <h1 className="text-title1 text-primary font-bold">Privacy & Visibility</h1>
              <p className="text-[11px] text-tertiary">Control who sees you and how you connect</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full glass-thin border border-pink-500/40 text-[11px] font-bold text-pink-500 shadow-xs">
            <Lock size={13} className="text-pink-500" strokeWidth={2.4} />
            <span>Protected</span>
          </div>
        </div>
      </div>

      <div className="px-5 mt-4 space-y-5">
        {/* Hero Privacy Shield & Ghost Mode Card */}
        <div className="relative rounded-3xl overflow-hidden p-5 glass glass-specular border border-pink-500/30 shadow-lg">
          {/* Ambient Pink Glow */}
          <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-pink-500/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex items-start justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <GlassAvatar
                  src={me.avatar_url}
                  name={`${me.first_name} ${me.last_name}`}
                  size={58}
                  
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-md ring-2 ring-[rgb(var(--bg-canvas))]">
                  {ghostMode ? <EyeOff size={13} strokeWidth={2.6} /> : <ShieldCheck size={13} strokeWidth={2.6} />}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-body text-primary font-bold">
                    {ghostMode ? 'Ghost Mode Active' : 'Public Explorer'}
                  </h2>
                  <GlassBadgeIcon
                    icon={ghostMode ? 'EyeOff' : 'ShieldCheck'}
                    label={ghostMode ? 'Hidden' : 'Standard'}
                    color="pink"
                  />
                </div>
                <p className="text-caption text-secondary mt-0.5">
                  {ghostMode
                    ? 'Browse Ekips & profiles incognito with zero visitor footprints'
                    : 'Visible on discovery radars & attendee lists'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Ghost Mode Switch */}
          <div className="mt-4 pt-3.5 border-t border-white/15 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-pink-500" />
              <span className="text-foot font-semibold text-primary">Ghost Mode (Incognito)</span>
            </div>
            <button
              type="button"
              onClick={() => handleToggle(setGhostMode, ghostMode, 'Ghost Mode')}
              className="relative w-[50px] h-[30px] rounded-full transition-all duration-300 spring-press cursor-pointer"
              style={{
                background: ghostMode
                  ? 'linear-gradient(135deg, rgb(244 114 182), rgb(236 72 153))'
                  : 'rgb(var(--glass-tint) / 0.3)',
                boxShadow: 'inset 0 1px 2px rgb(0 0 0 / 0.15)',
              }}
              aria-label="Toggle Ghost Mode"
            >
              <div
                className="absolute top-1 w-[22px] h-[22px] rounded-full bg-white shadow-md transition-all duration-300"
                style={{ left: ghostMode ? '24px' : '4px' }}
              />
            </button>
          </div>
        </div>

        {/* Section 1: Profile & Discovery Visibility */}
        <SettingsSection title="Profile & Discovery Visibility">
          <GlassCard className="rounded-3xl overflow-hidden divide-y divide-white/10">
            {/* Private Profile */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3 pr-2">
                <div className="w-9 h-9 rounded-2xl bg-pink-500/15 text-pink-500 flex items-center justify-center shrink-0">
                  <Lock size={18} strokeWidth={2.4} />
                </div>
                <div>
                  <p className="text-body text-primary font-semibold">Private Profile</p>
                  <p className="text-caption text-secondary">
                    Only approved friends can view your full bio and past Ekips
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleToggle(setPrivateProfile, privateProfile, 'Private Profile')}
                className="relative w-[50px] h-[30px] rounded-full transition-all duration-300 spring-press cursor-pointer shrink-0"
                style={{
                  background: privateProfile
                    ? 'linear-gradient(135deg, rgb(244 114 182), rgb(236 72 153))'
                    : 'rgb(var(--glass-tint) / 0.3)',
                  boxShadow: 'inset 0 1px 2px rgb(0 0 0 / 0.15)',
                }}
                aria-label="Toggle Private Profile"
              >
                <div
                  className="absolute top-1 w-[22px] h-[22px] rounded-full bg-white shadow-md transition-all duration-300"
                  style={{ left: privateProfile ? '24px' : '4px' }}
                />
              </button>
            </div>

            {/* Discovery Radar Search */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3 pr-2">
                <div className="w-9 h-9 rounded-2xl bg-pink-500/15 text-pink-500 flex items-center justify-center shrink-0">
                  <Eye size={18} strokeWidth={2.4} />
                </div>
                <div>
                  <p className="text-body text-primary font-semibold">Search Discovery</p>
                  <p className="text-caption text-secondary">
                    Allow people to find you by username or interests
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleToggle(setDiscoverySearch, discoverySearch, 'Search Discovery')}
                className="relative w-[50px] h-[30px] rounded-full transition-all duration-300 spring-press cursor-pointer shrink-0"
                style={{
                  background: discoverySearch
                    ? 'linear-gradient(135deg, rgb(244 114 182), rgb(236 72 153))'
                    : 'rgb(var(--glass-tint) / 0.3)',
                  boxShadow: 'inset 0 1px 2px rgb(0 0 0 / 0.15)',
                }}
                aria-label="Toggle Search Discovery"
              >
                <div
                  className="absolute top-1 w-[22px] h-[22px] rounded-full bg-white shadow-md transition-all duration-300"
                  style={{ left: discoverySearch ? '24px' : '4px' }}
                />
              </button>
            </div>

            {/* Show Online Status */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3 pr-2">
                <div className="w-9 h-9 rounded-2xl bg-pink-500/15 text-pink-500 flex items-center justify-center shrink-0">
                  <User size={18} strokeWidth={2.4} />
                </div>
                <div>
                  <p className="text-body text-primary font-semibold">Online & Active Status</p>
                  <p className="text-caption text-secondary">
                    Show green indicator when active in group chats
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleToggle(setShowOnlineStatus, showOnlineStatus, 'Online Status')}
                className="relative w-[50px] h-[30px] rounded-full transition-all duration-300 spring-press cursor-pointer shrink-0"
                style={{
                  background: showOnlineStatus
                    ? 'linear-gradient(135deg, rgb(244 114 182), rgb(236 72 153))'
                    : 'rgb(var(--glass-tint) / 0.3)',
                  boxShadow: 'inset 0 1px 2px rgb(0 0 0 / 0.15)',
                }}
                aria-label="Toggle Online Status"
              >
                <div
                  className="absolute top-1 w-[22px] h-[22px] rounded-full bg-white shadow-md transition-all duration-300"
                  style={{ left: showOnlineStatus ? '24px' : '4px' }}
                />
              </button>
            </div>

            {/* Show in Attendee Lists */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3 pr-2">
                <div className="w-9 h-9 rounded-2xl bg-pink-500/15 text-pink-500 flex items-center justify-center shrink-0">
                  <Users size={18} strokeWidth={2.4} />
                </div>
                <div>
                  <p className="text-body text-primary font-semibold">Attendee Roster Visibility</p>
                  <p className="text-caption text-secondary">
                    Display avatar in the joined list of public events
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleToggle(setShowInAttendeeList, showInAttendeeList, 'Attendee Visibility')}
                className="relative w-[50px] h-[30px] rounded-full transition-all duration-300 spring-press cursor-pointer shrink-0"
                style={{
                  background: showInAttendeeList
                    ? 'linear-gradient(135deg, rgb(244 114 182), rgb(236 72 153))'
                    : 'rgb(var(--glass-tint) / 0.3)',
                  boxShadow: 'inset 0 1px 2px rgb(0 0 0 / 0.15)',
                }}
                aria-label="Toggle Attendee Visibility"
              >
                <div
                  className="absolute top-1 w-[22px] h-[22px] rounded-full bg-white shadow-md transition-all duration-300"
                  style={{ left: showInAttendeeList ? '24px' : '4px' }}
                />
              </button>
            </div>
          </GlassCard>
        </SettingsSection>

        {/* Section 2: Contact & Invitation Permissions */}
        <SettingsSection title="Who Can Contact You">
          <GlassCard className="rounded-3xl p-4 space-y-4">
            {/* DM Audience */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-foot font-bold text-primary">Direct Messages (DMs)</span>
                <span className="text-[11px] font-semibold text-pink-500 capitalize">
                  {dmAudience.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { id: 'everyone', label: 'Everyone' },
                    { id: 'friends_of_friends', label: 'Mutuals' },
                    { id: 'friends', label: 'Friends' },
                  ] as const
                ).map((aud) => {
                  const active = dmAudience === aud.id;
                  return (
                    <button
                      key={aud.id}
                      type="button"
                      onClick={() => {
                        triggerHaptic(6);
                        setDmAudience(aud.id);
                        showToast(`DMs set to ${aud.label}`);
                      }}
                      className={`py-2 px-1 rounded-2xl text-[11px] font-bold text-center transition-all spring-press cursor-pointer ${
                        active
                          ? 'bg-pink-500 text-white shadow-xs ring-1 ring-pink-500'
                          : 'glass-thin text-secondary hover:text-primary'
                      }`}
                    >
                      {aud.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <SettingsDivider />

            {/* Ekip Invitations */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-foot font-bold text-primary">Ekip Gathering Invites</span>
                <span className="text-[11px] font-semibold text-pink-500 capitalize">
                  {inviteAudience === 'verified' ? 'Verified Only' : inviteAudience}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { id: 'everyone', label: 'Everyone' },
                    { id: 'verified', label: 'Verified' },
                    { id: 'friends', label: 'Friends Only' },
                  ] as const
                ).map((aud) => {
                  const active = inviteAudience === aud.id;
                  return (
                    <button
                      key={aud.id}
                      type="button"
                      onClick={() => {
                        triggerHaptic(6);
                        setInviteAudience(aud.id);
                        showToast(`Invites set to ${aud.label}`);
                      }}
                      className={`py-2 px-1 rounded-2xl text-[11px] font-bold text-center transition-all spring-press cursor-pointer ${
                        active
                          ? 'bg-pink-500 text-white shadow-xs ring-1 ring-pink-500'
                          : 'glass-thin text-secondary hover:text-primary'
                      }`}
                    >
                      {aud.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </GlassCard>
        </SettingsSection>

        {/* Section 3: Geofence & Location Privacy */}
        <SettingsSection title="Location & Geofence Privacy">
          <GlassCard className="rounded-3xl overflow-hidden divide-y divide-white/10">
            {/* Precise Live Location */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3 pr-2">
                <div className="w-9 h-9 rounded-2xl bg-pink-500/15 text-pink-500 flex items-center justify-center shrink-0">
                  <MapPin size={18} strokeWidth={2.4} />
                </div>
                <div>
                  <p className="text-body text-primary font-semibold">Live Event GPS Tracking</p>
                  <p className="text-caption text-secondary">
                    Only activate pinpoint coordinates 30 mins before meetup time
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleToggle(setPreciseLocation, preciseLocation, 'Live Event GPS')}
                className="relative w-[50px] h-[30px] rounded-full transition-all duration-300 spring-press cursor-pointer shrink-0"
                style={{
                  background: preciseLocation
                    ? 'linear-gradient(135deg, rgb(244 114 182), rgb(236 72 153))'
                    : 'rgb(var(--glass-tint) / 0.3)',
                  boxShadow: 'inset 0 1px 2px rgb(0 0 0 / 0.15)',
                }}
                aria-label="Toggle Live Event GPS"
              >
                <div
                  className="absolute top-1 w-[22px] h-[22px] rounded-full bg-white shadow-md transition-all duration-300"
                  style={{ left: preciseLocation ? '24px' : '4px' }}
                />
              </button>
            </div>

            {/* City & Neighborhood */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3 pr-2">
                <div className="w-9 h-9 rounded-2xl bg-pink-500/15 text-pink-500 flex items-center justify-center shrink-0">
                  <User size={18} strokeWidth={2.4} />
                </div>
                <div>
                  <p className="text-body text-primary font-semibold">Show City Pill</p>
                  <p className="text-caption text-secondary">
                    Display &quot;{me.city || 'San Francisco'}&quot; on your profile cards
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleToggle(setShowCityNeighborhood, showCityNeighborhood, 'City Pill')}
                className="relative w-[50px] h-[30px] rounded-full transition-all duration-300 spring-press cursor-pointer shrink-0"
                style={{
                  background: showCityNeighborhood
                    ? 'linear-gradient(135deg, rgb(244 114 182), rgb(236 72 153))'
                    : 'rgb(var(--glass-tint) / 0.3)',
                  boxShadow: 'inset 0 1px 2px rgb(0 0 0 / 0.15)',
                }}
                aria-label="Toggle City Pill"
              >
                <div
                  className="absolute top-1 w-[22px] h-[22px] rounded-full bg-white shadow-md transition-all duration-300"
                  style={{ left: showCityNeighborhood ? '24px' : '4px' }}
                />
              </button>
            </div>

            {/* Hide Honor Score */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3 pr-2">
                <div className="w-9 h-9 rounded-2xl bg-pink-500/15 text-pink-500 flex items-center justify-center shrink-0">
                  <ShieldCheck size={18} strokeWidth={2.4} />
                </div>
                <div>
                  <p className="text-body text-primary font-semibold">Hide Honor Score</p>
                  <p className="text-caption text-secondary">
                    Keep your honor score (94) private from other users
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleToggle(setHideHonorScore, hideHonorScore, 'Honor Score Masking')}
                className="relative w-[50px] h-[30px] rounded-full transition-all duration-300 spring-press cursor-pointer shrink-0"
                style={{
                  background: hideHonorScore
                    ? 'linear-gradient(135deg, rgb(244 114 182), rgb(236 72 153))'
                    : 'rgb(var(--glass-tint) / 0.3)',
                  boxShadow: 'inset 0 1px 2px rgb(0 0 0 / 0.15)',
                }}
                aria-label="Toggle Hide Honor Score"
              >
                <div
                  className="absolute top-1 w-[22px] h-[22px] rounded-full bg-white shadow-md transition-all duration-300"
                  style={{ left: hideHonorScore ? '24px' : '4px' }}
                />
              </button>
            </div>
          </GlassCard>
        </SettingsSection>

        {/* Section 4: Safety & Blocked Accounts */}
        <SettingsSection title="Safety & Blocked Accounts">
          <GlassCard className="rounded-3xl overflow-hidden">
            <div
              onClick={() => {
                triggerHaptic(8);
                setShowBlockedSheet(true);
              }}
              className="flex items-center justify-between p-4 cursor-pointer spring-press hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-rose-500/15 text-rose-500 flex items-center justify-center">
                  <Ban size={18} strokeWidth={2.4} />
                </div>
                <div>
                  <p className="text-body text-primary font-semibold">Blocked Accounts</p>
                  <p className="text-caption text-secondary">
                    {blockedList.length} accounts cannot view or contact you
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-pink-500 font-bold text-foot">
                <span>{blockedList.length}</span>
                <ChevronRight size={16} />
              </div>
            </div>
          </GlassCard>
        </SettingsSection>

        {/* Section 5: Data Rights & Archive */}
        <SettingsSection title="Data & Account Rights">
          <GlassCard className="rounded-3xl p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-2xl bg-pink-500/15 text-pink-500 flex items-center justify-center shrink-0 mt-0.5">
                <Fingerprint size={18} strokeWidth={2.2} />
              </div>
              <div>
                <h4 className="text-foot font-bold text-primary">Zero-Knowledge Encrypted Vault</h4>
                <p className="text-[11px] text-secondary mt-0.5 leading-relaxed">
                  Your chat logs, biometric hashes, and private messages are end-to-end encrypted on device.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <GlassButton
                variant="secondary"
                size="sm"
                onClick={handleExportData}
                icon="Share"
              >
                Export Data
              </GlassButton>

              <GlassButton
                variant="secondary"
                size="sm"
                onClick={handleClearCache}
                icon="Trash"
              >
                Clear Cache
              </GlassButton>
            </div>
          </GlassCard>
        </SettingsSection>
      </div>

      {/* Blocked Accounts Bottom Sheet */}
      <GlassSheet
        open={showBlockedSheet}
        onClose={() => setShowBlockedSheet(false)}
        title="Blocked Accounts"
      >
        <div className="space-y-3 pt-2">
          <p className="text-foot text-secondary">
            Blocked accounts cannot find your profile, view your Ekips, or send you messages.
          </p>

          {blockedList.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-full bg-pink-500/10 text-pink-500 flex items-center justify-center mx-auto mb-2">
                <Check size={24} strokeWidth={2.6} />
              </div>
              <p className="text-body font-bold text-primary">No Blocked Accounts</p>
              <p className="text-caption text-secondary mt-0.5">Your block list is clean</p>
            </div>
          ) : (
            <div className="space-y-2">
              {blockedList.map((user) => (
                <div
                  key={user.id}
                  className="glass-thin rounded-2xl p-3 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <GlassAvatar src={user.avatar} name={user.name} size={42} />
                    <div>
                      <p className="text-foot text-primary font-bold">{user.name}</p>
                      <p className="text-caption text-secondary">@{user.username}</p>
                      <span className="text-[10px] text-tertiary">Blocked {user.blockedDate}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleUnblockUser(user.id, user.name)}
                    className="px-3 py-1.5 rounded-full glass-thick text-[11px] font-bold text-pink-500 hover:bg-pink-500 hover:text-white transition-all spring-press cursor-pointer border border-pink-500/30"
                  >
                    Unblock
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </GlassSheet>

      {/* Floating Toast Notification */}
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage('')} />}
    </div>
  );
}
