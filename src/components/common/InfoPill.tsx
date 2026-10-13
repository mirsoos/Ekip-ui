import { getIcon, type IconName } from '@/lib/icons';

interface InfoPillProps {
  icon: IconName;
  label: string;
  className?: string;
}

export function InfoPill({ icon, label, className = '' }: InfoPillProps) {
  const Icon = getIcon(icon);
  return (
    <div className={`glass-thin glass-specular rounded-full px-3 py-1.5 flex items-center gap-1.5 ${className}`}>
      <Icon size={14} className="text-tertiary" strokeWidth={2.2} />
      <span className="text-foot text-secondary font-medium">{label}</span>
    </div>
  );
}
