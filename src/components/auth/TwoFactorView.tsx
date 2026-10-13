import { GlassButton, GlassBackButton } from '@/components/Glass';
import { getIcon } from '@/lib/icons';

interface TwoFactorViewProps {
  otp: string;
  setOtp: (val: string) => void;
  onBack: () => void;
  onComplete: () => void;
}

export function TwoFactorView({ otp, setOtp, onBack, onComplete }: TwoFactorViewProps) {
  const Shield = getIcon('ShieldCheck');

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-8 overflow-y-auto no-scrollbar">
      <div className="absolute top-16 left-8">
        <GlassBackButton onClick={onBack} />
      </div>

      <div className="w-20 h-20 rounded-full glass-thick glass-specular glass-edge flex items-center justify-center mb-6 animate-scale-in">
        <Shield size={36} className="text-green-500" strokeWidth={1.8} />
      </div>

      <h1 className="text-title1 text-primary font-bold text-center animate-rise">Two-Factor Authentication</h1>
      <p className="text-sub text-secondary text-center mt-2 max-w-[280px] animate-rise-d1">
        Enter the 6-digit code from your authenticator app.
      </p>

      <div className="mt-8 animate-rise-d2">
        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="000000"
          className="w-[200px] text-center text-title1 font-bold tracking-[0.5em] bg-transparent outline-none text-primary"
          style={{ letterSpacing: '0.3em' }}
          autoFocus
        />
        <div className="flex justify-center gap-2 mt-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                otp.length > i ? 'bg-pink-500' : 'bg-current/15'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="w-full max-w-[300px] mt-8 animate-rise-d3">
        <GlassButton size="lg" fullWidth onClick={onComplete} disabled={otp.length < 6}>
          Verify
        </GlassButton>
      </div>
    </div>
  );
}
