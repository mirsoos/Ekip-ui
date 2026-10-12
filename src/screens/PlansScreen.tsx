import { GlassButton } from '@/components/Glass';
import { getIcon } from '@/lib/icons';

interface PlansScreenProps {
  onBack: () => void;
}

export function PlansScreen({ onBack }: PlansScreenProps) {
  const Back = getIcon('ArrowLeft');

  return (
    <div className="h-full overflow-y-auto no-scrollbar px-5 pt-4 pb-32 screen-enter-items">
      <div className="flex items-center gap-3 mb-8">
        <button onClick={onBack} className="w-10 h-10 rounded-full glass glass-specular flex items-center justify-center haptic">
          <Back size={18} className="text-primary" strokeWidth={2.2} />
        </button>
        <h1 className="text-title1 text-primary font-bold">Plans</h1>
      </div>
      <div className="text-center py-16">
        <div className="w-16 h-16 rounded-3xl mx-auto flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgb(234 179 8), rgb(245 158 11))' }}>
          {(() => { const I = getIcon('Crown'); return <I size={30} className="text-white" strokeWidth={2} />; })()}
        </div>
        <h2 className="text-title2 text-primary font-bold mt-5">Premium plans</h2>
        <p className="text-body text-secondary mt-2">Choose the plan that fits your Ekip experience.</p>
        <GlassButton variant="secondary" onClick={onBack} className="mt-6">Back</GlassButton>
      </div>
    </div>
  );
}
