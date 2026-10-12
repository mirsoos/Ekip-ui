import { useState } from 'react';
import { GlassButton, GlassInput, GlassCard } from '@/components/Glass';
import { getIcon } from '@/lib/icons';

interface AuthScreenProps {
  onComplete: () => void;
}

export function AuthScreen({ onComplete }: AuthScreenProps) {
  const [mode, setMode] = useState<'welcome' | 'login' | 'register'>('welcome');
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone' | 'username'>('email');

  // Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [show2FA, setShow2FA] = useState(false);
  const [otp, setOtp] = useState('');

  // Register state
  const [regStep, setRegStep] = useState(0);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [city, setCity] = useState('San Francisco');
  const [regPassword, setRegPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [regEmail, setRegEmail] = useState('');

  if (mode === 'welcome') return <WelcomeScreen onLogin={() => setMode('login')} onRegister={() => setMode('register')} />;

  if (mode === 'login') {
    if (show2FA) return <TwoFactorScreen otp={otp} setOtp={setOtp} onBack={() => setShow2FA(false)} onComplete={onComplete} />;
    return (
      <LoginScreen
        loginMethod={loginMethod} setLoginMethod={setLoginMethod}
        email={email} setEmail={setEmail}
        password={password} setPassword={setPassword}
        phone={phone} setPhone={setPhone}
        username={username} setUsername={setUsername}
        onBack={() => setMode('welcome')}
        onSubmit={() => setShow2FA(true)}
        onOAuth={onComplete}
      />
    );
  }

  return (
    <RegisterScreen
      step={regStep} setStep={setRegStep}
      firstName={firstName} setFirstName={setFirstName}
      lastName={lastName} setLastName={setLastName}
      gender={gender} setGender={setGender}
      age={age} setAge={setAge}
      username={regUsername} setUsername={setRegUsername}
      city={city} setCity={setCity}
      password={regPassword} setPassword={setRegPassword}
      acceptTerms={acceptTerms} setAcceptTerms={setAcceptTerms}
      email={regEmail} setEmail={setRegEmail}
      onBack={() => (regStep === 0 ? setMode('welcome') : setRegStep(regStep - 1))}
      onComplete={onComplete}
    />
  );
}

function WelcomeScreen({ onLogin, onRegister }: { onLogin: () => void; onRegister: () => void }) {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-8 overflow-y-auto no-scrollbar">
      <div className="flex flex-col items-center text-center mb-10 animate-rise">
        <div
          className="w-24 h-24 rounded-[28px] flex items-center justify-center mb-6 animate-float glass-thick glass-specular glass-edge"
          style={{ background: 'linear-gradient(135deg, rgb(244 114 182 / 0.4), rgb(59 130 246 / 0.3))' }}
        >
          {(() => { const I = getIcon('Users'); return <I size={48} className="text-white" strokeWidth={1.8} />; })()}
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

      <div className="flex items-center justify-center gap-3 mt-5 animate-rise-d4">
        {(['Apple', 'Mail', 'Phone'] as const).map((p) => {
          const Icon = getIcon(p === 'Apple' ? 'Sparkles' : p === 'Mail' ? 'Mail' : 'Phone');
          return (
            <button key={p} onClick={onLogin} className="w-12 h-12 rounded-2xl glass glass-specular glass-edge flex items-center justify-center haptic">
              <Icon size={22} className="text-primary" strokeWidth={2} />
            </button>
          );
        })}
      </div>

      <p className="text-foot text-tertiary text-center mt-8 max-w-[280px] animate-rise-d5">
        By continuing you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  );
}

