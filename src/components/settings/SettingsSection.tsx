import { type ReactNode } from 'react';

interface SettingsSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function SettingsSection({ title, children, className = '' }: SettingsSectionProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <h2 className="text-foot text-tertiary font-bold uppercase tracking-wider ml-1">{title}</h2>
      {children}
    </div>
  );
}
