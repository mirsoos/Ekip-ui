import { useState, useMemo } from 'react';
import type { Variants } from 'framer-motion';
import { useAppData } from '@/lib/appData';
import { GlassCard, GlassBackButton, GlassEmpty, GlassSegmented } from '@/components/Glass';
import { Toast } from '@/components/Overlays';
import { SettingsSection } from '@/components/settings/SettingsSection';
import { getIcon, type IconName } from '@/lib/icons';
import type { Notification, Group } from '@/types/database';

// eslint-disable-next-line react-refresh/only-export-components
export const raiseAnimation: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.45,
      delay: Math.min(i, 8) * 0.05,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
  exit: {
    opacity: 0,
    y: -14,
    scale: 0.95,
    transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
  },
};

interface NotificationsScreenProps {
  onBack?: () => void;
  open?: boolean; // backwards compatibility with sheets
  onOpenConversation?: (id: string) => void;
  onOpenGroup?: (group: Group) => void;
}

type TabType = 'feed' | 'settings';
type FeedFilter = 'all' | 'unread' | 'groups' | 'social' | 'rewards';

const TYPE_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; icon: IconName; border: string }
> = {
  chat: {
    label: 'Chat',
    color: 'rgb(59 130 246)',
    bg: 'rgb(59 130 246 / 0.15)',
    border: 'border-blue-500/30',
    icon: 'MessageCircle',
  },
  friend_request: {
    label: 'Friend Request',
    color: 'rgb(244 114 182)',
    bg: 'rgb(244 114 182 / 0.15)',
    border: 'border-pink-500/30',
    icon: 'UserPlus',
  },
  group_request: {
    label: 'Ekip Request',
    color: 'rgb(168 85 247)',
    bg: 'rgb(168 85 247 / 0.15)',
    border: 'border-purple-500/30',
    icon: 'Users',
  },
  admin: {
    label: 'System',
    color: 'rgb(107 114 128)',
    bg: 'rgb(107 114 128 / 0.15)',
    border: 'border-zinc-500/30',
    icon: 'Shield',
  },
  ticket: {
    label: 'Support',
    color: 'rgb(234 179 8)',
    bg: 'rgb(234 179 8 / 0.15)',
    border: 'border-amber-500/30',
    icon: 'Info',
  },
  subscription: {
    label: 'Premium',
    color: 'rgb(234 179 8)',
    bg: 'rgb(234 179 8 / 0.15)',
    border: 'border-amber-500/30',
    icon: 'Crown',
  },
  discount: {
    label: 'Perk',
    color: 'rgb(16 185 129)',
    bg: 'rgb(16 185 129 / 0.15)',
    border: 'border-emerald-500/30',
    icon: 'Gift',
  },
  report: {
    label: 'Alert',
    color: 'rgb(239 68 68)',
    bg: 'rgb(239 68 68 / 0.15)',
    border: 'border-rose-500/30',
    icon: 'AlertCircle',
  },
  achievement: {
    label: 'Milestone',
    color: 'rgb(245 158 11)',
    bg: 'rgb(245 158 11 / 0.15)',
    border: 'border-amber-500/30',
    icon: 'Trophy',
  },
};

function formatTimeAgo(iso: string): string {
  try {
    const diff = Date.now() - new Date(iso).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  } catch {
    return 'Recently';
  }
}

