import { GlassAvatar, GlassBadgeIcon, GlassButton } from '@/components/Glass';
import { InfoPill } from '@/components/common/InfoPill';
import { getIcon } from '@/lib/icons';
import type { Profile } from '@/types/database';

interface ProfileHeaderCardProps {
  profile: Profile;
  isOwnProfile: boolean;
  isFriend: boolean;
  onAddFriend?: () => void;
  onOpenActions?: () => void;
  className?: string;
}

export function ProfileHeaderCard({
  profile,
  isOwnProfile,
  isFriend,
  onAddFriend,
  onOpenActions,
  className = '',
}: ProfileHeaderCardProps) {
  const MoreHorizontal = getIcon('MoreHorizontal');
  const Smile = getIcon('Smile');

  return (
    <div className={`px-5 -mt-12 relative z-10 ${className}`}>
      <div className="flex items-end justify-between">
        <GlassAvatar
          src={profile.avatar_url}
          name={`${profile.first_name} ${profile.last_name}`}
          size={96}
        />
        {!isOwnProfile && (
          <div className="flex gap-2 mb-2">
            {onOpenActions && (
              <button
                type="button"
                onClick={onOpenActions}
                aria-label="Actions"
                className="w-10 h-10 rounded-full glass-thick glass-specular glass-edge flex items-center justify-center spring-press cursor-pointer shadow-sm text-primary"
              >
                <MoreHorizontal size={20} strokeWidth={2.2} />
              </button>
            )}
            {onAddFriend && (
              <GlassButton size="sm" icon="UserPlus" onClick={onAddFriend}>
                {isFriend ? 'Friends' : 'Add Friend'}
              </GlassButton>
            )}
          </div>
        )}
      </div>

      <div className="mt-3">
        <div className="flex items-center gap-2">
          <h1 className="text-title1 text-primary font-bold">
            {profile.first_name} {profile.last_name}
          </h1>
          {profile.is_verified && <GlassBadgeIcon icon="Verified" label="" color="blue" />}
          {profile.is_premium && <GlassBadgeIcon icon="Crown" label="Premium" color="amber" />}
        </div>
        <p className="text-sub text-secondary">@{profile.username}</p>
        {profile.bio && <p className="text-body text-secondary mt-2 leading-relaxed">{profile.bio}</p>}

        {/* Quick info pills */}
        <div className="flex flex-wrap gap-2 mt-3">
          {profile.age && <InfoPill icon="Calendar" label={`${profile.age} yrs`} />}
          {profile.gender && <InfoPill icon="User" label={profile.gender} />}
          {profile.city && <InfoPill icon="MapPin" label={profile.city} />}
          {profile.job && <InfoPill icon="Briefcase" label={profile.job} />}
          {profile.personality_type && <InfoPill icon="Sparkles" label={profile.personality_type} />}
        </div>

        {/* Mood status */}
        {profile.mood && (
          <div className="glass-thin glass-specular rounded-2xl p-3 mt-3 flex items-center gap-2">
            <Smile size={18} className="text-pink-500" />
            <span className="text-foot text-tertiary">Feeling</span>
            <span className="text-foot text-primary font-semibold">{profile.mood}</span>
          </div>
        )}
      </div>
    </div>
  );
}
