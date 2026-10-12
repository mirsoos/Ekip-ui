import { useState } from 'react';
import { useAppData } from '@/lib/appData';
import { GlassCard, GlassButton, GlassAvatar, GlassBadgeIcon, GlassProgress, GlassSegmented, GlassListItem, GlassEmpty } from '@/components/Glass';
import { GlassSheet } from '@/components/Overlays';
import { getIcon, type IconName } from '@/lib/icons';
import { useTheme } from '@/lib/theme';
import type { Group, Profile } from '@/types/database';

interface ProfileScreenProps {
  userId: string;
  isOwnProfile: boolean;
  onBack?: () => void;
  onOpenGroup: (group: Group) => void;
  onOpenSettings: () => void;
}

export function ProfileScreen({ userId, isOwnProfile, onBack, onOpenGroup, onOpenSettings }: ProfileScreenProps) {
  const { me, profiles, groups, members, badges, missions, friends, addFriend, updateFriend, addNotification } = useAppData();
  const { theme, toggle } = useTheme();
  const [tab, setTab] = useState('activity');
  const [showActions, setShowActions] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showBlock, setShowBlock] = useState(false);
  const [toast, setToast] = useState('');

  const profile = profiles.find((p) => p.id === userId) ?? me;
  const isMe = profile.id === 'me';

  const myGroups = groups.filter((g) => {
    if (isMe) return g.owner_id === 'me' || members.some((m) => m.group_id === g.id && m.user_id === 'me' && m.status === 'active');
    return g.owner_id === profile.id;
  });

  const myBadges = badges.filter((b) => b.user_id === profile.id || (isMe && b.user_id === 'me'));
  const myMissions = missions.filter((m) => m.user_id === profile.id || isMe);
  const myFriends = friends.filter((f) => (f.user_id === profile.id || f.friend_id === profile.id) && f.status === 'accepted');
  const existingFriend = friends.find((f) => f.friend_id === profile.id || (f.user_id === profile.id && f.friend_id === 'me'));

  const xpPct = (profile.xp / profile.xp_to_next) * 100;
  const Back = getIcon('ArrowLeft');

  const handleAddFriend = () => {
    if (existingFriend) {
      updateFriend(existingFriend.id, 'accepted');
      setToast('Friend request accepted');
    } else {
      addFriend(profile.id);
      setToast('Friend added');
    }
    addNotification({ type: 'friend_request', title: 'Friend update', body: `You are now friends with ${profile.first_name}.`, icon: 'UserCheck' });
    setShowActions(false);
    setTimeout(() => setToast(''), 2500);
  };

  return (
    <div className={`relative h-full overflow-y-auto no-scrollbar screen-enter-items ${isOwnProfile ? 'pb-32' : 'pb-8'}`}>
      {/* Banner */}
      <div className="relative h-44 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center scale-110" style={{ backgroundImage: `url(${profile.banner_url})` }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgb(0 0 0 / 0.2) 0%, transparent 40%, rgb(var(--bg-canvas) / 0.6))' }} />
        {!isOwnProfile && (
          <button onClick={onBack} className={`absolute top-4 left-4 w-10 h-10 rounded-full glass-thick glass-specular glass-edge flex items-center justify-center haptic z-10 ${theme === 'dark' ? 'text-white' : 'text-primary'}`}>
            <Back size={20} strokeWidth={2.2} />
          </button>
        )}
        {isOwnProfile && (
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            <button onClick={toggle} className={`w-10 h-10 rounded-full glass-thick glass-specular glass-edge flex items-center justify-center haptic ${theme === 'dark' ? 'text-white' : 'text-primary'}`}>
              {(() => { const I = getIcon(theme === 'dark' ? 'Sun' : 'Moon'); return <I size={18} strokeWidth={2.2} />; })()}
            </button>
            <button onClick={onOpenSettings} className={`w-10 h-10 rounded-full glass-thick glass-specular glass-edge flex items-center justify-center haptic ${theme === 'dark' ? 'text-white' : 'text-primary'}`}>
              {(() => { const I = getIcon('Settings'); return <I size={18} strokeWidth={2.2} />; })()}
            </button>
          </div>
        )}
      </div>

      {/* Profile header */}
      <div className="px-5 -mt-12 relative z-10">
        <div className="flex items-end justify-between">
          <GlassAvatar src={profile.avatar_url} name={`${profile.first_name} ${profile.last_name}`} size={96} />
          {!isOwnProfile && (
            <div className="flex gap-2 mb-2">
              <button onClick={() => setShowActions(true)} className="w-10 h-10 rounded-full glass glass-specular glass-edge flex items-center justify-center haptic">
                {(() => { const I = getIcon('MoreHorizontal'); return <I size={20} className="text-primary" strokeWidth={2.2} />; })()}
              </button>
              <GlassButton size="sm" icon="UserPlus" onClick={handleAddFriend}>
                {existingFriend?.status === 'accepted' ? 'Friends' : existingFriend?.status === 'pending' ? 'Accept' : 'Add'}
              </GlassButton>
            </div>
          )}
        </div>

        <div className="mt-3">
          <div className="flex items-center gap-2">
            <h1 className="text-title1 text-primary font-bold">{profile.first_name} {profile.last_name}</h1>
            {profile.is_verified && <GlassBadgeIcon icon="Verified" label="" color="blue" />}
            {profile.is_premium && <GlassBadgeIcon icon="Crown" label="Premium" color="amber" />}
          </div>
          <p className="text-sub text-secondary">@{profile.username}</p>
          {profile.bio && <p className="text-body text-secondary mt-2 leading-relaxed">{profile.bio}</p>}

          {/* Quick info */}
          <div className="flex flex-wrap gap-2 mt-3">
            {profile.age && <InfoPill icon="Calendar" label={`${profile.age} yrs`} />}
            {profile.gender && <InfoPill icon="User" label={profile.gender} />}
            {profile.city && <InfoPill icon="MapPin" label={profile.city} />}
            {profile.job && <InfoPill icon="Briefcase" label={profile.job} />}
            {profile.personality_type && <InfoPill icon="Sparkles" label={profile.personality_type} />}
          </div>

          {/* Mood */}
          {profile.mood && (
            <GlassCard variant="thin" className="rounded-2xl p-3 mt-3 flex items-center gap-2">
              {(() => { const I = getIcon('Smile'); return <I size={18} className="text-pink-500" />; })()}
              <span className="text-foot text-tertiary">Feeling</span>
              <span className="text-foot text-primary font-semibold">{profile.mood}</span>
            </GlassCard>
          )}
        </div>

        {/* Level + XP */}
        <GlassCard className="rounded-3xl p-4 mt-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, rgb(244 114 182), rgb(59 130 246))' }}
              >
                <span className="text-body text-white font-bold">{profile.level}</span>
              </div>
              <div>
                <p className="text-sub text-primary font-bold">Level {profile.level}</p>
                <p className="text-foot text-tertiary">{profile.xp} / {profile.xp_to_next} XP</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sub text-primary font-bold">{profile.honor_score}</p>
              <p className="text-foot text-tertiary">{profile.reputation_level}</p>
            </div>
          </div>
          <GlassProgress value={profile.xp} max={profile.xp_to_next} />
          <div className="flex items-center gap-1.5 mt-2">
            {(() => { const S = getIcon('Shield'); return <S size={14} className="text-green-500" />; })()}
            <span className="text-foot text-tertiary">Honor score</span>
            <span className="text-foot text-primary font-semibold ml-auto">{profile.honor_score}/100</span>
          </div>
        </GlassCard>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mt-3">
          <GlassCard variant="thin" className="rounded-2xl p-3 text-center">
            <p className="text-title3 text-primary font-bold">{myGroups.length}</p>
            <p className="text-caption text-tertiary mt-0.5">Ekips</p>
          </GlassCard>
          <GlassCard variant="thin" className="rounded-2xl p-3 text-center">
            <p className="text-title3 text-primary font-bold">{myFriends.length}</p>
            <p className="text-caption text-tertiary mt-0.5">Friends</p>
          </GlassCard>
          <GlassCard variant="thin" className="rounded-2xl p-3 text-center">
            <p className="text-title3 text-primary font-bold">{myBadges.filter((b) => b.earned_at).length}</p>
            <p className="text-caption text-tertiary mt-0.5">Badges</p>
          </GlassCard>
        </div>

        {/* Tabs */}
        <div className="mt-5">
          <GlassSegmented
            options={[
              { label: 'Activity', value: 'activity' },
              { label: 'Badges', value: 'badges' },
              { label: 'Missions', value: 'missions' },
              { label: 'About', value: 'about' },
            ]}
            value={tab}
            onChange={setTab}
          />
        </div>

        {/* Tab content */}
        <div className="mt-4">
          {tab === 'activity' && (
            <div className="space-y-3 animate-rise">
              {myGroups.length === 0 ? (
                <GlassEmpty icon="Layers" title="No Ekips yet" subtitle={isMe ? 'Create or join an Ekip to see it here.' : undefined} />
              ) : (
                myGroups.map((g) => (
                  <button key={g.id} onClick={() => onOpenGroup(g)} className="w-full text-left haptic">
                    <GlassCard variant="thin" className="rounded-3xl overflow-hidden">
                      <div className="flex gap-3 p-3">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 bg-cover bg-center" style={{ backgroundImage: `url(${g.cover_url})` }} />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sub text-primary font-semibold truncate">{g.title}</h3>
                          <p className="text-foot text-tertiary mt-0.5">{new Date(g.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {g.city}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-caption text-tertiary">{g.member_count} members</span>
                            {g.owner_id === profile.id && <GlassBadgeIcon icon="Crown" label="Host" color="amber" />}
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </button>
                ))
              )}
            </div>
          )}

          {tab === 'badges' && (
            <div className="grid grid-cols-3 gap-3 animate-rise">
              {myBadges.map((b) => {
                const Icon = getIcon(b.icon as IconName);
                const earned = !!b.earned_at;
                const colorMap: Record<string, string> = {
                  pink: 'rgb(244 114 182)', blue: 'rgb(59 130 246)', green: 'rgb(34 197 94)',
                  amber: 'rgb(234 179 8)', purple: 'rgb(168 85 247)',
                };
                return (
                  <GlassCard key={b.id} variant="thin" className={`rounded-2xl p-3 flex flex-col items-center text-center ${earned ? '' : 'opacity-40'}`}>
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center mb-2"
                      style={{ background: earned ? `${colorMap[b.color]}30` : 'rgb(var(--glass-tint) / 0.1)' }}
                    >
                      <Icon size={24} strokeWidth={2} style={{ color: earned ? colorMap[b.color] : 'rgb(var(--text-tertiary))' }} />
                    </div>
                    <p className="text-foot text-primary font-bold leading-tight">{b.name}</p>
                    <p className="text-[10px] text-tertiary mt-0.5">{b.description}</p>
                  </GlassCard>
                );
              })}
            </div>
          )}

          {tab === 'missions' && (
            <div className="space-y-3 animate-rise">
              {myMissions.map((m) => {
                const Icon = getIcon(m.icon as IconName);
                return (
                  <GlassCard key={m.id} className="rounded-3xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl glass-thin glass-specular flex items-center justify-center shrink-0">
                        <Icon size={20} className={m.is_complete ? 'text-green-500' : 'text-pink-500'} strokeWidth={2} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sub text-primary font-bold">{m.title}</p>
                        <p className="text-foot text-tertiary">{m.description}</p>
                      </div>
                      <div className="flex items-center gap-1 text-foot font-bold text-pink-500">
                        {(() => { const Z = getIcon('Zap'); return <Z size={14} />; })()}
                        +{m.xp_reward}
                      </div>
                    </div>
                    {!m.is_complete && (
                      <div className="mt-3">
                        <GlassProgress value={m.progress} max={m.target} color="accent" />
                        <p className="text-foot text-tertiary mt-1">{m.progress} / {m.target}</p>
                      </div>
                    )}
                    {m.is_complete && (
                      <div className="flex items-center gap-1 mt-2 text-foot text-green-500 font-semibold">
                        {(() => { const C = getIcon('CheckCircle2'); return <C size={14} />; })()}
                        Completed
                      </div>
                    )}
                  </GlassCard>
                );
              })}
            </div>
          )}

          {tab === 'about' && (
            <div className="space-y-3 animate-rise">
              {profile.interests && profile.interests.length > 0 && (
                <div>
                  <p className="text-foot text-secondary font-semibold ml-1 mb-2">Interests</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((i) => (
                      <span key={i} className="text-foot text-secondary font-semibold px-3 py-1 rounded-full glass-thin glass-specular">{i}</span>
                    ))}
                  </div>
                </div>
              )}
              {profile.social_links && Object.keys(profile.social_links).length > 0 && (
                <div>
                  <p className="text-foot text-secondary font-semibold ml-1 mb-2 mt-4">Social links</p>
                  <GlassCard className="rounded-3xl overflow-hidden">
                    {Object.entries(profile.social_links).map(([platform, handle], i, arr) => (
                      <div key={platform} className={`px-4 py-3 flex items-center gap-3 ${i < arr.length - 1 ? 'border-b border-current/5' : ''}`}>
                        <div className="w-8 h-8 rounded-lg glass-thin glass-specular flex items-center justify-center">
                          {(() => { const I = getIcon('Globe'); return <I size={16} className="text-secondary" />; })()}
                        </div>
                        <span className="text-sub text-primary font-semibold capitalize">{platform}</span>
                        <span className="text-foot text-tertiary ml-auto">@{handle}</span>
                      </div>
                    ))}
                  </GlassCard>
                </div>
              )}
              <div>
                <p className="text-foot text-secondary font-semibold ml-1 mb-2 mt-4">Verification</p>
                <GlassCard className="rounded-3xl p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    {(() => { const I = getIcon('Verified'); return <I size={20} className={profile.is_verified ? 'text-blue-500' : 'text-tertiary'} />; })()}
                    <span className="text-sub text-primary font-semibold flex-1">Verified profile</span>
                    {profile.is_verified ? (
                      <GlassBadgeIcon icon="CheckCircle2" label="Active" color="green" />
                    ) : (
                      <span className="text-foot text-tertiary">Pending</span>
                    )}
                  </div>
                  <div className="h-px bg-current/5" />
                  <div className="flex items-center gap-3">
                    {(() => { const I = getIcon('ShieldCheck'); return <I size={20} className={profile.is_identity_verified ? 'text-green-500' : 'text-tertiary'} />; })()}
                    <span className="text-sub text-primary font-semibold flex-1">Identity verified</span>
                    {profile.is_identity_verified ? (
                      <GlassBadgeIcon icon="CheckCircle2" label="Active" color="green" />
                    ) : (
                      <span className="text-foot text-tertiary">Not verified</span>
                    )}
                  </div>
                </GlassCard>
              </div>
              <p className="text-foot text-tertiary text-center mt-6">
                Member since {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Actions sheet (other user's profile) */}
      <GlassSheet open={showActions} onClose={() => setShowActions(false)} title="Actions">
        <div className="space-y-2">
          <ActionRow icon="Share" label="Share profile" onClick={() => { setShowActions(false); }} />
          <ActionRow icon="UserPlus" label={existingFriend?.status === 'accepted' ? 'Already friends' : 'Add friend'} onClick={handleAddFriend} disabled={existingFriend?.status === 'accepted'} />
          <div className="h-px bg-current/5 my-2" />
          <ActionRow icon="Flag" label="Report user" danger onClick={() => { setShowActions(false); setShowReport(true); }} />
          <ActionRow icon="Ban" label="Block user" danger onClick={() => { setShowActions(false); setShowBlock(true); }} />
        </div>
      </GlassSheet>

      {/* Report sheet */}
      <GlassSheet open={showReport} onClose={() => setShowReport(false)} title="Report user?">
        <div className="space-y-4">
          <p className="text-body text-secondary">Your report will be reviewed by our team. {profile.first_name} won't know it was you.</p>
          <div className="flex gap-2">
            <GlassButton fullWidth variant="secondary" onClick={() => setShowReport(false)}>Cancel</GlassButton>
            <GlassButton fullWidth variant="danger" onClick={() => { setShowReport(false); setToast('Report submitted'); setTimeout(() => setToast(''), 2500); }}>Report</GlassButton>
          </div>
        </div>
      </GlassSheet>

      {/* Block sheet */}
      <GlassSheet open={showBlock} onClose={() => setShowBlock(false)} title={`Block ${profile.first_name}?`}>
        <div className="space-y-4">
          <p className="text-body text-secondary">They won't be able to find you, message you, or see your profile.</p>
          <div className="flex gap-2">
            <GlassButton fullWidth variant="secondary" onClick={() => setShowBlock(false)}>Cancel</GlassButton>
            <GlassButton fullWidth variant="danger" onClick={() => { setShowBlock(false); setToast('User blocked'); setTimeout(() => setToast(''), 2500); }}>Block</GlassButton>
          </div>
        </div>
      </GlassSheet>

      {/* Toast */}
      {toast && (
        <div className="absolute inset-0 flex items-center justify-center p-6 z-[70] animate-pop pointer-events-none">
          <div className="glass-thick glass-specular glass-edge rounded-2xl px-4 py-3 flex items-center gap-2.5">
            {(() => { const I = getIcon('CheckCircle2'); return <I size={20} className="text-green-500" strokeWidth={2.2} />; })()}
            <span className="text-sub text-primary font-medium">{toast}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoPill({ icon, label }: { icon: IconName; label: string }) {
  const Icon = getIcon(icon);
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-thin glass-specular">
      <Icon size={13} className="text-tertiary" strokeWidth={2.2} />
      <span className="text-foot text-secondary font-semibold capitalize">{label}</span>
    </div>
  );
}

function ActionRow({ icon, label, onClick, danger, disabled }: { icon: IconName; label: string; onClick: () => void; danger?: boolean; disabled?: boolean }) {
  const Icon = getIcon(icon);
  return (
    <button onClick={onClick} disabled={disabled} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl glass-thin glass-specular haptic-soft ${disabled ? 'opacity-40' : ''}`}>
      <Icon size={20} className={danger ? 'text-red-500' : 'text-secondary'} strokeWidth={2.2} />
      <span className={`text-body font-semibold ${danger ? 'text-red-500' : 'text-primary'}`}>{label}</span>
    </button>
  );
}
