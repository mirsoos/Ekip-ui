import { useState } from 'react';
import { useAppData } from '@/lib/appData';
import { GlassCard, GlassButton, GlassAvatar, GlassBadgeIcon, GlassInput, GlassProgress, GlassSegmented } from '@/components/Glass';
import { GlassSheet } from '@/components/Overlays';
import { getIcon, type IconName } from '@/lib/icons';
import { useTheme } from '@/lib/theme';
import type { Group } from '@/types/database';

interface EkipDetailProps {
  group: Group;
  onBack: () => void;
  onOpenProfile: (userId: string) => void;
  onOpenChat: (conversationId: string) => void;
}

const categoryIcons: Record<string, IconName> = {
  entertainment: 'PartyPopper',
  work: 'Briefcase',
};

export function EkipDetail({ group, onBack, onOpenProfile, onOpenChat }: EkipDetailProps) {
  const { me, members, requests, addRequest, updateRequest, addNotification, conversations, addMessage } = useAppData();
  const { theme } = useTheme();
  const [showJoinSheet, setShowJoinSheet] = useState(false);
  const [joinMessage, setJoinMessage] = useState('');
  const [showShare, setShowShare] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [toast, setToast] = useState('');

  const Back = getIcon('ArrowLeft');
  const CatIcon = getIcon(categoryIcons[group.category] ?? 'PartyPopper');

  const groupMembers = members.filter((m) => m.group_id === group.id && m.status === 'active');
  const myRequest = requests.find((r) => r.group_id === group.id && r.user_id === 'me');
  const isOwner = group.owner_id === 'me';
  const isMember = groupMembers.some((m) => m.user_id === 'me');

  const eventDate = new Date(group.event_date);
  const dateStr = eventDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  const timeStr = eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  // Eligibility check
  const levelOk = !group.required_level || me.level >= group.required_level;
  const honorOk = !group.required_honor || me.honor_score >= group.required_honor;
  const ageOk = (!group.age_min || (me.age ?? 0) >= group.age_min) && (!group.age_max || (me.age ?? 0) <= group.age_max);
  const genderOk = !group.gender_preference || group.gender_preference === 'any' || me.gender === group.gender_preference;
  const premiumOk = !group.premium_only || me.is_premium;
  const eligible = levelOk && honorOk && ageOk && genderOk && premiumOk;
  const spotsLeft = group.max_members ? group.max_members - group.member_count : null;
  const full = spotsLeft !== null && spotsLeft <= 0;

  const reasons: string[] = [];
  if (!levelOk) reasons.push(`Requires level ${group.required_level}`);
  if (!honorOk) reasons.push(`Requires honor score ${group.required_honor}+`);
  if (!ageOk) reasons.push(`Ages ${group.age_min}-${group.age_max} only`);
  if (!genderOk) reasons.push(`${group.gender_preference} only`);
  if (!premiumOk) reasons.push('Premium members only');
  if (full) reasons.push('This Ekip is full');

  const handleJoin = () => {
    if (group.auto_accept) {
      addRequest({
        id: `r-${Date.now()}`,
        group_id: group.id,
        user_id: 'me',
        status: 'accepted',
        message: joinMessage || null,
        created_at: new Date().toISOString(),
        group,
        profile: me,
      });
      setToast('You joined this Ekip!');
    } else {
      addRequest({
        id: `r-${Date.now()}`,
        group_id: group.id,
        user_id: 'me',
        status: 'pending',
        message: joinMessage || null,
        created_at: new Date().toISOString(),
        group,
        profile: me,
      });
      setToast('Request sent!');
    }
    addNotification({
      type: 'group_request',
      title: group.auto_accept ? 'Joined Ekip' : 'Request sent',
      body: `You ${group.auto_accept ? 'joined' : 'requested to join'} ${group.title}`,
      icon: 'UserPlus',
    });
    setShowJoinSheet(false);
    setJoinMessage('');
    setTimeout(() => setToast(''), 2500);
  };

  const handleCancelRequest = () => {
    if (myRequest) updateRequest(myRequest.id, 'cancelled');
    setShowCancel(false);
    setToast('Request cancelled');
    setTimeout(() => setToast(''), 2500);
  };

  const handleStartChat = () => {
    const existing = conversations.find((c) => c.group_id === group.id);
    if (existing) onOpenChat(existing.id);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden relative">
      <div className="flex-1 overflow-y-auto no-scrollbar relative screen-enter-items">
      {/* Cover with back button */}
      <div className="relative h-56 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center scale-110" style={{ backgroundImage: `url(${group.cover_url})` }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgb(0 0 0 / 0.3) 0%, transparent 30%, rgb(0 0 0 / 0.5))' }} />
        <button onClick={onBack} className={`absolute top-4 left-4 w-10 h-10 rounded-full glass-thick glass-specular glass-edge flex items-center justify-center haptic z-10 ${theme === 'dark' ? 'text-white' : 'text-primary'}`}>
          <Back size={20} strokeWidth={2.2} />
        </button>
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <button onClick={() => setShowShare(true)} className={`w-10 h-10 rounded-full glass-thick glass-specular glass-edge flex items-center justify-center haptic ${theme === 'dark' ? 'text-white' : 'text-primary'}`}>
            {(() => { const S = getIcon('Share'); return <S size={18} strokeWidth={2.2} />; })()}
          </button>
          <button className={`w-10 h-10 rounded-full glass-thick glass-specular glass-edge flex items-center justify-center haptic ${theme === 'dark' ? 'text-white' : 'text-primary'}`}>
            {(() => { const B = getIcon('Bookmark'); return <B size={18} strokeWidth={2.2} />; })()}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 -mt-8 relative z-10">
        <div className="flex gap-2 mb-3">
          <div className="glass-thin glass-specular rounded-full px-3 py-1 flex items-center gap-1.5">
            <CatIcon size={12} className="text-white" strokeWidth={2.4} />
            <span className="text-caption text-white font-bold uppercase">{group.category}</span>
          </div>
          <div className="glass-thin glass-specular rounded-full px-3 py-1">
            <span className="text-caption text-white font-bold uppercase">{group.group_type}</span>
          </div>
          {group.is_repeating && (
            <div className="glass-thin glass-specular rounded-full px-3 py-1 flex items-center gap-1">
              {(() => { const R = getIcon('RefreshCw'); return <R size={12} className="text-white" strokeWidth={2.4} />; })()}
              <span className="text-caption text-white font-bold uppercase">Repeating</span>
            </div>
          )}
        </div>

        <h1 className="text-title1 text-primary font-bold leading-tight">{group.title}</h1>
        <p className="text-body text-secondary mt-3 leading-relaxed">{group.description}</p>

        {/* Event info */}
        <GlassCard className="rounded-3xl p-4 mt-4 flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, rgb(244 114 182 / 0.2), rgb(59 130 246 / 0.2))' }}
          >
            <span className="text-[10px] text-tertiary font-bold uppercase">{eventDate.toLocaleDateString('en-US', { month: 'short' })}</span>
            <span className="text-title2 text-primary font-bold leading-none">{eventDate.getDate()}</span>
          </div>
          <div className="flex-1">
            <p className="text-body text-primary font-semibold">{dateStr}</p>
            <p className="text-foot text-secondary">{timeStr}</p>
          </div>
          {(() => { const C = getIcon('Calendar'); return <C size={20} className="text-tertiary" />; })()}
        </GlassCard>

        {/* Location */}
        {group.location_name && (
          <GlassCard className="rounded-3xl p-4 mt-3 flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: 'linear-gradient(135deg, rgb(16 185 129 / 0.2), rgb(59 130 246 / 0.2))' }}
            >
              {(() => { const M = getIcon('MapPin'); return <M size={24} className="text-green-500" strokeWidth={2} />; })()}
            </div>
            <div className="flex-1">
              <p className="text-body text-primary font-semibold">{group.location_name}</p>
              <p className="text-foot text-secondary">{group.city}</p>
            </div>
            <button className="text-foot text-pink-500 font-semibold haptic">Map</button>
          </GlassCard>
        )}

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-2 mt-3">
          <GlassCard variant="thin" className="rounded-2xl p-3 text-center">
            <p className="text-title3 text-primary font-bold">{group.member_count}{group.max_members ? `/${group.max_members}` : ''}</p>
            <p className="text-caption text-tertiary mt-0.5">Members</p>
          </GlassCard>
          <GlassCard variant="thin" className="rounded-2xl p-3 text-center">
            <p className="text-title3 text-primary font-bold">{group.views}</p>
            <p className="text-caption text-tertiary mt-0.5">Views</p>
          </GlassCard>
          <GlassCard variant="thin" className="rounded-2xl p-3 text-center">
            <p className="text-title3 text-primary font-bold">{group.avg_cost ? `$${group.avg_cost}` : 'Free'}</p>
            <p className="text-caption text-tertiary mt-0.5">Per person</p>
          </GlassCard>
        </div>

        {/* Tags */}
        {group.tags && group.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {group.tags.map((tag) => (
              <span key={tag} className="text-foot text-secondary font-semibold px-3 py-1 rounded-full glass-thin glass-specular flex items-center gap-1">
                {(() => { const H = getIcon('Hash'); return <H size={12} className="text-tertiary" />; })()}
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Requirements */}
        <div className="mt-5">
          <h2 className="text-title2 text-primary font-bold mb-3">Requirements</h2>
          <GlassCard className="rounded-3xl p-4 space-y-3">
            <RequirementRow icon="TrendingUp" label="Minimum level" value={group.required_level ? `Level ${group.required_level}` : 'Any'} ok={levelOk} />
            <RequirementRow icon="Shield" label="Honor score" value={group.required_honor ? `${group.required_honor}+` : 'Any'} ok={honorOk} />
            <RequirementRow icon="Calendar" label="Age range" value={group.age_min && group.age_max ? `${group.age_min}-${group.age_max}` : 'Any'} ok={ageOk} />
            <RequirementRow icon="User" label="Gender" value={group.gender_preference && group.gender_preference !== 'any' ? group.gender_preference : 'Any'} ok={genderOk} />
            {group.premium_only && <RequirementRow icon="Crown" label="Membership" value="Premium only" ok={premiumOk} />}
          </GlassCard>
        </div>

        {/* Organizer */}
        <div className="mt-5">
          <h2 className="text-title2 text-primary font-bold mb-3">Organizer</h2>
          <button onClick={() => onOpenProfile(group.owner_id)} className="w-full text-left haptic">
            <GlassCard className="rounded-3xl p-4 flex items-center gap-3">
              <GlassAvatar src={group.owner?.avatar_url} name={`${group.owner?.first_name} ${group.owner?.last_name}`} size={52} online />
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-body text-primary font-bold">{group.owner?.first_name} {group.owner?.last_name}</p>
                  {group.owner?.is_verified && <GlassBadgeIcon icon="Verified" label="" color="blue" />}
                </div>
                <p className="text-foot text-secondary">@{group.owner?.username} · {group.owner?.job}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-tertiary">Level {group.owner?.level}</span>
                  <span className="text-[10px] text-tertiary">·</span>
                  <span className="text-[10px] text-tertiary">{group.owner?.reputation_level}</span>
                </div>
              </div>
              {(() => { const C = getIcon('ChevronRight'); return <C size={20} className="text-tertiary" />; })()}
            </GlassCard>
          </button>
        </div>

        {/* Members */}
        <div className="mt-5">
          <h2 className="text-title2 text-primary font-bold mb-3">Members ({groupMembers.length})</h2>
          <GlassCard className="rounded-3xl overflow-hidden">
            {groupMembers.map((m, i) => (
              <button
                key={m.id}
                onClick={() => onOpenProfile(m.user_id)}
                className={`flex items-center gap-3 px-4 py-3 w-full text-left haptic-soft ${i < groupMembers.length - 1 ? 'border-b border-current/5' : ''}`}
              >
                <GlassAvatar src={m.profile?.avatar_url} name={`${m.profile?.first_name} ${m.profile?.last_name}`} size={40} />
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sub text-primary font-semibold">{m.profile?.first_name} {m.profile?.last_name}</p>
                    {m.role === 'owner' && <GlassBadgeIcon icon="Crown" label="Host" color="amber" />}
                  </div>
                  <p className="text-foot text-tertiary">@{m.profile?.username}</p>
                </div>
                {(() => { const C = getIcon('ChevronRight'); return <C size={16} className="text-tertiary" />; })()}
              </button>
            ))}
          </GlassCard>
        </div>
      </div>

      </div>

      {/* Fixed action bar: the detail body scrolls above this control. */}
      <div className="shrink-0 px-5 pb-5 pt-3 z-30 bg-transparent animate-rise-d3">
        <GlassCard variant="thick" className="rounded-3xl p-3 flex items-center gap-3">
          {isOwner ? (
            <>
              <GlassButton variant="secondary" icon="Edit" onClick={() => {}} className="flex-1">Edit</GlassButton>
              <GlassButton variant="secondary" icon="Users" onClick={() => {}} className="flex-1">Manage</GlassButton>
            </>
          ) : isMember || myRequest?.status === 'accepted' ? (
            <>
              <GlassButton variant="secondary" icon="MessageCircle" onClick={handleStartChat} className="flex-1">Chat</GlassButton>
              <GlassButton variant="secondary" icon="CheckCircle2" onClick={() => {}} className="flex-1">Going</GlassButton>
            </>
          ) : myRequest?.status === 'pending' ? (
            <>
              <div className="flex-1 flex items-center justify-center gap-2 text-sub text-secondary font-semibold">
                {(() => { const C = getIcon('Clock'); return <C size={18} />; })()}
                Request pending
              </div>
              <GlassButton variant="secondary" icon="X" onClick={() => setShowCancel(true)}>Cancel</GlassButton>
            </>
          ) : (
            <GlassButton fullWidth size="lg" icon="UserPlus" onClick={() => setShowJoinSheet(true)} disabled={!eligible || full}>
              {!eligible ? 'Not eligible' : full ? 'Ekip full' : group.auto_accept ? 'Join now' : 'Request to join'}
            </GlassButton>
          )}
        </GlassCard>
      </div>

      {/* Join sheet */}
      <GlassSheet open={showJoinSheet} onClose={() => setShowJoinSheet(false)} title={group.auto_accept ? 'Join Ekip' : 'Request to join'}>
        {!eligible && reasons.length > 0 ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sub text-error">
              {(() => { const A = getIcon('AlertCircle'); return <A size={20} />; })()}
              You don't meet all requirements
            </div>
            {reasons.map((r) => (
              <div key={r} className="flex items-center gap-2 text-foot text-secondary">
                {(() => { const X = getIcon('XCircle'); return <X size={16} className="text-error" />; })()}
                {r}
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-body text-secondary">
              Add a message to introduce yourself to the organizer{(group.owner?.first_name ? `, ${group.owner.first_name}` : '')}.
            </p>
            <GlassInput multiline rows={4} placeholder="Hi! I'd love to join because..." value={joinMessage} onChange={setJoinMessage} />
            <GlassButton fullWidth size="lg" onClick={handleJoin} icon="Send">
              {group.auto_accept ? 'Join Ekip' : 'Send request'}
            </GlassButton>
          </div>
        )}
      </GlassSheet>

      {/* Share sheet */}
      <GlassSheet open={showShare} onClose={() => setShowShare(false)} title="Share Ekip">
        <div className="grid grid-cols-4 gap-3">
          {([
            { label: 'Copy Link', icon: 'Link' as IconName },
            { label: 'Messages', icon: 'MessageCircle' as IconName },
            { label: 'Mail', icon: 'Mail' as IconName },
            { label: 'More', icon: 'Share' as IconName },
          ]).map((s) => {
            const Icon = getIcon(s.icon);
            return (
              <button key={s.label} className="flex flex-col items-center gap-2 haptic">
                <div className="w-14 h-14 rounded-2xl glass glass-specular glass-edge flex items-center justify-center">
                  <Icon size={24} className="text-primary" strokeWidth={2} />
                </div>
                <span className="text-foot text-secondary font-medium">{s.label}</span>
              </button>
            );
          })}
        </div>
        <div className="mt-6">
          <GlassCard variant="thin" className="rounded-2xl p-3 flex items-center gap-2">
            <span className="text-foot text-secondary flex-1 truncate">ekip.app/g/{group.id}</span>
            <button className="text-foot text-pink-500 font-bold haptic">Copy</button>
          </GlassCard>
        </div>
      </GlassSheet>

      {/* Cancel request sheet */}
      <GlassSheet open={showCancel} onClose={() => setShowCancel(false)} title="Cancel request?">
        <div className="space-y-4">
          <p className="text-body text-secondary">You'll need to send a new request if you change your mind.</p>
          <div className="flex gap-2">
            <GlassButton fullWidth variant="secondary" onClick={() => setShowCancel(false)}>Keep request</GlassButton>
            <GlassButton fullWidth variant="danger" onClick={handleCancelRequest}>Cancel request</GlassButton>
          </div>
        </div>
      </GlassSheet>

      {/* Toast */}
      {toast && (
        <div className="absolute inset-0 z-[70] flex items-center justify-center p-6 pointer-events-none">
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

function RequirementRow({ icon, label, value, ok }: { icon: IconName; label: string; value: string; ok: boolean }) {
  const Icon = getIcon(icon);
  const Check = getIcon('CheckCircle2');
  const X = getIcon('XCircle');
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg glass-thin glass-specular flex items-center justify-center shrink-0">
        <Icon size={16} className="text-secondary" strokeWidth={2} />
      </div>
      <span className="text-sub text-secondary flex-1">{label}</span>
      <span className="text-sub text-primary font-semibold">{value}</span>
      {ok ? <Check size={18} className="text-green-500" strokeWidth={2.2} /> : <X size={18} className="text-red-500" strokeWidth={2.2} />}
    </div>
  );
}
