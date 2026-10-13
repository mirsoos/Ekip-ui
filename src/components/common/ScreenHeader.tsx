import { type ReactNode } from 'react';
import { GlassBackButton } from '@/components/Glass';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightAction?: ReactNode;
  className?: string;
}

export function ScreenHeader({ title, subtitle, onBack, rightAction, className = '' }: ScreenHeaderProps) {
  return (
    <div className={`sticky top-0 z-20 glass glass-specular px-5 pt-3 pb-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          {onBack && <GlassBackButton onClick={onBack} />}
          <div className="min-w-0">
            <h1 className="text-title1 text-primary font-bold tracking-tight truncate">{title}</h1>
            {subtitle && <p className="text-sub text-secondary truncate">{subtitle}</p>}
          </div>
        </div>
        {rightAction && <div className="shrink-0 ml-3">{rightAction}</div>}
      </div>
    </div>
  );
}
