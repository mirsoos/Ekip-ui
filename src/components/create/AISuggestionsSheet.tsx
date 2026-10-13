import { GlassCard, GlassButton } from '@/components/Glass';
import { GlassSheet } from '@/components/Overlays';
import { getIcon } from '@/lib/icons';

interface AISuggestionsSheetProps {
  open: boolean;
  onClose: () => void;
  onApplyTitle?: (title: string) => void;
}

const suggestions = [
  'Add a catchy title like "Sunset Yoga in the Park"',
  'Include 3-5 tags to help people discover your Ekip',
  'Set an age range to attract the right crowd',
  'Add a specific venue for better discoverability',
  'Enable auto-accept to fill open spots faster',
];

export function AISuggestionsSheet({ open, onClose, onApplyTitle }: AISuggestionsSheetProps) {
  const Sparkles = getIcon('Sparkles');

  return (
    <GlassSheet open={open} onClose={onClose} title="AI Assistant Recommendations">
      <div className="space-y-3">
        {suggestions.map((s, i) => (
          <GlassCard key={i} variant="thin" className="rounded-2xl p-3 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-pink-500/15 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles size={16} className="text-pink-500" strokeWidth={2.2} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-foot text-secondary leading-snug">{s}</p>
              {s.includes('"') && onApplyTitle && (
                <button
                  type="button"
                  onClick={() => {
                    const match = s.match(/"([^"]+)"/);
                    if (match) onApplyTitle(match[1]);
                    onClose();
                  }}
                  className="text-[11px] text-pink-500 font-bold mt-1 spring-press cursor-pointer"
                >
                  Use this suggestion
                </button>
              )}
            </div>
          </GlassCard>
        ))}

        <GlassButton fullWidth variant="secondary" onClick={onClose} className="mt-2">
          Done
        </GlassButton>
      </div>
    </GlassSheet>
  );
}
