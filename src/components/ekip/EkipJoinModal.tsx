import { GlassButton, GlassInput } from '@/components/Glass';
import { GlassSheet } from '@/components/Overlays';
import type { Group } from '@/types/database';

interface EkipJoinModalProps {
  open: boolean;
  group: Group;
  eligible: boolean;
  message: string;
  onChangeMessage: (msg: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}

export function EkipJoinModal({
  open,
  group,
  eligible,
  message,
  onChangeMessage,
  onSubmit,
  onClose,
}: EkipJoinModalProps) {
  return (
    <GlassSheet open={open} onClose={onClose} title={`Join ${group.title}`}>
      <div className="space-y-4">
        <p className="text-body text-secondary">
          {group.auto_accept
            ? 'This Ekip has auto-accept enabled. You will join immediately.'
            : 'Send a note to the organizer with your request.'}
        </p>

        {!group.auto_accept && (
          <GlassInput
            placeholder="Introduce yourself or mention why you'd like to join..."
            value={message}
            onChange={onChangeMessage}
            multiline
            rows={3}
          />
        )}

        <GlassButton
          fullWidth
          size="lg"
          onClick={onSubmit}
          disabled={!eligible}
          className="mt-2"
        >
          {group.auto_accept ? 'Join Now' : 'Send Request'}
        </GlassButton>
      </div>
    </GlassSheet>
  );
}
