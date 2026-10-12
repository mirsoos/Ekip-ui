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
      <button onClick={onClick} className="w-10 h-10 rounded-full glass glass-specular glass-edge flex items-center justify-center haptic" aria-label="Open notifications">
        <Bell size={18} className="text-primary" strokeWidth={2.2} />
      </button>
      {unreadCount > 0 && (
        <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full text-[10px] font-bold text-white flex items-center justify-center border-2 border-[rgb(var(--bg-canvas))] shadow-lg pointer-events-none" style={{ background: 'linear-gradient(135deg, rgb(239 68 68), rgb(220 38 38))' }}>
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </div>
  );
}
