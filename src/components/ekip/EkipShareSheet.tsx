import { GlassCard } from '@/components/Glass';
import { GlassSheet } from '@/components/Overlays';
import { getIcon, type IconName } from '@/lib/icons';

interface EkipShareSheetProps {
  open: boolean;
  groupId: string;
  onClose: () => void;
  onCopy?: () => void;
}

const shareOptions: { label: string; icon: IconName }[] = [
  { label: 'Copy Link', icon: 'Link' },
  { label: 'Messages', icon: 'MessageCircle' },
  { label: 'Mail', icon: 'Mail' },
  { label: 'More', icon: 'Share' },
];

export function EkipShareSheet({ open, groupId, onClose, onCopy }: EkipShareSheetProps) {
  return (
    <GlassSheet open={open} onClose={onClose} title="Share Ekip">
      <div className="grid grid-cols-4 gap-3">
        {shareOptions.map((s) => {
          const Icon = getIcon(s.icon);
          return (
            <button
              key={s.label}
              type="button"
              onClick={s.label === 'Copy Link' ? onCopy : undefined}
              className="flex flex-col items-center gap-2 spring-press cursor-pointer"
            >
              <div className="w-14 h-14 rounded-2xl glass glass-specular glass-edge flex items-center justify-center">
                <Icon size={24} className="text-primary" strokeWidth={2} />
              </div>
              <span className="text-foot text-secondary font-medium">{s.label}</span>
            </button>
          );
        })}
      </div>
      <div className="mt-6">
        <GlassCard variant="thin" className="rounded-2xl p-3 flex items-center gap-2">
          <span className="text-foot text-secondary flex-1 truncate">ekip.app/g/{groupId}</span>
          <button
            type="button"
            onClick={onCopy}
            className="text-foot text-pink-500 font-bold spring-press cursor-pointer"
          >
            Copy
          </button>
        </GlassCard>
      </div>
    </GlassSheet>
  );
}
