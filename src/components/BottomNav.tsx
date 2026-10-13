import { useState, useRef, useEffect, useCallback, type PointerEvent } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
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

  const activeIndex = Math.max(0, tabs.findIndex((tab) => tab.key === active));

  const navRef = useRef<HTMLElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Framer Motion spring-driven x position in pixels
  const x = useMotionValue(0);

  // Measure slot width accurately based on nav inner bounds
  const getSlotWidth = useCallback(() => {
    if (!navRef.current) return 70;
    const innerWidth = navRef.current.clientWidth - 12; // 6px padding on left & right
    return Math.max(20, innerWidth / 5);
  }, []);

  // Sync spring to activeIndex whenever active tab changes externally
  useEffect(() => {
    if (isDragging) return;
    const slotW = getSlotWidth();
    const targetPx = activeIndex * slotW;

    // Fluid spring alignment to active slot
    const controls = animate(x, targetPx, {
      type: 'spring',
      stiffness: 450,
      damping: 35,
      mass: 0.8,
    });

    return () => controls.stop();
  }, [activeIndex, getSlotWidth, isDragging, x]);

  // Recalibrate on resize
  useEffect(() => {
    const handleResize = () => {
      if (isDragging) return;
      const slotW = getSlotWidth();
      x.set(activeIndex * slotW);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeIndex, getSlotWidth, isDragging, x]);

  const dragInfoRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    startLensX: number;
    slotW: number;
    hasMoved: boolean;
    lastTime: number;
    lastX: number;
    velocity: number;
  } | null>(null);

  const wasDraggedRef = useRef(false);
  const hoveredIndexRef = useRef<number | null>(null);

  const triggerHaptic = (ms: number = 8) => {
    if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
      try {
        navigator.vibrate(ms);
      } catch {
        // ignore
      }
    }
  };

  const handleTabClick = (key: TabKey) => {
    if (wasDraggedRef.current) {
      wasDraggedRef.current = false;
      return;
    }
    triggerHaptic(8);
    onChange(key);
  };

  const handlePointerDown = (e: PointerEvent, tabKey: TabKey) => {
    // Only begin drag gesture when pressing on the currently active button
    if (tabKey !== active) return;
    if (!navRef.current) return;

    const slotW = getSlotWidth();
    const currentLensX = x.get();

    dragInfoRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      startLensX: currentLensX,
      slotW,
      hasMoved: false,
      lastTime: performance.now(),
      lastX: e.clientX,
      velocity: 0,
    };
    hoveredIndexRef.current = activeIndex;

    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const handlePointerMove = (e: PointerEvent) => {
    const info = dragInfoRef.current;
    if (!info || info.pointerId !== e.pointerId) return;

    const dx = e.clientX - info.startX;
    const dy = e.clientY - info.startY;

    // Small threshold before engaging drag (4px)
    if (!info.hasMoved) {
      if (Math.hypot(dx, dy) < 4) return;
      info.hasMoved = true;
      wasDraggedRef.current = true;
      setIsDragging(true);
      triggerHaptic(6);
    }

    e.preventDefault();
    e.stopPropagation();

    // Track instantaneous pointer velocity (px/ms)
    const now = performance.now();
    const dt = now - info.lastTime;
    if (dt > 8) {
      info.velocity = (e.clientX - info.lastX) / dt;
      info.lastTime = now;
      info.lastX = e.clientX;
    }

    const slotW = info.slotW;
    let newX = info.startLensX + dx;
    const minX = 0;
    const maxX = 4 * slotW;

    // Progressive Apple rubberband resistance at boundaries
    if (newX < minX) {
      newX = minX - Math.pow(minX - newX, 0.8) * 1.6;
    } else if (newX > maxX) {
      newX = maxX + Math.pow(newX - maxX, 0.8) * 1.6;
    }

    // Follow the pointer precisely with zero lag
    x.set(newX);

    // Calculate slot directly from the center of the dragged lens
    // Lens is slotW wide, so lensCenter = newX + slotW / 2
    const lensCenter = newX + slotW / 2;
    const currentSlot = Math.max(0, Math.min(4, Math.floor(lensCenter / slotW)));

    if (currentSlot !== hoveredIndexRef.current) {
      hoveredIndexRef.current = currentSlot;
      setHoveredIndex(currentSlot);
      triggerHaptic(5);
    }
  };

  const handlePointerUp = (e: PointerEvent) => {
    const info = dragInfoRef.current;
    if (!info || info.pointerId !== e.pointerId) return;

    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    const hasMoved = info.hasMoved;
    const slotW = info.slotW;
    const velocity = info.velocity; // px/ms

    dragInfoRef.current = null;
    setIsDragging(false);
    setHoveredIndex(null);
    hoveredIndexRef.current = null;

    if (hasMoved) {
      // Determine target slot from lens center + flick velocity
      const currentX = x.get();
      const lensCenter = currentX + slotW / 2;
      let targetSlot = Math.max(0, Math.min(4, Math.floor(lensCenter / slotW)));

      // If user flicked with noticeable velocity, advance slot in flick direction
      if (Math.abs(velocity) > 0.35) {
        if (velocity > 0 && targetSlot < 4) {
          targetSlot = Math.min(4, targetSlot + 1);
        } else if (velocity < 0 && targetSlot > 0) {
          targetSlot = Math.max(0, targetSlot - 1);
        }
      }

      const targetX = targetSlot * slotW;
      const targetTab = tabs[targetSlot].key;

      // Authentic Framer Motion spring physics animation into the target slot
      animate(x, targetX, {
        type: 'spring',
        stiffness: 420,
        damping: 32,
        mass: 0.8,
        velocity: velocity * 1000, // convert px/ms to px/s for Framer Motion
      });

      if (targetTab !== active) {
        triggerHaptic(12);
        onChange(targetTab);
      }
    }

    setTimeout(() => {
      wasDraggedRef.current = false;
    }, 150);
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 z-40 px-3 pb-4 pt-1 pointer-events-none select-none">
      <nav
        ref={navRef}
        className="pointer-events-auto relative glass-dock rounded-[32px] px-1.5 py-1.5 grid grid-cols-5 items-center select-none touch-none"
      >
        {/* iOS Liquid Glass sliding lens with Framer Motion spring follower */}
        <motion.div
          aria-hidden="true"
          className="absolute inset-y-1.5 left-1.5 rounded-[22px] glass-lens pointer-events-none"
          style={{
            x,
            width: 'calc((100% - 0.75rem) / 5)',
          }}
          animate={{
            scale: isDragging ? 1.05 : 1,
            boxShadow: isDragging
              ? '0 12px 30px -4px rgba(0, 0, 0, 0.25), 0 4px 14px rgba(244, 114, 182, 0.28), 0 2px 8px rgba(59, 130, 246, 0.20)'
              : '0 2px 8px rgba(0, 0, 0, 0.06)',
          }}
          transition={{
            scale: { type: 'spring', stiffness: 500, damping: 30 },
            boxShadow: { duration: 0.2 },
          }}
        />

        {tabs.map((tab, idx) => {
          const isActive = tab.key === active;
          const isSlotActive = isDragging ? hoveredIndex === idx : isActive;
          const Icon = getIcon(tab.icon);
          const badge = badges[tab.key];
          const isCreate = tab.key === 'create';

          if (isCreate) {
            return (
              <div key={tab.key} className="flex justify-center items-center relative z-20">
                <button
                  onClick={() => handleTabClick(tab.key)}
                  onPointerDown={(e) => handlePointerDown(e, tab.key)}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                  aria-label={isActive ? 'Close create and return to discover' : 'Create new Ekip'}
                  className={`-mt-5 w-[50px] h-[50px] rounded-full liquid-orb flex items-center justify-center spring-press group transition-transform duration-200 ${
                    isSlotActive
                      ? 'ring-2 ring-white/90 ring-offset-2 ring-offset-[rgb(var(--bg-canvas))] cursor-grab active:cursor-grabbing scale-105'
                      : 'cursor-pointer'
                  }`}
                >
                  <Icon
                    size={24}
                    className={`text-white transition-transform duration-300 ease-out ${
                      isSlotActive ? 'rotate-45 scale-110' : 'rotate-0 group-hover:scale-110'
                    }`}
                    strokeWidth={2.6}
                  />
                  {!isSlotActive && (
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
              onPointerDown={(e) => handlePointerDown(e, tab.key)}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className={`relative z-10 flex w-full flex-col items-center justify-center py-1.5 px-1 rounded-[22px] select-none transition-transform duration-200 ${
                isActive ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'
              } ${isSlotActive ? 'scale-105' : 'spring-press group'}`}
            >
              <div className="relative flex items-center justify-center h-7 w-7">
                {/* Profile tab uses user avatar if available, otherwise User icon */}
                {tab.key === 'profile' && me?.avatar_url ? (
                  <div
                    className={`relative w-6 h-6 rounded-full overflow-hidden transition-transform duration-300 ${
                      isSlotActive
                        ? 'scale-110 ring-2 ring-white/80 dark:ring-white/60 shadow-sm'
                        : 'opacity-75 group-hover:opacity-100'
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
                    strokeWidth={isSlotActive ? 2.5 : 1.9}
                    className={`relative z-10 transition-all duration-300 ${
                      isSlotActive
                        ? 'text-primary scale-110'
                        : 'text-tertiary group-hover:text-secondary group-hover:scale-105'
                    }`}
                  />
                )}

                {/* Unread badge */}
                {Boolean(badge && badge > 0) && (
                  <span
                    className="absolute -top-1 -right-2.5 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-black text-white flex items-center justify-center telegram-badge animate-pop shadow-md"
                  >
                    {badge! > 9 ? '9+' : badge}
                  </span>
                )}
              </div>

              {/* Micro-label */}
              <div className="flex flex-col items-center mt-0.5">
                <span
                  className={`text-[10px] tracking-tight transition-all duration-300 font-semibold ${
                    isSlotActive
                      ? 'text-primary font-bold'
                      : 'text-tertiary group-hover:text-secondary'
                  }`}
                >
                  {tab.label}
                </span>
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