function LoginScreen({
  loginMethod, setLoginMethod, email, setEmail, password, setPassword,
  phone, setPhone, username, setUsername, onBack, onSubmit, onOAuth,
}: {
  loginMethod: 'email' | 'phone' | 'username'; setLoginMethod: (m: 'email' | 'phone' | 'username') => void;
  email: string; setEmail: (v: string) => void; password: string; setPassword: (v: string) => void;
  phone: string; setPhone: (v: string) => void; username: string; setUsername: (v: string) => void;
  onBack: () => void; onSubmit: () => void; onOAuth: () => void;
}) {
  const Back = getIcon('ArrowLeft');
  const loginMethods = ['email', 'phone', 'username'] as const;
  const activeMethodIndex = loginMethods.indexOf(loginMethod);
  return (
    <div className="relative w-full h-full flex flex-col px-8 pt-16 pb-8 overflow-y-auto no-scrollbar">
      <button onClick={onBack} className="w-9 h-9 rounded-full glass glass-specular flex items-center justify-center mb-6 haptic">
        <Back size={18} className="text-primary" strokeWidth={2.2} />
      </button>

      <h1 className="text-hero text-primary font-bold animate-rise">Welcome back</h1>
      <p className="text-sub text-secondary mt-1 animate-rise-d1">Sign in to your Ekip account</p>

      <div className="mt-6 animate-rise-d2">
        <div className="relative glass-thin glass-specular rounded-2xl p-1 flex gap-1">
          <div
            aria-hidden="true"
            className="absolute inset-y-1 left-1 w-[calc((100%-0.5rem)/3)] rounded-xl glass glass-specular pointer-events-none transition-transform duration-500 ease-out"
            style={{ transform: `translateX(${activeMethodIndex * 100}%)` }}
          />
          {loginMethods.map((m) => (
            <button
              key={m}
              onClick={() => setLoginMethod(m)}
              className={`relative z-10 flex-1 py-2 rounded-xl text-foot font-semibold capitalize transition-colors haptic ${loginMethod === m ? 'text-primary' : 'text-tertiary'}`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div key={loginMethod} className="flex flex-col gap-3 mt-4 animate-rise-d3">
        {loginMethod === 'email' && <GlassInput icon="Mail" placeholder="Email address" value={email} onChange={setEmail} type="email" />}
        {loginMethod === 'phone' && <GlassInput icon="Phone" placeholder="Phone number" value={phone} onChange={setPhone} type="tel" />}
        {loginMethod === 'username' && <GlassInput icon="User" placeholder="Username" value={username} onChange={setUsername} />}
        <GlassInput icon="Lock" placeholder="Password" value={password} onChange={setPassword} secure />

        <button className="text-foot text-secondary text-right font-medium">Forgot password?</button>

        <GlassButton size="lg" fullWidth onClick={onSubmit} className="mt-2">
          Sign In
        </GlassButton>
      </div>

      <div className="flex items-center gap-3 mt-6 animate-rise-d4">
        <div className="flex-1 h-px bg-current/10" />
        <span className="text-caption text-tertiary">or</span>
        <div className="flex-1 h-px bg-current/10" />
      </div>

      <div className="flex items-center justify-center gap-3 mt-5 animate-rise-d5">
        {(['Apple', 'Google'] as const).map((p) => (
          <button key={p} onClick={onOAuth} className="flex-1 max-w-[150px] h-12 rounded-2xl glass glass-specular glass-edge flex items-center justify-center gap-2 text-sub font-semibold text-primary haptic">
            {(() => { const I = getIcon(p === 'Apple' ? 'Sparkles' : 'Globe'); return <I size={18} strokeWidth={2} />; })()}
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}

function TwoFactorScreen({ otp, setOtp, onBack, onComplete }: { otp: string; setOtp: (v: string) => void; onBack: () => void; onComplete: () => void }) {
  const Back = getIcon('ArrowLeft');
  const Shield = getIcon('ShieldCheck');
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-8 overflow-y-auto no-scrollbar">
      <button onClick={onBack} className="absolute top-16 left-8 w-9 h-9 rounded-full glass glass-specular flex items-center justify-center haptic">
        <Back size={18} className="text-primary" strokeWidth={2.2} />
      </button>
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
        />
        <div className="flex justify-center gap-2 mt-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={`w-3 h-3 rounded-full ${otp.length > i ? 'bg-pink-500' : 'bg-current/15'}`} />
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

function RegisterScreen({
  step, setStep, firstName, setFirstName, lastName, setLastName,
  gender, setGender, age, setAge, username, setUsername,
  city, setCity, password, setPassword, acceptTerms, setAcceptTerms,
  email, setEmail, onBack, onComplete,
}: {
  step: number; setStep: (n: number) => void;
  firstName: string; setFirstName: (v: string) => void;
  lastName: string; setLastName: (v: string) => void;
  gender: string; setGender: (v: string) => void;
  age: string; setAge: (v: string) => void;
  username: string; setUsername: (v: string) => void;
  city: string; setCity: (v: string) => void;
  password: string; setPassword: (v: string) => void;
  acceptTerms: boolean; setAcceptTerms: (v: boolean) => void;
  email: string; setEmail: (v: string) => void;
  onBack: () => void; onComplete: () => void;
}) {
  const Back = getIcon('ArrowLeft');
  const Check = getIcon('Check');
  const totalSteps = 4;
  const genders = ['Male', 'Female', 'Non-binary', 'Other'];

  const canProceed = () => {
    if (step === 0) return firstName && lastName && gender;
    if (step === 1) return age && username && city;
    if (step === 2) return password && acceptTerms;
    return true;
  };

  const next = () => {
    if (step < totalSteps - 1) setStep(step + 1);
    else onComplete();
  };

  return (
    <div className="relative w-full h-full flex flex-col px-8 pt-16 pb-8 overflow-y-auto no-scrollbar">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="w-9 h-9 rounded-full glass glass-specular flex items-center justify-center haptic">
          <Back size={18} className="text-primary" strokeWidth={2.2} />
        </button>
        {/* Progress dots */}
        <div className="flex gap-1.5 flex-1">
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
      </div>

      {step === 0 && (
        <div key="register-step-0" className="animate-rise">
          <h1 className="text-title1 text-primary font-bold">Tell us about you</h1>
          <p className="text-sub text-secondary mt-1 mb-6">Let's start with the basics.</p>
          <div className="flex flex-col gap-3">
            <GlassInput icon="User" placeholder="First name" value={firstName} onChange={setFirstName} />
            <GlassInput icon="User" placeholder="Last name" value={lastName} onChange={setLastName} />
            <div>
              <p className="text-foot text-secondary mb-2 ml-1">Gender</p>
              <div className="flex flex-wrap gap-2">
                {genders.map((g) => (
                  <button
                    key={g}
                    onClick={() => setGender(g)}
                    className={`px-4 py-2 rounded-full text-foot font-semibold transition-all duration-300 haptic ${gender === g ? 'text-white animate-pop' : 'glass-thin glass-specular text-secondary'}`}
                    style={gender === g ? { background: 'linear-gradient(135deg, rgb(244 114 182), rgb(59 130 246))' } : undefined}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 1 && (
        <div key="register-step-1" className="animate-rise">
          <h1 className="text-title1 text-primary font-bold">Your identity</h1>
          <p className="text-sub text-secondary mt-1 mb-6">How old are you and where are you?</p>
          <div className="flex flex-col gap-3">
            <GlassInput icon="Calendar" placeholder="Age" value={age} onChange={setAge} type="number" />
            <GlassInput icon="User" placeholder="Username" value={username} onChange={setUsername} />
            <div>
              <p className="text-foot text-secondary mb-2 ml-1">City</p>
              <GlassCard variant="thin" className="rounded-3xl p-1.5 flex flex-wrap gap-1.5">
                {['San Francisco', 'New York', 'Los Angeles', 'Seattle', 'Austin', 'Miami'].map((c) => (
                  <button
                    key={c}
                    onClick={() => setCity(c)}
                    className={`px-3 py-1.5 rounded-full text-foot font-semibold transition-all duration-300 haptic ${city === c ? 'text-white animate-pop' : 'text-tertiary'}`}
                    style={city === c ? { background: 'linear-gradient(135deg, rgb(244 114 182), rgb(59 130 246))' } : undefined}
                  >
                    {c}
                  </button>
                ))}
              </GlassCard>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div key="register-step-2" className="animate-rise">
          <h1 className="text-title1 text-primary font-bold">Secure your account</h1>
          <p className="text-sub text-secondary mt-1 mb-6">Create a strong password.</p>
          <div className="flex flex-col gap-3">
            <GlassInput icon="Mail" placeholder="Email (optional)" value={email} onChange={setEmail} type="email" />
            <GlassInput icon="Lock" placeholder="Password" value={password} onChange={setPassword} secure />
            <GlassCard variant="thin" className="rounded-2xl p-3 mt-2">
              <button onClick={() => setAcceptTerms(!acceptTerms)} className="flex items-start gap-3 text-left">
                <div
                  className="w-6 h-6 rounded-lg shrink-0 flex items-center justify-center mt-0.5 transition-all"
                  style={{
                    background: acceptTerms ? 'linear-gradient(135deg, rgb(244 114 182), rgb(59 130 246))' : 'rgb(var(--glass-tint) / 0.2)',
                  }}
                >
                  {acceptTerms && <Check size={14} className="text-white" strokeWidth={3} />}
                </div>
                <span className="text-sub text-secondary">
                  I accept the <span className="text-pink-500 font-semibold">Terms of Service</span> and <span className="text-pink-500 font-semibold">Privacy Policy</span>.
                </span>
              </button>
            </GlassCard>
          </div>
        </div>
      )}

      {step === 3 && (
        <div key="register-step-3" className="animate-rise text-center">
          <div
            className="w-24 h-24 rounded-[28px] flex items-center justify-center mx-auto mb-6 animate-float glass-thick glass-specular glass-edge"
            style={{ background: 'linear-gradient(135deg, rgb(244 114 182 / 0.4), rgb(59 130 246 / 0.3))' }}
          >
            {(() => { const I = getIcon('Sparkles'); return <I size={48} className="text-white" strokeWidth={1.8} />; })()}
          </div>
          <h1 className="text-title1 text-primary font-bold">You're all set!</h1>
          <p className="text-sub text-secondary mt-2 max-w-[280px] mx-auto mb-6">
            Welcome to Ekip, {firstName || 'friend'}. Let's find your first group.
          </p>
          <GlassCard className="rounded-3xl p-4 text-left">
            <div className="flex items-center gap-3">
              {(() => { const I = getIcon('Rocket'); return <I size={22} className="text-pink-500" />; })()}
              <div>
                <p className="text-body text-primary font-semibold">+50 XP</p>
                <p className="text-foot text-secondary">Registration bonus</p>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      <div className="mt-auto pt-6">
        <GlassButton size="lg" fullWidth onClick={next} disabled={!canProceed()} iconRight="ArrowRight">
          {step === totalSteps - 1 ? 'Enter Ekip' : 'Continue'}
        </GlassButton>
      </div>
    </div>
  );
}
