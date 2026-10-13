import { useState, useId } from 'react';
import { useAppData } from '@/lib/appData';
import { GlassCard, GlassButton, GlassBackButton, GlassAvatar } from '@/components/Glass';
import { Toast } from '@/components/Overlays';
import { getIcon } from '@/lib/icons';
import type { Gender } from '@/types/database';

interface PersonalInfoScreenProps {
  onBack: () => void;
  onOpenVerification?: () => void;
}

const AVATAR_PRESETS = [
  'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=256&h=256&fit=crop',
  'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=256&h=256&fit=crop',
  'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=256&h=256&fit=crop',
  'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=256&h=256&fit=crop',
  'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=256&h=256&fit=crop',
  'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=256&h=256&fit=crop',
  'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=256&h=256&fit=crop',
  'https://images.pexels.com/photos/1080213/pexels-photo-1080213.jpeg?auto=compress&cs=tinysrgb&w=256&h=256&fit=crop',
];

const BANNER_PRESETS = [
  'https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
  'https://images.pexels.com/photos/355465/pexels-photo-355465.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
  'https://images.pexels.com/photos/167964/pexels-photo-167964.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
  'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
  'https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
];

const POPULAR_INTERESTS = [
  'Design', 'Tech', 'Hiking', 'Coffee', 'Photography', 'Startups',
  'Yoga', 'Climbing', 'Travel', 'Music', 'Foodie', 'Fitness',
  'Books', 'Art', 'Cinema', 'Gaming',
];

const PERSONALITY_TYPES = [
  'ENFJ', 'ENFP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'INTJ', 'INTP',
  'ESFJ', 'ESFP', 'ESTJ', 'ESTP',
  'ISFJ', 'ISFP', 'ISTJ', 'ISTP',
];

