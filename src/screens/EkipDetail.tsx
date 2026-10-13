import { useState } from 'react';
import { useAppData } from '@/lib/appData';
import { GlassButton } from '@/components/Glass';
import { GlassSheet, Toast } from '@/components/Overlays';
import { getIcon, type IconName } from '@/lib/icons';
import { EkipDetailHeader } from '@/components/ekip/EkipDetailHeader';
import { EkipEventInfoCard } from '@/components/ekip/EkipEventInfoCard';
import { EkipHostCard } from '@/components/ekip/EkipHostCard';
import { EkipMembersSection } from '@/components/ekip/EkipMembersSection';
import { EkipRequirementsCard } from '@/components/ekip/EkipRequirementsCard';
import { EkipActionBar } from '@/components/ekip/EkipActionBar';
import { EkipJoinModal } from '@/components/ekip/EkipJoinModal';
import { EkipShareSheet } from '@/components/ekip/EkipShareSheet';
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
  const { me, members, requests, addRequest, updateRequest, addNotification, conversations } = useAppData();
  const [showJoinSheet, setShowJoinSheet] = useState(false);
  const [joinMessage, setJoinMessage] = useState('');
  const [showShare, setShowShare] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [toast, setToast] = useState('');

  const CatIcon = getIcon(categoryIcons[group.category] ?? 'PartyPopper');
  const Hash = getIcon('Hash');
  const groupMembers = members.filter((m) => m.group_id === group.id && m.status === 'active');
  const myRequest = requests.find((r) => r.group_id === group.id && r.user_id === 'me');
  const isOwner = group.owner_id === 'me';
  const isMember = groupMembers.some((m) => m.user_id === 'me');

  // Eligibility check
  const levelOk = !group.required_level || me.level >= group.required_level;
  const honorOk = !group.required_honor || me.honor_score >= group.required_honor;
  const ageOk = (!group.age_min || (me.age ?? 0) >= group.age_min) && (!group.age_max || (me.age ?? 0) <= group.age_max);
  const genderOk = !group.gender_preference || group.gender_preference === 'any' || me.gender === group.gender_preference;
  const premiumOk = !group.premium_only || me.is_premium;
  const eligible = levelOk && honorOk && ageOk && genderOk && premiumOk;
  const spotsLeft = group.max_members ? group.max_members - group.member_count : null;
  const full = spotsLeft !== null && spotsLeft <= 0;

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
      addNotification({
        type: 'group_request',
        title: 'Joined Ekip',
        body: `You are now a member of ${group.title}!`,
        icon: 'Users',
      });
      setToast('Joined Ekip!');
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
      setToast('Request sent to organizer');
    }
    setShowJoinSheet(false);
    setTimeout(() => setToast(''), 2500);
  };

  const handleCancelRequest = () => {
    if (myRequest) {
      updateRequest(myRequest.id, 'rejected');
      setToast('Request canceled');
      setShowCancel(false);
      setTimeout(() => setToast(''), 2500);
    }
  };

  const handleStartChat = () => {
    const existing = conversations.find((c) => c.group_id === group.id);
    if (existing) onOpenChat(existing.id);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden relative">
      <div className="flex-1 overflow-y-auto no-scrollbar relative screen-enter-items">
        {/* Cover with liquid header buttons */}
        <EkipDetailHeader
          coverUrl={group.cover_url}
          onBack={onBack}
          onShare={() => setShowShare(true)}
        />

        {/* Content Body */}
        <div className="px-5 -mt-8 relative z-10 space-y-4 pb-8">
          {/* Category badges */}
          <div className="flex gap-2">
            <div className="glass-thin glass-specular rounded-full px-3 py-1 flex items-center gap-1.5">
              <CatIcon size={12} className="text-white" strokeWidth={2.4} />
              <span className="text-caption text-white font-bold uppercase">{group.category}</span>
            </div>
            <div className="glass-thin glass-specular rounded-full px-3 py-1">
              <span className="text-caption text-white font-bold uppercase">{group.group_type}</span>
            </div>
            {group.is_repeating && (
              <div className="glass-thin glass-specular rounded-full px-3 py-1">
                <span className="text-caption text-white font-bold uppercase">Repeating</span>
              </div>
            )}
          </div>

          <h1 className="text-title1 text-primary font-bold leading-tight">{group.title}</h1>
          <p className="text-body text-secondary leading-relaxed">{group.description}</p>

          {/* Event info card */}
          <EkipEventInfoCard group={group} />

          {/* Host profile card */}
          {group.owner && (
            <div>
              <h2 className="text-title3 text-primary font-bold mb-2">Organizer</h2>
              <EkipHostCard host={group.owner} onOpenProfile={() => onOpenProfile(group.owner_id)} />
            </div>
          )}

          {/* Requirements card */}
          <EkipRequirementsCard group={group} user={me} />

          {/* Members horizontal section */}
          <EkipMembersSection
            members={groupMembers}
            memberCount={group.member_count}
            maxMembers={group.max_members}
            onOpenProfile={onOpenProfile}
          />

          {/* Tags */}
          {group.tags && group.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {group.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-foot text-secondary font-medium px-3 py-1 rounded-full glass-thin glass-specular flex items-center gap-1"
                >
                  <Hash size={12} className="text-tertiary" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Bar */}
      <EkipActionBar
        isOwner={isOwner}
        isMember={isMember}
        myRequest={myRequest}
        eligible={eligible}
        full={full}
        autoAccept={group.auto_accept}
        onStartChat={handleStartChat}
        onOpenJoinSheet={() => setShowJoinSheet(true)}
        onCancelRequest={() => setShowCancel(true)}
      />

      {/* Join Sheet */}
      <EkipJoinModal
        open={showJoinSheet}
        group={group}
        eligible={eligible}
        message={joinMessage}
        onChangeMessage={setJoinMessage}
        onSubmit={handleJoin}
        onClose={() => setShowJoinSheet(false)}
      />

      {/* Share Sheet */}
      <EkipShareSheet
        open={showShare}
        groupId={group.id}
        onClose={() => setShowShare(false)}
        onCopy={() => {
          setToast('Link copied to clipboard!');
          setShowShare(false);
          setTimeout(() => setToast(''), 2500);
        }}
      />

      {/* Cancel Request Sheet */}
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
      <Toast message={toast} visible={Boolean(toast)} />
    </div>
  );
}
