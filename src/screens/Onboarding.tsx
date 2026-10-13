import { useState } from 'react';
import { GlassButton } from '@/components/Glass';
import { OnboardingSlide, type SlideData } from '@/components/onboarding/OnboardingSlide';

interface OnboardingProps {
  onComplete: () => void;
}

const slides: SlideData[] = [
  {
    icon: 'Compass',
    title: 'Discover Ekips',
    desc: 'Find activity groups near you — from photo walks to startup roundtables. Filter by what you love.',
    color: 'rgb(244 114 182)',
  },
  {
    icon: 'Plus',
    title: 'Create Your Own',
    desc: 'Build an Ekip in seconds. Set your rules, pick your vibe, and invite the right people.',
    color: 'rgb(59 130 246)',
  },
  {
    icon: 'MessageCircle',
    title: 'Chat in Realtime',
    desc: 'Private and group chats keep your Ekip connected before and after every event.',
    color: 'rgb(16 185 129)',
  },
  {
    icon: 'Trophy',
    title: 'Level Up',
    desc: 'Earn XP, complete missions, collect badges, and build your honor score as you participate.',
    color: 'rgb(234 179 8)',
  },
];

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const slide = slides[step];
  const isLast = step === slides.length - 1;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-8 overflow-y-auto no-scrollbar">
      <button
        type="button"
        onClick={onComplete}
        className="absolute top-16 right-8 text-foot text-secondary font-semibold spring-press cursor-pointer"
      >
        Skip
      </button>

      <OnboardingSlide slide={slide} step={step} />

      <div className="flex gap-2 mt-10">
        {slides.map((_, i) => (
          <div
            key={i}
            className="h-2 rounded-full transition-all duration-500"
            style={{
              width: i === step ? 28 : 8,
              background:
                i === step
                  ? 'linear-gradient(90deg, rgb(244 114 182), rgb(59 130 246))'
                  : 'rgb(var(--glass-tint) / 0.2)',
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-[320px] mt-10">
        <GlassButton
          size="lg"
          fullWidth
          onClick={() => (isLast ? onComplete() : setStep(step + 1))}
          iconRight={isLast ? 'Sparkles' : 'ArrowRight'}
        >
          {isLast ? 'Start exploring' : 'Next'}
        </GlassButton>
      </div>
    </div>
  );
}
