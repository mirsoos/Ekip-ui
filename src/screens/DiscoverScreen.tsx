import { useEffect, useMemo, useRef, useState } from 'react';
import { useAppData } from '@/lib/appData';
import { EkipCard } from '@/components/EkipCard';
import { GlassEmpty, GlassButton } from '@/components/Glass';
import { DiscoverHeader } from '@/components/discover/DiscoverHeader';
import { AIAssistantBanner } from '@/components/discover/AIAssistantBanner';
import { CommunityMembersRow } from '@/components/discover/CommunityMembersRow';
import { DiscoverFilterSheet } from '@/components/discover/DiscoverFilterSheet';
import { cities } from '@/lib/demoData';
import type { Group } from '@/types/database';

interface DiscoverScreenProps {
  onOpenGroup: (group: Group) => void;
  onOpenProfile: (userId: string) => void;
  onOpenOwnProfile: () => void;
  onOpenAI: () => void;
  onOpenNotifications: () => void;
}

export function DiscoverScreen({
  onOpenGroup,
  onOpenProfile,
  onOpenOwnProfile,
  onOpenAI,
  onOpenNotifications,
}: DiscoverScreenProps) {
  const { groups, me, profiles, notifications } = useAppData();
  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'work' | 'entertainment'>('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [premiumOnly, setPremiumOnly] = useState(false);
  const discoverRef = useRef<HTMLDivElement>(null);
  const pageSize = 3;

  const filtered = useMemo(() => {
    let result = [...groups];
    if (categoryFilter !== 'all') result = result.filter((g) => g.category === categoryFilter);
    if (cityFilter !== 'all') result = result.filter((g) => g.city === cityFilter);
    if (premiumOnly) result = result.filter((g) => g.premium_only);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.description.toLowerCase().includes(q) ||
          g.tags?.some((t) => t.toLowerCase().includes(q)) ||
          g.city.toLowerCase().includes(q)
      );
    }
    return result;
  }, [groups, search, categoryFilter, cityFilter, premiumOnly]);

  const featured = filtered[0];
  const otherProfiles = profiles.filter((p) => p.id !== 'me').slice(0, 5);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages - 1);
  const paginatedGroups = filtered.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  useEffect(() => {
    discoverRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const hasActiveFilters = categoryFilter !== 'all' || cityFilter !== 'all' || premiumOnly;

  const handleResetFilters = () => {
    setCategoryFilter('all');
    setCityFilter('all');
    setPremiumOnly(false);
    setSearch('');
    setPage(0);
    setShowFilters(false);
  };

  return (
    <div ref={discoverRef} className="h-full overflow-y-auto no-scrollbar pb-32 screen-enter-items">
      {/* Header component */}
      <DiscoverHeader
        user={me}
        unreadCount={unreadCount}
        search={search}
        onChangeSearch={(v) => {
          setSearch(v);
          setPage(0);
        }}
        hasActiveFilters={hasActiveFilters}
        onOpenFilters={() => setShowFilters(true)}
        onOpenNotifications={onOpenNotifications}
        onOpenOwnProfile={onOpenOwnProfile}
      />

      {/* AI banner */}
      <AIAssistantBanner onClick={onOpenAI} />

      {/* Featured Ekip */}
      {featured && (
        <div className="px-5 mt-5">
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="text-title3 text-primary font-bold">Featured Ekip</h2>
            <span className="text-caption text-pink-500 font-bold">Hot</span>
          </div>
          <EkipCard group={featured} onClick={() => onOpenGroup(featured)} variant="featured" />
        </div>
      )}

      {/* Active members row */}
      <CommunityMembersRow profiles={otherProfiles} onOpenProfile={onOpenProfile} />

      {/* Main feed */}
      <div className="px-5 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-title3 text-primary font-bold">Discover Ekips</h2>
          <span className="text-caption text-tertiary font-semibold">
            {filtered.length} activities
          </span>
        </div>

        {paginatedGroups.length === 0 ? (
          <GlassEmpty
            icon="Search"
            title="No Ekips found"
            subtitle="Try adjusting your search or filters to see more results."
          />
        ) : (
          <div className="space-y-4">
            {paginatedGroups.map((group) => (
              <EkipCard key={group.id} group={group} onClick={() => onOpenGroup(group)} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-6">
            <GlassButton
              size="sm"
              variant="secondary"
              icon="ChevronLeft"
              onClick={() => setPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
            >
              Prev
            </GlassButton>
            <span className="text-foot text-tertiary font-semibold">
              {currentPage + 1} of {totalPages}
            </span>
            <GlassButton
              size="sm"
              variant="secondary"
              iconRight="ChevronRight"
              onClick={() => setPage(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage >= totalPages - 1}
            >
              Next
            </GlassButton>
          </div>
        )}
      </div>

      {/* Filter Sheet Modal */}
      <DiscoverFilterSheet
        open={showFilters}
        onClose={() => setShowFilters(false)}
        categoryFilter={categoryFilter}
        onChangeCategory={setCategoryFilter}
        cityFilter={cityFilter}
        onChangeCity={setCityFilter}
        premiumOnly={premiumOnly}
        onChangePremiumOnly={setPremiumOnly}
        cities={cities}
        onReset={handleResetFilters}
      />
    </div>
  );
}
