import { GlassAvatar, GlassBackButton } from '@/components/Glass';
import { getIcon } from '@/lib/icons';
import type { Conversation } from '@/types/database';

interface ChatHeaderProps {
  conversation: Conversation;
  onBack: () => void;
  onOpenMenu?: () => void;
}

export function ChatHeader({ conversation, onBack, onOpenMenu }: ChatHeaderProps) {
  const isGroup = conversation.type === 'group';
  const More = getIcon('MoreVertical');

  return (
    <div className="px-4 pt-4 pb-3 absolute top-0 left-0 right-0 z-20">
      <div className="glass-thick glass-specular glass-edge rounded-3xl p-2 flex items-center gap-3">
        <GlassBackButton onClick={onBack} />
        <GlassAvatar
          src={conversation.avatar_url}
          name={conversation.title}
          size={40}
          online={!isGroup}
        />
        <div className="flex-1 min-w-0">
          <p className="text-sub text-primary font-bold truncate">{conversation.title}</p>
          <p className="text-foot text-tertiary">
            {isGroup ? 'Group chat' : 'Active now'}
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="More options"
          className="w-9 h-9 rounded-full glass-thick glass-specular glass-edge flex items-center justify-center spring-press cursor-pointer shadow-sm text-primary"
        >
          <More size={18} strokeWidth={2.2} />
        </button>
      </div>
    </div>
  );
}
