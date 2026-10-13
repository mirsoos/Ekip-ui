import { getIcon } from '@/lib/icons';

interface ChatInputBarProps {
  value: string;
  onChange: (val: string) => void;
  onSend: () => void;
  placeholder?: string;
  className?: string;
}

export function ChatInputBar({
  value,
  onChange,
  onSend,
  placeholder = 'Type a message...',
  className = '',
}: ChatInputBarProps) {
  const Send = getIcon('Send');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className={`px-4 pb-5 pb-safe pt-2 ${className}`}>
      <div className="glass-thick glass-specular glass-edge rounded-3xl p-1.5 flex items-center gap-2 shadow-lg">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-body text-primary placeholder:text-tertiary px-3"
        />
        <button
          type="button"
          onClick={onSend}
          disabled={!value.trim()}
          aria-label="Send message"
          className="w-10 h-10 rounded-full flex items-center justify-center spring-press cursor-pointer shadow-md disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          style={{ background: 'linear-gradient(135deg, rgb(244 114 182), rgb(59 130 246))' }}
        >
          <Send size={18} className="text-white" strokeWidth={2.4} />
        </button>
      </div>
    </div>
  );
}
