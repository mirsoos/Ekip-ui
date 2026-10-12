import { getIcon, type IconName } from '@/lib/icons';
import { useAppData } from '@/lib/appData';

export type TabKey = 'discover' | 'create' | 'chat' | 'activity' | 'profile';

interface BottomNavProps {
  active: TabKey;
  onChange: (tab: TabKey) => void;
}

const tabs: { key: TabKey; label: string; icon: IconName }[] = [
  { key: 'discover', label: 'Discover', icon: 'Compass' },
  { key: 'activity', label: 'My Ekip', icon: 'Layers' },
  { key: 'create', label: 'Create', icon: 'Plus' },
  { key: 'chat', label: 'Chats', icon: 'MessageCircle' },
  { key: 'profile', label: 'Profile', icon: 'User' },
];

export function BottomNav({ active, onChange }: BottomNavProps) {
  const { conversations, notifications } = useAppData();
  const unreadChats = conversations.reduce((s, c) => s + c.unread_count, 0);
  const unreadNotifs = notifications.filter((n) => !n.is_read).length;

  const badges: Partial<Record<TabKey, number>> = {
    chat: unreadChats,
    activity: unreadNotifs,
  };
  const activeIndex = tabs.findIndex((tab) => tab.key === active);

  return (
    <div className="absolute bottom-0 left-0 right-0 z-40 px-3 pb-5 pt-2">
      <nav className="relative glass glass-specular glass-edge rounded-[28px] px-2 py-2 grid grid-cols-5 items-center">
        {active !== 'create' && (
          <div
            aria-hidden="true"
            className="absolute inset-y-2 left-2 w-[calc((100%-1rem)/5)] rounded-2xl glass glass-specular pointer-events-none transition-transform duration-500 ease-out"
            style={{ transform: `translateX(${activeIndex * 100}%)` }}
          />
        )}
        {tabs.map((tab) => {
          const isActive = tab.key === active;
          const Icon = getIcon(tab.icon);
          const badge = badges[tab.key];
          const isCreate = tab.key === 'create';

          if (isCreate) {
            return (
              <button
                key={tab.key}
                onClick={() => onChange(tab.key)}
                className={`relative z-10 -mt-2 w-14 h-14 justify-self-center rounded-full glass-button flex items-center justify-center shadow-xl ${isActive ? 'ring-2 ring-white/90 ring-offset-2 ring-offset-[rgb(var(--bg-canvas))]' : ''}`}
                style={{ background: 'linear-gradient(135deg, rgb(244 114 182), rgb(59 130 246))' }}
              >
                <Icon size={26} className="text-white" strokeWidth={2.4} />
                <div className="absolute inset-0 rounded-full animate-pulse-ring" />
              </button>
            );
          }

          return (
            <button
              key={tab.key}
              onClick={() => onChange(tab.key)}
              className="relative z-10 flex w-full flex-col items-center gap-1 px-3 py-1.5 rounded-2xl haptic"
            >
              <div className={`relative transition-all duration-300 ${isActive ? 'scale-110' : 'scale-100'}`}>
                <Icon
                  size={24}
                  strokeWidth={isActive ? 2.6 : 2}
                  className={isActive ? 'text-primary' : 'text-tertiary'}
                />
                {badge ? (
                  <span
                    className="absolute -top-1.5 -right-2 min-w-[16px] h-[16px] px-1 rounded-full text-[10px] font-bold text-white flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, rgb(239 68 68), rgb(220 38 38))' }}
                  >
                    {badge > 9 ? '9+' : badge}
                  </span>
                ) : null}
              </div>
              <span className={`text-[10px] font-semibold transition-colors ${isActive ? 'text-primary' : 'text-tertiary'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
