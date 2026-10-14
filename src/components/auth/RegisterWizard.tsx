import { useState } from 'react';
import { GlassButton, GlassInput, GlassCard, GlassBackButton, GlassSegmented } from '@/components/Glass';
import { StepProgressBar } from '@/components/common/StepProgressBar';
import { getIcon } from '@/lib/icons';

interface RegisterWizardProps {
  onBack: () => void;
  onComplete: () => void;
}

const availableCities = ['San Francisco', 'New York', 'Los Angeles', 'Seattle', 'Austin', 'Miami'];
const totalSteps = 4;

export function RegisterWizard({ onBack, onComplete }: RegisterWizardProps) {
  const [step, setStep] = useState(0);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('Female');
  const [age, setAge] = useState('');
  const [username, setUsername] = useState('');
  const [city, setCity] = useState('San Francisco');
  const [password, setPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [email, setEmail] = useState('');

  const Check = getIcon('Check');
  const Sparkles = getIcon('Sparkles');
  const Rocket = getIcon('Rocket');

  const canProceed = () => {
    if (step === 0) return firstName.trim() && lastName.trim() && gender;
    if (step === 1) return age && username.trim() && city;
    if (step === 2) return password.length >= 6 && acceptTerms;
    return true;
  };

  const handleNext = () => {
    if (step < totalSteps - 1) setStep(step + 1);
    else onComplete();
  };

  const handlePrev = () => {
    if (step === 0) onBack();
    else setStep(step - 1);
  };

  return (
    <div className="relative w-full h-full flex flex-col px-8 pt-16 pb-8 overflow-y-auto no-scrollbar">
      {/* Header with back button and progress bar */}
      <div className="flex items-center gap-3 mb-6">
        <GlassBackButton onClick={handlePrev} />
        <StepProgressBar currentStep={step} totalSteps={totalSteps} className="flex-1" />
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
              <GlassSegmented
                options={[
                  { label: 'Female', value: 'Female', icon: 'User' },
                  { label: 'Male', value: 'Male', icon: 'UserCheck' },
                  { label: 'Non-binary', value: 'Non-binary', icon: 'Sparkles' },
                  { label: 'Other', value: 'Other', icon: 'MoreHorizontal' },
                ]}
                value={gender}
                onChange={setGender}
              />
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
                {availableCities.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCity(c)}
                    className={`px-3 py-1.5 rounded-full text-foot font-semibold transition-all duration-300 spring-press cursor-pointer ${
                      city === c ? 'text-white shadow-sm' : 'text-tertiary hover:text-secondary'
                    }`}
                    style={
                      city === c
                        ? { background: 'linear-gradient(135deg, rgb(244 114 182), rgb(59 130 246))' }
                        : undefined
                    }
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
            <GlassInput icon="Lock" placeholder="Password (min. 6 characters)" value={password} onChange={setPassword} secure />
            <GlassCard variant="thin" className="rounded-2xl p-3 mt-2">
              <button
                type="button"
                onClick={() => setAcceptTerms(!acceptTerms)}
                className="flex items-start gap-3 text-left w-full cursor-pointer"
              >
                <div
                  className="w-6 h-6 rounded-lg shrink-0 flex items-center justify-center mt-0.5 transition-all"
                  style={{
                    background: acceptTerms
                      ? 'linear-gradient(135deg, rgb(244 114 182), rgb(59 130 246))'
                      : 'rgb(var(--glass-tint) / 0.2)',
                  }}
                >
                  {acceptTerms && <Check size={14} className="text-white" strokeWidth={3} />}
                </div>
                <span className="text-sub text-secondary">
                  I accept the <span className="text-pink-500 font-semibold">Terms of Service</span> and{' '}
                  <span className="text-pink-500 font-semibold">Privacy Policy</span>.
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
            <Sparkles size={48} className="text-white" strokeWidth={1.8} />
          </div>
          <h1 className="text-title1 text-primary font-bold">You're all set!</h1>
          <p className="text-sub text-secondary mt-2 max-w-[280px] mx-auto mb-6">
            Welcome to Ekip, {firstName || 'friend'}. Let's find your first group.
          </p>
          <GlassCard className="rounded-3xl p-4 text-left">
            <div className="flex items-center gap-3">
              <Rocket size={22} className="text-pink-500" />
              <div>
                <p className="text-body text-primary font-semibold">+50 XP</p>
                <p className="text-foot text-secondary">Registration bonus</p>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      <div className="mt-auto pt-6">
        <GlassButton size="lg" fullWidth onClick={handleNext} disabled={!canProceed()} iconRight="ArrowRight">
          {step === totalSteps - 1 ? 'Enter Ekip' : 'Continue'}
        </GlassButton>
      </div>
    </div>
  );
}
