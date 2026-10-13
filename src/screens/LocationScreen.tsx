import { useState } from 'react';
import { useAppData } from '@/lib/appData';
import { GlassCard, GlassButton, GlassBackButton } from '@/components/Glass';
import { Toast } from '@/components/Overlays';
import { SettingsSection } from '@/components/settings/SettingsSection';
import { cities } from '@/lib/demoData';
import { getIcon } from '@/lib/icons';

interface LocationScreenProps {
  onBack: () => void;
}

interface SavedPlace {
  id: string;
  name: string;
  address: string;
  category: 'favorite' | 'home' | 'work';
}

const INITIAL_SAVED_PLACES: SavedPlace[] = [
  { id: 'p1', name: 'Home Base', address: 'Marina District, San Francisco, CA', category: 'home' },
  { id: 'p2', name: 'Design Studio', address: 'SoMa, 2nd St, San Francisco, CA', category: 'work' },
  { id: 'p3', name: 'Ferry Building Meetup Spot', address: '1 Ferry Building, San Francisco, CA', category: 'favorite' },
];

export function LocationScreen({ onBack }: LocationScreenProps) {
  const { me, updateMe, addNotification } = useAppData();

  // Location settings state
  const [selectedCity, setSelectedCity] = useState(me.city || 'San Francisco');
  const [discoveryRadius, setDiscoveryRadius] = useState<number>(15); // km
  const [preciseLocationSharing, setPreciseLocationSharing] = useState(true);
  const [backgroundRadar, setBackgroundRadar] = useState(true);
  const [spotlightMyCity, setSpotlightMyCity] = useState(true);
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>(INITIAL_SAVED_PLACES);

  // New place input state
  const [showAddPlaceModal, setShowAddPlaceModal] = useState(false);
  const [newPlaceName, setNewPlaceName] = useState('');
  const [newPlaceAddress, setNewPlaceAddress] = useState('');
  const [newPlaceCategory, setNewPlaceCategory] = useState<'favorite' | 'home' | 'work'>('favorite');

  // Toast feedback
  const [toastMessage, setToastMessage] = useState('');

  // Icons
  const MapPin = getIcon('MapPin');
  const Compass = getIcon('Compass');
  const Navigation = getIcon('Navigation');
  const ShieldCheck = getIcon('ShieldCheck');
  const Check = getIcon('Check');
  const Trash = getIcon('Trash');
  const Plus = getIcon('Plus');
  const Globe = getIcon('Globe');

  const triggerHaptic = (ms: number = 8) => {
    if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
      try {
        navigator.vibrate(ms);
      } catch {
        // ignore
      }
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2600);
  };

  const handleCityChange = (city: string) => {
    triggerHaptic(10);
    setSelectedCity(city);
    updateMe({ city });
    showToast(`Primary discovery city updated to ${city}`);
    addNotification({
      type: 'system',
      title: 'Location Updated',
      body: `Your active radar has been relocated to ${city}.`,
      icon: 'MapPin',
    });
  };

  const handleToggle = (
    setter: React.Dispatch<React.SetStateAction<boolean>>,
    value: boolean,
    label: string
  ) => {
    triggerHaptic(8);
    setter(!value);
    showToast(`${label} ${!value ? 'enabled' : 'disabled'}`);
  };

  const handleAddPlace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaceName.trim() || !newPlaceAddress.trim()) {
      showToast('Please enter both place name and address');
      return;
    }

    triggerHaptic(12);
    const place: SavedPlace = {
      id: `place-${Date.now()}`,
      name: newPlaceName.trim(),
      address: newPlaceAddress.trim(),
      category: newPlaceCategory,
    };

    setSavedPlaces((prev) => [place, ...prev]);
    setNewPlaceName('');
    setNewPlaceAddress('');
    setShowAddPlaceModal(false);
    showToast('Saved favorite location added');
  };

  const handleRemovePlace = (id: string, name: string) => {
    triggerHaptic(10);
    setSavedPlaces((prev) => prev.filter((p) => p.id !== id));
    showToast(`Removed "${name}" from saved places`);
  };

  return (
    <div className="h-full overflow-y-auto no-scrollbar screen-enter-items pb-6">
      {/* Sticky Liquid Glass Navigation Header */}
      <div className="sticky top-0 z-30 glass glass-specular px-5 pt-3 pb-3 border-b border-white/20 dark:border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GlassBackButton onClick={onBack} />
            <div>
              <h1 className="text-title1 text-primary font-bold">Location & Radar</h1>
              <p className="text-[11px] text-tertiary">City hub, discovery radius & geofencing</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full glass-thin border border-emerald-500/30 text-[11px] font-bold text-emerald-500 shadow-xs">
            <MapPin size={13} className="text-emerald-500" strokeWidth={2.4} />
            <span>GPS Active</span>
          </div>
        </div>
      </div>

      <div className="px-5 mt-4 space-y-5">
        {/* Hero Location Status Card - Emerald/Cyan glass with minimal pink highlight */}
        <div className="relative rounded-3xl overflow-hidden p-5 glass glass-specular border border-emerald-500/30 shadow-lg">
          {/* Ambient Emerald Glow */}
          <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex items-start justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/40 shadow-inner">
                  <Navigation size={26} className="text-emerald-500" strokeWidth={2.3} />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md ring-2 ring-[rgb(var(--bg-canvas))]">
                  <Check size={11} strokeWidth={3} />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-body text-primary font-bold">{selectedCity} Hub</h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-500 border border-emerald-500/25">
                    {discoveryRadius} km radius
                  </span>
                </div>
                <p className="text-caption text-secondary mt-0.5">
                  GPS positioning calibrated · 24 Ekips active nearby
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="mt-4 pt-3.5 border-t border-white/15 dark:border-white/10 grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 rounded-xl bg-white/40 dark:bg-white/5 border border-white/20">
              <span className="text-[10px] text-tertiary block font-medium">City Hub</span>
              <span className="text-caption font-bold text-primary truncate block">{selectedCity}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/40 dark:bg-white/5 border border-white/20">
              <span className="text-[10px] text-tertiary block font-medium">Discovery Range</span>
              <span className="text-caption font-bold text-emerald-500">{discoveryRadius} km</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/40 dark:bg-white/5 border border-white/20">
              <span className="text-[10px] text-tertiary block font-medium">Saved Places</span>
              <span className="text-caption font-bold text-primary">{savedPlaces.length} locations</span>
            </div>
          </div>
        </div>

        {/* Section 1: Primary City Hub Selection */}
        <SettingsSection title="Primary City Hub">
          <GlassCard className="rounded-3xl overflow-hidden p-4 space-y-3">
            <div>
              <span className="text-caption font-bold text-primary">Select Active Community City</span>
              <p className="text-[11px] text-tertiary mt-0.5">
                Your discovery feed and group recommendations will center around this hub.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {cities.map((city) => {
                const isSelected = selectedCity === city;
                return (
                  <button
                    key={city}
                    type="button"
                    onClick={() => handleCityChange(city)}
                    className={`p-3 rounded-2xl glass-thin transition-all flex items-center justify-between text-left ${
                      isSelected
                        ? 'border-emerald-500/50 bg-emerald-500/10 ring-1 ring-emerald-500/30'
                        : 'border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <MapPin size={16} className={isSelected ? 'text-emerald-500' : 'text-secondary'} />
                      <span className={`text-foot font-bold truncate ${isSelected ? 'text-primary font-extrabold' : 'text-secondary'}`}>
                        {city}
                      </span>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                        <Check size={12} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </GlassCard>
        </SettingsSection>

        {/* Section 2: Discovery Radius Slider */}
        <SettingsSection title="Discovery Radius & Range">
          <GlassCard className="rounded-3xl overflow-hidden p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-body font-bold text-primary">Radar Search Distance</span>
                <p className="text-caption text-secondary">Maximum distance for nearby Ekip gatherings</p>
              </div>
              <span className="text-lg font-black text-emerald-500 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                {discoveryRadius} km
              </span>
            </div>

            <div className="space-y-2">
              <input
                type="range"
                min="3"
                max="50"
                step="1"
                value={discoveryRadius}
                onChange={(e) => {
                  setDiscoveryRadius(Number(e.target.value));
                  triggerHaptic(4);
                }}
                className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-tertiary font-bold">
                <span>3 km (Walking)</span>
                <span>25 km (City)</span>
                <span>50 km (Metro)</span>
              </div>
            </div>
          </GlassCard>
        </SettingsSection>

        {/* Section 3: Privacy & GPS Permissions */}
        <SettingsSection title="Privacy & GPS Permissions">
          <GlassCard className="rounded-3xl overflow-hidden divide-y divide-white/10 dark:divide-white/5">
            {/* Precise Location */}
            <div className="p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgb(16 185 129 / 0.15)' }}
                >
                  <Navigation size={19} className="text-emerald-500" strokeWidth={2.2} />
                </div>
                <div>
                  <span className="text-body font-semibold text-primary">Precise GPS Coordinates</span>
                  <p className="text-caption text-secondary">
                    Share exact meetup spot coordinates with accepted Ekip members
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleToggle(setPreciseLocationSharing, preciseLocationSharing, 'Precise GPS')}
                aria-label="Toggle Precise GPS Coordinates"
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  preciseLocationSharing ? 'bg-emerald-500' : 'bg-zinc-400/50 dark:bg-zinc-600'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    preciseLocationSharing ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Background Radar */}
            <div className="p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgb(59 130 246 / 0.15)' }}
                >
                  <Compass size={19} className="text-blue-500" strokeWidth={2.2} />
                </div>
                <div>
                  <span className="text-body font-semibold text-primary">Background Radar Alerts</span>
                  <p className="text-caption text-secondary">
                    Notify when passing near favorite Ekip spots or flash meetups
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleToggle(setBackgroundRadar, backgroundRadar, 'Background Radar')}
                aria-label="Toggle Background Radar Alerts"
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  backgroundRadar ? 'bg-blue-500' : 'bg-zinc-400/50 dark:bg-zinc-600'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    backgroundRadar ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Spotlight My City */}
            <div className="p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgb(244 114 182 / 0.15)' }}
                >
                  <Globe size={19} className="text-pink-500" strokeWidth={2.2} />
                </div>
                <div>
                  <span className="text-body font-semibold text-primary">Spotlight on City Leaderboards</span>
                  <p className="text-caption text-secondary">
                    Display your city badge on your public profile header
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleToggle(setSpotlightMyCity, spotlightMyCity, 'City Spotlight')}
                aria-label="Toggle City Spotlight"
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  spotlightMyCity ? 'bg-pink-500' : 'bg-zinc-400/50 dark:bg-zinc-600'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    spotlightMyCity ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </GlassCard>
        </SettingsSection>

        {/* Section 4: Saved Meeting Places */}
        <SettingsSection title="Saved Meeting Places">
          <GlassCard className="rounded-3xl overflow-hidden p-4 space-y-3">
            <div className="flex items-center justify-between pb-1">
              <div>
                <span className="text-caption font-bold text-primary">Frequent Locations ({savedPlaces.length})</span>
                <p className="text-[11px] text-tertiary">Quick tags when creating new Ekip gatherings</p>
              </div>
              <GlassButton
                size="sm"
                variant="primary"
                onClick={() => {
                  triggerHaptic(8);
                  setShowAddPlaceModal(true);
                }}
                className="text-[11px] font-bold flex items-center gap-1"
              >
                <Plus size={14} />
                <span>Add Place</span>
              </GlassButton>
            </div>

            <div className="space-y-2.5">
              {savedPlaces.map((place) => (
                <div
                  key={place.id}
                  className="p-3.5 rounded-2xl glass-thin border border-white/20 dark:border-white/10 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-foot font-bold text-primary">{place.name}</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                          {place.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-tertiary mt-0.5">{place.address}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemovePlace(place.id, place.name)}
                    aria-label="Remove saved place"
                    className="p-1.5 rounded-xl text-tertiary hover:text-rose-500 transition-colors"
                  >
                    <Trash size={14} />
                  </button>
                </div>
              ))}
            </div>
          </GlassCard>
        </SettingsSection>

        {/* Footer Note */}
        <div className="text-center pt-2">
          <p className="text-[11px] text-tertiary flex items-center justify-center gap-1.5">
            <ShieldCheck size={13} className="text-emerald-500" />
            <span>Encrypted location pings · Never shared without active session</span>
          </p>
        </div>
      </div>

      {/* Add Saved Place Modal / Sheet */}
      {showAddPlaceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <form
            onSubmit={handleAddPlace}
            className="max-w-xs w-full p-5 rounded-3xl glass glass-specular border border-emerald-500/40 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-title3 font-bold text-primary">Add Saved Location</h3>
              <button
                type="button"
                onClick={() => setShowAddPlaceModal(false)}
                className="text-tertiary hover:text-primary text-sm font-bold"
              >
                Cancel
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-secondary uppercase tracking-wider block mb-1">
                  Place Name
                </label>
                <input
                  type="text"
                  value={newPlaceName}
                  onChange={(e) => setNewPlaceName(e.target.value)}
                  placeholder="e.g. Favorite Coffee Shop"
                  className="w-full bg-white/50 dark:bg-white/10 border border-white/20 rounded-2xl px-3.5 py-2 text-body text-primary focus:outline-hidden focus:ring-2 focus:ring-emerald-500/40"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-secondary uppercase tracking-wider block mb-1">
                  Address / Description
                </label>
                <input
                  type="text"
                  value={newPlaceAddress}
                  onChange={(e) => setNewPlaceAddress(e.target.value)}
                  placeholder="e.g. 420 Market St, San Francisco"
                  className="w-full bg-white/50 dark:bg-white/10 border border-white/20 rounded-2xl px-3.5 py-2 text-body text-primary focus:outline-hidden focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-secondary uppercase tracking-wider block mb-1">
                  Category
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['favorite', 'home', 'work'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        triggerHaptic(4);
                        setNewPlaceCategory(cat);
                      }}
                      className={`py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all ${
                        newPlaceCategory === cat
                          ? 'bg-emerald-500 text-white shadow-xs'
                          : 'bg-white/40 dark:bg-white/10 text-secondary hover:text-primary'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <GlassButton
                type="button"
                variant="ghost"
                className="flex-1 text-[12px]"
                onClick={() => setShowAddPlaceModal(false)}
              >
                Cancel
              </GlassButton>
              <GlassButton
                type="submit"
                variant="primary"
                className="flex-1 text-[12px]"
              >
                Save Place
              </GlassButton>
            </div>
          </form>
        </div>
      )}

      {/* Toast Feedback */}
      <Toast message={toastMessage} open={Boolean(toastMessage)} />
    </div>
  );
}
