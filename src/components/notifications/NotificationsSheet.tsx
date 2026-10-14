import { useState, useMemo } from 'react';
import { useAppData } from '@/lib/appData';
import { GlassSheet, Toast } from '@/components/Overlays';
import { GlassEmpty } from '@/components/Glass';
import { NotificationItem } from '@/components/notifications/NotificationItem';
import { getIcon } from '@/lib/icons';
import type { Notification, Group } from '@/types/database';

interface NotificationsSheetProps {
  open: boolean;
  onClose: () => void;
  onOpenConversation?: (id: string) => void;
  onOpenGroup?: (group: Group) => void;
  onOpenSettings?: () => void;
}

type FeedFilter = 'all' | 'unread' | 'groups' | 'social' | 'rewards';

export function NotificationsSheet({
  open,
  onClose,
  onOpenConversation,
  onOpenGroup,
  onOpenSettings,
}: NotificationsSheetProps) {
  const { notifications, groups, markNotificationRead, markAllNotificationsRead, addNotification } = useAppData();
  const [filter, setFilter] = useState<FeedFilter>('all');
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState('');

  const Check = getIcon('Check');
  const Trash = getIcon('Trash');
  const Sparkles = getIcon('Sparkles');
  const SettingsIcon = getIcon('Settings');

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
    setTimeout(() => setToastMessage(''), 2400);
  };

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
    triggerHaptic(10);
    const readIds = activeNotifications.filter((n) => n.is_read).map((n) => n.id);
    setDismissedIds((prev) => [...prev, ...readIds]);
    showToast('Read notifications cleared');
  };

  const handleDismissOne = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    triggerHaptic(8);
    setDismissedIds((prev) => [...prev, id]);
  };

  const handleSimulateNewNotification = () => {
    triggerHaptic(12);
    const types: Notification['type'][] = [
      'chat',
      'friend_request',
      'group_request',
      'achievement',
      'discount',
      'admin',
    ];
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
    showToast('New alert received!');
  };

  const handleAction = (notification: Notification) => {
    triggerHaptic(8);
    if (!notification.is_read) {
      markNotificationRead(notification.id);
    }

    if (notification.type === 'chat' && onOpenConversation) {
      onClose();
      onOpenConversation('conv-1');
    } else if (notification.type === 'group_request' && onOpenGroup && groups.length > 0) {
      onClose();
      onOpenGroup(groups[0]);
    }
  };

  return (
    <GlassSheet
      open={open}
      onClose={onClose}
      title={`Notifications ${unreadCount > 0 ? `(${unreadCount})` : ''}`}
      fullHeight
    >
      <div className="space-y-4 pt-1">
        {/* Header preferences quick link bar */}
        {onOpenSettings && (
          <div className="flex items-center justify-between pb-1 border-b border-white/10">
            <span className="text-[11px] font-semibold text-tertiary">
              {unreadCount} unread · {activeNotifications.length} total
            </span>
            <button
              type="button"
              onClick={() => {
                triggerHaptic(8);
                onClose();
                onOpenSettings();
              }}
              className="text-[11px] font-bold text-pink-500 hover:text-pink-600 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <SettingsIcon size={12} />
              <span>Notification Settings</span>
            </button>
          </div>
        )}

        {/* Filter Pills Bar */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar py-0.5">
          <div className="flex items-center gap-1.5 shrink-0">
            {(
              [
                { key: 'all', label: 'All' },
                { key: 'unread', label: `Unread (${unreadCount})` },
                { key: 'groups', label: 'Ekips' },
                { key: 'social', label: 'Social' },
                { key: 'rewards', label: 'Rewards' },
              ] as const
            ).map((tabItem) => (
              <button
                key={tabItem.key}
                type="button"
                onClick={() => {
                  triggerHaptic(6);
                  setFilter(tabItem.key);
                }}
                className={`px-3 py-1.5 rounded-full text-[12px] font-bold transition-all whitespace-nowrap cursor-pointer ${
                  filter === tabItem.key
                    ? 'bg-gradient-to-r from-pink-500 to-blue-500 text-white shadow-xs'
                    : 'glass-thin border border-white/20 text-secondary hover:text-primary'
                }`}
              >
                {tabItem.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Actions Row */}
        <div className="flex items-center justify-between pt-1 pb-1">
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-[11px] font-bold text-pink-500 hover:text-pink-600 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Check size={12} strokeWidth={2.8} />
                <span>Mark all read</span>
              </button>
            )}
            {activeNotifications.some((n) => n.is_read) && (
              <button
                type="button"
                onClick={handleClearRead}
                className="text-[11px] font-semibold text-tertiary hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
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
            className="text-[11px] font-semibold text-blue-500 hover:text-blue-600 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Sparkles size={12} />
            <span>Simulate Alert</span>
          </button>
        </div>

        {/* Notification List */}
        {filteredList.length === 0 ? (
          <div key={`empty-${filter}`} className="animate-rise py-8">
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
            {filteredList.map((n, idx) => (
              <div key={n.id} className="relative group">
                <NotificationItem
                  notification={n}
                  index={idx}
                  onClick={() => handleAction(n)}
                />
                <button
                  type="button"
                  onClick={(e) => handleDismissOne(e, n.id)}
                  aria-label="Dismiss notification"
                  className="absolute top-3 right-3 p-1.5 rounded-xl bg-black/20 dark:bg-white/10 text-tertiary hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                >
                  <Trash size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {toastMessage && <Toast message={toastMessage} open={Boolean(toastMessage)} />}
    </GlassSheet>
  );
}
