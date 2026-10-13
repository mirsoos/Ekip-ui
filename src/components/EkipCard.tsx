import { type Group } from '@/types/database';
import { GlassCard, GlassAvatar, GlassBadgeIcon } from '@/components/Glass';
import { getIcon, type IconName } from '@/lib/icons';
import { useAppData } from '@/lib/appData';

const categoryIcons: Record<string, IconName> = {
  entertainment: 'PartyPopper',
  work: 'Briefcase',
};

const typeLabels: Record<string, string> = {
  solo: 'Solo',
  couple: 'Couple',
  group: 'Group',
};

export function EkipCard({ group, onClick, variant = 'default' }: { group: Group; onClick?: () => void; variant?: 'default' | 'compact' | 'featured' }) {
  const { requests } = useAppData();
  const myRequest = requests.find((r) => r.group_id === group.id && r.user_id === 'me');
  const isOwner = group.owner_id === 'me';

  const eventDate = new Date(group.event_date);
  const dateStr = eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const timeStr = eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  const CatIcon = getIcon(categoryIcons[group.category] ?? 'PartyPopper');

  if (variant === 'compact') {
    return (
      <GlassCard variant="thin" onClick={onClick} className="rounded-3xl overflow-hidden">
        <div className="flex gap-3 p-3">
          <div
            className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${group.cover_url})` }}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <CatIcon size={12} className="text-pink-500" strokeWidth={2.4} />
              <span className="text-caption text-tertiary uppercase">{typeLabels[group.group_type]}</span>
            </div>
            <h3 className="text-sub text-primary font-semibold truncate">{group.title}</h3>
            <div className="flex items-center gap-2 mt-1 text-foot text-tertiary">
              <span>{dateStr}</span>
              <span>·</span>
              <span>{group.member_count}/{group.max_members ?? '∞'}</span>
            </div>
          </div>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard onClick={onClick} className={`rounded-[28px] overflow-hidden ${variant === 'featured' ? '' : ''}`}>
      {/* Cover */}
      <div className="relative h-40 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: `url(${group.cover_url})` }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 40%, rgb(0 0 0 / 0.5))' }} />
        {/* Category + type chips */}
        <div className="absolute top-3 left-3 flex gap-2">
          <div className="glass-thin glass-specular rounded-full px-2.5 py-1 flex items-center gap-1">
            <CatIcon size={12} className="text-white" strokeWidth={2.4} />
            <span className="text-caption text-white font-bold uppercase">{group.category}</span>
          </div>
          <div className="glass-thin glass-specular rounded-full px-2.5 py-1">
            <span className="text-caption text-white font-bold uppercase">{typeLabels[group.group_type]}</span>
          </div>
          {group.premium_only && (
            <div className="rounded-full px-2.5 py-1 flex items-center gap-1" style={{ background: 'linear-gradient(135deg, rgb(234 179 8), rgb(245 158 11))' }}>
              {(() => { const C = getIcon('Crown'); return <C size={12} className="text-white" strokeWidth={2.4} />; })()}
              <span className="text-caption text-white font-bold uppercase">Premium</span>
            </div>
          )}
        </div>
        {/* Status badge */}
        {(isOwner || myRequest) && (
          <div className="absolute top-3 right-3">
            {isOwner ? (
              <GlassBadgeIcon icon="Crown" label="Owner" color="amber" />
            ) : myRequest ? (
              <GlassBadgeIcon
                icon={myRequest.status === 'accepted' ? 'CheckCircle2' : 'Clock'}
                label={myRequest.status === 'accepted' ? 'Joined' : 'Pending'}
                color={myRequest.status === 'accepted' ? 'green' : 'blue'}
              />
            ) : null}
          </div>
        )}
        {/* Date pill */}
        <div className="absolute bottom-3 left-3 glass-thin glass-specular rounded-2xl px-3 py-1.5 flex items-center gap-1.5">
          {(() => { const C = getIcon('Calendar'); return <C size={14} className="text-white" strokeWidth={2.2} />; })()}
          <span className="text-foot text-white font-semibold">{dateStr} · {timeStr}</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="text-title3 text-primary font-bold leading-tight">{group.title}</h3>
        <p className="text-sub text-secondary mt-1.5 line-clamp-2">{group.description}</p>

        {/* Tags */}
        {group.tags && group.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {group.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="text-caption text-tertiary font-semibold px-2 py-0.5 rounded-full glass-thin glass-specular">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-current/5">
          <div className="flex items-center gap-2">
            <GlassAvatar src={group.owner?.avatar_url} name={`${group.owner?.first_name} ${group.owner?.last_name}`} size={28} ring={false} />
            <div>
              <p className="text-foot text-primary font-semibold">@{group.owner?.username}</p>
              <p className="text-[10px] text-tertiary">{group.owner?.job}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-foot text-tertiary">
            <div className="flex items-center gap-1">
              {(() => { const E = getIcon('Eye'); return <E size={14} strokeWidth={2} />; })()}
              {group.views}
            </div>
            <div className="flex items-center gap-1">
              {(() => { const U = getIcon('Users'); return <U size={14} strokeWidth={2} />; })()}
              {group.member_count}{group.max_members ? `/${group.max_members}` : ''}
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
