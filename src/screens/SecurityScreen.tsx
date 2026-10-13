import { useState } from 'react';
import { useAppData } from '@/lib/appData';
import { GlassCard, GlassButton, GlassBackButton, GlassAvatar, GlassBadgeIcon } from '@/components/Glass';
import { GlassSheet, Toast } from '@/components/Overlays';
import { SettingsSection } from '@/components/settings/SettingsSection';
import { getIcon } from '@/lib/icons';

interface SecurityScreenProps {
  onBack: () => void;
}

interface ActiveDevice {
  id: string;
  name: string;
  platform: string;
  location: string;
  ip: string;
  lastActive: string;
  isCurrent: boolean;
  type: 'phone' | 'laptop' | 'tablet';
}

interface SecurityAuditLog {
  id: string;
  action: string;
  device: string;
  location: string;
  timestamp: string;
  status: 'success' | 'flagged' | 'revoked';
}

const INITIAL_DEVICES: ActiveDevice[] = [
  {
    id: 'dev-1',
    name: 'iPhone 16 Pro',
    platform: 'iOS 26.2 · Ekip Mobile',
    location: 'London, United Kingdom',
    ip: '82.165.197.42',
    lastActive: 'Active now',
    isCurrent: true,
    type: 'phone',
  },
  {
    id: 'dev-2',
    name: 'MacBook Pro 16"',
    platform: 'macOS Sequoia · Safari 18.2',
    location: 'London, United Kingdom',
    ip: '82.165.197.42',
    lastActive: '2 hours ago',
    isCurrent: false,
    type: 'laptop',
  },
  {
    id: 'dev-3',
    name: 'iPad Air (5th Gen)',
    platform: 'iPadOS 26.1 · Ekip App',
    location: 'Oxford, United Kingdom',
    ip: '146.198.81.12',
    lastActive: 'Yesterday at 18:24',
    isCurrent: false,
    type: 'tablet',
  },
];

const INITIAL_AUDIT_LOGS: SecurityAuditLog[] = [
  {
    id: 'log-1',
    action: 'Biometric Face ID Session Verified',
    device: 'iPhone 16 Pro',
    location: 'London, UK',
    timestamp: 'Today, 10:14 AM',
    status: 'success',
  },
  {
    id: 'log-2',
    action: 'Passkey Signed in via iCloud',
    device: 'MacBook Pro 16"',
    location: 'London, UK',
    timestamp: 'Today, 08:32 AM',
    status: 'success',
  },
  {
    id: 'log-3',
    action: '2FA Token Generated for Web Session',
    device: 'Safari Browser',
    location: 'London, UK',
    timestamp: 'Oct 11, 21:05 PM',
    status: 'success',
  },
  {
    id: 'log-4',
    action: 'Unrecognized IP Login Attempt Blocked',
    device: 'Android Chrome 118',
    location: 'Frankfurt, Germany',
    timestamp: 'Oct 08, 03:12 AM',
    status: 'flagged',
  },
];

const RECOVERY_CODES = [
  'EKIP-89A2-94CF',
  'EKIP-47K1-82MN',
  'EKIP-93X9-11QA',
  'EKIP-60Z3-88PP',
  'EKIP-12B7-44VK',
  'EKIP-75D0-39LQ',
  'EKIP-33W6-72RZ',
  'EKIP-58C4-90TK',
];

