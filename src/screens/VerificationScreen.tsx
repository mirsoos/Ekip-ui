import { useState, useId } from 'react';
import { useAppData } from '@/lib/appData';
import { GlassCard, GlassButton, GlassBackButton, GlassAvatar, GlassBadgeIcon } from '@/components/Glass';
import { GlassSheet, Toast } from '@/components/Overlays';
import { getIcon } from '@/lib/icons';

interface VerificationScreenProps {
  onBack: () => void;
}

type DocumentType = 'driver_license' | 'passport' | 'national_id';

interface DocumentDetails {
  type: DocumentType;
  docNumber: string;
  country: string;
  expiryDate: string;
  frontImage?: string;
  backImage?: string;
}

export function VerificationScreen({ onBack }: VerificationScreenProps) {
  const { me, updateMe, addNotification } = useAppData();

  // Verification states
  const [isVerified, setIsVerified] = useState(me.is_verified ?? true);
  const [isIdentityVerified, setIsIdentityVerified] = useState(me.is_identity_verified ?? true);

  // Active sub-modals
  const [showDocModal, setShowDocModal] = useState(false);
  const [showFaceModal, setShowFaceModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Document details
  const [selectedDocType, setSelectedDocType] = useState<DocumentType>('driver_license');
  const [docDetails, setDocDetails] = useState<DocumentDetails>({
    type: 'driver_license',
    docNumber: 'DL-84920194',
    country: 'United States (California)',
    expiryDate: '11/2029',
  });

  // Face scanner simulation state
  const [faceScanStep, setFaceScanStep] = useState<'idle' | 'scanning' | 'smiling' | 'success'>('idle');
  const [faceConfidence, setFaceConfidence] = useState(99.4);

  // Doc scanner simulation state
  const [docScanning, setDocScanning] = useState(false);

  // Input IDs for accessibility
  const docNumberId = useId();
  const countryId = useId();

  // Icons
  const ShieldCheck = getIcon('ShieldCheck');
  const Check = getIcon('Check');
  const Lock = getIcon('Lock');
  const Camera = getIcon('Camera');
  const Sparkles = getIcon('Sparkles');
  const ChevronRight = getIcon('ChevronRight');
  const Award = getIcon('Award');
  const Users = getIcon('Users');
  const Zap = getIcon('Zap');
  const Smartphone = getIcon('Phone');
  const Mail = getIcon('Mail');

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
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Simulate updating verification status
  const handleToggleVerification = () => {
    triggerHaptic(12);
    const newStatus = !isVerified;
    setIsVerified(newStatus);
    setIsIdentityVerified(newStatus);
    updateMe({
      is_verified: newStatus,
      is_identity_verified: newStatus,
    });

    if (newStatus) {
      addNotification({
        type: 'system',
        title: 'Identity Verified',
        body: 'Your identity verification badge is now active across Ekip!',
        icon: 'ShieldCheck',
      });
      showToast('🎉 Verification badge activated!');
    } else {
      showToast('Verification status set to pending');
    }
  };

  // Simulate Biometric Face Scan Flow
  const startFaceScan = () => {
    triggerHaptic(10);
    setFaceScanStep('scanning');
    setShowFaceModal(true);

    setTimeout(() => {
      triggerHaptic(8);
      setFaceScanStep('smiling');
    }, 1800);

    setTimeout(() => {
      triggerHaptic(15);
      setFaceConfidence(99.7);
      setFaceScanStep('success');
      setIsIdentityVerified(true);
      setIsVerified(true);
      updateMe({ is_verified: true, is_identity_verified: true });
    }, 3600);
  };

  // Simulate Document Scan Flow
  const handleScanDocument = () => {
    triggerHaptic(10);
    setDocScanning(true);
    setTimeout(() => {
      setDocScanning(false);
      setShowDocModal(false);
      setIsIdentityVerified(true);
      setIsVerified(true);
      updateMe({ is_verified: true, is_identity_verified: true });
      showToast('ID document successfully scanned and encrypted!');
      addNotification({
        type: 'system',
        title: 'Document Approved',
        body: `${selectedDocType === 'driver_license' ? "Driver's License" : selectedDocType === 'passport' ? 'Passport' : 'National ID'} verified.`,
        icon: 'BadgeCheck',
      });
    }, 2000);
  };

  return (
    <div className="h-full overflow-y-auto no-scrollbar screen-enter-items pb-6">
      {/* Sticky Liquid Glass Navigation Header */}
      <div className="sticky top-0 z-30 glass glass-specular px-5 pt-3 pb-3 border-b border-white/20 dark:border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GlassBackButton onClick={onBack} />
            <div>
              <h1 className="text-title1 text-primary font-bold">Identity Verification</h1>
              <p className="text-[11px] text-tertiary">Official trust credentials & badge</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full glass-thin border border-pink-500/40 text-[11px] font-bold text-pink-500 shadow-xs">
            <ShieldCheck size={14} className="text-pink-500" strokeWidth={2.5} />
            <span>{isVerified ? 'Verified' : 'Pending'}</span>
          </div>
        </div>
      </div>

      <div className="px-5 mt-4 space-y-5">
        {/* Hero Card: Trust Status & Verified Badge */}
        <div className="relative rounded-3xl overflow-hidden p-5 glass glass-specular border border-pink-500/30 shadow-lg">
          {/* Ambient Pink & Sky Backlight */}
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-pink-500/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Avatar with Pink Halo & Shield Badge */}
            <div className="relative mb-3">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-pink-500 via-rose-400 to-blue-500 blur-sm opacity-80 animate-pulse-ring" />
              <GlassAvatar
                src={me.avatar_url}
                name={`${me.first_name} ${me.last_name}`}
                size={84}
                className="relative ring-3 ring-pink-500/50"
              />
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 text-white flex items-center justify-center shadow-lg ring-2 ring-[rgb(var(--bg-canvas))]">
                <ShieldCheck size={18} strokeWidth={2.6} />
              </div>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <h2 className="text-title2 text-primary font-bold">
                {me.first_name} {me.last_name}
              </h2>
              {isVerified && <GlassBadgeIcon icon="Verified" label="Verified" color="pink" />}
            </div>
            <p className="text-foot text-secondary mt-0.5 font-medium">@{me.username}</p>

            {/* Verification Status Pill */}
            <div className="mt-3 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-500 text-foot font-bold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping" />
              <span>{isVerified ? 'Level 2 Verified • Trusted Identity' : 'Verification Under Review'}</span>
            </div>

            <p className="text-caption text-secondary mt-3 max-w-xs leading-relaxed">
              Your verified badge is displayed next to your name in all group discover lists, chat messages, and attendee rosters.
            </p>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-2.5 w-full mt-4 pt-4 border-t border-white/15 dark:border-white/10">
              <div className="glass-thin rounded-2xl p-2.5">
                <span className="text-title3 font-bold text-pink-500">94</span>
                <p className="text-[10px] text-tertiary font-semibold uppercase tracking-wider mt-0.5">Honor Score</p>
              </div>
              <div className="glass-thin rounded-2xl p-2.5">
                <span className="text-title3 font-bold text-primary">100%</span>
                <p className="text-[10px] text-tertiary font-semibold uppercase tracking-wider mt-0.5">Safety Rating</p>
              </div>
              <div className="glass-thin rounded-2xl p-2.5">
                <span className="text-title3 font-bold text-emerald-500">Tier 2</span>
                <p className="text-[10px] text-tertiary font-semibold uppercase tracking-wider mt-0.5">Trust Level</p>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Checkpoints (4-Step Verification Pillars) */}
        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-[11px] font-bold text-tertiary uppercase tracking-wider">
              Verification Checkpoints
            </span>
            <span className="text-[11px] text-pink-500 font-bold">
              {isVerified && isIdentityVerified ? '4 of 4 Completed' : '3 of 4 Completed'}
            </span>
          </div>

          <div className="space-y-3">
            {/* Step 1: Government ID Document */}
            <GlassCard
              onClick={() => {
                triggerHaptic(6);
                setShowDocModal(true);
              }}
              className="rounded-3xl p-4 spring-press cursor-pointer hover:border-pink-500/40 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-500 shrink-0">
                    <Award size={20} strokeWidth={2.4} />
                  </div>
                  <div>
                    <h3 className="text-body font-bold text-primary">Government Photo ID</h3>
                    <p className="text-caption text-secondary mt-0.5">
                      {selectedDocType === 'driver_license'
                        ? "US Driver's License"
                        : selectedDocType === 'passport'
                        ? 'International Passport'
                        : 'National ID Card'}{' '}
                      • {docDetails.docNumber}
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-pink-500 bg-pink-500/10 px-2 py-0.5 rounded-full border border-pink-500/20">
                  <Check size={12} strokeWidth={3} />
                  <span>Approved</span>
                </span>
              </div>

              <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-foot text-tertiary">
                <span>Expires {docDetails.expiryDate}</span>
                <span className="text-pink-500 font-semibold flex items-center gap-1">
                  Manage Document <ChevronRight size={14} />
                </span>
              </div>
            </GlassCard>

            {/* Step 2: 3D Biometric Liveness Check */}
            <GlassCard
              onClick={startFaceScan}
              className="rounded-3xl p-4 spring-press cursor-pointer hover:border-pink-500/40 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500/20 to-blue-500/20 border border-pink-500/30 flex items-center justify-center text-pink-500 shrink-0">
                    <Camera size={20} strokeWidth={2.4} />
                  </div>
                  <div>
                    <h3 className="text-body font-bold text-primary">Biometric Face Match</h3>
                    <p className="text-caption text-secondary mt-0.5">
                      3D Facial Depth Scan • {faceConfidence}% match confidence
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-pink-500 bg-pink-500/10 px-2 py-0.5 rounded-full border border-pink-500/20">
                  <Check size={12} strokeWidth={3} />
                  <span>Verified</span>
                </span>
              </div>

              <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-foot text-tertiary">
                <span>Anti-spoofing certified</span>
                <span className="text-pink-500 font-semibold flex items-center gap-1">
                  Retake Face Scan <ChevronRight size={14} />
                </span>
              </div>
            </GlassCard>

            {/* Step 3: Contact Authentication */}
            <GlassCard className="rounded-3xl p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-500 shrink-0">
                    <Smartphone size={20} strokeWidth={2.4} />
                  </div>
                  <div>
                    <h3 className="text-body font-bold text-primary">Contact 2-Step Verification</h3>
                    <p className="text-caption text-secondary mt-0.5">SMS & Work Email bound</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-pink-500 bg-pink-500/10 px-2 py-0.5 rounded-full border border-pink-500/20">
                  <Check size={12} strokeWidth={3} />
                  <span>Active</span>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="glass-thin rounded-2xl p-2.5 flex items-center gap-2">
                  <Smartphone size={14} className="text-pink-500 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] text-tertiary uppercase font-bold">SMS 2FA</p>
                    <p className="text-caption text-primary font-semibold truncate">{me.phone || '+1 415 555 0142'}</p>
                  </div>
                </div>
                <div className="glass-thin rounded-2xl p-2.5 flex items-center gap-2">
                  <Mail size={14} className="text-pink-500 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] text-tertiary uppercase font-bold">Work Email</p>
                    <p className="text-caption text-primary font-semibold truncate">{me.email || 'aria@ekip.app'}</p>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Step 4: Community Trust Standing */}
            <GlassCard className="rounded-3xl p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-500 shrink-0">
                    <ShieldCheck size={20} strokeWidth={2.4} />
                  </div>
                  <div>
                    <h3 className="text-body font-bold text-primary">Community Safety Shield</h3>
                    <p className="text-caption text-secondary mt-0.5">
                      Zero policy violations • Clean attendance history
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <Check size={12} strokeWidth={3} />
                  <span>Flawless</span>
                </span>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Verification Perks Grid */}
        <div>
          <div className="flex items-center gap-2 mb-2 px-1">
            <span className="text-[11px] font-bold text-tertiary uppercase tracking-wider">
              Verified Member Privileges
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <GlassCard className="rounded-3xl p-3.5 space-y-1.5 border border-pink-500/20">
              <div className="w-8 h-8 rounded-xl bg-pink-500/15 text-pink-500 flex items-center justify-center">
                <Sparkles size={16} strokeWidth={2.4} />
              </div>
              <h4 className="text-foot font-bold text-primary">Pink & Blue Badge</h4>
              <p className="text-[11px] text-secondary leading-tight">
                Authentic visual badge next to your avatar across all screens.
              </p>
            </GlassCard>

            <GlassCard className="rounded-3xl p-3.5 space-y-1.5 border border-pink-500/20">
              <div className="w-8 h-8 rounded-xl bg-pink-500/15 text-pink-500 flex items-center justify-center">
                <Zap size={16} strokeWidth={2.4} />
              </div>
              <h4 className="text-foot font-bold text-primary">Instant Join Approval</h4>
              <p className="text-[11px] text-secondary leading-tight">
                Bypass organizer review for public gatherings.
              </p>
            </GlassCard>

            <GlassCard className="rounded-3xl p-3.5 space-y-1.5 border border-pink-500/20">
              <div className="w-8 h-8 rounded-xl bg-pink-500/15 text-pink-500 flex items-center justify-center">
                <Users size={16} strokeWidth={2.4} />
              </div>
              <h4 className="text-foot font-bold text-primary">Verified-Only Ekips</h4>
              <p className="text-[11px] text-secondary leading-tight">
                Create and enter exclusive safety-gated meetups.
              </p>
            </GlassCard>

            <GlassCard className="rounded-3xl p-3.5 space-y-1.5 border border-pink-500/20">
              <div className="w-8 h-8 rounded-xl bg-pink-500/15 text-pink-500 flex items-center justify-center">
                <Award size={16} strokeWidth={2.4} />
              </div>
              <h4 className="text-foot font-bold text-primary">+25% XP Multiplier</h4>
              <p className="text-[11px] text-secondary leading-tight">
                Boosted leveling XP and higher honor points per meetup.
              </p>
            </GlassCard>
          </div>
        </div>

        {/* Privacy & Encryption Guarantee Notice */}
        <div className="glass-thin rounded-3xl p-4 border border-white/20 dark:border-white/10 flex items-start gap-3">
          <div className="w-9 h-9 rounded-2xl bg-black/10 dark:bg-white/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
            <Lock size={18} strokeWidth={2.2} />
          </div>
          <div>
            <h4 className="text-foot font-bold text-primary">Hardware Enclave Zero-Knowledge Privacy</h4>
            <p className="text-[11px] text-secondary mt-1 leading-relaxed">
              Your government IDs and facial biometric meshes are encrypted on-device with AES-256 GCM keys. Ekip never shares raw documents with organizers, members, or third parties.
            </p>
          </div>
        </div>

        {/* Interactive Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <GlassButton
            fullWidth
            onClick={startFaceScan}
            icon="Camera"
            className="shadow-md"
          >
            Launch Biometric Face Scanner
          </GlassButton>

          <GlassButton
            variant="secondary"
            fullWidth
            onClick={handleToggleVerification}
            icon="RefreshCw"
          >
            {isVerified ? 'Simulate Unverified State' : 'Re-Activate Verified Status'}
          </GlassButton>
        </div>
      </div>

      {/* MODAL 1: Document Upload & Scanner Drawer */}
      <GlassSheet
        open={showDocModal}
        onClose={() => setShowDocModal(false)}
        title="Government ID Scanner"
      >
        <div className="space-y-4 pt-2">
          <p className="text-foot text-secondary leading-relaxed">
            Select your preferred government document and verify the details for encrypted identity matching.
          </p>

          {/* Document Type Selector */}
          <div>
            <label className="text-[11px] font-bold text-tertiary uppercase tracking-wider block mb-2">
              Select Document Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: 'driver_license', label: "Driver's License" },
                  { id: 'passport', label: 'Passport' },
                  { id: 'national_id', label: 'National ID' },
                ] as const
              ).map((doc) => {
                const active = selectedDocType === doc.id;
                return (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => {
                      triggerHaptic(6);
                      setSelectedDocType(doc.id);
                    }}
                    className={`py-2.5 px-2 rounded-2xl text-[11px] font-bold text-center transition-all spring-press cursor-pointer ${
                      active
                        ? 'bg-pink-500 text-white shadow-sm ring-1 ring-pink-500'
                        : 'glass-thin text-secondary hover:text-primary'
                    }`}
                  >
                    {doc.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Document Card Scanner Frame */}
          <div className="relative rounded-3xl overflow-hidden aspect-16/10 glass-thick border-2 border-dashed border-pink-500/50 p-4 flex flex-col items-center justify-center text-center">
            {/* Animated Laser Scanning Bar */}
            {docScanning && (
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent shadow-[0_0_12px_rgb(244_114_182)] animate-float top-1/2" />
            )}

            <div className="w-12 h-12 rounded-2xl bg-pink-500/20 text-pink-500 flex items-center justify-center mb-2">
              <Camera size={24} strokeWidth={2.2} />
            </div>
            <p className="text-body font-bold text-primary">
              {docScanning ? 'Scanning Encrypted Document...' : 'Position Front of ID in Frame'}
            </p>
            <p className="text-[11px] text-secondary mt-1">
              Ensure all 4 corners are clearly visible with zero glare
            </p>
          </div>

          {/* Document Form Fields */}
          <div className="space-y-3">
            <div>
              <label htmlFor={docNumberId} className="text-foot text-secondary font-semibold block mb-1">
                Document Number
              </label>
              <input
                id={docNumberId}
                type="text"
                value={docDetails.docNumber}
                onChange={(e) => setDocDetails((prev) => ({ ...prev, docNumber: e.target.value }))}
                className="w-full bg-black/5 dark:bg-black/40 border border-white/20 dark:border-white/10 rounded-2xl p-3 text-body text-primary focus:outline-hidden focus:ring-2 focus:ring-pink-500/60"
              />
            </div>

            <div>
              <label htmlFor={countryId} className="text-foot text-secondary font-semibold block mb-1">
                Issuing Country / Jurisdiction
              </label>
              <input
                id={countryId}
                type="text"
                value={docDetails.country}
                onChange={(e) => setDocDetails((prev) => ({ ...prev, country: e.target.value }))}
                className="w-full bg-black/5 dark:bg-black/40 border border-white/20 dark:border-white/10 rounded-2xl p-3 text-body text-primary focus:outline-hidden focus:ring-2 focus:ring-pink-500/60"
              />
            </div>
          </div>

          <div className="pt-2">
            <GlassButton
              fullWidth
              onClick={handleScanDocument}
              disabled={docScanning}
              icon="Check"
            >
              {docScanning ? 'Processing...' : 'Scan & Save ID Document'}
            </GlassButton>
          </div>
        </div>
      </GlassSheet>

      {/* MODAL 2: 3D Biometric Face Scanner Simulation Drawer */}
      <GlassSheet
        open={showFaceModal}
        onClose={() => setShowFaceModal(false)}
        title="3D Face Biometric Scan"
      >
        <div className="flex flex-col items-center text-center pt-2 pb-4 space-y-4">
          <p className="text-foot text-secondary max-w-xs">
            Hold your phone at eye level. Our iOS neural engine confirms liveness in real-time.
          </p>

          {/* Interactive Biometric Camera Viewport */}
          <div className="relative w-64 h-64 rounded-full overflow-hidden glass-thick border-4 border-pink-500/40 p-2 shadow-2xl flex items-center justify-center">
            {/* Ambient scanning glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/20 via-transparent to-blue-500/20" />

            {/* Simulated camera feed (user avatar with face mesh) */}
            <img
              src={me.avatar_url || ''}
              alt="Live Face"
              className="w-full h-full object-cover rounded-full filter contrast-110"
            />

            {/* Glowing Reticle Rings */}
            <div className="absolute inset-4 rounded-full border-2 border-pink-500/60 border-dashed animate-spin [animation-duration:12s]" />

            {/* Scanning Laser Beam */}
            {faceScanStep === 'scanning' && (
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-pink-400 to-transparent shadow-[0_0_16px_rgb(244_114_182)] animate-float top-1/2" />
            )}

            {/* Success checkmark overlay */}
            {faceScanStep === 'success' && (
              <div className="absolute inset-0 bg-pink-500/60 backdrop-blur-xs flex items-center justify-center animate-scale-in">
                <div className="w-16 h-16 rounded-full bg-white text-pink-500 flex items-center justify-center shadow-xl">
                  <Check size={36} strokeWidth={3.5} />
                </div>
              </div>
            )}
          </div>

          {/* Dynamic Instructions & Confidence indicator */}
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/15 border border-pink-500/30 text-pink-500 text-foot font-bold">
              {faceScanStep === 'scanning' && 'Looking straight... Analyzing depth'}
              {faceScanStep === 'smiling' && 'Smile slightly for anti-spoofing check'}
              {faceScanStep === 'success' && '✨ Liveness confirmed (99.7% confidence)'}
            </div>
            <p className="text-[11px] text-tertiary">Hardware-accelerated neural liveness check</p>
          </div>

          {faceScanStep === 'success' && (
            <div className="w-full pt-3">
              <GlassButton
                fullWidth
                onClick={() => {
                  triggerHaptic(10);
                  setShowFaceModal(false);
                  showToast('🎉 Biometric identity verification successful!');
                }}
                icon="Check"
              >
                Complete Verification
              </GlassButton>
            </div>
          )}
        </div>
      </GlassSheet>

      {/* Floating Toast notification */}
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage('')} />}
    </div>
  );
}
