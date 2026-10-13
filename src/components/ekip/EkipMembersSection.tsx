import { GlassCard, GlassAvatar } from '@/components/Glass';
import { getIcon } from '@/lib/icons';
import type { GroupMember } from '@/types/database';

interface EkipMembersSectionProps {
  members: GroupMember[];
  memberCount: number;
  maxMembers: number | null;
  onOpenProfile: (userId: string) => void;
  className?: string;
}

export function EkipMembersSection({
  members,
  memberCount,
  maxMembers,
  onOpenProfile,
  className = '',
}: EkipMembersSectionProps) {
  const Users = getIcon('Users');
  const activeMembers = members.filter((m) => m.status === 'active');

  return (
    <GlassCard className={`rounded-3xl p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Users size={16} className="text-pink-500" strokeWidth={2.4} />
          <h3 className="text-sub text-primary font-bold">Members</h3>
        </div>
        <span className="text-foot text-tertiary font-semibold">
          {memberCount} {maxMembers ? `/ ${maxMembers}` : ''} spots
        </span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {activeMembers.map((m) => {
          const profile = m.profile;
          if (!profile) return null;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onOpenProfile(profile.id)}
              className="flex flex-col items-center gap-1 shrink-0 spring-press cursor-pointer group"
            >
              <GlassAvatar
                src={profile.avatar_url}
                name={`${profile.first_name} ${profile.last_name}`}
                size={40}
                ring={m.role === 'admin'}
              />
              <span className="text-[10px] text-secondary font-medium truncate max-w-[48px] group-hover:text-primary">
                {profile.first_name}
              </span>
            </button>
          );
        })}
      </div>
    </GlassCard>
  );
}
