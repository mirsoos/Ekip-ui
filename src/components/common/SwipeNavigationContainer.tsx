import { useRef, useState, type ReactNode, type TouchEvent } from 'react';
import { getIcon } from '@/lib/icons';

interface SwipeNavigationContainerProps {
  children: ReactNode;
  canGoBack: boolean;
  onGoBack: () => void;
  canSwipeLeftTab?: boolean;
  canSwipeRightTab?: boolean;
  onSwipeNextTab?: () => void;
  onSwipePrevTab?: () => void;
  className?: string;
}

export function SwipeNavigationContainer({
  children,
  canGoBack,
  onGoBack,
  canSwipeLeftTab = false,
  canSwipeRightTab = false,
  onSwipeNextTab,
  onSwipePrevTab,
  className = '',
}: SwipeNavigationContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);

  // Gesture state refs (to avoid stale closures during event callbacks)
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const gestureStateRef = useRef<'idle' | 'vertical' | 'horizontal'>('idle');
  const offsetRef = useRef(0);

  const ChevronLeft = getIcon('ChevronLeft');

  const triggerHaptic = (ms: number = 8) => {
    if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
      try {
        navigator.vibrate(ms);
      } catch {
        // ignore
      }
    }
  };

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    if (e.touches.length !== 1) return;

    // Do not initiate swipe navigation if touching form inputs, textareas, or explicit no-swipe horizontal carousels
    const target = e.target as HTMLElement | null;
    if (target?.closest('input, textarea, [data-no-swipe], .no-scrollbar-horizontal')) {
      return;
    }

    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
    gestureStateRef.current = 'idle';
    offsetRef.current = 0;
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!touchStartRef.current || e.touches.length !== 1) return;

    // If already locked to vertical scrolling, immediately exit so native scrolling runs uninterrupted
    if (gestureStateRef.current === 'vertical') {
      return;
    }

    const touch = e.touches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    // Initial movement threshold (8px) to accurately disambiguate direction
    if (gestureStateRef.current === 'idle') {
      if (Math.hypot(absDx, absDy) < 8) {
        return;
      }

      // If vertical delta is greater, permanently lock to native vertical scroll
      if (absDy >= absDx) {
        gestureStateRef.current = 'vertical';
        return;
      }

      // If horizontal delta dominates by at least 1.5x, lock to horizontal navigation
      if (absDx > absDy * 1.4) {
        // Check if the gesture is allowed in the attempted direction:
        // 1. Swiping back (dx > 0) when canGoBack is true
        if (canGoBack && dx > 0) {
          gestureStateRef.current = 'horizontal';
          setIsSwiping(true);
          triggerHaptic(5);
        }
        // 2. Swiping between tabs when on main screen
        else if (!canGoBack) {
          if (dx < 0 && canSwipeLeftTab) {
            // Drag left -> next tab
            gestureStateRef.current = 'horizontal';
            setIsSwiping(true);
          } else if (dx > 0 && canSwipeRightTab) {
            // Drag right -> prev tab
            gestureStateRef.current = 'horizontal';
            setIsSwiping(true);
          } else {
            // Out of bounds swipe -> lock vertical so it doesn't stutter
            gestureStateRef.current = 'vertical';
            return;
          }
        } else {
          gestureStateRef.current = 'vertical';
          return;
        }
      } else {
        gestureStateRef.current = 'vertical';
        return;
      }
    }

    // Active horizontal navigation tracking
    if (gestureStateRef.current === 'horizontal') {
      let finalOffset = dx;

      // Apply resistance if swiping back
      if (canGoBack) {
        if (dx < 0) {
          finalOffset = 0; // prevent dragging left when navigating back
        } else {
          // Smooth progressive damping as offset increases
          finalOffset = Math.min(dx, 280);
        }
      } else {
        // Tab switching resistance
        if ((dx < 0 && !canSwipeLeftTab) || (dx > 0 && !canSwipeRightTab)) {
          finalOffset = dx * 0.2; // heavy rubberband
        } else {
          finalOffset = Math.max(-140, Math.min(140, dx * 0.75));
        }
      }

      offsetRef.current = finalOffset;
      setDragOffset(finalOffset);
    }
  };

  const handleTouchEnd = () => {
    if (!touchStartRef.current) return;

    if (gestureStateRef.current === 'horizontal') {
      const start = touchStartRef.current;
      const elapsed = Math.max(1, Date.now() - start.time);
      const offset = offsetRef.current;
      const velocity = offset / elapsed; // px per ms

      if (canGoBack) {
        // Threshold: dragged right more than 75px or flicked with velocity > 0.35 px/ms
        if (offset > 75 || (velocity > 0.35 && offset > 25)) {
          triggerHaptic(12);
          onGoBack();
        }
      } else {
        // Tab swipe thresholds
        if (offset < -60 || (velocity < -0.35 && offset < -20)) {
          if (canSwipeLeftTab && onSwipeNextTab) {
            triggerHaptic(8);
            onSwipeNextTab();
          }
        } else if (offset > 60 || (velocity > 0.35 && offset > 20)) {
          if (canSwipeRightTab && onSwipePrevTab) {
            triggerHaptic(8);
            onSwipePrevTab();
          }
        }
      }
    }

    // Reset gesture state with spring release
    setIsSwiping(false);
    setDragOffset(0);
    offsetRef.current = 0;
    touchStartRef.current = null;
    gestureStateRef.current = 'idle';
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      className={`relative w-full h-full overflow-hidden select-none ${className}`}
    >
      {/* Interactive moving viewport */}
      <div
        className="w-full h-full"
        style={{
          transform: dragOffset !== 0 ? `translate3d(${dragOffset}px, 0, 0)` : undefined,
          transition: isSwiping ? 'none' : 'transform 0.28s cubic-bezier(0.25, 1, 0.5, 1)',
        }}
      >
        {children}
      </div>

      {/* Edge Swipe-to-Back Floating Cue (iOS style) */}
      {canGoBack && dragOffset > 10 && (
        <div
          aria-hidden="true"
          className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full glass-thick glass-specular glass-edge flex items-center justify-center shadow-lg pointer-events-none transition-opacity duration-200"
          style={{
            opacity: Math.min(1, dragOffset / 60),
            transform: `translateY(-50%) scale(${Math.min(1.15, 0.7 + dragOffset / 120)})`,
          }}
        >
          <ChevronLeft
            size={20}
            className={`transition-colors ${dragOffset > 75 ? 'text-pink-500' : 'text-primary'}`}
            strokeWidth={2.6}
          />
        </div>
      )}

      {/* Dimmed backdrop veil when sliding a sub-screen away */}
      {canGoBack && dragOffset > 0 && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-black pointer-events-none transition-opacity"
          style={{
            opacity: Math.max(0, (1 - dragOffset / 280) * 0.15),
            zIndex: -1,
          }}
        />
      )}
    </div>
  );
}
