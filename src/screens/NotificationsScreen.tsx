import { useState } from 'react';
import { useAppData } from '@/lib/appData';
import { GlassEmpty } from '@/components/Glass';
import { NotificationItem } from '@/components/notifications/NotificationItem';
import { NotificationFilterTabs } from '@/components/notifications/NotificationFilterTabs';

export function NotificationsScreen({ open }: { open: boolean }) {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useAppData();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filtered = filter === 'unread' ? notifications.filter((n) => !n.is_read) : notifications;
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <NotificationFilterTabs
        filter={filter}
        onChangeFilter={setFilter}
        unreadCount={unreadCount}
        onMarkAllRead={markAllNotificationsRead}
      />

      <div
        key={`${open}-${filter}`}
        className="min-h-0 flex-1 overflow-y-auto no-scrollbar px-5 pt-2 pb-4 mt-4"
      >
        {filtered.length === 0 ? (
          <GlassEmpty
            icon="Bell"
            title="No notifications"
            subtitle="You're all caught up. New activity will appear here."
          />
        ) : (
          <div className="space-y-2">
            {filtered.map((n, i) => (
              <NotificationItem
                key={n.id}
                notification={n}
                onClick={() => markNotificationRead(n.id)}
                index={i}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
