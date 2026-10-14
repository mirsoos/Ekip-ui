import { useState, useEffect } from 'react';
import { GlassCard, GlassEmpty } from '@/components/Glass';
import { getIcon } from '@/lib/icons';
import type { Mission } from '@/types/database';

interface ProfileMissionsListProps {
  missions: Mission[];
  className?: string;
}

export function ProfileMissionsList({ missions, className = '' }: ProfileMissionsListProps) {
  if (missions.length === 0) {
    return (
      <GlassEmpty
        icon="Target"
        title="No missions"
        subtitle="New missions will be available each week."
        className={className}
      />
    );
  }

  return (
    <div className={`space-y-2.5 ${className}`}>
      {missions.map((m, idx) => (
        <MissionCard key={m.id} mission={m} index={idx} />
      ))}
    </div>
  );
}

function MissionCard({ mission, index }: { mission: Mission; index: number }) {
  const [fillPct, setFillPct] = useState(0);
  const [displayCount, setDisplayCount] = useState(0);
  const CheckCircle2 = getIcon('CheckCircle2');

  const targetPct = Math.min(100, Math.max(0, (mission.progress / mission.target) * 100));

  useEffect(() => {
    // Reset to 0 initially
    setFillPct(0);
    setDisplayCount(0);

    // Staggered fill trigger so missions cascade sequentially
    const startDelay = 80 + index * 120;
    let frameId: number | null = null;

    const timer = setTimeout(() => {
      setFillPct(targetPct);

      // Smooth count-up animation for progress numbers
      const duration = 1100; // ms
      const startTime = performance.now();
      const targetVal = mission.progress;

      const animateCounter = (now: number) => {
        const elapsed = now - startTime;
        const progressRatio = Math.min(1, elapsed / duration);
        // smooth ease-out cubic curve
        const easeOut = 1 - Math.pow(1 - progressRatio, 3);
        const currentCount = Math.round(easeOut * targetVal);
        setDisplayCount(currentCount);

        if (progressRatio < 1) {
          frameId = requestAnimationFrame(animateCounter);
        } else {
          setDisplayCount(targetVal);
        }
      };

      frameId = requestAnimationFrame(animateCounter);
    }, startDelay);

    return () => {
      clearTimeout(timer);
      if (frameId !== null) cancelAnimationFrame(frameId);
    };
  }, [targetPct, mission.progress, index]);

  return (
    <GlassCard variant="thin" className="rounded-2xl p-3.5 space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sub text-primary font-bold">{mission.title}</h4>
        <span className="text-[11px] text-pink-500 font-bold">+{mission.xp_reward} XP</span>
      </div>
      <p className="text-foot text-secondary leading-snug">{mission.description}</p>
      <div className="pt-1">
        <div className="flex justify-between text-[11px] text-tertiary mb-1.5">
          <span>Progress</span>
          <span className="font-bold text-primary">
            {displayCount} / {mission.target}
          </span>
        </div>

        {/* Liquid Progress Bar with smooth 0 -> target fill */}
        <div className="glass-thin rounded-full h-2.5 overflow-hidden relative">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] relative overflow-hidden"
            style={{
              width: `${fillPct}%`,
              background: mission.completed
                ? 'linear-gradient(90deg, rgb(34 197 94), rgb(16 185 129))'
                : 'linear-gradient(90deg, rgb(244 114 182), rgb(59 130 246))',
              boxShadow: mission.completed
                ? '0 0 12px rgb(34 197 94 / 0.5)'
                : '0 0 12px rgb(244 114 182 / 0.5)',
            }}
          >
            {/* Shimmer liquid highlight effect */}
            <div className="absolute inset-0 animate-shimmer opacity-40 pointer-events-none" />
          </div>
        </div>
      </div>

      {mission.completed && (
        <div className="flex items-center gap-1.5 text-green-500 text-[11px] font-bold pt-1 animate-pop">
          <CheckCircle2 size={13} strokeWidth={2.4} />
          <span>Completed</span>
        </div>
      )}
    </GlassCard>
  );
}
