import { useEffect, useMemo, useRef, useState } from 'react';
import { useAppData } from '@/lib/appData';
import { EkipCard } from '@/components/EkipCard';
import { GlassCard, GlassInput, GlassEmpty, GlassAvatar, GlassButton, GlassChip, GlassSegmented, GlassToggle } from '@/components/Glass';
import { GlassSheet } from '@/components/Overlays';
import { getIcon } from '@/lib/icons';
import { NotificationButton } from '@/components/NotificationButton';
import { cities } from '@/lib/demoData';
import type { Group } from '@/types/database';

interface DiscoverScreenProps {
  onOpenGroup: (group: Group) => void;
  onOpenProfile: (userId: string) => void;
  onOpenOwnProfile: () => void;
  onOpenAI: () => void;
  onOpenNotifications: () => void;
}

export function DiscoverScreen({ onOpenGroup, onOpenProfile, onOpenOwnProfile, onOpenAI, onOpenNotifications }: DiscoverScreenProps) {
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

  return (
    <div ref={discoverRef} className="h-full overflow-y-auto no-scrollbar pb-32 screen-enter-items">
      {/* Compact sticky header with glass background */}
      <div className="sticky top-0 z-20 glass glass-specular px-5 pt-3 pb-3">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-foot text-tertiary font-semibold">{me.city}</p>
            <h1 className="text-title1 text-primary font-bold tracking-tight leading-tight">Discover</h1>
          </div>
          <div className="flex items-center gap-2">
            <NotificationButton unreadCount={unreadCount} onClick={onOpenNotifications} />
            <button onClick={onOpenOwnProfile} className="haptic">
              <GlassAvatar src={me.avatar_url} name={`${me.first_name} ${me.last_name}`} size={40} online />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <GlassInput
            icon="Search"
            placeholder="Search Ekips, tags, cities..."
            value={search}
            onChange={(value) => { setSearch(value); setPage(0); }}
            className="flex-1"
          />
          <button
            type="button"
            onClick={() => setShowFilters(true)}
            aria-label="Open filters"
            title="Filters"
            className={`w-12 h-12 shrink-0 rounded-2xl glass glass-specular glass-edge flex items-center justify-center haptic ${categoryFilter !== 'all' || cityFilter !== 'all' || premiumOnly ? 'text-pink-500 ring-1 ring-pink-500/40' : 'text-primary'}`}
          >
            {(() => { const F = getIcon('SlidersHorizontal'); return <F size={19} strokeWidth={2.2} />; })()}
          </button>
        </div>
      </div>

      {/* AI assistant banner */}
      <div className="px-5 mt-4">
        <button onClick={onOpenAI} className="w-full text-left haptic">
          <GlassCard glow className="rounded-3xl p-4 flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: 'linear-gradient(135deg, rgb(244 114 182 / 0.3), rgb(59 130 246 / 0.3))' }}
            >
              {(() => { const I = getIcon('Sparkles'); return <I size={24} className="text-pink-500" strokeWidth={2} />; })()}
            </div>
            <div className="flex-1">
              <h3 className="text-body text-primary font-bold">AI Assistant</h3>
              <p className="text-foot text-secondary">Get smart recommendations for your next Ekip</p>
            </div>
            {(() => { const C = getIcon('ChevronRight'); return <C size={20} className="text-tertiary" />; })()}
          </GlassCard>
        </button>
      </div>

      {/* Featured */}
      {featured && categoryFilter === 'all' && cityFilter === 'all' && !premiumOnly && !search && (
        <div className="px-5 mt-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-title2 text-primary font-bold">Featured</h2>
            {(() => { const F = getIcon('Flame'); return <F size={20} className="text-pink-500" />; })()}
          </div>
          <EkipCard group={featured} onClick={() => onOpenGroup(featured)} variant="featured" />
        </div>
      )}

      {/* People you might know */}
      {categoryFilter === 'all' && cityFilter === 'all' && !premiumOnly && !search && (
        <div className="mt-6">
          <div className="flex items-center justify-between px-5 mb-3">
            <h2 className="text-title2 text-primary font-bold">People near you</h2>
            <button className="text-foot text-pink-500 font-semibold">See all</button>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar px-5">
            {otherProfiles.map((p) => (
              <button key={p.id} onClick={() => onOpenProfile(p.id)} className="shrink-0 w-32 haptic">
                <GlassCard variant="thin" className="rounded-3xl p-3 flex flex-col items-center text-center">
                  <GlassAvatar src={p.avatar_url} name={`${p.first_name} ${p.last_name}`} size={56} online />
                  <p className="text-foot text-primary font-semibold mt-2 truncate w-full">{p.first_name}</p>
                  <p className="text-[10px] text-tertiary truncate w-full">{p.job}</p>
                </GlassCard>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* All groups */}
      <div className="px-5 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-title2 text-primary font-bold">
            {filtered.length} Ekip{filtered.length !== 1 ? 's' : ''}
          </h2>
          <span className="text-foot text-tertiary">{premiumOnly || categoryFilter !== 'all' || cityFilter !== 'all' ? 'Filtered' : 'All results'}</span>
        </div>

        {filtered.length === 0 ? (
          <GlassEmpty
            icon="Compass"
            title="No Ekips found"
            subtitle="Try a different filter or search term. New groups are added every day."
          />
        ) : (
          <div className="flex flex-col gap-4">
            {paginatedGroups.map((g, i) => (
              <div key={g.id} className={`animate-rise-d${Math.min(i, 5)}`}>
                <EkipCard group={g} onClick={() => onOpenGroup(g)} />
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between gap-2 mt-5">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(0, current - 1))}
              disabled={currentPage === 0}
              className="glass-thin glass-specular rounded-2xl px-3 py-2 text-foot text-secondary font-semibold inline-flex items-center gap-1.5 haptic disabled:opacity-30"
            >
              {(() => { const I = getIcon('ChevronLeft'); return <I size={16} />; })()}
              Previous
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setPage(index)}
                  aria-label={`Go to page ${index + 1}`}
                  aria-current={currentPage === index ? 'page' : undefined}
                  className={`w-8 h-8 rounded-xl text-foot font-semibold haptic ${currentPage === index ? 'text-white' : 'glass-thin glass-specular text-secondary'}`}
                  style={currentPage === index ? { background: 'linear-gradient(135deg, rgb(244 114 182), rgb(59 130 246))' } : undefined}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setPage((current) => Math.min(totalPages - 1, current + 1))}
              disabled={currentPage === totalPages - 1}
              className="glass-thin glass-specular rounded-2xl px-3 py-2 text-foot text-secondary font-semibold inline-flex items-center gap-1.5 haptic disabled:opacity-30"
            >
              Next
              {(() => { const I = getIcon('ChevronRight'); return <I size={16} />; })()}
            </button>
          </div>
        )}
      </div>

      <GlassSheet open={showFilters} onClose={() => setShowFilters(false)} title="Filter Ekips">
        <div className="space-y-5">
          <div>
            <p className="text-foot text-secondary font-semibold ml-1 mb-2">Category</p>
            <GlassSegmented
              options={[
                { label: 'All', value: 'all' },
                { label: 'Work', value: 'work' },
                { label: 'Entertainment', value: 'entertainment' },
              ]}
              value={categoryFilter}
              onChange={(value) => { setCategoryFilter(value as typeof categoryFilter); setPage(0); }}
            />
          </div>
          <div>
            <p className="text-foot text-secondary font-semibold ml-1 mb-2">City</p>
            <div className="flex flex-wrap gap-2">
              <GlassChip active={cityFilter === 'all'} onClick={() => { setCityFilter('all'); setPage(0); }}>All cities</GlassChip>
              {cities.slice(0, 6).map((city) => (
                <GlassChip key={city} active={cityFilter === city} onClick={() => { setCityFilter(city); setPage(0); }}>{city}</GlassChip>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between glass-thin rounded-2xl px-4 py-3">
            <div>
              <p className="text-body text-primary font-semibold">Premium Ekips only</p>
              <p className="text-foot text-secondary">Show groups reserved for Premium members</p>
            </div>
            <GlassToggle checked={premiumOnly} onChange={(checked) => { setPremiumOnly(checked); setPage(0); }} />
          </div>
          <GlassButton
            fullWidth
            variant="secondary"
            onClick={() => { setCategoryFilter('all'); setCityFilter('all'); setPremiumOnly(false); setPage(0); }}
          >
            Reset filters
          </GlassButton>
        </div>
      </GlassSheet>
    </div>
  );
}
