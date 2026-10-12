import { useState } from 'react';
import { useAppData } from '@/lib/appData';
import { GlassButton, GlassCard, GlassInput, GlassChip, GlassSegmented, GlassToggle } from '@/components/Glass';
import { getIcon, type IconName } from '@/lib/icons';
import { cities, allInterests } from '@/lib/demoData';
import type { Group, GroupCategory, GroupType } from '@/types/database';

interface CreateScreenProps {
  onBack: () => void;
  onCreated: (group: Group) => void;
}

const coverOptions = [
  'https://images.pexels.com/photos/167964/pexels-photo-167964.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
  'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
  'https://images.pexels.com/photos/884600/pexels-photo-884600.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
  'https://images.pexels.com/photos/1654748/pexels-photo-1654748.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
  'https://images.pexels.com/photos/1677256/pexels-photo-1677256.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
  'https://images.pexels.com/photos/6952383/pexels-photo-6952383.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
];

export function CreateScreen({ onBack, onCreated }: CreateScreenProps) {
  const { me, addGroup, addNotification } = useAppData();
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<GroupCategory>('entertainment');
  const [groupType, setGroupType] = useState<GroupType>('group');
  const [minMembers, setMinMembers] = useState('2');
  const [maxMembers, setMaxMembers] = useState('10');
  const [city, setCity] = useState(me.city ?? 'San Francisco');
  const [locationName, setLocationName] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [ageMin, setAgeMin] = useState('');
  const [ageMax, setAgeMax] = useState('');
  const [requiredLevel, setRequiredLevel] = useState('');
  const [requiredHonor, setRequiredHonor] = useState('');
  const [genderPref, setGenderPref] = useState('any');
  const [avgCost, setAvgCost] = useState('');
  const [coverUrl, setCoverUrl] = useState(coverOptions[0]);
  const [premiumOnly, setPremiumOnly] = useState(false);
  const [autoAccept, setAutoAccept] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [showAI, setShowAI] = useState(false);

  const Back = getIcon('ArrowLeft');
  const Sparkles = getIcon('Sparkles');
  const totalSteps = 4;

  const canProceed = () => {
    if (step === 0) return title.trim().length > 2 && description.trim().length > 5;
    if (step === 1) return category && groupType && minMembers && city;
    if (step === 2) return true; // optional step
    if (step === 3) return eventDate && eventTime;
    return true;
  };

  const toggleTag = (tag: string) => {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const handleCreate = () => {
    const newGroup: Group = {
      id: `g-${Date.now()}`,
      owner_id: 'me',
      title: title.trim(),
      description: description.trim(),
      category,
      group_type: groupType,
      min_members: parseInt(minMembers) || 2,
      max_members: maxMembers ? parseInt(maxMembers) : null,
      city,
      location_name: locationName || null,
      latitude: null,
      longitude: null,
      tags: tags.length ? tags : null,
      age_min: ageMin ? parseInt(ageMin) : null,
      age_max: ageMax ? parseInt(ageMax) : null,
      required_level: requiredLevel ? parseInt(requiredLevel) : null,
      required_honor: requiredHonor ? parseInt(requiredHonor) : null,
      gender_preference: genderPref as Group['gender_preference'],
      avg_cost: avgCost ? parseFloat(avgCost) : null,
      cover_url: coverUrl,
      premium_only: premiumOnly,
      visibility: 'public',
      auto_accept: autoAccept,
      is_repeating: isRepeating,
      event_date: new Date(`${eventDate}T${eventTime}`).toISOString(),
      views: 0,
      member_count: 1,
      created_at: new Date().toISOString(),
      owner: me,
    };
    addGroup(newGroup);
    addNotification({
      type: 'achievement',
      title: 'Ekip created!',
      body: `Your Ekip "${title}" is now live. +50 XP earned.`,
      icon: 'Rocket',
    });
    onCreated(newGroup);
  };

  const aiSuggestions = [
    'Add a catchy title like "Sunset Yoga in the Park"',
    'Include 3-5 tags to help people discover your Ekip',
    'Set an age range to attract the right crowd',
    'Add a location for better discoverability',
    'Enable auto-accept to fill spots faster',
  ];

  return (
    <div className="relative h-full flex flex-col screen-enter-items">
      {/* Header */}
      <div className="shrink-0 px-5 pt-4 pb-2 z-20">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="w-10 h-10 rounded-full glass glass-specular flex items-center justify-center haptic">
            <Back size={18} className="text-primary" strokeWidth={2.2} />
          </button>
          <h1 className="text-title1 text-primary font-bold">Create an Ekip</h1>
        </div>
        {/* Progress */}
        <div className="flex gap-1.5">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className="flex-1 h-1.5 rounded-full transition-all duration-500"
              style={{
                background: i <= step ? 'linear-gradient(90deg, rgb(244 114 182), rgb(59 130 246))' : 'rgb(var(--glass-tint) / 0.2)',
              }}
            />
          ))}
        </div>
        <p className="text-foot text-tertiary mt-2">Step {step + 1} of {totalSteps}</p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto no-scrollbar px-5 mt-4 pb-4">
        {/* AI banner */}
        {step === 0 && (
          <button onClick={() => setShowAI(!showAI)} className="w-full text-left mb-4 haptic">
            <GlassCard glow className="rounded-3xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, rgb(244 114 182 / 0.3), rgb(59 130 246 / 0.3))' }}>
                <Sparkles size={20} className="text-pink-500" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <p className="text-sub text-primary font-bold">AI suggestions</p>
                <p className="text-foot text-secondary">Tap for tips to improve your Ekip</p>
              </div>
            </GlassCard>
          </button>
        )}

        {showAI && step === 0 && (
          <GlassCard variant="thin" className="rounded-3xl p-4 mb-4 animate-rise">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={16} className="text-pink-500" />
              <span className="text-foot text-primary font-bold">AI recommendations</span>
            </div>
            <div className="space-y-2">
              {aiSuggestions.map((s, i) => (
                <div key={i} className="flex items-start gap-2 text-foot text-secondary">
                  {(() => { const C = getIcon('CircleDot'); return <C size={14} className="text-pink-500 mt-0.5 shrink-0" />; })()}
                  {s}
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        {/* Step 0: Basics */}
        {step === 0 && (
          <div className="space-y-4 animate-rise">
            <div>
              <label className="text-foot text-secondary font-semibold ml-1">Title</label>
              <GlassInput placeholder="Give your Ekip a name" value={title} onChange={setTitle} className="mt-1.5" />
            </div>
            <div>
              <label className="text-foot text-secondary font-semibold ml-1">Description</label>
              <GlassInput multiline rows={4} placeholder="What's the plan? What should people expect?" value={description} onChange={setDescription} className="mt-1.5" />
            </div>
            <div>
              <label className="text-foot text-secondary font-semibold ml-1">Cover image</label>
              <div className="grid grid-cols-3 gap-2 mt-1.5">
                {coverOptions.map((url) => (
                  <button
                    key={url}
                    onClick={() => setCoverUrl(url)}
                    className={`relative h-20 rounded-2xl overflow-hidden haptic ${coverUrl === url ? 'ring-2 ring-pink-500' : ''}`}
                  >
                    <img src={url} alt="cover" className="w-full h-full object-cover" />
                    {coverUrl === url && (
                      <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgb(244 114 182 / 0.3)' }}>
                        {(() => { const C = getIcon('Check'); return <C size={20} className="text-white" strokeWidth={3} />; })()}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Category + Type */}
        {step === 1 && (
          <div className="space-y-5 animate-rise">
            <div>
              <label className="text-foot text-secondary font-semibold ml-1">Category</label>
              <div className="grid grid-cols-2 gap-3 mt-1.5">
                {([
                  { value: 'entertainment', label: 'Entertainment', icon: 'PartyPopper' as IconName, desc: 'Fun, social, leisure' },
                  { value: 'work', label: 'Work', icon: 'Briefcase' as IconName, desc: 'Professional, networking' },
                ]).map((c) => {
                  const Icon = getIcon(c.icon);
                  const active = category === c.value;
                  return (
                    <button key={c.value} onClick={() => setCategory(c.value as GroupCategory)} className="haptic">
                      <GlassCard variant={active ? 'default' : 'thin'} className={`rounded-3xl p-4 text-left ${active ? 'ring-2 ring-pink-500' : ''}`}>
                        <Icon size={28} className={active ? 'text-pink-500' : 'text-tertiary'} strokeWidth={2} />
                        <p className="text-body text-primary font-bold mt-2">{c.label}</p>
                        <p className="text-foot text-tertiary">{c.desc}</p>
                      </GlassCard>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-foot text-secondary font-semibold ml-1">Group type</label>
              <GlassSegmented
                className="mt-1.5"
                options={[
                  { label: 'Solo', value: 'solo', icon: 'User' },
                  { label: 'Couple', value: 'couple', icon: 'Heart' },
                  { label: 'Group', value: 'group', icon: 'Users' },
                ]}
                value={groupType}
                onChange={(v) => setGroupType(v as GroupType)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-foot text-secondary font-semibold ml-1">Min members</label>
                <GlassInput type="number" placeholder="2" value={minMembers} onChange={setMinMembers} className="mt-1.5" />
              </div>
              <div>
                <label className="text-foot text-secondary font-semibold ml-1">Max members</label>
                <GlassInput type="number" placeholder="10" value={maxMembers} onChange={setMaxMembers} className="mt-1.5" />
              </div>
            </div>

            <div>
              <label className="text-foot text-secondary font-semibold ml-1">City</label>
              <div className="flex flex-wrap gap-2 mt-1.5">
                {cities.slice(0, 6).map((c) => (
                  <GlassChip key={c} active={city === c} onClick={() => setCity(c)}>{c}</GlassChip>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Optional details */}
        {step === 2 && (
          <div className="space-y-5 animate-rise">
            <div>
              <label className="text-foot text-secondary font-semibold ml-1">Location (optional)</label>
              <GlassInput icon="MapPin" placeholder="Venue or address" value={locationName} onChange={setLocationName} className="mt-1.5" />
            </div>

            <div>
              <label className="text-foot text-secondary font-semibold ml-1">Tags</label>
              <div className="flex flex-wrap gap-2 mt-1.5">
                {allInterests.slice(0, 12).map((t) => (
                  <GlassChip key={t} active={tags.includes(t)} onClick={() => toggleTag(t)}>{t}</GlassChip>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-foot text-secondary font-semibold ml-1">Age min</label>
                <GlassInput type="number" placeholder="18" value={ageMin} onChange={setAgeMin} className="mt-1.5" />
              </div>
              <div>
                <label className="text-foot text-secondary font-semibold ml-1">Age max</label>
                <GlassInput type="number" placeholder="50" value={ageMax} onChange={setAgeMax} className="mt-1.5" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-foot text-secondary font-semibold ml-1">Min level</label>
                <GlassInput type="number" placeholder="1" value={requiredLevel} onChange={setRequiredLevel} className="mt-1.5" />
              </div>
              <div>
                <label className="text-foot text-secondary font-semibold ml-1">Min honor</label>
                <GlassInput type="number" placeholder="50" value={requiredHonor} onChange={setRequiredHonor} className="mt-1.5" />
              </div>
            </div>

            <div>
              <label className="text-foot text-secondary font-semibold ml-1">Gender preference</label>
              <GlassSegmented
                className="mt-1.5"
                options={[
                  { label: 'Any', value: 'any' },
                  { label: 'Male', value: 'male' },
                  { label: 'Female', value: 'female' },
                ]}
                value={genderPref}
                onChange={setGenderPref}
              />
            </div>

            <div>
              <label className="text-foot text-secondary font-semibold ml-1">Avg cost per person ($)</label>
              <GlassInput type="number" placeholder="0" value={avgCost} onChange={setAvgCost} className="mt-1.5" />
            </div>

            <GlassCard className="rounded-3xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sub text-primary font-semibold">Auto-accept</p>
                  <p className="text-foot text-tertiary">Let people join without approval</p>
                </div>
                <GlassToggle checked={autoAccept} onChange={setAutoAccept} />
              </div>
              <div className="h-px bg-current/5" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sub text-primary font-semibold">Repeating event</p>
                  <p className="text-foot text-tertiary">Happens regularly</p>
                </div>
                <GlassToggle checked={isRepeating} onChange={setIsRepeating} />
              </div>
              <div className="h-px bg-current/5" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sub text-primary font-semibold">Premium only</p>
                  <p className="text-foot text-tertiary">Only Premium members can join</p>
                </div>
                <GlassToggle checked={premiumOnly} onChange={setPremiumOnly} />
              </div>
            </GlassCard>
          </div>
        )}

        {/* Step 3: Date + Preview */}
        {step === 3 && (
          <div className="space-y-5 animate-rise">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-foot text-secondary font-semibold ml-1">Date</label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full glass-thin glass-specular rounded-3xl px-4 py-3.5 text-body text-primary bg-transparent outline-none mt-1.5 [color-scheme:light] dark:[color-scheme:dark]"
                />
              </div>
              <div>
                <label className="text-foot text-secondary font-semibold ml-1">Time</label>
                <input
                  type="time"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  className="w-full glass-thin glass-specular rounded-3xl px-4 py-3.5 text-body text-primary bg-transparent outline-none mt-1.5 [color-scheme:light] dark:[color-scheme:dark]"
                />
              </div>
            </div>

            {/* Preview */}
            <div>
              <label className="text-foot text-secondary font-semibold ml-1">Preview</label>
              <GlassCard className="rounded-[28px] overflow-hidden mt-1.5">
                <div className="relative h-32 overflow-hidden">
                  <img src={coverUrl} alt="cover" className="w-full h-full object-cover" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 40%, rgb(0 0 0 / 0.5))' }} />
                  <div className="absolute top-3 left-3 glass-thin glass-specular rounded-full px-2.5 py-1">
                    <span className="text-caption text-white font-bold uppercase">{category}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-title3 text-primary font-bold">{title || 'Your Ekip title'}</h3>
                  <p className="text-sub text-secondary mt-1 line-clamp-2">{description || 'Your description will appear here...'}</p>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {tags.slice(0, 4).map((t) => (
                        <span key={t} className="text-caption text-tertiary font-semibold px-2 py-0.5 rounded-full glass-thin glass-specular">{t}</span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-3 text-foot text-tertiary">
                    {(() => { const C = getIcon('Calendar'); return <C size={14} />; })()}
                    {eventDate ? new Date(eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Date TBD'}
                    {eventTime ? ` · ${eventTime}` : ''}
                    <span>·</span>
                    {(() => { const M = getIcon('MapPin'); return <M size={14} />; })()}
                    {city}
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        )}
      </div>

      {/* Bottom actions */}
      <div className="shrink-0 px-5 pb-24 pt-3 z-30">
        <GlassCard variant="thick" className="rounded-3xl p-3 flex items-center gap-3">
          {step > 0 && (
            <GlassButton variant="secondary" icon="ArrowLeft" onClick={() => setStep(step - 1)}>Back</GlassButton>
          )}
          {step < totalSteps - 1 ? (
            <GlassButton fullWidth size="lg" iconRight="ArrowRight" onClick={() => setStep(step + 1)} disabled={!canProceed()}>
              Continue
            </GlassButton>
          ) : (
            <GlassButton fullWidth size="lg" icon="Rocket" onClick={handleCreate} disabled={!canProceed()}>
              Publish Ekip
            </GlassButton>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
