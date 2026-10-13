interface StepProgressBarProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export function StepProgressBar({ currentStep, totalSteps, className = '' }: StepProgressBarProps) {
  return (
    <div className={`flex gap-1.5 ${className}`}>
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div
          key={i}
          className="flex-1 h-1.5 rounded-full transition-all duration-500"
          style={{
            background:
              i <= currentStep
                ? 'linear-gradient(90deg, rgb(244 114 182), rgb(59 130 246))'
                : 'rgb(var(--glass-tint) / 0.2)',
          }}
        />
      ))}
    </div>
  );
}