export function NotificationsScreen({
  onBack,
  onOpenConversation,
}: NotificationsScreenProps) {
  const { notifications, markNotificationRead, markAllNotificationsRead, addNotification } = useAppData();

  // Active top tab (Feed vs Preferences)
  const [activeTab, setActiveTab] = useState<TabType>('feed');

  // Feed filter
  const [filter, setFilter] = useState<FeedFilter>('all');

  // Toast feedback
  const [toastMessage, setToastMessage] = useState('');

  // Preference Toggles state
  const [masterPush, setMasterPush] = useState(true);
  const [groupRequestsPush, setGroupRequestsPush] = useState(true);
  const [eventRemindersPush, setEventRemindersPush] = useState(true);
  const [flashNearbyEkips, setFlashNearbyEkips] = useState(true);
  const [directMessagesPush, setDirectMessagesPush] = useState(true);
  const [friendRequestsPush, setFriendRequestsPush] = useState(true);
  const [honorMilestonesPush, setHonorMilestonesPush] = useState(true);
  const [soundHaptics, setSoundHaptics] = useState(true);
  const [inAppBanners, setInAppBanners] = useState(true);
  const [quietHours, setQuietHours] = useState(false);
  const [quietHoursSchedule, setQuietHoursSchedule] = useState<'22-8' | '23-7' | 'all-night'>('23-7');
  const [emailDigest, setEmailDigest] = useState<'instant' | 'daily' | 'weekly' | 'off'>('daily');

  // Dismissed notifications list (local deletion simulation)
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  // Icons
  const Bell = getIcon('Bell');
  const Check = getIcon('Check');
  const Trash = getIcon('Trash');
  const SlidersHorizontal = getIcon('SlidersHorizontal');
  const Sparkles = getIcon('Sparkles');
  const Volume2 = getIcon('Volume2');
  const Mail = getIcon('Mail');
  const Moon = getIcon('Moon');

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
    setTimeout(() => setToastMessage(''), 2600);
  };

  // Filtered list
  const activeNotifications = useMemo(() => {
    return notifications.filter((n) => !dismissedIds.includes(n.id));
  }, [notifications, dismissedIds]);

  const filteredList = useMemo(() => {
    return activeNotifications.filter((n) => {
      if (filter === 'unread') return !n.is_read;
      if (filter === 'groups') return n.type === 'group_request' || n.type === 'discount';
      if (filter === 'social') return n.type === 'chat' || n.type === 'friend_request';
      if (filter === 'rewards') return n.type === 'achievement' || n.type === 'subscription';
      return true;
    });
  }, [activeNotifications, filter]);

  const unreadCount = useMemo(() => {
    return activeNotifications.filter((n) => !n.is_read).length;
  }, [activeNotifications]);

  const handleMarkAllRead = () => {
    triggerHaptic(12);
    markAllNotificationsRead();
    showToast('All notifications marked as read');
  };

  const handleClearRead = () => {
    triggerHaptic(14);
    const readIds = activeNotifications.filter((n) => n.is_read).map((n) => n.id);
    setDismissedIds((prev) => [...prev, ...readIds]);
    showToast(`Removed ${readIds.length} read notifications`);
  };

  const handleDismissOne = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    triggerHaptic(10);
    setDismissedIds((prev) => [...prev, id]);
    showToast('Notification removed');
  };

  const handleAction = (n: Notification) => {
    triggerHaptic(10);
    markNotificationRead(n.id);

    if (n.type === 'chat' && onOpenConversation) {
      onOpenConversation('c1');
      return;
    }

    if (n.type === 'achievement') {
      showToast('🎉 Badge celebration unlocked!');
      return;
    }

    if (n.type === 'friend_request') {
      showToast('Friend request accepted');
      return;
    }

    if (n.type === 'group_request') {
      showToast('Ekip member approved');
      return;
    }

    showToast('Notification confirmed');
  };

  const handleSimulateNewNotification = () => {
    triggerHaptic(16);
    const types: Notification['type'][] = ['chat', 'friend_request', 'group_request', 'achievement', 'discount'];
    const randomType = types[Math.floor(Math.random() * types.length)];

    const samples: Record<Notification['type'], { title: string; body: string; icon: string }> = {
      chat: { title: 'Liam Vance', body: 'Just dropped the meetup location in the channel!', icon: 'MessageCircle' },
      friend_request: { title: 'Camila Zhang', body: 'Camila requested to connect with you.', icon: 'UserPlus' },
      group_request: { title: 'Neon Night Walkers', body: 'Elena requested to join your midnight photowalk.', icon: 'Users' },
      achievement: { title: 'Milestone Unlocked!', body: 'You reached 95+ Honor Score on Ekip.', icon: 'Trophy' },
      discount: { title: 'Partner Perk', body: 'Free matcha drink unlocked for your next Ekip meetup.', icon: 'Gift' },
      admin: { title: 'Security Alert', body: 'New login verified on iPhone 16 Pro.', icon: 'Shield' },
      ticket: { title: 'Ekip Support', body: 'Your support ticket was answered.', icon: 'Info' },
      subscription: { title: 'Premium Renewed', body: 'Your VIP pass is active.', icon: 'Crown' },
      report: { title: 'Community Notice', body: 'Guidelines updated for private Ekips.', icon: 'AlertCircle' },
    };

    const sample = samples[randomType];
    addNotification({
      type: randomType,
      title: sample.title,
      body: sample.body,
      icon: sample.icon,
    });
    showToast('New simulated alert received!');
  };

  const handleTogglePref = (
    setter: React.Dispatch<React.SetStateAction<boolean>>,
    val: boolean,
    title: string
  ) => {
    triggerHaptic(8);
    setter(!val);
    showToast(`${title} ${!val ? 'enabled' : 'disabled'}`);
  };

  return (
    <div className="h-full overflow-y-auto no-scrollbar screen-enter-items pb-6">
      {/* Sticky Liquid Glass Navigation Header */}
      <div className="sticky top-0 z-30 glass glass-specular px-5 pt-3 pb-3 border-b border-white/20 dark:border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && <GlassBackButton onClick={onBack} />}
            <div>
              <h1 className="text-title1 text-primary font-bold">Notifications</h1>
              <p className="text-[11px] text-tertiary">
                {activeTab === 'feed'
                  ? `${unreadCount} unread · ${activeNotifications.length} total updates`
                  : 'Manage push, alerts & quiet hours'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                triggerHaptic(8);
                setActiveTab(activeTab === 'feed' ? 'settings' : 'feed');
              }}
              className="p-2 rounded-2xl glass-thin border border-white/20 text-secondary hover:text-primary transition-colors flex items-center gap-1.5 text-[11px] font-bold"
            >
              {activeTab === 'feed' ? (
                <>
                  <SlidersHorizontal size={14} />
                  <span>Channels</span>
                </>
              ) : (
                <>
                  <Bell size={14} />
                  <span>Inbox</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* View Switcher Segmented Control */}
        <GlassSegmented
          className="mt-3"
          options={[
            {
              label: `Activity Feed${unreadCount > 0 ? ` (${unreadCount})` : ''}`,
              value: 'feed',
              icon: 'Bell',
            },
            { label: 'Preferences', value: 'settings', icon: 'SlidersHorizontal' },
          ]}
          value={activeTab}
          onChange={(v) => {
            triggerHaptic(6);
            setActiveTab(v as TabType);
          }}
        />
      </div>

      <div key={activeTab} className="px-5 mt-4 space-y-4 animate-rise">
        {activeTab === 'feed' ? (
          <>
            {/* Filter Pills Bar */}
            <GlassSegmented
              options={[
                { label: 'All', value: 'all', icon: 'Bell' },
                { label: `Unread${unreadCount > 0 ? ` (${unreadCount})` : ''}`, value: 'unread', icon: 'CircleDot' },
                { label: 'Ekips', value: 'groups', icon: 'Users' },
                { label: 'Social', value: 'social', icon: 'MessageCircle' },
                { label: 'Rewards', value: 'rewards', icon: 'Trophy' },
              ]}
              value={filter}
              onChange={(v) => {
                triggerHaptic(6);
                setFilter(v as FeedFilter);
              }}
            />

            {/* Quick Actions Row */}
            <div className="flex items-center justify-between pt-1 pb-1">
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    className="text-[11px] font-bold text-pink-500 hover:text-pink-600 transition-colors flex items-center gap-1"
                  >
                    <Check size={12} strokeWidth={2.8} />
                    <span>Mark all read</span>
                  </button>
                )}
                {activeNotifications.some((n) => n.is_read) && (
                  <button
                    type="button"
                    onClick={handleClearRead}
                    className="text-[11px] font-semibold text-tertiary hover:text-primary transition-colors flex items-center gap-1"
                  >
                    <Trash size={12} />
                    <span>Clear read</span>
                  </button>
                )}
              </div>

              {/* Demo Simulator button */}
              <button
                type="button"
                onClick={handleSimulateNewNotification}
                className="text-[11px] font-semibold text-blue-500 hover:text-blue-600 transition-colors flex items-center gap-1"
              >
                <Sparkles size={12} />
                <span>Simulate Alert</span>
              </button>
            </div>

            {/* Notification List */}
            {filteredList.length === 0 ? (
              <div key={`empty-${filter}`} className="animate-rise">
                <GlassEmpty
                  icon="Bell"
                  title={filter === 'unread' ? 'Zero unread notifications' : 'No notifications'}
                  subtitle={
                    filter === 'unread'
                      ? "You're completely caught up on all activity!"
                      : 'Activity and messages from your Ekips will appear right here.'
                  }
                />
              </div>
            ) : (
              <div key={`list-${filter}`} className="space-y-2.5 animate-rise">
                {filteredList.map((n, idx) => {
                  const cfg = TYPE_CONFIG[n.type] ?? TYPE_CONFIG.admin;
                  const Icon = getIcon(cfg.icon);

                  return (
                    <div
                      key={n.id}
                      onClick={() => handleAction(n)}
                      className={`relative rounded-3xl p-3.5 glass transition-all cursor-pointer spring-press animate-rise-d${Math.min(
                        idx,
                        5
                      )} ${
                        n.is_read
                          ? 'glass-thin opacity-85 hover:opacity-100'
                          : 'glass-specular border-l-4 border-l-pink-500 shadow-md ring-1 ring-pink-500/20'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon Badge */}
                        <div
                          className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-inner relative"
                          style={{ background: cfg.bg }}
                        >
                          <Icon size={20} style={{ color: cfg.color }} strokeWidth={2.2} />
                          {!n.is_read && (
                            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-pink-500 ring-2 ring-white dark:ring-black animate-pulse" />
                          )}
                        </div>

                        {/* Text Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sub font-bold text-primary truncate">
                              {n.title}
                            </span>
                            <span className="text-[10px] text-tertiary shrink-0">
                              {formatTimeAgo(n.created_at)}
                            </span>
                          </div>

                          <p className="text-foot text-secondary mt-0.5 leading-snug line-clamp-2">
                            {n.body}
                          </p>

                          {/* Contextual Action Bar */}
                          <div className="mt-2.5 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                              <span
                                className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
                                style={{ background: cfg.bg, color: cfg.color }}
                              >
                                {cfg.label}
                              </span>

                              {n.type === 'friend_request' && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAction(n);
                                  }}
                                  className="text-[11px] font-bold text-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20 px-2 py-0.5 rounded-lg border border-emerald-500/20 transition-colors"
                                >
                                  Accept
                                </button>
                              )}

                              {n.type === 'group_request' && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAction(n);
                                  }}
                                  className="text-[11px] font-bold text-purple-500 bg-purple-500/10 hover:bg-purple-500/20 px-2 py-0.5 rounded-lg border border-purple-500/20 transition-colors"
                                >
                                  Review
                                </button>
                              )}

                              {n.type === 'chat' && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAction(n);
                                  }}
                                  className="text-[11px] font-bold text-blue-500 bg-blue-500/10 hover:bg-blue-500/20 px-2 py-0.5 rounded-lg border border-blue-500/20 transition-colors"
                                >
                                  Reply
                                </button>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={(e) => handleDismissOne(e, n.id)}
                              aria-label="Dismiss notification"
                              className="p-1 rounded-lg text-tertiary hover:text-rose-500 transition-colors"
                            >
                              <Trash size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          /* Preferences / Delivery Channels View */
          <div key="settings-view" className="space-y-5 animate-rise">
            {/* Master Push Toggle Hero Card */}
            <div className="relative rounded-3xl overflow-hidden p-5 glass glass-specular border border-indigo-500/30 shadow-lg">
              <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-pink-500/15 blur-3xl pointer-events-none" />

              <div className="relative z-10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-500 flex items-center justify-center border border-indigo-500/30">
                    <Bell size={24} />
                  </div>
                  <div>
                    <h2 className="text-body text-primary font-bold">Push Notifications</h2>
                    <p className="text-caption text-secondary">
                      {masterPush ? 'Active on iPhone 16 Pro' : 'Notifications paused'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleTogglePref(setMasterPush, masterPush, 'Push Notifications')}
                  aria-label="Toggle Master Push Notifications"
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    masterPush ? 'bg-indigo-500' : 'bg-zinc-400/50 dark:bg-zinc-600'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      masterPush ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Ekip & Activities Section */}
            <SettingsSection title="Ekip & Gathering Alerts">
              <GlassCard className="rounded-3xl overflow-hidden divide-y divide-white/10 dark:divide-white/5">
                <div className="p-4 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-body font-semibold text-primary">Join Requests</span>
                    <p className="text-caption text-secondary">When someone applies to enter your Ekip</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleTogglePref(setGroupRequestsPush, groupRequestsPush, 'Join Requests')}
                    aria-label="Toggle Join Requests alerts"
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                      groupRequestsPush ? 'bg-purple-500' : 'bg-zinc-400/50 dark:bg-zinc-600'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                        groupRequestsPush ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="p-4 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-body font-semibold text-primary">Event Reminders</span>
                    <p className="text-caption text-secondary">1 hour countdown alerts before scheduled meetups</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleTogglePref(setEventRemindersPush, eventRemindersPush, 'Event Reminders')}
                    aria-label="Toggle Event Reminders alerts"
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                      eventRemindersPush ? 'bg-purple-500' : 'bg-zinc-400/50 dark:bg-zinc-600'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                        eventRemindersPush ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="p-4 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-body font-semibold text-primary">Flash Radar Ekips</span>
                    <p className="text-caption text-secondary">Pop-up community events within 5km radius</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleTogglePref(setFlashNearbyEkips, flashNearbyEkips, 'Flash Nearby Ekips')}
                    aria-label="Toggle Flash Radar Ekips alerts"
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                      flashNearbyEkips ? 'bg-purple-500' : 'bg-zinc-400/50 dark:bg-zinc-600'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                        flashNearbyEkips ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </GlassCard>
            </SettingsSection>

            {/* Social & Messaging Section */}
            <SettingsSection title="Social & Community">
              <GlassCard className="rounded-3xl overflow-hidden divide-y divide-white/10 dark:divide-white/5">
                <div className="p-4 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-body font-semibold text-primary">Direct Messages & Mentions</span>
                    <p className="text-caption text-secondary">Instant alerts for new chats and @tags</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleTogglePref(setDirectMessagesPush, directMessagesPush, 'Chat Alerts')}
                    aria-label="Toggle Chat Alerts"
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                      directMessagesPush ? 'bg-blue-500' : 'bg-zinc-400/50 dark:bg-zinc-600'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                        directMessagesPush ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="p-4 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-body font-semibold text-primary">Friend Requests</span>
                    <p className="text-caption text-secondary">When other members request to connect</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleTogglePref(setFriendRequestsPush, friendRequestsPush, 'Friend Requests')}
                    aria-label="Toggle Friend Requests"
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                      friendRequestsPush ? 'bg-pink-500' : 'bg-zinc-400/50 dark:bg-zinc-600'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                        friendRequestsPush ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="p-4 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-body font-semibold text-primary">Honor & Level Milestones</span>
                    <p className="text-caption text-secondary">Celebratory alerts for XP and badges earned</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleTogglePref(setHonorMilestonesPush, honorMilestonesPush, 'Milestone Alerts')}
                    aria-label="Toggle Milestone Alerts"
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                      honorMilestonesPush ? 'bg-amber-500' : 'bg-zinc-400/50 dark:bg-zinc-600'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                        honorMilestonesPush ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </GlassCard>
            </SettingsSection>

            {/* Delivery Modes & Quiet Hours */}
            <SettingsSection title="Sounds, Banners & Schedule">
              <GlassCard className="rounded-3xl overflow-hidden divide-y divide-white/10 dark:divide-white/5">
                <div className="p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Volume2 size={18} className="text-secondary" />
                    <div>
                      <span className="text-body font-semibold text-primary">Sound & Haptics</span>
                      <p className="text-caption text-secondary">Subtle iOS click vibration on incoming notifications</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleTogglePref(setSoundHaptics, soundHaptics, 'Sound & Haptics')}
                    aria-label="Toggle Sound & Haptics"
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                      soundHaptics ? 'bg-indigo-500' : 'bg-zinc-400/50 dark:bg-zinc-600'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                        soundHaptics ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Sparkles size={18} className="text-secondary" />
                    <div>
                      <span className="text-body font-semibold text-primary">In-App Liquid Banners</span>
                      <p className="text-caption text-secondary">Display floating banner while inside the application</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleTogglePref(setInAppBanners, inAppBanners, 'In-App Banners')}
                    aria-label="Toggle In-App Banners"
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                      inAppBanners ? 'bg-indigo-500' : 'bg-zinc-400/50 dark:bg-zinc-600'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                        inAppBanners ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Quiet Hours */}
                <div className="p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Moon size={18} className="text-secondary" />
                      <div>
                        <span className="text-body font-semibold text-primary">Quiet Hours (Do Not Disturb)</span>
                        <p className="text-caption text-secondary">Silence notifications during rest periods</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleTogglePref(setQuietHours, quietHours, 'Quiet Hours')}
                      aria-label="Toggle Quiet Hours"
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        quietHours ? 'bg-indigo-500' : 'bg-zinc-400/50 dark:bg-zinc-600'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                          quietHours ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {quietHours && (
                    <GlassSegmented
                      className="mt-2"
                      options={[
                        { label: '22:00 – 08:00', value: '22-8', icon: 'Moon' },
                        { label: '23:00 – 07:00', value: '23-7', icon: 'Moon' },
                        { label: '00:00 – 09:00', value: 'all-night', icon: 'Moon' },
                      ]}
                      value={quietHoursSchedule}
                      onChange={(v) => {
                        triggerHaptic(6);
                        const scheduleKey = v as '22-8' | '23-7' | 'all-night';
                        setQuietHoursSchedule(scheduleKey);
                        const labels = { '22-8': '22:00 – 08:00', '23-7': '23:00 – 07:00', 'all-night': '00:00 – 09:00' };
                        showToast(`Quiet hours schedule set to ${labels[scheduleKey]}`);
                      }}
                    />
                  )}
                </div>

                {/* Email Digest */}
                <div className="p-4 space-y-2.5">
                  <div className="flex items-center gap-3">
                    <Mail size={18} className="text-secondary" />
                    <div>
                      <span className="text-body font-semibold text-primary">Email Digest</span>
                      <p className="text-caption text-secondary">Summary of community gatherings & invites</p>
                    </div>
                  </div>

                  <GlassSegmented
                    className="mt-1"
                    options={[
                      { label: 'Instant', value: 'instant', icon: 'Zap' },
                      { label: 'Daily', value: 'daily', icon: 'Calendar' },
                      { label: 'Weekly', value: 'weekly', icon: 'Clock' },
                      { label: 'Off', value: 'off', icon: 'EyeOff' },
                    ]}
                    value={emailDigest}
                    onChange={(v) => {
                      triggerHaptic(6);
                      const freq = v as 'instant' | 'daily' | 'weekly' | 'off';
                      setEmailDigest(freq);
                      showToast(`Email digest: ${freq}`);
                    }}
                  />
                </div>
              </GlassCard>
            </SettingsSection>
          </div>
        )}
      </div>

      {/* Toast Feedback */}
      <Toast message={toastMessage} open={Boolean(toastMessage)} />
    </div>
  );
}
