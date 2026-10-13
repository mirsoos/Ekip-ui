import { GlassCard, GlassSegmented } from '@/components/Glass';
import { getIcon } from '@/lib/icons';
import type { GroupCategory, GroupType } from '@/types/database';

interface CategoryTypeSelectorProps {
  category: GroupCategory;
  groupType: GroupType;
  onChangeCategory: (cat: GroupCategory) => void;
  onChangeGroupType: (type: GroupType) => void;
  className?: string;
}

export function CategoryTypeSelector({
  category,
  groupType,
  onChangeCategory,
  onChangeGroupType,
  className = '',
}: CategoryTypeSelectorProps) {
  const PartyPopper = getIcon('PartyPopper');
  const Briefcase = getIcon('Briefcase');

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Category Selection */}
      <div className="space-y-2">
        <label className="text-foot text-secondary font-medium ml-1">Category</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onChangeCategory('entertainment')}
            className="w-full text-left spring-press cursor-pointer"
          >
            <GlassCard
              variant={category === 'entertainment' ? 'default' : 'thin'}
              className={`rounded-2xl p-3 flex items-center gap-2.5 ${
                category === 'entertainment' ? 'ring-2 ring-pink-500/80 shadow-md' : ''
              }`}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background:
                    category === 'entertainment'
                      ? 'linear-gradient(135deg, rgb(244 114 182), rgb(236 72 153))'
                      : 'rgb(var(--glass-tint) / 0.15)',
                }}
              >
                <PartyPopper size={20} className={category === 'entertainment' ? 'text-white' : 'text-primary'} />
              </div>
              <div>
                <p className="text-sub font-bold text-primary">Entertainment</p>
                <p className="text-[11px] text-tertiary">Fun & Social</p>
              </div>
            </GlassCard>
          </button>

          <button
            type="button"
            onClick={() => onChangeCategory('work')}
            className="w-full text-left spring-press cursor-pointer"
          >
            <GlassCard
              variant={category === 'work' ? 'default' : 'thin'}
              className={`rounded-2xl p-3 flex items-center gap-2.5 ${
                category === 'work' ? 'ring-2 ring-pink-500/80 shadow-md' : ''
              }`}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background:
                    category === 'work'
                      ? 'linear-gradient(135deg, rgb(59 130 246), rgb(37 99 235))'
                      : 'rgb(var(--glass-tint) / 0.15)',
                }}
              >
                <Briefcase size={20} className={category === 'work' ? 'text-white' : 'text-primary'} />
              </div>
              <div>
                <p className="text-sub font-bold text-primary">Work</p>
                <p className="text-[11px] text-tertiary">Projects & Meetups</p>
              </div>
            </GlassCard>
          </button>
        </div>
      </div>

      {/* Group Format */}
      <div className="space-y-2">
        <label className="text-foot text-secondary font-medium ml-1">Format</label>
        <GlassSegmented
          options={[
            { label: 'Solo', value: 'solo', icon: 'User' },
            { label: 'Couple', value: 'couple', icon: 'Users' },
            { label: 'Group', value: 'group', icon: 'Layers' },
          ]}
          value={groupType}
          onChange={(v) => onChangeGroupType(v as GroupType)}
        />
      </div>
    </div>
  );
}
