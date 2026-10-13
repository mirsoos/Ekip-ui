import { GlassAvatar } from '@/components/Glass';
import type { Message } from '@/types/database';

interface ChatMessageBubbleProps {
  message: Message;
  isMe: boolean;
  showAvatar?: boolean;
}

export function ChatMessageBubble({ message, isMe, showAvatar = false }: ChatMessageBubbleProps) {
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
            ? 'rounded-3xl rounded-br-lg text-white'
            : 'rounded-3xl rounded-bl-lg glass glass-specular text-primary'
        }`}
        style={
          isMe
            ? { background: 'linear-gradient(135deg, rgb(244 114 182), rgb(59 130 246))' }
            : undefined
        }
      >
        {!isMe && message.sender && (
          <p className="text-[10px] text-pink-500 font-bold mb-0.5">
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
