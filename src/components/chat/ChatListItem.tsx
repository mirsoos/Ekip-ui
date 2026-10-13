import { GlassCard, GlassAvatar } from '@/components/Glass';
import type { Conversation } from '@/types/database';

interface ChatListItemProps {
  conversation: Conversation;
  onClick: () => void;
  className?: string;
}

export function ChatListItem({ conversation, onClick, className = '' }: ChatListItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left spring-press cursor-pointer ${className}`}
    >
      <GlassCard
        variant={conversation.unread_count > 0 ? 'default' : 'thin'}
        className="rounded-3xl p-3 flex items-center gap-3"
      >
        <GlassAvatar
          src={conversation.avatar_url}
          name={conversation.title}
          size={48}
          online={conversation.type === 'direct'}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sub text-primary font-bold truncate">{conversation.title}</h3>
            <span className="text-[10px] text-tertiary">
              {formatChatTime(conversation.last_message_at)}
            </span>
          </div>
          <p className="text-foot text-secondary truncate">{conversation.last_message}</p>
        </div>
        {conversation.unread_count > 0 && (
          <span className="min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-black text-white flex items-center justify-center telegram-badge animate-pop shadow-md shrink-0">
            {conversation.unread_count}
          </span>
        )}
      </GlassCard>
    </button>
  );
}

function formatChatTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }
  if (diffDays < 7) {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
