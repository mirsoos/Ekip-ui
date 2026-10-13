import { useState, useMemo } from 'react';
import { useAppData } from '@/lib/appData';
import { GlassSheet, Toast } from '@/components/Overlays';
import { GlassEmpty } from '@/components/Glass';
import { getIcon, type IconName } from '@/lib/icons';
import type { Notification, Group } from '@/types/database';

interface NotificationSheetProps {
  open: boolean;
  onClose: () => void;
  onOpenConversation?: (id: string) => void;
  onOpenGroup?: (group: Group) => void;
}

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

export function NotificationSheet({
  open,
  onClose,
  onOpenConversation,
}: NotificationSheetProps) {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useAppData();
  const [filter, setFilter] = useState<FeedFilter>('all');
  const [toastMessage, setToastMessage] = useState('');
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  const triggerHaptic = (ms: number = 8) => {
    if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
      try {
        navigator.vibrate(ms);
      } catch {
        // ignore vibration error
      }
    }
  };

  const activeNotifications = useMemo(
    () => notifications.filter((n) => !dismissedIds.includes(n.id)),
    [notifications, dismissedIds]
  );

  const unreadCount = useMemo(
    () => activeNotifications.filter((n) => !n.is_read).length,
    [activeNotifications]
  );

  const filteredList = useMemo(() => {
    return activeNotifications.filter((n) => {
      if (filter === 'unread') return !n.is_read;
      if (filter === 'groups') return n.type === 'group_request' || n.type === 'achievement';
      if (filter === 'social') return n.type === 'friend_request' || n.type === 'chat';
      if (filter === 'rewards') return n.type === 'discount' || n.type === 'subscription';
      return true;
    });
  }, [activeNotifications, filter]);

  const handleAction = (n: Notification) => {
    markNotificationRead(n.id);
    triggerHaptic(10);
    if (n.type === 'chat' && onOpenConversation) {
      onClose();
      onOpenConversation('conv-1');
    } else if (n.type === 'group_request') {
      setToastMessage('Opening Ekip request review...');
      setTimeout(() => setToastMessage(''), 2500);
    } else if (n.type === 'friend_request') {
      setToastMessage('Friend request accepted!');
      setTimeout(() => setToastMessage(''), 2500);
    } else {
      setToastMessage(`Opened: ${n.title}`);
      setTimeout(() => setToastMessage(''), 2000);
    }
  };

  const handleDismissOne = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    triggerHaptic(6);
    setDismissedIds((prev) => [...prev, id]);
  };

  const handleMarkAllRead = () => {
    triggerHaptic(12);
    markAllNotificationsRead();
    setToastMessage('All notifications marked as read');
    setTimeout(() => setToastMessage(''), 2000);
  };

  const Check = getIcon('Check');
  const Trash = getIcon('Trash');

  return (
    <>
      <GlassSheet open={open} onClose={onClose} title="Notifications" fullHeight>
        <div className="space-y-4 pb-12 pt-1">
          {/* Filter Pills */}
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
                  className="text-[11px] font-bold text-pink-500 hover:text-pink-600 transition-colors flex items-center gap-1"
                >
                  <Check size={12} strokeWidth={2.8} />
                  <span>Mark all read</span>
                </button>
              )}
            </div>
          </div>

          {/* Notification List */}
          {filteredList.length === 0 ? (
            <GlassEmpty
              icon="Bell"
              title={filter === 'unread' ? 'Zero unread notifications' : 'No notifications'}
              subtitle={
                filter === 'unread'
                  ? "You're completely caught up on all activity!"
                  : 'Activity and messages from your Ekips will appear right here.'
              }
            />
          ) : (
            <div className="space-y-2.5">
              {filteredList.map((n, idx) => {
                const cfg = TYPE_CONFIG[n.type] ?? TYPE_CONFIG.admin;
                const Icon = getIcon(cfg.icon);

                return (
                  <div
                    key={n.id}
                    onClick={() => handleAction(n)}
                    className={`relative rounded-3xl p-3.5 glass transition-all cursor-pointer animate-rise-d${Math.min(
                      idx,
                      5
                    )} ${
                      n.is_read
                        ? 'glass-thin opacity-85 hover:opacity-100'
                        : 'glass-specular border-l-4 border-l-pink-500 shadow-md ring-1 ring-pink-500/20'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-inner relative"
                        style={{ background: cfg.bg }}
                      >
                        <Icon size={20} style={{ color: cfg.color }} strokeWidth={2.2} />
                        {!n.is_read && (
                          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-pink-500 ring-2 ring-white dark:ring-black animate-pulse" />
                        )}
                      </div>

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

                        <div className="mt-2.5 flex items-center justify-between gap-2">
                          <span
                            className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
                            style={{ background: cfg.bg, color: cfg.color }}
                          >
                            {cfg.label}
                          </span>

                          <button
                            type="button"
                            onClick={(e) => handleDismissOne(e, n.id)}
                            aria-label="Dismiss notification"
                            className="p-1 rounded-lg text-tertiary hover:text-rose-500 transition-colors"
                          >
                            <Trash size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </GlassSheet>
      <Toast message={toastMessage} visible={Boolean(toastMessage)} />
    </>
  );
}
