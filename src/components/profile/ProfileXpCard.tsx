import { GlassCard, GlassProgress } from '@/components/Glass';
import { getIcon } from '@/lib/icons';
import type { Profile } from '@/types/database';

interface ProfileXpCardProps {
  profile: Profile;
  className?: string;
}

export function ProfileXpCard({ profile, className = '' }: ProfileXpCardProps) {
  const Shield = getIcon('Shield');

  return (
    <GlassCard className={`rounded-3xl p-4 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-bold text-body shadow-sm"
            style={{ background: 'linear-gradient(135deg, rgb(244 114 182), rgb(59 130 246))' }}
          >
            {profile.level}
          </div>
          <div>
            <p className="text-sub text-primary font-bold">Level {profile.level}</p>
            <p className="text-foot text-tertiary">
              {profile.xp} / {profile.xp_to_next} XP
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sub text-primary font-bold">{profile.honor_score}</p>
          <p className="text-foot text-tertiary">{profile.reputation_level}</p>
        </div>
      </div>

      <GlassProgress value={profile.xp} max={profile.xp_to_next} />

      <div className="flex items-center gap-1.5 mt-2.5">
        <Shield size={14} className="text-green-500" strokeWidth={2.4} />
        <span className="text-foot text-tertiary">Honor score</span>
        <span className="text-foot text-primary font-bold ml-auto">{profile.honor_score}/100</span>
      </div>
    </GlassCard>
  );
}
