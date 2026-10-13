import { GlassInput, GlassAvatar } from '@/components/Glass';
import { NotificationButton } from '@/components/NotificationButton';
import { getIcon } from '@/lib/icons';
import type { Profile } from '@/types/database';

interface DiscoverHeaderProps {
  user: Profile;
  unreadCount: number;
  search: string;
  onChangeSearch: (val: string) => void;
  hasActiveFilters: boolean;
  onOpenFilters: () => void;
  onOpenNotifications: () => void;
  onOpenOwnProfile: () => void;
}

export function DiscoverHeader({
  user,
  unreadCount,
  search,
  onChangeSearch,
  hasActiveFilters,
  onOpenFilters,
  onOpenNotifications,
  onOpenOwnProfile,
}: DiscoverHeaderProps) {
  const SlidersHorizontal = getIcon('SlidersHorizontal');

  return (
    <div className="sticky top-0 z-20 glass glass-specular px-5 pt-3 pb-3">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-foot text-tertiary font-semibold">{user.city}</p>
          <h1 className="text-title1 text-primary font-bold tracking-tight leading-tight">
            Discover
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <NotificationButton unreadCount={unreadCount} onClick={onOpenNotifications} />
          <button
            type="button"
            onClick={onOpenOwnProfile}
            className="spring-press cursor-pointer"
            aria-label="View profile"
          >
            <GlassAvatar
              src={user.avatar_url}
              name={`${user.first_name} ${user.last_name}`}
              size={40}
              online
            />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <GlassInput
          icon="Search"
          placeholder="Search Ekips, tags, cities..."
          value={search}
          onChange={onChangeSearch}
          className="flex-1"
        />
        <button
          type="button"
          onClick={onOpenFilters}
          aria-label="Open filters"
          title="Filters"
          className={`w-12 h-12 shrink-0 rounded-2xl glass-thick glass-specular glass-edge flex items-center justify-center spring-press cursor-pointer shadow-sm ${
            hasActiveFilters
              ? 'text-pink-500 ring-2 ring-pink-500/60'
              : 'text-primary'
          }`}
        >
          <SlidersHorizontal size={19} strokeWidth={2.2} />
        </button>
      </div>
    </div>
  );
}
