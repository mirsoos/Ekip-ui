import { useState } from 'react';
import { useAppData } from '@/lib/appData';
import { GlassButton, GlassInput, GlassToggle, GlassBackButton, GlassSegmented } from '@/components/Glass';
import { StepProgressBar } from '@/components/common/StepProgressBar';
import { CoverPicker } from '@/components/create/CoverPicker';
import { CategoryTypeSelector } from '@/components/create/CategoryTypeSelector';
import { TagSelector } from '@/components/create/TagSelector';
import { AISuggestionsSheet } from '@/components/create/AISuggestionsSheet';
import { getIcon } from '@/lib/icons';
import { allInterests } from '@/lib/demoData';
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

const totalSteps = 4;

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
  const [tags, setTags] = useState<string[]>(['Coffee', 'Networking']);
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
  const [eventDate, setEventDate] = useState('2026-10-20');
  const [eventTime, setEventTime] = useState('18:00');
  const [showAI, setShowAI] = useState(false);

  const Sparkles = getIcon('Sparkles');

  const canProceed = () => {
    if (step === 0) return title.trim().length > 2 && description.trim().length > 5;
    if (step === 1) return category && groupType && minMembers && city;
    if (step === 2) return true; // eligibility options are optional
    if (step === 3) return eventDate && eventTime;
    return true;
  };

  const toggleTag = (tag: string) => {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      handleCreate();
    }
  };

  const handlePrev = () => {
    if (step === 0) onBack();
    else setStep(step - 1);
  };

  const handleCreate = () => {
    const newGroup: Group = {
      id: `g-${Date.now()}`,
      owner_id: 'me',
      title,
      description,
      category,
      group_type: groupType,
      min_members: parseInt(minMembers) || 2,
      max_members: maxMembers ? parseInt(maxMembers) : null,
      city,
      location_name: locationName || null,
      tags,
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

  return (
    <div className="relative h-full flex flex-col screen-enter-items">
      {/* Header */}
      <div className="shrink-0 px-5 pt-4 pb-2 z-20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <GlassBackButton onClick={handlePrev} />
            <div>
              <h1 className="text-title2 text-primary font-bold">Create Ekip</h1>
              <p className="text-foot text-tertiary">Step {step + 1} of {totalSteps}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowAI(true)}
            className="px-3 py-1.5 rounded-full glass-thick glass-specular glass-edge flex items-center gap-1.5 text-foot font-semibold text-pink-500 spring-press cursor-pointer shadow-sm"
          >
            <Sparkles size={14} strokeWidth={2.4} />
            AI Help
          </button>
        </div>
        <StepProgressBar currentStep={step} totalSteps={totalSteps} />
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-3 pb-28 space-y-4">
        {step === 0 && (
          <div className="space-y-4 animate-rise">
            <div>
              <h2 className="text-title2 text-primary font-bold">Basics</h2>
              <p className="text-sub text-secondary mt-0.5">What are you organizing?</p>
            </div>
            <GlassInput
              placeholder="Ekip Title (e.g. Sunset Photography Walk)"
              value={title}
              onChange={setTitle}
            />
            <GlassInput
              placeholder="Description — describe what you'll do, meetups, goals..."
              value={description}
              onChange={setDescription}
              multiline
              rows={4}
            />
            <CoverPicker
              options={coverOptions}
              selectedUrl={coverUrl}
              onSelect={setCoverUrl}
            />
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4 animate-rise">
            <div>
              <h2 className="text-title2 text-primary font-bold">Details</h2>
              <p className="text-sub text-secondary mt-0.5">Category, group type & location.</p>
            </div>
            <CategoryTypeSelector
              category={category}
              groupType={groupType}
              onChangeCategory={setCategory}
              onChangeGroupType={setGroupType}
            />
            <div className="grid grid-cols-2 gap-3">
              <GlassInput
                placeholder="Min members"
                value={minMembers}
                onChange={setMinMembers}
                type="number"
              />
              <GlassInput
                placeholder="Max members (optional)"
                value={maxMembers}
                onChange={setMaxMembers}
                type="number"
              />
            </div>
            <GlassInput placeholder="City" value={city} onChange={setCity} />
            <GlassInput
              placeholder="Specific Location / Venue (optional)"
              value={locationName}
              onChange={setLocationName}
            />
            <TagSelector
              availableTags={allInterests}
              selectedTags={tags}
              onToggleTag={toggleTag}
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-rise">
            <div>
              <h2 className="text-title2 text-primary font-bold">Eligibility & Rules</h2>
              <p className="text-sub text-secondary mt-0.5">Optional criteria for members.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <GlassInput
                placeholder="Min age"
                value={ageMin}
                onChange={setAgeMin}
                type="number"
              />
              <GlassInput
                placeholder="Max age"
                value={ageMax}
                onChange={setAgeMax}
                type="number"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <GlassInput
                placeholder="Required Level"
                value={requiredLevel}
                onChange={setRequiredLevel}
                type="number"
              />
              <GlassInput
                placeholder="Required Honor (0-100)"
                value={requiredHonor}
                onChange={setRequiredHonor}
                type="number"
              />
            </div>
            <GlassInput
              placeholder="Est. Cost per person ($)"
              value={avgCost}
              onChange={setAvgCost}
              type="number"
            />
            <div className="space-y-1.5">
              <label className="text-foot text-secondary font-medium ml-1">Gender preference</label>
              <GlassSegmented
                options={[
                  { label: 'Any', value: 'any' },
                  { label: 'Male', value: 'Male' },
                  { label: 'Female', value: 'Female' },
                ]}
                value={genderPref}
                onChange={setGenderPref}
              />
            </div>
            <div className="space-y-3 pt-2">
              <GlassToggle
                checked={autoAccept}
                onChange={setAutoAccept}
                label="Auto-accept requests"
              />
              <GlassToggle
                checked={premiumOnly}
                onChange={setPremiumOnly}
                label="Premium members only"
              />
              <GlassToggle
                checked={isRepeating}
                onChange={setIsRepeating}
                label="Repeating weekly meetup"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-rise">
            <div>
              <h2 className="text-title2 text-primary font-bold">Schedule</h2>
              <p className="text-sub text-secondary mt-0.5">When is the first meetup happening?</p>
            </div>
            <GlassInput
              placeholder="Event Date"
              value={eventDate}
              onChange={setEventDate}
              type="text"
            />
            <GlassInput
              placeholder="Event Time (e.g. 18:30)"
              value={eventTime}
              onChange={setEventTime}
              type="text"
            />
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="absolute bottom-0 left-0 right-0 p-5 glass-thick z-30">
        <GlassButton
          fullWidth
          size="lg"
          onClick={handleNext}
          disabled={!canProceed()}
          iconRight={step === totalSteps - 1 ? 'Check' : 'ArrowRight'}
        >
          {step === totalSteps - 1 ? 'Publish Ekip' : 'Next Step'}
        </GlassButton>
      </div>

      {/* AI Assistant Suggestions */}
      <AISuggestionsSheet
        open={showAI}
        onClose={() => setShowAI(false)}
        onApplyTitle={setTitle}
      />
    </div>
  );
}
