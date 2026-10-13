import { useState } from 'react';
import { WelcomeView } from '@/components/auth/WelcomeView';
import { LoginForm } from '@/components/auth/LoginForm';
import { TwoFactorView } from '@/components/auth/TwoFactorView';
import { RegisterWizard } from '@/components/auth/RegisterWizard';

interface AuthScreenProps {
  onComplete: () => void;
}

export function AuthScreen({ onComplete }: AuthScreenProps) {
  const [mode, setMode] = useState<'welcome' | 'login' | 'register'>('welcome');
  const [show2FA, setShow2FA] = useState(false);
  const [otp, setOtp] = useState('');

  if (mode === 'welcome') {
    return <WelcomeView onLogin={() => setMode('login')} onRegister={() => setMode('register')} />;
  }

  if (mode === 'login') {
    if (show2FA) {
      return (
        <TwoFactorView
          otp={otp}
          setOtp={setOtp}
          onBack={() => setShow2FA(false)}
          onComplete={onComplete}
        />
      );
    }
    return (
      <LoginForm
        onBack={() => setMode('welcome')}
        onSubmit={() => setShow2FA(true)}
        onOAuth={onComplete}
      />
    );
  }

  return (
    <RegisterWizard
      onBack={() => setMode('welcome')}
      onComplete={onComplete}
    />
  );
}
