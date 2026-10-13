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
  const { me, conversations, notifications } = useAppData();
  const unreadChats = conversations.reduce((s, c) => s + c.unread_count, 0);
  const unreadNotifs = notifications.filter((n) => !n.is_read).length;

  const badges: Partial<Record<TabKey, number>> = {
    chat: unreadChats,
    activity: unreadNotifs,
  };
  const activeIndex = tabs.findIndex((tab) => tab.key === active);

  const handleTabClick = (key: TabKey) => {
    if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
      try {
        navigator.vibrate(8);
      } catch {
        // ignore
      }
    }
    onChange(key);
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 z-40 px-3 pb-4 pt-1 pointer-events-none">
      <nav className="pointer-events-auto relative glass-dock rounded-[32px] px-1.5 py-1.5 grid grid-cols-5 items-center select-none">
        {/* Telegram-style fluid sliding liquid lens */}
        {active !== 'create' && activeIndex !== -1 && (
          <div
            aria-hidden="true"
            className="absolute inset-y-1.5 left-1.5 w-[calc((100%-0.75rem)/5)] rounded-[22px] glass-lens pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
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
              <div key={tab.key} className="flex justify-center items-center relative z-20">
                <button
                  onClick={() => handleTabClick(tab.key)}
                  aria-label={isActive ? 'Close create and return to discover' : 'Create new Ekip'}
                  className={`-mt-5 w-[50px] h-[50px] rounded-full liquid-orb flex items-center justify-center spring-press group ${
                    isActive ? 'ring-2 ring-white/90 ring-offset-2 ring-offset-[rgb(var(--bg-canvas))]' : ''
                  }`}
                >
                  <Icon
                    size={24}
                    className={`text-white transition-transform duration-300 ease-out ${
                      isActive ? 'rotate-45 scale-110' : 'rotate-0 group-hover:scale-110'
                    }`}
                    strokeWidth={2.6}
                  />
                  {!isActive && (
                    <div className="absolute -inset-0.5 rounded-full animate-pulse-ring pointer-events-none" />
                  )}
                </button>
              </div>
            );
          }

          return (
            <button
              key={tab.key}
              onClick={() => handleTabClick(tab.key)}
              className="relative z-10 flex w-full flex-col items-center justify-center py-1.5 px-1 rounded-[22px] spring-press cursor-pointer group"
            >
              <div className="relative flex items-center justify-center h-7 w-7">
                {/* Active ambient glow aura behind icon */}
                {isActive && (
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full blur-md opacity-75 pointer-events-none"
                    style={{
                      background: 'radial-gradient(circle, rgb(244 114 182 / 0.6) 0%, rgb(59 130 246 / 0.3) 100%)',
                    }}
                  />
                )}

                {/* Profile tab uses user avatar if available, otherwise User icon */}
                {tab.key === 'profile' && me?.avatar_url ? (
                  <div
                    className={`relative w-6 h-6 rounded-full overflow-hidden transition-transform duration-300 ${
                      isActive
                        ? 'scale-110 ring-2 ring-pink-500 ring-offset-1 ring-offset-transparent'
                        : 'opacity-80 group-hover:opacity-100'
                    }`}
                  >
                    <img
                      src={me.avatar_url}
                      alt={me.first_name || 'Profile'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <Icon
                    size={22}
                    strokeWidth={isActive ? 2.5 : 1.9}
                    className={`relative z-10 transition-all duration-300 ${
                      isActive
                        ? 'text-primary scale-110'
                        : 'text-tertiary group-hover:text-secondary group-hover:scale-105'
                    }`}
                  />
                )}

                {/* Telegram-style unread counter badge */}
                {Boolean(badge && badge > 0) && (
                  <span
                    className="absolute -top-1 -right-2.5 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-black text-white flex items-center justify-center telegram-badge animate-pop shadow-md"
                  >
                    {badge! > 9 ? '9+' : badge}
                  </span>
                )}
              </div>

              {/* Telegram-style micro-label & active dot indicator */}
              <div className="flex flex-col items-center mt-0.5">
                <span
                  className={`text-[10px] tracking-tight transition-all duration-300 font-semibold ${
                    isActive
                      ? 'text-primary font-bold'
                      : 'text-tertiary group-hover:text-secondary'
                  }`}
                >
                  {tab.label}
                </span>
                <div
                  className={`w-1 h-1 rounded-full mt-0.5 transition-all duration-300 ${
                    isActive
                      ? 'scale-100 opacity-100'
                      : 'scale-0 opacity-0'
                  }`}
                  style={{
                    background: 'linear-gradient(135deg, rgb(244 114 182), rgb(59 130 246))',
                  }}
                />
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
