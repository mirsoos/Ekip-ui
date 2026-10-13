import { GlassChip } from '@/components/Glass';

interface TagSelectorProps {
  availableTags: string[];
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
  className?: string;
}

export function TagSelector({
  availableTags,
  selectedTags,
  onToggleTag,
  className = '',
}: TagSelectorProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between ml-1">
        <label className="text-foot text-secondary font-medium">Tags & Interests</label>
        <span className="text-[11px] text-tertiary">{selectedTags.length} selected</span>
      </div>
      <div className="flex flex-wrap gap-1.5 max-h-44 overflow-y-auto no-scrollbar p-1">
        {availableTags.map((tag) => {
          const isSelected = selectedTags.includes(tag);
          return (
            <GlassChip
              key={tag}
              active={isSelected}
              onClick={() => onToggleTag(tag)}
            >
              {tag}
            </GlassChip>
          );
        })}
      </div>
    </div>
  );
}
