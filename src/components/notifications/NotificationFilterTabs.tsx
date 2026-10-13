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
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onChangeFilter('all')}
            className={`px-4 py-2 rounded-full text-foot font-semibold spring-press cursor-pointer ${
              filter === 'all' ? 'text-white shadow-sm' : 'glass-thin glass-specular text-secondary hover:text-primary'
            }`}
            style={
              filter === 'all'
                ? { background: 'linear-gradient(135deg, rgb(244 114 182), rgb(59 130 246))' }
                : undefined
            }
          >
            All
          </button>
          <button
            type="button"
            onClick={() => onChangeFilter('unread')}
            className={`px-4 py-2 rounded-full text-foot font-semibold spring-press cursor-pointer ${
              filter === 'unread' ? 'text-white shadow-sm' : 'glass-thin glass-specular text-secondary hover:text-primary'
            }`}
            style={
              filter === 'unread'
                ? { background: 'linear-gradient(135deg, rgb(244 114 182), rgb(59 130 246))' }
                : undefined
            }
          >
            Unread ({unreadCount})
          </button>
        </div>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={onMarkAllRead}
            className="text-foot text-pink-500 font-bold spring-press cursor-pointer"
          >
            Mark all read
          </button>
        )}
      </div>
    </div>
  );
}
