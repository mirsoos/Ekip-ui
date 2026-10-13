import { GlassCard, GlassAvatar, GlassBadgeIcon } from '@/components/Glass';
import { getIcon } from '@/lib/icons';
import type { Profile } from '@/types/database';

interface EkipHostCardProps {
  host: Profile;
  onOpenProfile: () => void;
  className?: string;
}

export function EkipHostCard({ host, onOpenProfile, className = '' }: EkipHostCardProps) {
  const Shield = getIcon('Shield');
  const ChevronRight = getIcon('ChevronRight');

  return (
    <button
      type="button"
      onClick={onOpenProfile}
      className={`w-full text-left spring-press cursor-pointer ${className}`}
    >
      <GlassCard variant="thin" className="rounded-3xl p-3.5 flex items-center gap-3">
        <GlassAvatar
          src={host.avatar_url}
          name={`${host.first_name} ${host.last_name}`}
          size={46}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="text-sub text-primary font-bold truncate">
              {host.first_name} {host.last_name}
            </h3>
            {host.is_verified && <GlassBadgeIcon icon="Verified" label="" color="blue" />}
            {host.is_premium && <GlassBadgeIcon icon="Crown" label="" color="amber" />}
          </div>
          <p className="text-foot text-tertiary truncate">@{host.username} {host.job ? `· ${host.job}` : ''}</p>
          <div className="flex items-center gap-2 mt-1 text-[11px] text-secondary font-medium">
            <span className="flex items-center gap-0.5">
              <Shield size={12} className="text-green-500" />
              Honor {host.honor_score}
            </span>
            <span>·</span>
            <span>Level {host.level}</span>
          </div>
        </div>
        <ChevronRight size={18} className="text-tertiary shrink-0" />
      </GlassCard>
    </button>
  );
}
