import { useState } from 'react';
import { useAppData } from '@/lib/appData';
import { GlassCard, GlassSegmented, GlassEmpty, GlassBadgeIcon, GlassButton } from '@/components/Glass';
import { Toast } from '@/components/Overlays';
import { StatBox } from '@/components/common/StatBox';
import { RequestsModal } from '@/components/activity/RequestsModal';
import { NotificationButton } from '@/components/NotificationButton';
import { getIcon, type IconName } from '@/lib/icons';
import type { Group } from '@/types/database';

interface ActivityScreenProps {
  onOpenGroup: (group: Group) => void;
  onOpenProfile: (userId: string) => void;
  onOpenNotifications: () => void;
}

export function ActivityScreen({
  onOpenGroup,
  onOpenProfile,
  onOpenNotifications,
}: ActivityScreenProps) {
  const { groups, members, requests, updateRequest, addNotification, notifications } = useAppData();
  const [tab, setTab] = useState('created');
  const [showRequests, setShowRequests] = useState(false);
  const [requestsGroupId, setRequestsGroupId] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  const createdGroups = groups.filter((g) => g.owner_id === 'me');
  const myRequests = requests.filter((r) => r.user_id === 'me');
  const joinedGroups = groups.filter(
    (g) =>
      g.owner_id !== 'me' &&
      members.some((m) => m.group_id === g.id && m.user_id === 'me' && m.status === 'active')
  );

  const ChevronRight = getIcon('ChevronRight');

  const handleAccept = (reqId: string, profileName: string, groupTitle: string) => {
    updateRequest(reqId, 'accepted');
    addNotification({
      type: 'group_request',
      title: 'Request accepted',
      body: `You accepted ${profileName} into ${groupTitle}.`,
      icon: 'CheckCircle2',
    });
    setToast('Request accepted');
    setTimeout(() => setToast(''), 2500);
  };

  const handleReject = (reqId: string) => {
    updateRequest(reqId, 'rejected');
    setToast('Request rejected');
    setTimeout(() => setToast(''), 2500);
  };

  const openRequests = (groupId: string) => {
    setRequestsGroupId(groupId);
    setShowRequests(true);
  };

  const activeGroupRequests = requests.filter(
    (r) => r.group_id === requestsGroupId && r.status === 'pending'
  );

  return (
    <div className="h-full overflow-y-auto no-scrollbar screen-enter-items">
      {/* Header */}
      <div className="sticky top-0 z-20 glass glass-specular px-5 pt-4 pb-3">
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-hero text-primary font-bold tracking-tight">My Ekip</h1>
          <NotificationButton
            unreadCount={notifications.filter((n) => !n.is_read).length}
            onClick={onOpenNotifications}
          />
        </div>

        <GlassSegmented
          options={[
            { label: 'Created', value: 'created', icon: 'Crown' },
            { label: 'Joined', value: 'joined', icon: 'Users' },
            { label: 'Requested', value: 'requested', icon: 'Clock' },
          ]}
          value={tab}
          onChange={setTab}
        />
      </div>

      <div className="px-5 mt-4 pb-32">
        {/* Created Tab */}
        {tab === 'created' && (
          <div className="space-y-4 animate-rise">
            {createdGroups.length === 0 ? (
              <GlassEmpty
                icon="Crown"
                title="No created Ekips"
                subtitle="Create your first Ekip to start gathering people."
              />
            ) : (
              createdGroups.map((g) => {
                const pendingReqs = requests.filter(
                  (r) => r.group_id === g.id && r.status === 'pending'
                );
                const groupMembers = members.filter(
                  (m) => m.group_id === g.id && m.status === 'active'
                );
                return (
                  <GlassCard key={g.id} className="rounded-[28px] overflow-hidden">
                    <div className="relative h-28 overflow-hidden">
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${g.cover_url})` }}
                      />
                      <div
                        className="absolute inset-0"
                        style={{
                          background: 'linear-gradient(180deg, transparent 30%, rgb(0 0 0 / 0.6))',
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => onOpenGroup(g)}
                        className="absolute inset-0 w-full h-full cursor-pointer"
                        aria-label={`Open ${g.title}`}
                      />
                      <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                        <div>
                          <h3 className="text-body text-white font-bold">{g.title}</h3>
                          <p className="text-foot text-white/80">
                            {new Date(g.event_date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                        <GlassBadgeIcon icon="Crown" label="Owner" color="amber" />
                      </div>
                    </div>

                    <div className="p-4">
                      {/* Metric Stat Boxes */}
                      <div className="grid grid-cols-4 gap-2 mb-3">
                        <StatBox icon="Users" value={groupMembers.length} label="Members" />
                        <StatBox
                          icon="UserPlus"
                          value={pendingReqs.length}
                          label="Requests"
                          highlight={pendingReqs.length > 0}
                          onClick={() => openRequests(g.id)}
                        />
                        <StatBox icon="Eye" value={g.views} label="Views" />
                        <StatBox icon="TrendingUp" value={g.member_count} label="Joined" />
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <GlassButton
                          size="sm"
                          variant="secondary"
                          icon="Edit"
                          onClick={() => onOpenGroup(g)}
                          className="flex-1"
                        >
                          Edit
                        </GlassButton>
                        {pendingReqs.length > 0 && (
                          <GlassButton
                            size="sm"
                            icon="UserPlus"
                            onClick={() => openRequests(g.id)}
                            className="flex-1"
                          >
                            Requests ({pendingReqs.length})
                          </GlassButton>
                        )}
                      </div>
                    </div>
                  </GlassCard>
                );
              })
            )}
          </div>
        )}

        {/* Joined Tab */}
        {tab === 'joined' && (
          <div className="space-y-3 animate-rise">
            {joinedGroups.length === 0 ? (
              <GlassEmpty
                icon="Users"
                title="No joined Ekips"
                subtitle="Discover and join Ekips to see them here."
              />
            ) : (
              joinedGroups.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => onOpenGroup(g)}
                  className="w-full text-left spring-press cursor-pointer"
                >
                  <GlassCard variant="thin" className="rounded-3xl overflow-hidden">
                    <div className="flex gap-3 p-3">
                      <div
                        className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${g.cover_url})` }}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sub text-primary font-semibold truncate">{g.title}</h3>
                        <p className="text-foot text-tertiary mt-0.5">
                          {new Date(g.event_date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}{' '}
                          · {g.city}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <GlassBadgeIcon icon="CheckCircle2" label="Member" color="green" />
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-tertiary self-center shrink-0" />
                    </div>
                  </GlassCard>
                </button>
              ))
            )}
          </div>
        )}

        {/* Requested Tab */}
        {tab === 'requested' && (
          <div className="space-y-3 animate-rise">
            {myRequests.length === 0 ? (
              <GlassEmpty
                icon="Clock"
                title="No requests sent"
                subtitle="Request to join an Ekip and track its status here."
              />
            ) : (
              myRequests.map((r) => {
                const g = groups.find((gr) => gr.id === r.group_id);
                if (!g) return null;
                const statusConfig: Record<string, { icon: IconName; color: string; label: string }> = {
                  pending: { icon: 'Clock', color: 'blue', label: 'Pending' },
                  accepted: { icon: 'CheckCircle2', color: 'green', label: 'Accepted' },
                  rejected: { icon: 'XCircle', color: 'pink', label: 'Rejected' },
                };
                const sc = statusConfig[r.status] ?? statusConfig.pending;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => onOpenGroup(g)}
                    className="w-full text-left spring-press cursor-pointer"
                  >
                    <GlassCard variant="thin" className="rounded-3xl p-3 flex gap-3">
                      <div
                        className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${g.cover_url})` }}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sub text-primary font-semibold truncate">{g.title}</h3>
                        <p className="text-foot text-tertiary mt-0.5">
                          {new Date(g.event_date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <GlassBadgeIcon icon={sc.icon} label={sc.label} color={sc.color} />
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-tertiary self-center shrink-0" />
                    </GlassCard>
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Requests Modal Sheet */}
      <RequestsModal
        open={showRequests}
        onClose={() => setShowRequests(false)}
        requests={activeGroupRequests}
        onAccept={handleAccept}
        onReject={handleReject}
        onOpenProfile={onOpenProfile}
      />

      {/* Toast */}
      <Toast message={toast} visible={Boolean(toast)} />
    </div>
  );
}
