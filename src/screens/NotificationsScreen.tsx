import { useState } from 'react';
import { useAppData } from '@/lib/appData';
import { GlassCard, GlassEmpty } from '@/components/Glass';
import { getIcon, type IconName } from '@/lib/icons';

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

export function NotificationsScreen({ open }: { open: boolean }) {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useAppData();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filtered = filter === 'unread' ? notifications.filter((n) => !n.is_read) : notifications;
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div
        className="shrink-0 -mx-5 px-5 py-2"
      >
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-full text-foot font-semibold haptic ${filter === 'all' ? 'text-white' : 'glass-thin glass-specular text-secondary'}`}
              style={filter === 'all' ? { background: 'linear-gradient(135deg, rgb(244 114 182), rgb(59 130 246))' } : undefined}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-full text-foot font-semibold haptic ${filter === 'unread' ? 'text-white' : 'glass-thin glass-specular text-secondary'}`}
              style={filter === 'unread' ? { background: 'linear-gradient(135deg, rgb(244 114 182), rgb(59 130 246))' } : undefined}
            >
              Unread ({unreadCount})
            </button>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllNotificationsRead} className="text-foot text-pink-500 font-semibold haptic">
              Mark all read
            </button>
          )}
        </div>
      </div>

      <div key={`${open}-${filter}`} className="min-h-0 flex-1 overflow-y-auto no-scrollbar px-5 pt-2 pb-4 mt-4">
        {filtered.length === 0 ? (
          <GlassEmpty icon="Bell" title="No notifications" subtitle="You're all caught up. New activity will appear here." />
        ) : (
          <div className="space-y-2">
            {filtered.map((n, i) => {
              const Icon = getIcon(n.icon as IconName);
              const cfg = typeConfig[n.type] ?? typeConfig.admin;
              return (
                <button
                  key={n.id}
                  onClick={() => markNotificationRead(n.id)}
                  className={`w-full text-left animate-rise-d${Math.min(i, 5)} haptic-soft`}
                >
                  <GlassCard
                    variant={n.is_read ? 'thin' : 'default'}
                    className={`rounded-3xl p-3 flex items-start gap-3 ${n.is_read ? '' : 'ring-1 ring-pink-500/20'}`}
                  >
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                      style={{ background: cfg.bg }}
                    >
                      <Icon size={22} style={{ color: cfg.color }} strokeWidth={2.2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sub text-primary font-bold truncate">{n.title}</p>
                        {!n.is_read && <div className="w-2 h-2 rounded-full bg-pink-500 shrink-0" />}
                      </div>
                      <p className="text-foot text-secondary mt-0.5 leading-snug">{n.body}</p>
                      <p className="text-[10px] text-tertiary mt-1">{formatTime(n.created_at)}</p>
                    </div>
                  </GlassCard>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function formatTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