export function PersonalInfoScreen({ onBack, onOpenVerification }: PersonalInfoScreenProps) {
  const { me, updateMe } = useAppData();

  const [firstName, setFirstName] = useState(me.first_name || '');
  const [lastName, setLastName] = useState(me.last_name || '');
  const [username, setUsername] = useState(me.username || '');
  const [bio, setBio] = useState(me.bio || '');
  const [mood, setMood] = useState(me.mood || 'Energized');
  const [city, setCity] = useState(me.city || '');
  const [job, setJob] = useState(me.job || '');
  const [age, setAge] = useState<string>(me.age ? String(me.age) : '26');
  const [gender, setGender] = useState<Gender | 'other'>(me.gender || 'female');
  const [personalityType, setPersonalityType] = useState(me.personality_type || 'ENFJ');
  const [email, setEmail] = useState(me.email || 'aria@ekip.app');
  const [phone, setPhone] = useState(me.phone || '+1 415 555 0142');
  const [avatarUrl, setAvatarUrl] = useState(me.avatar_url || AVATAR_PRESETS[0]);
  const [bannerUrl, setBannerUrl] = useState(me.banner_url || BANNER_PRESETS[0]);
  const [interests, setInterests] = useState<string[]>(me.interests || ['Design', 'Hiking', 'Coffee']);
  const [newTagInput, setNewTagInput] = useState('');
  const [socialInstagram, setSocialInstagram] = useState(me.social_links?.instagram || '');
  const [socialTwitter, setSocialTwitter] = useState(me.social_links?.twitter || '');
  const [socialLinkedin, setSocialLinkedin] = useState(me.social_links?.linkedin || '');

  const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState(false);
  const [isBannerPickerOpen, setIsBannerPickerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Accessible unique IDs for form inputs
  const firstNameId = useId();
  const lastNameId = useId();
  const usernameId = useId();
  const moodId = useId();
  const bioId = useId();
  const ageId = useId();
  const cityId = useId();
  const jobId = useId();
  const emailId = useId();
  const phoneId = useId();
  const instagramId = useId();
  const twitterId = useId();
  const linkedinId = useId();
  const newTagId = useId();

  const Camera = getIcon('Camera');
  const Check = getIcon('Check');
  const Plus = getIcon('Plus');
  const X = getIcon('X');
  const Sparkles = getIcon('Sparkles');
  const ShieldCheck = getIcon('ShieldCheck');
  const ChevronRight = getIcon('ChevronRight');

  const triggerHaptic = (ms: number = 8) => {
    if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
      try {
        navigator.vibrate(ms);
      } catch {
        // ignore
      }
    }
  };

  const handleToggleInterest = (tag: string) => {
    triggerHaptic(6);
    if (interests.includes(tag)) {
      setInterests((prev) => prev.filter((t) => t !== tag));
    } else {
      setInterests((prev) => [...prev, tag]);
    }
  };

  const handleAddCustomTag = () => {
    const trimmed = newTagInput.trim();
    if (trimmed && !interests.includes(trimmed)) {
      triggerHaptic(8);
      setInterests((prev) => [...prev, trimmed]);
      setNewTagInput('');
    }
  };

  const handleSave = () => {
    triggerHaptic(12);
    setIsSaving(true);

    const parsedAge = age ? parseInt(age, 10) : null;

    updateMe({
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      username: username.trim().replace(/^@/, ''),
      bio: bio.trim(),
      mood: mood.trim(),
      city: city.trim(),
      job: job.trim(),
      age: isNaN(parsedAge as number) ? null : parsedAge,
      gender: gender as Gender,
      personality_type: personalityType,
      email: email.trim(),
      phone: phone.trim(),
      avatar_url: avatarUrl,
      banner_url: bannerUrl,
      interests,
      social_links: {
        ...(socialInstagram ? { instagram: socialInstagram.trim() } : {}),
        ...(socialTwitter ? { twitter: socialTwitter.trim() } : {}),
        ...(socialLinkedin ? { linkedin: socialLinkedin.trim() } : {}),
      },
    });

    setToastMessage('Personal information saved successfully');
    setTimeout(() => {
      setIsSaving(false);
    }, 400);
  };

  return (
    <div className="h-full overflow-y-auto no-scrollbar screen-enter-items pb-28">
      {/* Sticky Liquid Glass Navigation Header */}
      <div className="sticky top-0 z-30 glass glass-specular px-5 pt-3 pb-3 border-b border-white/20 dark:border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GlassBackButton onClick={onBack} />
            <div>
              <h1 className="text-title1 text-primary font-bold">Personal Info</h1>
              <p className="text-[11px] text-tertiary">Edit your identity & details</p>
            </div>
          </div>
          <GlassButton
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
            icon="Check"
            className="shadow-sm"
          >
            {isSaving ? 'Saved' : 'Save'}
          </GlassButton>
        </div>
      </div>

      <div className="px-5 mt-4 space-y-5">
        {/* Profile Media Preview Card */}
        <GlassCard className="rounded-3xl overflow-hidden p-0 relative">
          {/* Banner Photo */}
          <div className="relative h-32 w-full overflow-hidden bg-slate-800">
            <img
              src={bannerUrl}
              alt="Cover Banner"
              className="w-full h-full object-cover transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/25 dark:bg-black/40" />
            <button
              type="button"
              onClick={() => setIsBannerPickerOpen((prev) => !prev)}
              aria-label="Change banner photo"
              className="absolute right-3 top-3 px-3 py-1.5 rounded-full glass-thick glass-specular text-[11px] font-semibold text-white flex items-center gap-1.5 shadow-md spring-press cursor-pointer"
            >
              <Camera size={14} strokeWidth={2.4} />
              <span>Change Cover</span>
            </button>
          </div>

          {/* Avatar Photo */}
          <div className="px-5 pb-5 -mt-10 flex items-end justify-between relative z-10">
            <div className="relative group">
              <GlassAvatar
                src={avatarUrl}
                name={`${firstName} ${lastName}`}
                size={80}
                className="ring-4 ring-[rgb(var(--bg-canvas))]"
              />
              <button
                type="button"
                onClick={() => setIsAvatarPickerOpen((prev) => !prev)}
                aria-label="Change avatar photo"
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-lg spring-press cursor-pointer ring-2 ring-[rgb(var(--bg-canvas))]"
              >
                <Camera size={15} strokeWidth={2.4} />
              </button>
            </div>

            <div className="flex-1 ml-4 min-w-0">
              <h2 className="text-body text-primary font-bold truncate">
                {firstName || 'First'} {lastName || 'Last'}
              </h2>
              <p className="text-foot text-secondary truncate">@{username || 'username'}</p>
            </div>
          </div>

          {/* Quick Avatar Selector Drawer */}
          {isAvatarPickerOpen && (
            <div className="p-4 bg-black/5 dark:bg-black/40 border-t border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-tertiary uppercase tracking-wider">
                  Select Profile Avatar
                </span>
                <button
                  type="button"
                  onClick={() => setIsAvatarPickerOpen(false)}
                  className="text-tertiary hover:text-primary"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2.5">
                {AVATAR_PRESETS.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      triggerHaptic(8);
                      setAvatarUrl(url);
                      setIsAvatarPickerOpen(false);
                    }}
                    className={`relative aspect-square rounded-2xl overflow-hidden spring-press cursor-pointer transition-all ${
                      avatarUrl === url
                        ? 'ring-2 ring-pink-500 ring-offset-2 ring-offset-[rgb(var(--bg-canvas))] scale-105'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={url} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                    {avatarUrl === url && (
                      <div className="absolute inset-0 bg-pink-500/25 flex items-center justify-center">
                        <Check size={18} className="text-white" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Banner Selector Drawer */}
          {isBannerPickerOpen && (
            <div className="p-4 bg-black/5 dark:bg-black/40 border-t border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-tertiary uppercase tracking-wider">
                  Select Cover Banner
                </span>
                <button
                  type="button"
                  onClick={() => setIsBannerPickerOpen(false)}
                  className="text-tertiary hover:text-primary"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {BANNER_PRESETS.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      triggerHaptic(8);
                      setBannerUrl(url);
                      setIsBannerPickerOpen(false);
                    }}
                    className={`relative h-16 rounded-xl overflow-hidden spring-press cursor-pointer transition-all ${
                      bannerUrl === url
                        ? 'ring-2 ring-pink-500 ring-offset-2 ring-offset-[rgb(var(--bg-canvas))]'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={url} alt={`Banner ${idx}`} className="w-full h-full object-cover" />
                    {bannerUrl === url && (
                      <div className="absolute inset-0 bg-pink-500/30 flex items-center justify-center">
                        <Check size={18} className="text-white" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </GlassCard>

        {/* Section 1: Basic Information */}
        <div>
          <div className="flex items-center gap-2 mb-2 px-1">
            <span className="text-[11px] font-bold text-tertiary uppercase tracking-wider">
              Basic Information
            </span>
          </div>
          <GlassCard className="rounded-3xl p-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor={firstNameId} className="block text-foot text-secondary font-semibold mb-1">
                  First Name
                </label>
                <input
                  id={firstNameId}
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  className="w-full bg-black/5 dark:bg-black/40 border border-white/20 dark:border-white/10 rounded-2xl p-3 text-body text-primary focus:outline-hidden focus:ring-2 focus:ring-pink-500/60 transition-all placeholder:text-tertiary"
                />
              </div>
              <div>
                <label htmlFor={lastNameId} className="block text-foot text-secondary font-semibold mb-1">
                  Last Name
                </label>
                <input
                  id={lastNameId}
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                  className="w-full bg-black/5 dark:bg-black/40 border border-white/20 dark:border-white/10 rounded-2xl p-3 text-body text-primary focus:outline-hidden focus:ring-2 focus:ring-pink-500/60 transition-all placeholder:text-tertiary"
                />
              </div>
            </div>

            <div>
              <label htmlFor={usernameId} className="block text-foot text-secondary font-semibold mb-1">
                Username
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-secondary font-bold text-body">@</span>
                <input
                  id={usernameId}
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.replace(/^@/, ''))}
                  placeholder="username"
                  className="w-full pl-8 bg-black/5 dark:bg-black/40 border border-white/20 dark:border-white/10 rounded-2xl p-3 text-body text-primary focus:outline-hidden focus:ring-2 focus:ring-pink-500/60 transition-all placeholder:text-tertiary"
                />
              </div>
            </div>

            <div>
              <label htmlFor={moodId} className="block text-foot text-secondary font-semibold mb-1">
                Current Mood / Status
              </label>
              <input
                id={moodId}
                type="text"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                placeholder="e.g. Energized, Exploring, In the zone"
                className="w-full bg-black/5 dark:bg-black/40 border border-white/20 dark:border-white/10 rounded-2xl p-3 text-body text-primary focus:outline-hidden focus:ring-2 focus:ring-pink-500/60 transition-all placeholder:text-tertiary"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor={bioId} className="text-foot text-secondary font-semibold">
                  About Me / Bio
                </label>
                <span className="text-[10px] text-tertiary font-semibold">{bio.length}/240</span>
              </div>
              <textarea
                id={bioId}
                rows={3}
                maxLength={240}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell your Ekip community what you love and what you're looking for..."
                className="w-full bg-black/5 dark:bg-black/40 border border-white/20 dark:border-white/10 rounded-2xl p-3 text-body text-primary focus:outline-hidden focus:ring-2 focus:ring-pink-500/60 transition-all placeholder:text-tertiary resize-none"
              />
            </div>
          </GlassCard>
        </div>

        {/* Section 2: Demographics & Lifestyle */}
        <div>
          <div className="flex items-center gap-2 mb-2 px-1">
            <span className="text-[11px] font-bold text-tertiary uppercase tracking-wider">
              Demographics & Profile Details
            </span>
          </div>
          <GlassCard className="rounded-3xl p-4 space-y-4">
            <div>
              <label className="block text-foot text-secondary font-semibold mb-2">
                Gender Identity
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['female', 'male', 'nonbinary', 'other'] as const).map((g) => {
                  const isSelected = gender === g;
                  const labelMap: Record<string, string> = {
                    female: 'Female',
                    male: 'Male',
                    nonbinary: 'Non-binary',
                    other: 'Other',
                  };
                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => {
                        triggerHaptic(6);
                        setGender(g);
                      }}
                      className={`py-2 px-1 rounded-xl text-[11px] font-bold capitalize transition-all spring-press cursor-pointer ${
                        isSelected
                          ? 'bg-pink-500 text-white shadow-sm'
                          : 'glass-thin text-secondary hover:text-primary'
                      }`}
                    >
                      {labelMap[g]}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor={ageId} className="block text-foot text-secondary font-semibold mb-1">
                  Age
                </label>
                <input
                  id={ageId}
                  type="number"
                  min="16"
                  max="99"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="26"
                  className="w-full bg-black/5 dark:bg-black/40 border border-white/20 dark:border-white/10 rounded-2xl p-3 text-body text-primary focus:outline-hidden focus:ring-2 focus:ring-pink-500/60 transition-all placeholder:text-tertiary"
                />
              </div>

              <div>
                <label htmlFor={cityId} className="block text-foot text-secondary font-semibold mb-1">
                  City / Location
                </label>
                <input
                  id={cityId}
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="San Francisco"
                  className="w-full bg-black/5 dark:bg-black/40 border border-white/20 dark:border-white/10 rounded-2xl p-3 text-body text-primary focus:outline-hidden focus:ring-2 focus:ring-pink-500/60 transition-all placeholder:text-tertiary"
                />
              </div>
            </div>

            <div>
              <label htmlFor={jobId} className="block text-foot text-secondary font-semibold mb-1">
                Occupation / Job Title
              </label>
              <input
                id={jobId}
                type="text"
                value={job}
                onChange={(e) => setJob(e.target.value)}
                placeholder="Product Designer"
                className="w-full bg-black/5 dark:bg-black/40 border border-white/20 dark:border-white/10 rounded-2xl p-3 text-body text-primary focus:outline-hidden focus:ring-2 focus:ring-pink-500/60 transition-all placeholder:text-tertiary"
              />
            </div>

            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Sparkles size={14} className="text-pink-500" strokeWidth={2.4} />
                <label className="text-foot text-secondary font-semibold">
                  Personality Type (MBTI)
                </label>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {PERSONALITY_TYPES.map((type) => {
                  const isSelected = personalityType?.toUpperCase().includes(type);
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        triggerHaptic(6);
                        setPersonalityType(type);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-foot font-semibold transition-all spring-press cursor-pointer ${
                        isSelected
                          ? 'bg-pink-500 text-white shadow-xs'
                          : 'glass-thin text-secondary hover:text-primary'
                      }`}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Section 3: Contact & Security */}
        <div>
          <div className="flex items-center gap-2 mb-2 px-1">
            <span className="text-[11px] font-bold text-tertiary uppercase tracking-wider">
              Contact & Verification
            </span>
          </div>
          <GlassCard className="rounded-3xl p-4 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor={emailId} className="text-foot text-secondary font-semibold">
                  Email Address
                </label>
                <span className="text-[10px] text-emerald-500 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <Check size={12} strokeWidth={3} />
                  Verified
                </span>
              </div>
              <input
                id={emailId}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full bg-black/5 dark:bg-black/40 border border-white/20 dark:border-white/10 rounded-2xl p-3 text-body text-primary focus:outline-hidden focus:ring-2 focus:ring-pink-500/60 transition-all placeholder:text-tertiary"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor={phoneId} className="text-foot text-secondary font-semibold">
                  Phone Number
                </label>
                <span className="text-[10px] text-emerald-500 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <Check size={12} strokeWidth={3} />
                  SMS 2FA Active
                </span>
              </div>
              <input
                id={phoneId}
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 555 0192"
                className="w-full bg-black/5 dark:bg-black/40 border border-white/20 dark:border-white/10 rounded-2xl p-3 text-body text-primary focus:outline-hidden focus:ring-2 focus:ring-pink-500/60 transition-all placeholder:text-tertiary"
              />
            </div>

            {onOpenVerification && (
              <div
                onClick={() => {
                  triggerHaptic(8);
                  onOpenVerification();
                }}
                className="pt-3 border-t border-white/10 flex items-center justify-between cursor-pointer spring-press group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-pink-500/20 text-pink-500 flex items-center justify-center">
                    <ShieldCheck size={18} strokeWidth={2.4} />
                  </div>
                  <div>
                    <p className="text-foot text-primary font-bold">Identity & Biometric Verification</p>
                    <p className="text-[11px] text-tertiary">
                      {me.is_verified ? 'Verified Level 2 • Active badge' : 'Pending verification review'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-pink-500 font-semibold text-caption">
                  <span>Manage</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            )}
          </GlassCard>
        </div>

        {/* Section 4: Interests & Tags */}
        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-[11px] font-bold text-tertiary uppercase tracking-wider">
              Interests & Passions
            </span>
            <span className="text-[11px] text-tertiary font-semibold">{interests.length} selected</span>
          </div>
          <GlassCard className="rounded-3xl p-4 space-y-3">
            <div className="flex flex-wrap gap-2">
              {POPULAR_INTERESTS.map((tag) => {
                const isSelected = interests.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleToggleInterest(tag)}
                    className={`px-3.5 py-1.5 rounded-full text-foot font-semibold flex items-center gap-1.5 transition-all spring-press cursor-pointer ${
                      isSelected
                        ? 'bg-pink-500 text-white shadow-xs'
                        : 'glass-thin text-secondary hover:text-primary'
                    }`}
                  >
                    <span>{tag}</span>
                    {isSelected && <Check size={13} strokeWidth={3} />}
                  </button>
                );
              })}
            </div>

            {/* Custom Tag Adder */}
            <div className="pt-2 border-t border-white/10 flex items-center gap-2">
              <label htmlFor={newTagId} className="sr-only">Add custom tag</label>
              <input
                id={newTagId}
                type="text"
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomTag();
                  }
                }}
                placeholder="Add another passion..."
                className="flex-1 bg-black/5 dark:bg-black/40 border border-white/20 dark:border-white/10 rounded-2xl px-3.5 py-2.5 text-sub text-primary focus:outline-hidden focus:ring-2 focus:ring-pink-500/60 transition-all placeholder:text-tertiary"
              />
              <button
                type="button"
                onClick={handleAddCustomTag}
                className="px-4 py-2.5 rounded-2xl bg-pink-500 text-white font-semibold text-sub spring-press cursor-pointer flex items-center gap-1 shadow-xs"
              >
                <Plus size={16} strokeWidth={2.4} />
                <span>Add</span>
              </button>
            </div>
          </GlassCard>
        </div>

        {/* Section 5: Social Profiles */}
        <div>
          <div className="flex items-center gap-2 mb-2 px-1">
            <span className="text-[11px] font-bold text-tertiary uppercase tracking-wider">
              Connected Socials
            </span>
          </div>
          <GlassCard className="rounded-3xl p-4 space-y-3">
            <div>
              <label htmlFor={instagramId} className="block text-foot text-secondary font-semibold mb-1">
                Instagram Handle
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-secondary font-bold text-body">@</span>
                <input
                  id={instagramId}
                  type="text"
                  value={socialInstagram}
                  onChange={(e) => setSocialInstagram(e.target.value.replace(/^@/, ''))}
                  placeholder="instagram_handle"
                  className="w-full pl-8 bg-black/5 dark:bg-black/40 border border-white/20 dark:border-white/10 rounded-2xl p-3 text-body text-primary focus:outline-hidden focus:ring-2 focus:ring-pink-500/60 transition-all placeholder:text-tertiary"
                />
              </div>
            </div>

            <div>
              <label htmlFor={twitterId} className="block text-foot text-secondary font-semibold mb-1">
                X / Twitter Handle
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-secondary font-bold text-body">@</span>
                <input
                  id={twitterId}
                  type="text"
                  value={socialTwitter}
                  onChange={(e) => setSocialTwitter(e.target.value.replace(/^@/, ''))}
                  placeholder="twitter_handle"
                  className="w-full pl-8 bg-black/5 dark:bg-black/40 border border-white/20 dark:border-white/10 rounded-2xl p-3 text-body text-primary focus:outline-hidden focus:ring-2 focus:ring-pink-500/60 transition-all placeholder:text-tertiary"
                />
              </div>
            </div>

            <div>
              <label htmlFor={linkedinId} className="block text-foot text-secondary font-semibold mb-1">
                LinkedIn Username
              </label>
              <input
                id={linkedinId}
                type="text"
                value={socialLinkedin}
                onChange={(e) => setSocialLinkedin(e.target.value)}
                placeholder="linkedin.com/in/username"
                className="w-full bg-black/5 dark:bg-black/40 border border-white/20 dark:border-white/10 rounded-2xl p-3 text-body text-primary focus:outline-hidden focus:ring-2 focus:ring-pink-500/60 transition-all placeholder:text-tertiary"
              />
            </div>
          </GlassCard>
        </div>

        {/* Save & Discard Buttons */}
        <div className="pt-2 flex items-center gap-3">
          <GlassButton
            fullWidth
            onClick={handleSave}
            icon="Check"
            size="lg"
            className="shadow-md"
          >
            Save All Changes
          </GlassButton>
        </div>
      </div>

      {/* Confirmation Toast */}
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage('')} />
      )}
    </div>
  );
}
