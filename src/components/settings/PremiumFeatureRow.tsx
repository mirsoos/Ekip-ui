import { getIcon } from '@/lib/icons';

interface PremiumFeatureRowProps {
  label: string;
}

export function PremiumFeatureRow({ label }: PremiumFeatureRowProps) {
  const Check = getIcon('Check');
  return (
    <div className="flex items-center gap-2 text-foot text-secondary">
      <div className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
        <Check size={10} strokeWidth={3} />
      </div>
      <span>{label}</span>
    </div>
  );
}
