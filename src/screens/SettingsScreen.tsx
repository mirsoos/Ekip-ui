import { useState } from 'react';
import { useAppData } from '@/lib/appData';
import { GlassCard, GlassListItem, GlassToggle, GlassButton, GlassAvatar } from '@/components/Glass';
import { GlassSheet } from '@/components/Overlays';
import { getIcon, type IconName } from '@/lib/icons';
import { useTheme } from '@/lib/theme';

interface SettingsScreenProps {
  onBack: () => void;
  onOpenPlans: () => void;
  onSignOut: () => void;
}

export function SettingsScreen({ onBack, onOpenPlans, onSignOut }: SettingsScreenProps) {
  const { me } = useAppData();
  const { theme, toggle } = useTheme();
  const [showPremium, setShowPremium] = useState(false);
  const Back = getIcon('ArrowLeft');

  return (
    <div className="h-full overflow-y-auto no-scrollbar screen-enter-items">
      <div className="sticky top-0 z-20 glass glass-specular px-5 pt-3 pb-3">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="w-10 h-10 rounded-full glass glass-specular flex items-center justify-center haptic">
            <Back size={18} className="text-primary" strokeWidth={2.2} />
          </button>
          <h1 className="text-title1 text-primary font-bold">Settings</h1>
        </div>
      </div>

      <div className="px-5 mt-4 pb-4 space-y-5">
        {/* Profile card */}
        <GlassCard className="rounded-3xl p-4 flex items-center gap-3">
          <GlassAvatar src={me.avatar_url} name={`${me.first_name} ${me.last_name}`} size={56} />
          <div className="flex-1">
            <p className="text-body text-primary font-bold">{me.first_name} {me.last_name}</p>
            <p className="text-foot text-secondary">@{me.username}</p>
          </div>
          {(() => { const C = getIcon('ChevronRight'); return <C size={20} className="text-tertiary" />; })()}
        </GlassCard>

        {/* Account */}
        <Section title="Account">
          <GlassCard className="rounded-3xl overflow-hidden">
            <GlassListItem icon="User" iconBg="rgb(59 130 246 / 0.2)" title="Personal information" subtitle="Name, username, email" showChevron onClick={() => {}} />
            <Divider />
            <GlassListItem icon="ShieldCheck" iconBg="rgb(34 197 94 / 0.2)" title="Verification" subtitle="ID and identity verification" showChevron onClick={() => {}} />
            <Divider />
            <GlassListItem icon="Lock" iconBg="rgb(168 85 247 / 0.2)" title="Privacy" subtitle="Who can find and contact you" showChevron onClick={() => {}} />
            <Divider />
            <GlassListItem icon="Fingerprint" iconBg="rgb(244 114 182 / 0.2)" title="Security" subtitle="2FA, password, devices" showChevron onClick={() => {}} />
          </GlassCard>
        </Section>

        {/* Preferences */}
        <Section title="Preferences">
          <GlassCard className="rounded-3xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgb(234 179 8 / 0.2)' }}>
                  {(() => { const I = getIcon(theme === 'dark' ? 'Moon' : 'Sun'); return <I size={18} className="text-amber-500" strokeWidth={2.2} />; })()}
                </div>
                <span className="text-body text-primary font-semibold">Dark mode</span>
              </div>
              <GlassToggle checked={theme === 'dark'} onChange={toggle} />
            </div>
            <Divider />
            <GlassListItem icon="Bell" iconBg="rgb(244 114 182 / 0.2)" title="Notifications" subtitle="Push, email, in-app" showChevron onClick={() => {}} />
            <Divider />
            <GlassListItem icon="MapPin" iconBg="rgb(16 185 129 / 0.2)" title="Location" subtitle="City and discovery radius" showChevron onClick={() => {}} />
            <Divider />
            <GlassListItem icon="Globe" iconBg="rgb(59 130 246 / 0.2)" title="Language" subtitle="English (US)" showChevron onClick={() => {}} />
          </GlassCard>
        </Section>

        {/* Premium */}
        <Section title="Premium">
          <GlassCard glow className="rounded-3xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgb(234 179 8), rgb(245 158 11))' }}>
                {(() => { const I = getIcon('Crown'); return <I size={24} className="text-white" strokeWidth={2} />; })()}
              </div>
              <div className="flex-1">
                <p className="text-body text-primary font-bold">Premium Active</p>
                <p className="text-foot text-secondary">Renews August 15</p>
              </div>
              <GlassButton size="sm" variant="secondary" onClick={() => setShowPremium(true)}>Manage</GlassButton>
            </div>
            <div className="space-y-2">
              <PremiumRow label="Profile themes" />
              <PremiumRow label="Special customization" />
              <PremiumRow label="Premium badge" />
              <PremiumRow label="Exclusive filters" />
            </div>
          </GlassCard>
        </Section>

        {/* Support */}
        <Section title="Support">
          <GlassCard className="rounded-3xl overflow-hidden">
            <GlassListItem icon="Info" iconBg="rgb(59 130 246 / 0.2)" title="Help center" showChevron onClick={() => {}} />
            <Divider />
            <GlassListItem icon="MessageSquare" iconBg="rgb(244 114 182 / 0.2)" title="Contact support" showChevron onClick={() => {}} />
            <Divider />
            <GlassListItem icon="Flag" iconBg="rgb(239 68 68 / 0.2)" title="Report a problem" showChevron onClick={() => {}} />
          </GlassCard>
        </Section>

        {/* About */}
        <Section title="About">
          <GlassCard className="rounded-3xl overflow-hidden">
            <GlassListItem icon="Sparkles" iconBg="rgb(168 85 247 / 0.2)" title="About Ekip" subtitle="Version 1.0.0" showChevron onClick={() => {}} />
            <Divider />
            <GlassListItem icon="BookOpen" iconBg="rgb(107 114 128 / 0.2)" title="Terms of Service" showChevron onClick={() => {}} />
            <Divider />
            <GlassListItem icon="BookOpen" iconBg="rgb(107 114 128 / 0.2)" title="Privacy Policy" showChevron onClick={() => {}} />
          </GlassCard>
        </Section>

        {/* Sign out */}
        <GlassButton variant="secondary" fullWidth size="lg" icon="LogOut" onClick={onSignOut} className="text-red-500">
          Sign Out
        </GlassButton>

        <p className="text-foot text-tertiary text-center">Ekip v1.0.0 · Made with care</p>
      </div>

      <GlassSheet open={showPremium} onClose={() => setShowPremium(false)} title="Premium">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgb(234 179 8), rgb(245 158 11))' }}>
              {(() => { const I = getIcon('Crown'); return <I size={24} className="text-white" strokeWidth={2} />; })()}
            </div>
            <div>
              <p className="text-body text-primary font-bold">Premium Active</p>
              <p className="text-foot text-secondary">Renews August 15</p>
            </div>
          </div>
          <div className="space-y-3">
            {['Profile themes', 'Special customization', 'Premium badge', 'Exclusive filters'].map((benefit) => (
              <PremiumRow key={benefit} label={benefit} />
            ))}
          </div>
          <GlassButton fullWidth icon="ArrowUpRight" onClick={() => { setShowPremium(false); onOpenPlans(); }}>
            View plans
          </GlassButton>
        </div>
      </GlassSheet>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-caption text-tertiary font-bold uppercase ml-4 mb-2">{title}</p>
      {children}
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-current/5 mx-4" />;
}

function PremiumRow({ label }: { label: string }) {
  const Check = getIcon('Check');
  return (
    <div className="flex items-center gap-2">
      <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: 'rgb(34 197 94 / 0.2)' }}>
        <Check size={12} className="text-green-500" strokeWidth={3} />
      </div>
      <span className="text-foot text-secondary">{label}</span>
    </div>
  );
}
