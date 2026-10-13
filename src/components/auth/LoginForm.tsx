import { useState } from 'react';
import { GlassButton, GlassInput, GlassBackButton } from '@/components/Glass';
import { getIcon } from '@/lib/icons';

interface LoginFormProps {
  onBack: () => void;
  onSubmit: () => void;
  onOAuth: () => void;
}

export function LoginForm({ onBack, onSubmit, onOAuth }: LoginFormProps) {
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone' | 'username'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');

  const loginMethods = ['email', 'phone', 'username'] as const;
  const activeMethodIndex = loginMethods.indexOf(loginMethod);

  return (
    <div className="relative w-full h-full flex flex-col px-8 pt-16 pb-8 overflow-y-auto no-scrollbar">
      <GlassBackButton onClick={onBack} className="mb-6" />

      <h1 className="text-hero text-primary font-bold animate-rise">Welcome back</h1>
      <p className="text-sub text-secondary mt-1 animate-rise-d1">Sign in to your Ekip account</p>

      {/* Tabs */}
      <div className="mt-6 animate-rise-d2">
        <div className="relative glass-thin glass-specular rounded-2xl p-1 flex gap-1">
          <div
            aria-hidden="true"
            className="absolute inset-y-1 left-1 w-[calc((100%-0.5rem)/3)] rounded-xl glass-lens pointer-events-none transition-transform duration-500 ease-out"
            style={{ transform: `translateX(${activeMethodIndex * 100}%)` }}
          />
          {loginMethods.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setLoginMethod(m)}
              className={`relative z-10 flex-1 py-2 rounded-xl text-foot font-semibold capitalize transition-colors spring-press cursor-pointer ${
                loginMethod === m ? 'text-primary font-bold' : 'text-tertiary hover:text-secondary'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Input fields */}
      <div key={loginMethod} className="flex flex-col gap-3 mt-4 animate-rise-d3">
        {loginMethod === 'email' && (
          <GlassInput icon="Mail" placeholder="Email address" value={email} onChange={setEmail} type="email" />
        )}
        {loginMethod === 'phone' && (
          <GlassInput icon="Phone" placeholder="Phone number" value={phone} onChange={setPhone} type="tel" />
        )}
        {loginMethod === 'username' && (
          <GlassInput icon="User" placeholder="Username" value={username} onChange={setUsername} />
        )}
        <GlassInput icon="Lock" placeholder="Password" value={password} onChange={setPassword} secure />

        <button type="button" className="text-foot text-secondary text-right font-medium hover:text-primary transition-colors">
          Forgot password?
        </button>

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
        {(['Apple', 'Google'] as const).map((p) => {
          const Icon = getIcon(p === 'Apple' ? 'Sparkles' : 'Globe');
          return (
            <button
              key={p}
              type="button"
              onClick={onOAuth}
              className="flex-1 max-w-[150px] h-12 rounded-2xl glass-thick glass-specular glass-edge flex items-center justify-center gap-2 text-sub font-semibold text-primary spring-press cursor-pointer shadow-sm"
            >
              <Icon size={18} strokeWidth={2.2} />
              {p}
            </button>
          );
        })}
      </div>
    </div>
  );
}
