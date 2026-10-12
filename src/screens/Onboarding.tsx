import { useState } from 'react';
import { GlassButton, GlassCard } from '@/components/Glass';
import { getIcon } from '@/lib/icons';
import { useTheme } from '@/lib/theme';

interface OnboardingProps {
  onComplete: () => void;
}

const slides = [
  {
    icon: 'Compass' as const,
    title: 'Discover Ekips',
    desc: 'Find activity groups near you — from photo walks to startup roundtables. Filter by what you love.',
    color: 'rgb(244 114 182)',
  },
  {
    icon: 'Plus' as const,
    title: 'Create Your Own',
    desc: 'Build an Ekip in seconds. Set your rules, pick your vibe, and invite the right people.',
    color: 'rgb(59 130 246)',
  },
  {
    icon: 'MessageCircle' as const,
    title: 'Chat in Realtime',
    desc: 'Private and group chats keep your Ekip connected before and after every event.',
    color: 'rgb(16 185 129)',
  },
  {
    icon: 'Trophy' as const,
    title: 'Level Up',
    desc: 'Earn XP, complete missions, collect badges, and build your honor score as you participate.',
    color: 'rgb(234 179 8)',
  },
];

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const { theme } = useTheme();
  const slide = slides[step];
  const Icon = getIcon(slide.icon);
  const isLast = step === slides.length - 1;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-8 overflow-y-auto no-scrollbar">
      <button
        onClick={onComplete}
        className="absolute top-16 right-8 text-foot text-secondary font-semibold"
      >
        Skip
      </button>

      <div
        key={step}
        className="w-32 h-32 rounded-[36px] flex items-center justify-center mb-10 animate-scale-in glass-thick glass-specular glass-edge"
        style={{ background: `linear-gradient(135deg, ${slide.color}40, ${slide.color}20)` }}
      >
        <Icon size={64} className={`${theme === 'dark' ? 'text-white' : 'text-primary'} animate-float`} strokeWidth={1.6} />
      </div>

      <div key={`t-${step}`} className="text-center animate-rise">
        <h1 className="text-hero text-primary font-bold tracking-tight">{slide.title}</h1>
        <p className="text-body text-secondary mt-3 max-w-[300px] text-balance">{slide.desc}</p>
      </div>

      <div className="flex gap-2 mt-10">
        {slides.map((_, i) => (
          <div
            key={i}
            className="h-2 rounded-full transition-all duration-500"
            style={{
              width: i === step ? 28 : 8,
              background: i === step
                ? 'linear-gradient(90deg, rgb(244 114 182), rgb(59 130 246))'
                : 'rgb(var(--glass-tint) / 0.2)',
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-[320px] mt-10">
        <GlassButton size="lg" fullWidth onClick={() => (isLast ? onComplete() : setStep(step + 1))} iconRight={isLast ? 'Sparkles' : 'ArrowRight'}>
          {isLast ? 'Start exploring' : 'Next'}
        </GlassButton>
      </div>
    </div>
  );
}
