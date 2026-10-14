import { GlassSegmented } from '@/components/Glass';

interface NotificationFilterTabsProps {
  filter: 'all' | 'unread';
  onChangeFilter: (f: 'all' | 'unread') => void;
  unreadCount: number;
  onMarkAllRead: () => void;
  className?: string;
}

export function NotificationFilterTabs({
  filter,
  onChangeFilter,
  unreadCount,
  onMarkAllRead,
  className = '',
}: NotificationFilterTabsProps) {
  return (
    <div className={`shrink-0 -mx-5 px-5 py-2 ${className}`}>
      <div className="flex items-center justify-between gap-3">
        <GlassSegmented
          className="flex-1"
          options={[
            { label: 'All', value: 'all' },
            { label: `Unread (${unreadCount})`, value: 'unread' },
          ]}
          value={filter}
          onChange={(v) => onChangeFilter(v as 'all' | 'unread')}
        />
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={onMarkAllRead}
            className="text-foot text-pink-500 font-bold spring-press cursor-pointer shrink-0"
          >
            Mark all read
          </button>
        )}
      </div>
    </div>
  );
}
