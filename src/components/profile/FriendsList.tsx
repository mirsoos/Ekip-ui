import { GlassCard, GlassAvatar, GlassEmpty } from '@/components/Glass';
import { getIcon } from '@/lib/icons';
import type { Friendship } from '@/types/database';

interface FriendsListProps {
  friends: Friendship[];
  onOpenProfile: (id: string) => void;
  className?: string;
}

export function FriendsList({ friends, onOpenProfile, className = '' }: FriendsListProps) {
  const ChevronRight = getIcon('ChevronRight');

  if (friends.length === 0) {
    return (
      <GlassEmpty
        icon="Users"
        title="No friends yet"
        subtitle="Connect with people across Ekip activities."
        className={className}
      />
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {friends.map((f) => {
        const p = f.profile;
        if (!p) return null;
        return (
          <button
            key={f.id}
            type="button"
            onClick={() => onOpenProfile(p.id)}
            className="w-full text-left spring-press cursor-pointer"
          >
            <GlassCard variant="thin" className="rounded-2xl p-3 flex items-center gap-3">
              <GlassAvatar
                src={p.avatar_url}
                name={`${p.first_name} ${p.last_name}`}
                size={42}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sub text-primary font-bold truncate">
                  {p.first_name} {p.last_name}
                </p>
                <p className="text-foot text-tertiary truncate">@{p.username} {p.job ? `· ${p.job}` : ''}</p>
              </div>
              <ChevronRight size={18} className="text-tertiary shrink-0" />
            </GlassCard>
          </button>
        );
      })}
    </div>
  );
}
