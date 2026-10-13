import { getIcon } from '@/lib/icons';

interface AIChatBubbleProps {
  role: 'user' | 'ai';
  body: string;
  chips?: string[];
  onSelectChip?: (chip: string) => void;
}

export function AIChatBubble({ role, body, chips, onSelectChip }: AIChatBubbleProps) {
  const Sparkles = getIcon('Sparkles');

  return (
    <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'} animate-rise`}>
      <div className={`max-w-[84%] ${role === 'user' ? '' : 'w-full'}`}>
        {role === 'ai' && (
          <div className="flex items-center gap-1.5 mb-1.5">
            <div
              className="w-5 h-5 rounded-lg flex items-center justify-center shadow-xs"
              style={{
                background: 'linear-gradient(135deg, rgb(244 114 182 / 0.4), rgb(59 130 246 / 0.4))',
              }}
            >
              <Sparkles size={12} className="text-pink-500" strokeWidth={2.4} />
            </div>
            <span className="text-[11px] text-tertiary font-bold">Ekip AI</span>
          </div>
        )}
        <div
          className={`px-4 py-3 ${
            role === 'user'
              ? 'rounded-3xl rounded-br-lg text-white shadow-md'
              : 'rounded-3xl rounded-bl-lg glass glass-specular text-primary shadow-sm'
          }`}
          style={
            role === 'user'
              ? { background: 'linear-gradient(135deg, rgb(244 114 182), rgb(59 130 246))' }
              : undefined
          }
        >
          <p className="text-body leading-relaxed whitespace-pre-line">{body}</p>
        </div>
        {chips && chips.length > 0 && onSelectChip && (
          <div className="flex flex-wrap gap-2 mt-2.5">
            {chips.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => onSelectChip(chip)}
                className="px-3 py-1.5 rounded-full text-foot font-semibold glass-thin glass-specular text-pink-500 spring-press cursor-pointer shadow-xs"
              >
                {chip}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
