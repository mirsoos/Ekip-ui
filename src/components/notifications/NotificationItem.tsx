import { GlassCard } from '@/components/Glass';
import { getIcon, type IconName } from '@/lib/icons';
import type { Notification } from '@/types/database';

interface NotificationItemProps {
  notification: Notification;
  onClick: () => void;
  index?: number;
}

const typeConfig: Record<string, { color: string; bg: string }> = {
  chat: { color: 'rgb(59 130 246)', bg: 'rgb(59 130 246 / 0.15)' },
  friend_request: { color: 'rgb(244 114 182)', bg: 'rgb(244 114 182 / 0.15)' },
  group_request: { color: 'rgb(168 85 247)', bg: 'rgb(168 85 247 / 0.15)' },
  admin: { color: 'rgb(107 114 128)', bg: 'rgb(107 114 128 / 0.15)' },
  ticket: { color: 'rgb(234 179 8)', bg: 'rgb(234 179 8 / 0.15)' },
  subscription: { color: 'rgb(234 179 8)', bg: 'rgb(234 179 8 / 0.15)' },
  discount: { color: 'rgb(16 185 129)', bg: 'rgb(16 185 129 / 0.15)' },
  report: { color: 'rgb(239 68 68)', bg: 'rgb(239 68 68 / 0.15)' },
  achievement: { color: 'rgb(234 179 8)', bg: 'rgb(234 179 8 / 0.15)' },
};

export function NotificationItem({ notification, onClick, index = 0 }: NotificationItemProps) {
  const Icon = getIcon(notification.icon as IconName);
  const cfg = typeConfig[notification.type] ?? typeConfig.admin;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left animate-rise-d${Math.min(index, 5)} spring-press cursor-pointer`}
    >
      <GlassCard
        variant={notification.is_read ? 'thin' : 'default'}
        className={`rounded-3xl p-3 flex items-start gap-3 ${
          notification.is_read ? '' : 'ring-1 ring-pink-500/25 shadow-sm'
        }`}
      >
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
          style={{ background: cfg.bg }}
        >
          <Icon size={22} style={{ color: cfg.color }} strokeWidth={2.2} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sub text-primary font-bold truncate">{notification.title}</p>
            {!notification.is_read && <div className="w-2 h-2 rounded-full bg-pink-500 shrink-0" />}
          </div>
          <p className="text-foot text-secondary mt-0.5 leading-snug">{notification.body}</p>
          <p className="text-[10px] text-tertiary mt-1">{formatNotificationTime(notification.created_at)}</p>
        </div>
      </GlassCard>
    </button>
  );
}

function formatNotificationTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
