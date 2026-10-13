import { getIcon } from '@/lib/icons';

interface SocialAuthRowProps {
  onSelect: (provider: string) => void;
  providers?: ('Apple' | 'Google' | 'Mail' | 'Phone')[];
  className?: string;
}

export function SocialAuthRow({ onSelect, providers = ['Apple', 'Mail', 'Phone'], className = '' }: SocialAuthRowProps) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      {providers.map((p) => {
        const Icon = getIcon(p === 'Apple' ? 'Sparkles' : p === 'Mail' ? 'Mail' : p === 'Phone' ? 'Phone' : 'Globe');
        return (
          <button
            key={p}
            type="button"
            onClick={() => onSelect(p)}
            className="w-12 h-12 rounded-2xl glass-thick glass-specular glass-edge flex items-center justify-center spring-press cursor-pointer shadow-sm"
            aria-label={`Continue with ${p}`}
          >
            <Icon size={20} className="text-primary" strokeWidth={2.2} />
          </button>
        );
      })}
    </div>
  );
}
