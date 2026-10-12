import { useState } from 'react';
import { useAppData } from '@/lib/appData';
import { GlassCard, GlassSegmented, GlassEmpty, GlassAvatar, GlassBadgeIcon, GlassButton } from '@/components/Glass';
import { GlassSheet } from '@/components/Overlays';
import { getIcon, type IconName } from '@/lib/icons';
import { NotificationButton } from '@/components/NotificationButton';
import type { Group } from '@/types/database';

interface ActivityScreenProps {
  onOpenGroup: (group: Group) => void;
  onOpenProfile: (userId: string) => void;
  onOpenNotifications: () => void;
}

export function ActivityScreen({ onOpenGroup, onOpenProfile, onOpenNotifications }: ActivityScreenProps) {
  const { me, groups, members, requests, updateRequest, addNotification, notifications } = useAppData();
  const [tab, setTab] = useState('created');
  const [showRequests, setShowRequests] = useState(false);
  const [requestsGroupId, setRequestsGroupId] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  // My created Ekips
  const createdGroups = groups.filter((g) => g.owner_id === 'me');
  // Ekips I've requested to join
  const myRequests = requests.filter((r) => r.user_id === 'me');
  const requestedGroups = groups.filter((g) => myRequests.some((r) => r.group_id === g.id));
  // Ekips I'm a member of (not owner)
  const joinedGroups = groups.filter((g) =>
    g.owner_id !== 'me' && members.some((m) => m.group_id === g.id && m.user_id === 'me' && m.status === 'active')
  );

  const handleAccept = (reqId: string, profileName: string, groupTitle: string) => {
    updateRequest(reqId, 'accepted');
    addNotification({ type: 'group_request', title: 'Request accepted', body: `You accepted ${profileName} into ${groupTitle}.`, icon: 'CheckCircle2' });
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

  const closeRequests = () => {
    setShowRequests(false);
  };

  return (
    <div className="h-full overflow-y-auto no-scrollbar screen-enter-items">
      {/* Header */}
      <div className="sticky top-0 z-20 glass glass-specular px-5 pt-4 pb-3">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-hero text-primary font-bold tracking-tight">My Ekip</h1>
          </div>
          <NotificationButton unreadCount={notifications.filter((notification) => !notification.is_read).length} onClick={onOpenNotifications} />
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
        {tab === 'created' && (
          <div className="space-y-4 animate-rise">
            {createdGroups.length === 0 ? (
              <GlassEmpty icon="Crown" title="No created Ekips" subtitle="Create your first Ekip to start gathering people." />
            ) : (
              createdGroups.map((g) => {
                const pendingReqs = requests.filter((r) => r.group_id === g.id && r.status === 'pending');
                const groupMembers = members.filter((m) => m.group_id === g.id && m.status === 'active');
                return (
                  <GlassCard key={g.id} className="rounded-[28px] overflow-hidden">
                    <div className="relative h-28 overflow-hidden">
                      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${g.cover_url})` }} />
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 30%, rgb(0 0 0 / 0.6))' }} />
                      <button onClick={() => onOpenGroup(g)} className="absolute inset-0 w-full h-full" />
                      <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                        <div>
                          <h3 className="text-body text-white font-bold">{g.title}</h3>
                          <p className="text-foot text-white/80">{new Date(g.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                        </div>
                        <GlassBadgeIcon icon="Crown" label="Owner" color="amber" />
                      </div>
                    </div>
                    <div className="p-4">
                      {/* Stats row */}
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
                        <GlassButton size="sm" variant="secondary" icon="Edit" onClick={() => onOpenGroup(g)} className="flex-1">Edit</GlassButton>
                        {pendingReqs.length > 0 && (
                          <GlassButton size="sm" icon="UserPlus" onClick={() => openRequests(g.id)} className="flex-1">
                            Requests ({pendingReqs.length})
                          </GlassButton>
                        )}
                        <button className="w-9 h-9 rounded-2xl glass-thin glass-specular flex items-center justify-center haptic">
                          {(() => { const I = getIcon('MoreVertical'); return <I size={16} className="text-secondary" />; })()}
                        </button>
                      </div>
                    </div>
                  </GlassCard>
                );
              })
            )}
          </div>
        )}

        {tab === 'joined' && (
          <div className="space-y-3 animate-rise">
            {joinedGroups.length === 0 ? (
              <GlassEmpty icon="Users" title="No joined Ekips" subtitle="Discover and join Ekips to see them here." />
            ) : (
              joinedGroups.map((g) => (
                <button key={g.id} onClick={() => onOpenGroup(g)} className="w-full text-left haptic">
                  <GlassCard variant="thin" className="rounded-3xl overflow-hidden">
                    <div className="flex gap-3 p-3">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 bg-cover bg-center" style={{ backgroundImage: `url(${g.cover_url})` }} />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sub text-primary font-semibold truncate">{g.title}</h3>
                        <p className="text-foot text-tertiary mt-0.5">{new Date(g.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {g.city}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <GlassBadgeIcon icon="CheckCircle2" label="Member" color="green" />
                        </div>
                      </div>
                      {(() => { const C = getIcon('ChevronRight'); return <C size={18} className="text-tertiary self-center" />; })()}
                    </div>
                  </GlassCard>
                </button>
              ))
            )}
          </div>
        )}

        {tab === 'requested' && (
          <div className="space-y-3 animate-rise">
            {myRequests.length === 0 ? (
              <GlassEmpty icon="Clock" title="No requests sent" subtitle="Request to join an Ekip and track its status here." />
            ) : (
              myRequests.map((r) => {
                const g = groups.find((gr) => gr.id === r.group_id);
                if (!g) return null;
                const statusConfig: Record<string, { icon: IconName; color: string; label: string }> = {
                  pending: { icon: 'Clock', color: 'blue', label: 'Pending' },
                  accepted: { icon: 'CheckCircle2', color: 'green', label: 'Accepted' },
                  rejected: { icon: 'XCircle', color: 'pink', label: 'Rejected' },
                  cancelled: { icon: 'XCircle', color: 'pink', label: 'Cancelled' },
                };
                const sc = statusConfig[r.status] ?? statusConfig.pending;
                return (
                  <button key={r.id} onClick={() => onOpenGroup(g)} className="w-full text-left haptic">
                    <GlassCard variant="thin" className="rounded-3xl overflow-hidden">
                      <div className="flex gap-3 p-3">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 bg-cover bg-center" style={{ backgroundImage: `url(${g.cover_url})` }} />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sub text-primary font-semibold truncate">{g.title}</h3>
                          <p className="text-foot text-tertiary mt-0.5">Sent {new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                          <div className="mt-1.5">
                            <GlassBadgeIcon icon={sc.icon} label={sc.label} color={sc.color} />
                          </div>
                        </div>
                        {(() => { const C = getIcon('ChevronRight'); return <C size={18} className="text-tertiary self-center" />; })()}
                      </div>
                    </GlassCard>
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Requests management sheet */}
      <GlassSheet open={showRequests} onClose={closeRequests} title="Join Requests">
        {(() => {
          const groupId = requestsGroupId;
          const group = groups.find((g) => g.id === groupId);
          const pending = requests.filter((r) => r.group_id === groupId && r.status === 'pending');
          if (!group) return null;
          return (
            <div className="space-y-3">
              {pending.length === 0 ? (
                <p className="text-sub text-secondary text-center py-8">No pending requests.</p>
              ) : (
                pending.map((r) => {
                  const p = r.profile;
                  if (!p) return null;
                  return (
                    <GlassCard key={r.id} className="rounded-3xl p-3">
                      <button onClick={() => onOpenProfile(p.id)} className="flex items-center gap-3 w-full text-left">
                        <GlassAvatar src={p.avatar_url} name={`${p.first_name} ${p.last_name}`} size={44} online />
                        <div className="flex-1 min-w-0">
                          <p className="text-sub text-primary font-bold">{p.first_name} {p.last_name}</p>
                          <p className="text-foot text-tertiary">@{p.username} · Level {p.level}</p>
                        </div>
                      </button>
                      {r.message && (
                        <p className="text-foot text-secondary mt-2 px-1 italic">"{r.message}"</p>
                      )}
                      <div className="flex gap-2 mt-3">
                        <GlassButton size="sm" variant="secondary" icon="X" onClick={() => handleReject(r.id)} className="flex-1">Decline</GlassButton>
                        <GlassButton size="sm" icon="Check" onClick={() => handleAccept(r.id, p.first_name, group.title)} className="flex-1">Accept</GlassButton>
                      </div>
                    </GlassCard>
                  );
                })
              )}
            </div>
          );
        })()}
      </GlassSheet>

      {/* Toast */}
      {toast && (
        <div className="absolute top-20 inset-x-0 z-[70] flex justify-center pointer-events-none">
          <div className="animate-pop">
            <div className="glass-thick glass-specular glass-edge rounded-2xl px-4 py-3 flex items-center gap-2.5">
            {(() => { const I = getIcon('CheckCircle2'); return <I size={20} className="text-green-500" strokeWidth={2.2} />; })()}
            <span className="text-sub text-primary font-medium">{toast}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatBox({ icon, value, label, highlight, onClick }: { icon: IconName; value: number; label: string; highlight?: boolean; onClick?: () => void }) {
  const Icon = getIcon(icon);
  const className = `rounded-2xl p-2.5 text-center glass-thin glass-specular ${highlight ? 'ring-1 ring-pink-500/40' : ''}`;
  const content = (
    <>
      <Icon size={16} className={highlight ? 'text-pink-500 mx-auto' : 'text-tertiary mx-auto'} strokeWidth={2.2} />
      <p className="text-sub text-primary font-bold mt-1">{value}</p>
      <p className="text-[10px] text-tertiary">{label}</p>
    </>
  );
  return onClick ? <button type="button" onClick={onClick} className={`${className} w-full haptic`}>{content}</button> : <div className={className}>{content}</div>;
}
