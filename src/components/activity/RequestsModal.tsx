import { GlassCard, GlassAvatar, GlassButton, GlassEmpty, GlassBadgeIcon } from '@/components/Glass';
import { GlassSheet } from '@/components/Overlays';
import { getIcon } from '@/lib/icons';
import type { GroupRequest } from '@/types/database';

interface RequestsModalProps {
  open: boolean;
  onClose: () => void;
  requests: GroupRequest[];
  onAccept: (reqId: string, name: string, groupTitle: string) => void;
  onReject: (reqId: string) => void;
  onOpenProfile?: (userId: string) => void;
}

export function RequestsModal({
  open,
  onClose,
  requests,
  onAccept,
  onReject,
  onOpenProfile,
}: RequestsModalProps) {
  const ChevronRight = getIcon('ChevronRight');

  const handleProfileClick = (userId: string) => {
    if (onOpenProfile) {
      onClose();
      onOpenProfile(userId);
    }
  };

  return (
    <GlassSheet open={open} onClose={onClose} title="Pending Join Requests">
      <div className="space-y-3 max-h-[60vh] overflow-y-auto no-scrollbar">
        {requests.length === 0 ? (
          <GlassEmpty
            icon="UserCheck"
            title="All caught up"
            subtitle="No pending requests for this Ekip."
          />
        ) : (
          requests.map((r) => {
            const profile = r.profile;
            const group = r.group;
            if (!profile || !group) return null;
            return (
              <GlassCard key={r.id} variant="thin" className="rounded-2xl p-3.5 space-y-3">
                {/* Clickable Applicant Profile Header */}
                <button
                  type="button"
                  onClick={() => handleProfileClick(profile.id)}
                  className="w-full text-left flex items-center gap-3 spring-press cursor-pointer group"
                  aria-label={`View ${profile.first_name}'s profile`}
                >
                  <GlassAvatar
                    src={profile.avatar_url}
                    name={`${profile.first_name} ${profile.last_name}`}
                    size={42}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sub text-primary font-bold truncate group-hover:text-pink-500 transition-colors">
                        {profile.first_name} {profile.last_name}
                      </p>
                      {profile.is_verified && <GlassBadgeIcon icon="Verified" label="" color="blue" />}
                      {profile.is_premium && <GlassBadgeIcon icon="Crown" label="" color="amber" />}
                    </div>
                    <p className="text-foot text-tertiary truncate">
                      Level {profile.level} · Honor {profile.honor_score} {profile.city ? `· ${profile.city}` : ''}
                    </p>
                  </div>
                  <ChevronRight size={18} className="text-tertiary group-hover:text-primary transition-colors shrink-0" />
                </button>

                {r.message && (
                  <p className="text-foot text-secondary italic bg-black/5 dark:bg-black/50 dark:border dark:border-white/5 rounded-xl p-2.5">
                    "{r.message}"
                  </p>
                )}

                <div className="flex gap-2 pt-1">
                  <GlassButton
                    size="sm"
                    fullWidth
                    onClick={() => onAccept(r.id, `${profile.first_name} ${profile.last_name}`, group.title)}
                  >
                    Accept
                  </GlassButton>
                  <GlassButton
                    size="sm"
                    fullWidth
                    variant="danger"
                    onClick={() => onReject(r.id)}
                  >
                    Reject
                  </GlassButton>
                </div>
              </GlassCard>
            );
          })
        )}
      </div>
    </GlassSheet>
  );
}
