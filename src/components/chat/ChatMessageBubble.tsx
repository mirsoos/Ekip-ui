import { GlassAvatar } from '@/components/Glass';
import type { Message } from '@/types/database';
import { useTheme, CHAT_THEMES } from '@/lib/theme';

interface ChatMessageBubbleProps {
  message: Message;
  isMe: boolean;
  showAvatar?: boolean;
}

export function ChatMessageBubble({ message, isMe, showAvatar = false }: ChatMessageBubbleProps) {
  const { chatTheme } = useTheme();
  const themeConfig = CHAT_THEMES[chatTheme] ?? CHAT_THEMES.default;

  const time = new Date(message.created_at).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <div className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'} animate-rise`}>
      {!isMe && (
        <div className="w-7 shrink-0">
          {showAvatar && (
            <GlassAvatar
              src={message.sender?.avatar_url}
              name={message.sender?.first_name ?? 'User'}
              size={28}
              ring={false}
            />
          )}
        </div>
      )}
      <div
        className={`max-w-[75%] px-4 py-2.5 ${
          isMe
            ? `rounded-3xl rounded-br-lg ${themeConfig.myBubbleText}`
            : `rounded-3xl rounded-bl-lg ${themeConfig.theirBubbleClass} ${themeConfig.theirBubbleText}`
        }`}
        style={
          isMe
            ? { background: themeConfig.myBubbleGradient }
            : undefined
        }
      >
        {!isMe && message.sender && (
          <p className="text-[10px] font-bold mb-0.5" style={{ color: themeConfig.accentHex }}>
            {message.sender.first_name} {message.sender.last_name}
          </p>
        )}
        <p className="text-body leading-snug break-words">{message.body}</p>
        <span
          className={`text-[9px] block text-right mt-1 ${
            isMe ? 'text-white/70' : 'text-tertiary'
          }`}
        >
          {time}
        </span>
      </div>
    </div>
  );
}
