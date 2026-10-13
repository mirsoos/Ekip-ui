import { GlassCard } from '@/components/Glass';
import { getIcon } from '@/lib/icons';
import type { Group } from '@/types/database';

interface EkipEventInfoCardProps {
  group: Group;
  className?: string;
}

export function EkipEventInfoCard({ group, className = '' }: EkipEventInfoCardProps) {
  const eventDate = new Date(group.event_date);
  const dateStr = eventDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const timeStr = eventDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  const MapPin = getIcon('MapPin');
  const Clock = getIcon('Clock');
  const DollarSign = getIcon('DollarSign');

  return (
    <GlassCard className={`rounded-3xl p-4 space-y-3 ${className}`}>
      <div className="flex items-center gap-3.5">
        <div
          className="w-13 h-13 rounded-2xl flex flex-col items-center justify-center shrink-0 p-1"
          style={{
            background: 'linear-gradient(135deg, rgb(244 114 182 / 0.25), rgb(59 130 246 / 0.25))',
          }}
        >
          <span className="text-[10px] text-pink-500 font-bold uppercase tracking-wider">
            {eventDate.toLocaleDateString('en-US', { month: 'short' })}
          </span>
          <span className="text-title3 text-primary font-bold leading-none">
            {eventDate.getDate()}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-body text-primary font-bold">{dateStr}</p>
          <div className="flex items-center gap-1.5 text-foot text-tertiary mt-0.5">
            <Clock size={13} strokeWidth={2.2} />
            <span>{timeStr}</span>
            {group.is_repeating && <span className="text-pink-500 font-medium">· Repeating</span>}
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-current/5 flex flex-wrap items-center justify-between gap-2 text-foot">
        <div className="flex items-center gap-1.5 text-secondary">
          <MapPin size={14} className="text-tertiary shrink-0" strokeWidth={2.2} />
          <span className="truncate">{group.location_name ? `${group.location_name}, ` : ''}{group.city}</span>
        </div>

        {group.avg_cost !== null && group.avg_cost > 0 && (
          <div className="flex items-center gap-1 text-secondary font-medium">
            <DollarSign size={13} className="text-green-500" strokeWidth={2.4} />
            <span>~${group.avg_cost} / person</span>
          </div>
        )}
      </div>
    </GlassCard>
  );
}
