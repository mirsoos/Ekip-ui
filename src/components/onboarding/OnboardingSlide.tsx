import { getIcon, type IconName } from '@/lib/icons';
import { useTheme } from '@/lib/theme';

export interface SlideData {
  icon: IconName;
  title: string;
  desc: string;
  color: string;
}

interface OnboardingSlideProps {
  slide: SlideData;
  step: number;
}

export function OnboardingSlide({ slide, step }: OnboardingSlideProps) {
  const { theme } = useTheme();
  const Icon = getIcon(slide.icon);

  return (
    <div className="flex flex-col items-center text-center">
      <div
        key={`icon-${step}`}
        className="w-32 h-32 rounded-[36px] flex items-center justify-center mb-10 animate-scale-in glass-thick glass-specular glass-edge shadow-xl"
        style={{ background: `linear-gradient(135deg, ${slide.color}40, ${slide.color}20)` }}
      >
        <Icon
          size={64}
          className={`${theme === 'dark' ? 'text-white' : 'text-primary'} animate-float`}
          strokeWidth={1.6}
        />
      </div>

      <div key={`text-${step}`} className="animate-rise">
        <h1 className="text-hero text-primary font-bold tracking-tight">{slide.title}</h1>
        <p className="text-body text-secondary mt-3 max-w-[300px] text-balance">{slide.desc}</p>
      </div>
    </div>
  );
}
