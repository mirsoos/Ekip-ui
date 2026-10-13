import { GlassSheet } from '@/components/Overlays';
import { GlassSegmented, GlassChip, GlassToggle, GlassButton } from '@/components/Glass';

interface DiscoverFilterSheetProps {
  open: boolean;
  onClose: () => void;
  categoryFilter: 'all' | 'work' | 'entertainment';
  onChangeCategory: (cat: 'all' | 'work' | 'entertainment') => void;
  cityFilter: string;
  onChangeCity: (city: string) => void;
  premiumOnly: boolean;
  onChangePremiumOnly: (val: boolean) => void;
  cities: string[];
  onReset: () => void;
}

export function DiscoverFilterSheet({
  open,
  onClose,
  categoryFilter,
  onChangeCategory,
  cityFilter,
  onChangeCity,
  premiumOnly,
  onChangePremiumOnly,
  cities,
  onReset,
}: DiscoverFilterSheetProps) {
  return (
    <GlassSheet open={open} onClose={onClose} title="Filter Ekips">
      <div className="space-y-4">
        {/* Category */}
        <div className="space-y-2">
          <label className="text-foot text-secondary font-medium">Category</label>
          <GlassSegmented
            options={[
              { label: 'All', value: 'all' },
              { label: 'Entertainment', value: 'entertainment', icon: 'PartyPopper' },
              { label: 'Work', value: 'work', icon: 'Briefcase' },
            ]}
            value={categoryFilter}
            onChange={(v) => onChangeCategory(v as 'all' | 'work' | 'entertainment')}
          />
        </div>

        {/* City */}
        <div className="space-y-2">
          <label className="text-foot text-secondary font-medium">City</label>
          <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto no-scrollbar p-1">
            <GlassChip
              active={cityFilter === 'all'}
              onClick={() => onChangeCity('all')}
            >
              All Cities
            </GlassChip>
            {cities.map((c) => (
              <GlassChip
                key={c}
                active={cityFilter === c}
                onClick={() => onChangeCity(c)}
              >
                {c}
              </GlassChip>
            ))}
          </div>
        </div>

        {/* Premium Only Toggle */}
        <div className="pt-2">
          <GlassToggle
            checked={premiumOnly}
            onChange={onChangePremiumOnly}
            label="Premium activities only"
          />
        </div>

        <div className="flex gap-2 pt-3">
          <GlassButton fullWidth variant="secondary" onClick={onReset}>
            Reset All
          </GlassButton>
          <GlassButton fullWidth onClick={onClose}>
            Apply Filters
          </GlassButton>
        </div>
      </div>
    </GlassSheet>
  );
}
