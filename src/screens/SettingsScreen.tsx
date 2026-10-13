import { useState } from 'react';
import { useAppData } from '@/lib/appData';
import { GlassCard, GlassListItem, GlassToggle, GlassButton, GlassAvatar, GlassBackButton } from '@/components/Glass';
import { GlassSheet } from '@/components/Overlays';
import { SettingsSection } from '@/components/settings/SettingsSection';
import { SettingsDivider } from '@/components/settings/SettingsDivider';
import { PremiumFeatureRow } from '@/components/settings/PremiumFeatureRow';
import { useTheme } from '@/lib/theme';

interface SettingsScreenProps {
  onBack: () => void;
  onOpenPlans: () => void;
  onOpenPersonalInfo: () => void;
  onOpenVerification?: () => void;
  onOpenPrivacy?: () => void;
  onOpenSecurity?: () => void;
  onOpenNotifications?: () => void;
  onOpenLocation?: () => void;
  onSignOut: () => void;
}

export function SettingsScreen({ onBack, onOpenPlans, onOpenPersonalInfo, onOpenVerification, onOpenPrivacy, onOpenSecurity, onOpenNotifications, onOpenLocation, onSignOut }: SettingsScreenProps) {
  const { me } = useAppData();
  const { theme, toggle } = useTheme();
  const [showPremium, setShowPremium] = useState(false);


  return (
    <div className="h-full overflow-y-auto no-scrollbar screen-enter-items">
      <div className="sticky top-0 z-20 glass glass-specular px-5 pt-3 pb-3">
        <div className="flex items-center gap-3 mb-4">
          <GlassBackButton onClick={onBack} />
          <h1 className="text-title1 text-primary font-bold">Settings</h1>
        </div>
      </div>

      <div className="px-5 mt-4 pb-8 space-y-5">
        {/* Profile card — navigates to Personal Information */}
        <GlassCard
          onClick={onOpenPersonalInfo}
          className="rounded-3xl p-4 flex items-center gap-3 spring-press cursor-pointer hover:border-white/30 transition-all"
        >
          <GlassAvatar src={me.avatar_url} name={`${me.first_name} ${me.last_name}`} size={56} />
          <div className="flex-1 min-w-0">
            <p className="text-body text-primary font-bold truncate">
              {me.first_name} {me.last_name}
            </p>
            <p className="text-foot text-secondary truncate">@{me.username}</p>
          </div>
          <ChevronRight size={20} className="text-tertiary shrink-0" />
        </GlassCard>

        {/* Account Section */}
        <SettingsSection title="Account">
          <GlassCard className="rounded-3xl overflow-hidden">
            <GlassListItem
              icon="User"
              iconBg="rgb(59 130 246 / 0.2)"
              title="Personal information"
              subtitle="Name, username, email"
              onClick={onOpenPersonalInfo}
              showChevron
            />
            <SettingsDivider />
            <GlassListItem
              icon="ShieldCheck"
              iconBg="rgb(244 114 182 / 0.22)"
              title="Verification"
              subtitle="ID and biometric identity verification"
              onClick={onOpenVerification}
              right={
                <span className="text-[11px] font-bold text-pink-500 bg-pink-500/10 px-2 py-0.5 rounded-full border border-pink-500/20 mr-1">
                  {me.is_verified ? 'Verified' : 'Pending'}
                </span>
              }
              showChevron
            />
            <SettingsDivider />
            <GlassListItem
              icon="Lock"
              iconBg="rgb(244 114 182 / 0.22)"
              title="Privacy"
              subtitle="Who can find and contact you"
              onClick={onOpenPrivacy}
              right={
                <span className="text-[11px] font-bold text-pink-500 bg-pink-500/10 px-2 py-0.5 rounded-full border border-pink-500/20 mr-1">
                  Protected
                </span>
              }
              showChevron
            />
            <SettingsDivider />
            <GlassListItem
              icon="Fingerprint"
              iconBg="rgb(16 185 129 / 0.2)"
              title="Security"
              subtitle="2FA, password, devices"
              onClick={onOpenSecurity}
              right={
                <span className="text-[11px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 mr-1">
                  Fortified
                </span>
              }
              showChevron
            />
          </GlassCard>
        </SettingsSection>

        {/* Preferences Section */}
        <SettingsSection title="Preferences">
          <GlassCard className="rounded-3xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgb(234 179 8 / 0.2)' }}
                >
                  {theme === 'dark' ? (
                    <Moon size={18} className="text-amber-500" strokeWidth={2.2} />
                  ) : (
                    <Sun size={18} className="text-amber-500" strokeWidth={2.2} />
                  )}
                </div>
                <span className="text-body text-primary font-semibold">Dark mode</span>
              </div>
              <GlassToggle checked={theme === 'dark'} onChange={toggle} />
            </div>
            <SettingsDivider />
            <GlassListItem
              icon="Bell"
              iconBg="rgb(99 102 241 / 0.2)"
              title="Notifications"
              subtitle="Push, email, in-app"
              onClick={onOpenNotifications}
              right={
                <span className="text-[11px] font-bold text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20 mr-1">
                  Active
                </span>
              }
              showChevron
            />
            <SettingsDivider />
            <GlassListItem
              icon="MapPin"
              iconBg="rgb(16 185 129 / 0.2)"
              title="Location"
              subtitle="City and discovery radius"
              onClick={onOpenLocation}
              right={
                <span className="text-[11px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 mr-1 truncate max-w-[100px]">
                  {me.city || 'San Francisco'}
                </span>
              }
              showChevron
            />
            <SettingsDivider />
            <GlassListItem
              icon="Globe"
              iconBg="rgb(59 130 246 / 0.2)"
              title="Language"
              subtitle="English (US)"
              showChevron
            />
          </GlassCard>
        </SettingsSection>

        {/* Premium Section */}
        <SettingsSection title="Premium">
          <GlassCard glow className="rounded-3xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm"
                style={{
                  background: 'linear-gradient(135deg, rgb(234 179 8), rgb(245 158 11))',
                }}
              >
                <Crown size={24} className="text-white" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <p className="text-body text-primary font-bold">Premium Active</p>
                <p className="text-foot text-secondary">Renews August 15</p>
              </div>
              <GlassButton size="sm" variant="secondary" onClick={() => setShowPremium(true)}>
                Manage
              </GlassButton>
            </div>
            <div className="space-y-2">
              <PremiumFeatureRow label="Profile themes & customization" />
              <PremiumFeatureRow label="Verified premium badge" />
              <PremiumFeatureRow label="Exclusive activity filters" />
              <PremiumFeatureRow label="Priority matching" />
            </div>
          </GlassCard>
        </SettingsSection>

        {/* Support Section */}
        <SettingsSection title="Support">
          <GlassCard className="rounded-3xl overflow-hidden">
            <GlassListItem
              icon="HelpCircle"
              iconBg="rgb(59 130 246 / 0.2)"
              title="Help Center"
              subtitle="FAQ, guides, and tips"
              showChevron
            />
            <SettingsDivider />
            <GlassListItem
              icon="FileText"
              iconBg="rgb(107 114 128 / 0.2)"
              title="Terms of Service"
              showChevron
            />
            <SettingsDivider />
            <GlassListItem
              icon="Shield"
              iconBg="rgb(107 114 128 / 0.2)"
              title="Privacy Policy"
              showChevron
            />
          </GlassCard>
        </SettingsSection>

        {/* Sign Out Button */}
        <GlassButton fullWidth variant="danger" icon="LogOut" onClick={onSignOut} className="mt-2">
          Sign Out
        </GlassButton>

        <p className="text-center text-[11px] text-tertiary">Ekip v1.0.0 · Build 2026.10</p>
      </div>

      {/* Premium Management Sheet */}
      <GlassSheet open={showPremium} onClose={() => setShowPremium(false)} title="Manage Premium">
        <div className="space-y-4">
          <p className="text-body text-secondary">
            Your Premium subscription is active and gives you full access to all exclusive features.
          </p>
          <GlassButton fullWidth onClick={onOpenPlans}>
            View All Plans
          </GlassButton>
          <GlassButton fullWidth variant="secondary" onClick={() => setShowPremium(false)}>
            Close
          </GlassButton>
        </div>
      </GlassSheet>
    </div>
  );
}
