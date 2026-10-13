import { GlassButton } from '@/components/Glass';
import { getIcon } from '@/lib/icons';
import { SocialAuthRow } from '@/components/auth/SocialAuthRow';

interface WelcomeViewProps {
  onLogin: () => void;
  onRegister: () => void;
}

export function WelcomeView({ onLogin, onRegister }: WelcomeViewProps) {
  const Users = getIcon('Users');

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-8 overflow-y-auto no-scrollbar">
      <div className="flex flex-col items-center text-center mb-10 animate-rise">
        <div
          className="w-24 h-24 rounded-[28px] flex items-center justify-center mb-6 animate-float glass-thick glass-specular glass-edge"
          style={{ background: 'linear-gradient(135deg, rgb(244 114 182 / 0.4), rgb(59 130 246 / 0.3))' }}
        >
          <Users size={48} className="text-white" strokeWidth={1.8} />
        </div>
        <h1 className="text-hero text-primary font-bold tracking-tight">Ekip</h1>
        <p className="text-body text-secondary mt-2 max-w-[280px] text-balance">
          Create, discover, and join activity groups around you.
        </p>
      </div>

      <div className="w-full max-w-[340px] flex flex-col gap-3 animate-rise-d2">
        <GlassButton size="lg" fullWidth onClick={onRegister} iconRight="ArrowRight">
          Get Started
        </GlassButton>
        <GlassButton variant="secondary" size="lg" fullWidth onClick={onLogin}>
          I already have an account
        </GlassButton>
      </div>

      <div className="flex items-center gap-3 mt-8 w-full max-w-[340px] animate-rise-d3">
        <div className="flex-1 h-px bg-current/10" />
        <span className="text-caption text-tertiary">or continue with</span>
        <div className="flex-1 h-px bg-current/10" />
      </div>

      <SocialAuthRow onSelect={onLogin} className="mt-5 animate-rise-d4" />

      <p className="text-foot text-tertiary text-center mt-8 max-w-[280px] animate-rise-d5">
        By continuing you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  );
}
