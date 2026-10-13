import { GlassCard } from '@/components/Glass';
import { getIcon } from '@/lib/icons';

interface AIAssistantBannerProps {
  onClick: () => void;
  className?: string;
}

export function AIAssistantBanner({ onClick, className = '' }: AIAssistantBannerProps) {
  const Sparkles = getIcon('Sparkles');
  const ChevronRight = getIcon('ChevronRight');

  return (
    <div className={`px-5 mt-4 ${className}`}>
      <button
        type="button"
        onClick={onClick}
        className="w-full text-left spring-press cursor-pointer"
      >
        <GlassCard glow className="rounded-3xl p-4 flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
            style={{
              background: 'linear-gradient(135deg, rgb(244 114 182 / 0.4), rgb(59 130 246 / 0.4))',
            }}
          >
            <Sparkles size={24} className="text-pink-500" strokeWidth={2.2} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sub text-primary font-bold">Ask Ekip AI</h3>
            <p className="text-foot text-secondary">
              Find activities, venues, and compatible group members.
            </p>
          </div>
          <ChevronRight size={20} className="text-tertiary shrink-0" />
        </GlassCard>
      </button>
    </div>
  );
}
