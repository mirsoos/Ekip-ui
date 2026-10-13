import { GlassCard, GlassEmpty } from '@/components/Glass';
import { getIcon, type IconName } from '@/lib/icons';
import type { Badge } from '@/types/database';

interface ProfileBadgesListProps {
  badges: Badge[];
  className?: string;
}

export function ProfileBadgesList({ badges, className = '' }: ProfileBadgesListProps) {
  if (badges.length === 0) {
    return (
      <GlassEmpty
        icon="Award"
        title="No badges yet"
        subtitle="Complete missions and participate in Ekips to earn badges."
        className={className}
      />
    );
  }

  return (
    <div className={`grid grid-cols-2 gap-2.5 ${className}`}>
      {badges.map((b) => {
        const Icon = getIcon((b.icon as IconName) ?? 'Award');
        return (
          <GlassCard key={b.id} variant="thin" className="rounded-2xl p-3 flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'linear-gradient(135deg, rgb(244 114 182 / 0.3), rgb(59 130 246 / 0.3))' }}
            >
              <Icon size={20} className="text-pink-500" strokeWidth={2.2} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sub text-primary font-bold truncate">{b.title}</p>
              <p className="text-[11px] text-tertiary truncate">{b.description}</p>
            </div>
          </GlassCard>
        );
      })}
    </div>
  );
}