export function SecurityScreen({ onBack }: SecurityScreenProps) {
  const { me, profiles, addNotification } = useAppData();

  // Security Toggles
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [passkeyRegistered, setPasskeyRegistered] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [geoFencingGuard, setGeoFencingGuard] = useState(true);
  const [autoLockDuration, setAutoLockDuration] = useState<'immediate' | '1m' | '5m' | '15m'>('5m');

  // Devices & Logs
  const [devices, setDevices] = useState<ActiveDevice[]>(INITIAL_DEVICES);
  const [auditLogs, setAuditLogs] = useState<SecurityAuditLog[]>(INITIAL_AUDIT_LOGS);

  // Sheets and Modals
  const [showPasswordSheet, setShowPasswordSheet] = useState(false);
  const [showRecoverySheet, setShowRecoverySheet] = useState(false);
  const [showAuditSheet, setShowAuditSheet] = useState(false);
  const [showTrustedContactSheet, setShowTrustedContactSheet] = useState(false);
  const [selectedRecoveryContact, setSelectedRecoveryContact] = useState<string | null>(profiles[1]?.id ?? null);
  const [showEmergencyLockConfirm, setShowEmergencyLockConfirm] = useState(false);

  // Password Sheet States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPasswordText, setShowCurrentPasswordText] = useState(false);
  const [showNewPasswordText, setShowNewPasswordText] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState('');

  // Icons
  const ShieldCheck = getIcon('ShieldCheck');
  const Lock = getIcon('Lock');
  const Fingerprint = getIcon('Fingerprint');
  const Eye = getIcon('Eye');
  const EyeOff = getIcon('EyeOff');
  const Check = getIcon('Check');
  const Sparkles = getIcon('Sparkles');
  const ChevronRight = getIcon('ChevronRight');
  const Copy = getIcon('Copy');
  const Ban = getIcon('Ban');
  const AlertCircle = getIcon('AlertCircle');
  const Wifi = getIcon('Wifi');
  const Clock = getIcon('Clock');
  const User = getIcon('User');

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
    setTimeout(() => setToastMessage(''), 2800);
  };

  // Password strength calculation
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: 'Empty', color: 'bg-zinc-400' };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-rose-500' };
    if (score === 2) return { score: 2, label: 'Fair', color: 'bg-amber-500' };
    if (score === 3 || score === 4) return { score: 3, label: 'Strong', color: 'bg-blue-500' };
    return { score: 4, label: 'Fortified', color: 'bg-emerald-500' };
  };

  const pwdStrength = getPasswordStrength(newPassword);

  const handleToggle = (
    setter: React.Dispatch<React.SetStateAction<boolean>>,
    value: boolean,
    label: string
  ) => {
    triggerHaptic(10);
    setter(!value);
    showToast(`${label} ${!value ? 'activated' : 'deactivated'}`);
  };

  const handleRevokeDevice = (deviceId: string, deviceName: string) => {
    triggerHaptic(14);
    setDevices((prev) => prev.filter((d) => d.id !== deviceId));
    setAuditLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        action: `Session revoked for ${deviceName}`,
        device: deviceName,
        location: 'Current device',
        timestamp: 'Just now',
        status: 'revoked',
      },
      ...prev,
    ]);
    showToast(`${deviceName} session revoked`);
    addNotification({
      type: 'system',
      title: 'Device Signed Out',
      body: `Session for ${deviceName} was terminated remotely.`,
      icon: 'Shield',
    });
  };

  const handleRevokeAllOtherDevices = () => {
    triggerHaptic(18);
    const nonCurrentCount = devices.filter((d) => !d.isCurrent).length;
    setDevices((prev) => prev.filter((d) => d.isCurrent));
    showToast(`Signed out ${nonCurrentCount} other devices`);
    addNotification({
      type: 'system',
      title: 'Global Sign Out Completed',
      body: `All other ${nonCurrentCount} remote active sessions were terminated.`,
      icon: 'ShieldCheck',
    });
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      showToast('Please enter your current password');
      return;
    }
    if (newPassword.length < 8) {
      showToast('New password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match');
      return;
    }

    triggerHaptic(15);
    setShowPasswordSheet(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showToast('Password updated successfully');
    addNotification({
      type: 'system',
      title: 'Password Changed',
      body: 'Your master account password was updated. Keep your credentials secure.',
      icon: 'Lock',
    });
  };

  const handleCopyCodes = () => {
    triggerHaptic(8);
    try {
      navigator.clipboard.writeText(RECOVERY_CODES.join('\n'));
      showToast('Backup codes copied to clipboard');
    } catch {
      showToast('Codes copied');
    }
  };

  const handleRegisterNewPasskey = () => {
    triggerHaptic(16);
    setPasskeyRegistered(true);
    showToast('Hardware Passkey enrolled via WebAuthn');
    addNotification({
      type: 'system',
      title: 'New Passkey Added',
      body: 'Hardware biometric passkey enrolled for lightning login.',
      icon: 'Fingerprint',
    });
  };

  const handleSelectRecoveryFriend = (friendId: string, friendName: string) => {
    triggerHaptic(10);
    setSelectedRecoveryContact(friendId);
    setShowTrustedContactSheet(false);
    showToast(`${friendName} designated as recovery contact`);
    addNotification({
      type: 'system',
      title: 'Recovery Contact Updated',
      body: `${friendName} can now verify emergency account recovery requests.`,
      icon: 'UserCheck',
    });
  };

  const chosenFriend = profiles.find((p) => p.id === selectedRecoveryContact);

  return (
    <div className="h-full overflow-y-auto no-scrollbar screen-enter-items pb-6">
      {/* Sticky Liquid Glass Navigation Header */}
      <div className="sticky top-0 z-30 glass glass-specular px-5 pt-3 pb-3 border-b border-white/20 dark:border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GlassBackButton onClick={onBack} />
            <div>
              <h1 className="text-title1 text-primary font-bold">Security</h1>
              <p className="text-[11px] text-tertiary">2FA, authentication, devices & safeguards</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full glass-thin border border-emerald-500/30 text-[11px] font-bold text-emerald-500 shadow-xs">
            <ShieldCheck size={13} className="text-emerald-500" strokeWidth={2.4} />
            <span>Fortified</span>
          </div>
        </div>
      </div>

      <div className="px-5 mt-4 space-y-5">
        {/* Security Health & Defense Card - Sleek Emerald & Cyan glass with minimal restrained pink hint */}
        <div className="relative rounded-3xl overflow-hidden p-5 glass glass-specular border border-emerald-500/30 shadow-lg">
          {/* Subtle Ambient Defense Glow (Cyan/Emerald) */}
          <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex items-start justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-emerald-500/40 shadow-inner">
                  <ShieldCheck size={28} className="text-emerald-500" strokeWidth={2.3} />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md ring-2 ring-[rgb(var(--bg-canvas))]">
                  <Check size={11} strokeWidth={3} />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-body text-primary font-bold">Account Defense Grade</h2>
                  <GlassBadgeIcon
                    icon="ShieldCheck"
                    label="Grade A+"
                    color="blue"
                  />
                </div>
                <p className="text-caption text-secondary mt-0.5">
                  Multi-factor protection active · 0 compromised alerts
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-2xl font-black text-emerald-500">96</span>
              <span className="text-[11px] text-tertiary block font-medium">/ 100 Safe</span>
            </div>
          </div>

          {/* 4 Security Pillars Progress Indicator */}
          <div className="mt-4 pt-3.5 border-t border-white/15 dark:border-white/10 grid grid-cols-4 gap-2 text-center">
            <div className="p-2 rounded-xl bg-white/50 dark:bg-white/5 border border-white/20">
              <span className="text-[10px] text-tertiary block font-medium">2FA</span>
              <span className="text-caption font-bold text-emerald-500">Active</span>
            </div>
            <div className="p-2 rounded-xl bg-white/50 dark:bg-white/5 border border-white/20">
              <span className="text-[10px] text-tertiary block font-medium">Biometrics</span>
              <span className="text-caption font-bold text-emerald-500">Enabled</span>
            </div>
            <div className="p-2 rounded-xl bg-white/50 dark:bg-white/5 border border-white/20">
              <span className="text-[10px] text-tertiary block font-medium">Passkeys</span>
              <span className="text-caption font-bold text-emerald-500">Enrolled</span>
            </div>
            <div className="p-2 rounded-xl bg-white/50 dark:bg-white/5 border border-white/20">
              <span className="text-[10px] text-tertiary block font-medium">Devices</span>
              <span className="text-caption font-bold text-primary">{devices.length}</span>
            </div>
          </div>
        </div>

        {/* Section 1: Authentication & Access */}
        <SettingsSection title="Authentication & Access">
          <GlassCard className="rounded-3xl overflow-hidden divide-y divide-white/10 dark:divide-white/5">
            {/* Two-Factor Authentication */}
            <div className="p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgb(16 185 129 / 0.15)' }}
                >
                  <Lock size={19} className="text-emerald-500" strokeWidth={2.2} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-body font-semibold text-primary">Two-Factor Authentication</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-emerald-500/15 text-emerald-500 border border-emerald-500/20">
                      Recommended
                    </span>
                  </div>
                  <p className="text-caption text-secondary">
                    Require authentication code from your authenticator app
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleToggle(setTwoFactorEnabled, twoFactorEnabled, 'Two-Factor Authentication')}
                aria-label="Toggle Two-Factor Authentication"
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  twoFactorEnabled ? 'bg-emerald-500' : 'bg-zinc-400/50 dark:bg-zinc-600'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    twoFactorEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Emergency Recovery Codes Button */}
            {twoFactorEnabled && (
              <button
                type="button"
                onClick={() => {
                  triggerHaptic(8);
                  setShowRecoverySheet(true);
                }}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/30 dark:hover:bg-white/5 transition-colors text-left"
              >
                <div className="flex items-center gap-3 pl-2">
                  <Sparkles size={16} className="text-secondary" />
                  <div>
                    <span className="text-foot font-semibold text-primary">Emergency Backup Codes</span>
                    <p className="text-[11px] text-tertiary">8 one-time fallback keys stored</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-secondary">
                  <span className="text-[12px] font-medium text-tertiary">View</span>
                  <ChevronRight size={16} />
                </div>
              </button>
            )}

            {/* Biometric App Lock */}
            <div className="p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgb(59 130 246 / 0.15)' }}
                >
                  <Fingerprint size={19} className="text-blue-500" strokeWidth={2.2} />
                </div>
                <div>
                  <span className="text-body font-semibold text-primary">Biometric App Lock</span>
                  <p className="text-caption text-secondary">
                    Require Face ID or fingerprint when reopening Ekip
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleToggle(setBiometricEnabled, biometricEnabled, 'Biometric Lock')}
                aria-label="Toggle Biometric Lock"
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  biometricEnabled ? 'bg-blue-500' : 'bg-zinc-400/50 dark:bg-zinc-600'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    biometricEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Hardware Passkey */}
            <div className="p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgb(147 51 234 / 0.15)' }}
                >
                  <ShieldCheck size={19} className="text-purple-500" strokeWidth={2.2} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-body font-semibold text-primary">FIDO2 Passkeys</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-purple-500/15 text-purple-500 border border-purple-500/20">
                      Syncing
                    </span>
                  </div>
                  <p className="text-caption text-secondary">
                    {passkeyRegistered ? 'iCloud / Google Keychain synced' : 'Passwordless secure logins'}
                  </p>
                </div>
              </div>
              <GlassButton
                size="sm"
                variant="ghost"
                onClick={handleRegisterNewPasskey}
                className="text-primary font-semibold text-[12px]"
              >
                {passkeyRegistered ? 'Manage' : 'Add Key'}
              </GlassButton>
            </div>

            {/* Change Master Password */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic(8);
                setShowPasswordSheet(true);
              }}
              className="w-full p-4 flex items-center justify-between hover:bg-white/30 dark:hover:bg-white/5 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgb(244 114 182 / 0.15)' }}
                >
                  <Lock size={19} className="text-pink-500" strokeWidth={2.2} />
                </div>
                <div>
                  <span className="text-body font-semibold text-primary">Account Password</span>
                  <p className="text-caption text-secondary">Last updated 42 days ago</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-secondary">
                <span className="text-[12px] text-tertiary">Change</span>
                <ChevronRight size={16} />
              </div>
            </button>
          </GlassCard>
        </SettingsSection>

        {/* Section 2: Active Devices & Sessions */}
        <SettingsSection title="Logged-In Devices">
          <GlassCard className="rounded-3xl overflow-hidden p-4 space-y-3">
            <div className="flex items-center justify-between pb-1">
              <div>
                <span className="text-caption font-bold text-primary">Active Devices ({devices.length})</span>
                <p className="text-[11px] text-tertiary">Devices currently logged into your account</p>
              </div>
              {devices.length > 1 && (
                <button
                  type="button"
                  onClick={handleRevokeAllOtherDevices}
                  className="text-[11px] font-semibold text-rose-500 hover:text-rose-600 transition-colors"
                >
                  Revoke Others
                </button>
              )}
            </div>

            <div className="space-y-2">
              {devices.map((device) => (
                <div
                  key={device.id}
                  className="p-3 rounded-2xl glass-thin border border-white/20 dark:border-white/10 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/40 dark:bg-white/10 flex items-center justify-center relative">
                      <Wifi size={18} className="text-secondary" />
                      {device.isCurrent && (
                        <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse ring-2 ring-white/50" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-foot font-bold text-primary">{device.name}</span>
                        {device.isCurrent ? (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                            This device
                          </span>
                        ) : (
                          <span className="text-[10px] text-tertiary">{device.lastActive}</span>
                        )}
                      </div>
                      <p className="text-[11px] text-tertiary">
                        {device.location} · {device.platform}
                      </p>
                    </div>
                  </div>

                  {!device.isCurrent && (
                    <button
                      type="button"
                      onClick={() => handleRevokeDevice(device.id, device.name)}
                      className="text-[11px] font-bold text-rose-500 px-2.5 py-1 rounded-lg hover:bg-rose-500/10 transition-colors"
                    >
                      Sign Out
                    </button>
                  )}
                </div>
              ))}
            </div>
          </GlassCard>
        </SettingsSection>

        {/* Section 3: Intrusion & Anomaly Guard */}
        <SettingsSection title="Real-Time Defense & Alerts">
          <GlassCard className="rounded-3xl overflow-hidden divide-y divide-white/10 dark:divide-white/5">
            {/* Login Alerts */}
            <div className="p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgb(245 158 11 / 0.15)' }}
                >
                  <AlertCircle size={19} className="text-amber-500" strokeWidth={2.2} />
                </div>
                <div>
                  <span className="text-body font-semibold text-primary">Unrecognized Login Alerts</span>
                  <p className="text-caption text-secondary">
                    Immediate push notification & email on new device logins
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleToggle(setLoginAlerts, loginAlerts, 'Login Alerts')}
                aria-label="Toggle Unrecognized Login Alerts"
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  loginAlerts ? 'bg-amber-500' : 'bg-zinc-400/50 dark:bg-zinc-600'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    loginAlerts ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Geo-Fencing Guard */}
            <div className="p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgb(14 165 233 / 0.15)' }}
                >
                  <ShieldCheck size={19} className="text-sky-500" strokeWidth={2.2} />
                </div>
                <div>
                  <span className="text-body font-semibold text-primary">Geo-Fencing Intrusion Block</span>
                  <p className="text-caption text-secondary">
                    Flag logins originating outside your usual registered countries
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleToggle(setGeoFencingGuard, geoFencingGuard, 'Geo-Fencing Guard')}
                aria-label="Toggle Geo-Fencing Guard"
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  geoFencingGuard ? 'bg-sky-500' : 'bg-zinc-400/50 dark:bg-zinc-600'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    geoFencingGuard ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Inactivity Auto-Lock */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-secondary" />
                  <span className="text-foot font-semibold text-primary">Auto-Lock Timer</span>
                </div>
                <span className="text-[11px] text-tertiary">When app is in background</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 p-1 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/20">
                {(['immediate', '1m', '5m', '15m'] as const).map((dur) => (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => {
                      triggerHaptic(6);
                      setAutoLockDuration(dur);
                      showToast(`Auto-lock set to ${dur}`);
                    }}
                    className={`py-1.5 text-[11px] font-bold rounded-xl transition-all ${
                      autoLockDuration === dur
                        ? 'bg-white dark:bg-white/20 text-primary shadow-xs'
                        : 'text-tertiary hover:text-primary'
                    }`}
                  >
                    {dur === 'immediate' ? 'Now' : dur}
                  </button>
                ))}
              </div>
            </div>
          </GlassCard>
        </SettingsSection>

        {/* Section 4: Recovery & Trusted Contacts */}
        <SettingsSection title="Recovery & Audit">
          <GlassCard className="rounded-3xl overflow-hidden divide-y divide-white/10 dark:divide-white/5">
            {/* Trusted Recovery Contact */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic(8);
                setShowTrustedContactSheet(true);
              }}
              className="w-full p-4 flex items-center justify-between hover:bg-white/30 dark:hover:bg-white/5 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgb(99 102 241 / 0.15)' }}
                >
                  <User size={19} className="text-indigo-500" strokeWidth={2.2} />
                </div>
                <div>
                  <span className="text-body font-semibold text-primary">Emergency Recovery Contact</span>
                  <p className="text-caption text-secondary">
                    {chosenFriend ? `${chosenFriend.first_name} ${chosenFriend.last_name}` : 'Select a trusted friend'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {chosenFriend && (
                  <GlassAvatar
                    src={chosenFriend.avatar_url}
                    name={`${chosenFriend.first_name} ${chosenFriend.last_name}`}
                    size={28}
                  />
                )}
                <ChevronRight size={16} className="text-secondary" />
              </div>
            </button>

            {/* Audit Log */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic(8);
                setShowAuditSheet(true);
              }}
              className="w-full p-4 flex items-center justify-between hover:bg-white/30 dark:hover:bg-white/5 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgb(20 184 166 / 0.15)' }}
                >
                  <ShieldCheck size={19} className="text-teal-500" strokeWidth={2.2} />
                </div>
                <div>
                  <span className="text-body font-semibold text-primary">Security Audit Log</span>
                  <p className="text-caption text-secondary">Review recent sign-ins and security events</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-secondary">
                <span className="text-[12px] text-tertiary">{auditLogs.length} events</span>
                <ChevronRight size={16} />
              </div>
            </button>
          </GlassCard>
        </SettingsSection>

        {/* Section 5: Emergency Action (Danger Zone with minimal pink/rose accent) */}
        <SettingsSection title="Emergency Protocol">
          <GlassCard className="rounded-3xl overflow-hidden p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-foot font-bold text-rose-500">Self-Lock Account</span>
                <p className="text-[11px] text-tertiary mt-0.5 leading-relaxed">
                  If you suspect unauthorized access, immediately freeze your account, revoke all API tokens, and pause incoming group invites.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  triggerHaptic(12);
                  setShowEmergencyLockConfirm(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 text-[11px] font-bold hover:bg-rose-500/20 transition-colors whitespace-nowrap"
              >
                Freeze Account
              </button>
            </div>
          </GlassCard>
        </SettingsSection>

        {/* Security Footer Note */}
        <div className="text-center pt-2">
          <p className="text-[11px] text-tertiary flex items-center justify-center gap-1.5">
            <ShieldCheck size={13} className="text-emerald-500" />
            <span>End-to-end encrypted with zero-knowledge keys · Ekip Secure 2026</span>
          </p>
        </div>
      </div>

      {/* Sheet 1: Master Password Change */}
      <GlassSheet
        open={showPasswordSheet}
        onClose={() => setShowPasswordSheet(false)}
        title="Update Master Password"
      >
        <form onSubmit={handleSavePassword} className="p-5 space-y-4">
          <p className="text-caption text-secondary">
            Choose a strong passphrase with numbers, uppercase letters, and symbols.
          </p>

          {/* Current Password */}
          <div>
            <label className="text-[11px] font-bold text-secondary uppercase tracking-wider block mb-1.5">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrentPasswordText ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full bg-white/50 dark:bg-white/10 border border-white/20 rounded-2xl px-3.5 py-2.5 text-body text-primary focus:outline-hidden focus:ring-2 focus:ring-blue-500/40 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPasswordText(!showCurrentPasswordText)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-tertiary hover:text-primary"
              >
                {showCurrentPasswordText ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="text-[11px] font-bold text-secondary uppercase tracking-wider block mb-1.5">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPasswordText ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new strong password"
                className="w-full bg-white/50 dark:bg-white/10 border border-white/20 rounded-2xl px-3.5 py-2.5 text-body text-primary focus:outline-hidden focus:ring-2 focus:ring-blue-500/40 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNewPasswordText(!showNewPasswordText)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-tertiary hover:text-primary"
              >
                {showNewPasswordText ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Strength meter */}
            {newPassword && (
              <div className="mt-2 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-tertiary">Strength:</span>
                  <span className="font-bold text-primary">{pwdStrength.label}</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden flex gap-1">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`h-full flex-1 rounded-full transition-colors ${
                        pwdStrength.score >= step ? pwdStrength.color : 'bg-transparent'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-[11px] font-bold text-secondary uppercase tracking-wider block mb-1.5">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full bg-white/50 dark:bg-white/10 border border-white/20 rounded-2xl px-3.5 py-2.5 text-body text-primary focus:outline-hidden focus:ring-2 focus:ring-blue-500/40"
            />
          </div>

          <div className="pt-2 flex gap-3">
            <GlassButton
              type="button"
              variant="ghost"
              className="flex-1"
              onClick={() => setShowPasswordSheet(false)}
            >
              Cancel
            </GlassButton>
            <GlassButton
              type="submit"
              variant="primary"
              className="flex-1"
            >
              Save Password
            </GlassButton>
          </div>
        </form>
      </GlassSheet>

      {/* Sheet 2: Emergency Recovery Codes */}
      <GlassSheet
        open={showRecoverySheet}
        onClose={() => setShowRecoverySheet(false)}
        title="Emergency Backup Codes"
      >
        <div className="p-5 space-y-4">
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
            <AlertCircle size={18} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-700 dark:text-amber-300 leading-relaxed">
              Store these codes in a safe location. Each code can be used once as a bypass if you lose access to your phone or authenticator app.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {RECOVERY_CODES.map((code, idx) => (
              <div
                key={code}
                className="p-2.5 rounded-xl bg-white/40 dark:bg-white/5 border border-white/15 text-center font-mono text-[11px] font-bold text-primary select-all"
              >
                <span className="text-[9px] text-tertiary block font-sans">#{idx + 1}</span>
                {code}
              </div>
            ))}
          </div>

          <div className="pt-2 flex gap-3">
            <GlassButton
              variant="ghost"
              className="flex-1 text-[12px] flex items-center justify-center gap-1.5"
              onClick={handleCopyCodes}
            >
              <Copy size={14} />
              <span>Copy All</span>
            </GlassButton>
            <GlassButton
              variant="primary"
              className="flex-1 text-[12px]"
              onClick={() => setShowRecoverySheet(false)}
            >
              Done
            </GlassButton>
          </div>
        </div>
      </GlassSheet>

      {/* Sheet 3: Security Audit Log Sheet */}
      <GlassSheet
        open={showAuditSheet}
        onClose={() => setShowAuditSheet(false)}
        title="Security Activity Log"
      >
        <div className="p-5 space-y-3">
          <p className="text-caption text-secondary">
            Verified audit trail of account authorization events over the last 30 days.
          </p>

          <div className="space-y-2.5 max-h-96 overflow-y-auto no-scrollbar pr-1">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-2xl glass-thin border border-white/20 dark:border-white/10"
              >
                <div className="flex items-center justify-between">
                  <span className="text-foot font-bold text-primary">{log.action}</span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${
                      log.status === 'success'
                        ? 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30'
                        : log.status === 'flagged'
                        ? 'bg-rose-500/15 text-rose-500 border-rose-500/30'
                        : 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30'
                    }`}
                  >
                    {log.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-tertiary mt-1">
                  <span>{log.device} · {log.location}</span>
                  <span>{log.timestamp}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <GlassButton
              variant="ghost"
              className="w-full text-[12px]"
              onClick={() => setShowAuditSheet(false)}
            >
              Close
            </GlassButton>
          </div>
        </div>
      </GlassSheet>

      {/* Sheet 4: Trusted Recovery Contact Picker */}
      <GlassSheet
        open={showTrustedContactSheet}
        onClose={() => setShowTrustedContactSheet(false)}
        title="Emergency Recovery Friend"
      >
        <div className="p-5 space-y-3">
          <p className="text-caption text-secondary">
            In the event that you lose access to all devices and 2FA keys, your trusted contact can verify your identity so Ekip support can unlock your profile.
          </p>

          <div className="space-y-2 max-h-80 overflow-y-auto no-scrollbar pr-1">
            {profiles
              .filter((p) => p.id !== me.id)
              .map((friend) => {
                const isSelected = selectedRecoveryContact === friend.id;
                return (
                  <button
                    key={friend.id}
                    type="button"
                    onClick={() => handleSelectRecoveryFriend(friend.id, `${friend.first_name} ${friend.last_name}`)}
                    className={`w-full p-3 rounded-2xl glass-thin border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-indigo-500/50 bg-indigo-500/10'
                        : 'border-white/20 dark:border-white/10 hover:bg-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <GlassAvatar
                        src={friend.avatar_url}
                        name={`${friend.first_name} ${friend.last_name}`}
                        size={40}
                      />
                      <div className="text-left">
                        <span className="text-foot font-bold text-primary block">
                          {friend.first_name} {friend.last_name}
                        </span>
                        <span className="text-[11px] text-tertiary">@{friend.username}</span>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center">
                        <Check size={14} strokeWidth={2.8} />
                      </div>
                    )}
                  </button>
                );
              })}
          </div>

          <div className="pt-2">
            <GlassButton
              variant="ghost"
              className="w-full text-[12px]"
              onClick={() => setShowTrustedContactSheet(false)}
            >
              Cancel
            </GlassButton>
          </div>
        </div>
      </GlassSheet>

      {/* Emergency Lock Confirmation Modal */}
      {showEmergencyLockConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div className="max-w-xs w-full p-5 rounded-3xl glass glass-specular border border-rose-500/40 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 text-rose-500 mx-auto flex items-center justify-center">
              <Ban size={24} />
            </div>
            <div>
              <h3 className="text-title3 font-bold text-primary">Emergency Account Freeze?</h3>
              <p className="text-caption text-secondary mt-1">
                This will immediately sign out all devices, pause notifications, and require identity verification upon next login.
              </p>
            </div>
            <div className="flex gap-2">
              <GlassButton
                variant="ghost"
                className="flex-1 text-[12px]"
                onClick={() => setShowEmergencyLockConfirm(false)}
              >
                Cancel
              </GlassButton>
              <button
                type="button"
                onClick={() => {
                  setShowEmergencyLockConfirm(false);
                  showToast('Account frozen for security');
                  addNotification({
                    type: 'system',
                    title: 'Account Locked Remotely',
                    body: 'Emergency security lockdown initiated. All sessions severed.',
                    icon: 'AlertCircle',
                  });
                }}
                className="flex-1 py-2 px-3 rounded-2xl bg-rose-500 text-white font-bold text-[12px] shadow-md hover:bg-rose-600 transition-colors"
              >
                Confirm Lock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Feedback */}
      <Toast message={toastMessage} open={Boolean(toastMessage)} />
    </div>
  );
}
