import { GlassCard, GlassAvatar } from '@/components/Glass';
import { getIcon } from '@/lib/icons';
import type { Profile } from '@/types/database';

interface CommunityMembersRowProps {
  profiles: Profile[];
  onOpenProfile: (id: string) => void;
  className?: string;
}

export function CommunityMembersRow({
  profiles,
  onOpenProfile,
  className = '',
}: CommunityMembersRowProps) {
  const Users = getIcon('Users');

  return (
    <div className={`px-5 mt-6 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <Users size={16} className="text-pink-500" strokeWidth={2.4} />
        <h2 className="text-title3 text-primary font-bold">Active in your area</h2>
      </div>

      <div className="flex gap-2.5 overflow-x-auto no-scrollbar py-1">
        {profiles.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onOpenProfile(p.id)}
            className="flex flex-col items-center gap-1.5 shrink-0 spring-press cursor-pointer group"
          >
            <GlassCard
              variant="thin"
              className="w-16 h-20 rounded-2xl p-2 flex flex-col items-center justify-center gap-1 text-center"
            >
              <GlassAvatar
                src={p.avatar_url}
                name={`${p.first_name} ${p.last_name}`}
                size={34}
                ring={false}
              />
              <span className="text-[10px] text-primary font-semibold truncate w-full group-hover:text-pink-500">
                {p.first_name}
              </span>
            </GlassCard>
          </button>
        ))}
      </div>
    </div>
  );
}
