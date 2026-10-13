import { getIcon, type IconName } from '@/lib/icons';

interface StatBoxProps {
  icon: IconName;
  value: number | string;
  label: string;
  highlight?: boolean;
  onClick?: () => void;
  className?: string;
}

export function StatBox({ icon, value, label, highlight = false, onClick, className = '' }: StatBoxProps) {
  const Icon = getIcon(icon);
  const content = (
    <div
      className={`rounded-2xl p-2.5 text-center transition-all ${
        highlight
          ? 'glass glass-specular ring-1 ring-pink-500/50'
          : 'glass-thin glass-specular'
      } ${onClick ? 'cursor-pointer spring-press' : ''} ${className}`}
    >
      <div className="flex items-center justify-center gap-1">
        <Icon size={14} className={highlight ? 'text-pink-500' : 'text-tertiary'} strokeWidth={2.2} />
        <span className={`text-sub font-bold ${highlight ? 'text-pink-500' : 'text-primary'}`}>{value}</span>
      </div>
      <p className="text-[10px] text-tertiary font-medium mt-0.5">{label}</p>
    </div>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className="w-full text-left">
        {content}
      </button>
    );
  }

  return content;
}
