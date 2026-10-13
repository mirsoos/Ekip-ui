import { getIcon } from '@/lib/icons';

interface NotificationButtonProps {
  unreadCount: number;
  onClick: () => void;
}

/** A shared header action so notification placement and its badge stay consistent. */
export function NotificationButton({ unreadCount, onClick }: NotificationButtonProps) {
  const Bell = getIcon('Bell');
  return (
    <div className="relative shrink-0">
      <button
        onClick={() => {
          if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
            try {
              navigator.vibrate(8);
            } catch {
              // ignore vibration error
            }
          }
          onClick();
        }}
        className="w-10 h-10 rounded-full glass-thick glass-specular glass-edge flex items-center justify-center spring-press cursor-pointer shadow-sm"
        aria-label="Open notifications"
      >
        <Bell size={18} className="text-primary" strokeWidth={2.4} />
      </button>
      {unreadCount > 0 && (
        <span
          className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-black text-white flex items-center justify-center telegram-badge animate-pop shadow-md pointer-events-none ring-2 ring-[rgb(var(--glass-tint))]"
        >
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </div>
  );
}
