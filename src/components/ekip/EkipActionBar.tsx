import { GlassCard, GlassButton } from '@/components/Glass';
import { getIcon } from '@/lib/icons';
import type { GroupRequest } from '@/types/database';

interface EkipActionBarProps {
  isOwner: boolean;
  isMember: boolean;
  myRequest?: GroupRequest;
  eligible: boolean;
  full: boolean;
  autoAccept: boolean;
  onStartChat: () => void;
  onOpenJoinSheet: () => void;
  onCancelRequest: () => void;
  className?: string;
}

export function EkipActionBar({
  isOwner,
  isMember,
  myRequest,
  eligible,
  full,
  autoAccept,
  onStartChat,
  onOpenJoinSheet,
  onCancelRequest,
  className = '',
}: EkipActionBarProps) {
  const Clock = getIcon('Clock');

  return (
    <div className={`shrink-0 px-5 pb-5 pt-3 z-30 bg-transparent animate-rise-d3 ${className}`}>
      <GlassCard variant="thick" className="rounded-3xl p-3 flex items-center gap-3">
        {isOwner ? (
          <>
            <GlassButton variant="secondary" icon="Edit" className="flex-1">
              Edit
            </GlassButton>
            <GlassButton variant="secondary" icon="Users" className="flex-1">
              Manage
            </GlassButton>
          </>
        ) : isMember || myRequest?.status === 'accepted' ? (
          <>
            <GlassButton
              variant="secondary"
              icon="MessageCircle"
              onClick={onStartChat}
              className="flex-1"
            >
              Chat
            </GlassButton>
            <GlassButton variant="secondary" icon="CheckCircle2" className="flex-1">
              Going
            </GlassButton>
          </>
        ) : myRequest?.status === 'pending' ? (
          <>
            <div className="flex-1 flex items-center justify-center gap-2 text-sub text-secondary font-semibold">
              <Clock size={18} />
              Request pending
            </div>
            <GlassButton variant="secondary" icon="X" onClick={onCancelRequest}>
              Cancel
            </GlassButton>
          </>
        ) : (
          <GlassButton
            fullWidth
            size="lg"
            icon="UserPlus"
            onClick={onOpenJoinSheet}
            disabled={!eligible || full}
          >
            {!eligible
              ? 'Not eligible'
              : full
              ? 'Ekip full'
              : autoAccept
              ? 'Join now'
              : 'Request to join'}
          </GlassButton>
        )}
      </GlassCard>
    </div>
  );
}
