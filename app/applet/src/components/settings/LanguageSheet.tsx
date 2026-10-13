import { GlassSheet } from '@/components/Overlays';
import { GlassCard } from '@/components/Glass';
import { Check } from 'lucide-react';

const triggerHaptic = (ms: number = 8) => {
  if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
    try {
      navigator.vibrate(ms);
    } catch {
      // ignore
    }
  }
};

interface LanguageSheetProps {
  open: boolean;
  onClose: () => void;
  currentLanguage: 'en' | 'fa';
  onSelectLanguage: (lang: 'en' | 'fa') => void;
}

export function LanguageSheet({
  open,
  onClose,
  currentLanguage,
  onSelectLanguage,
}: LanguageSheetProps) {
  const languages = [
    { code: 'en' as const, label: 'English (US)', native: 'English', flag: '🇺🇸' },
    { code: 'fa' as const, label: 'Persian', native: 'فارسی', flag: '🇮🇷' },
  ];

  return (
    <GlassSheet open={open} onClose={onClose} title="Interface Language">
      <div className="space-y-3 py-2">
        <p className="text-foot text-secondary px-1">
          Select your preferred display language for Ekip. Changes apply instantly across the tactical interface.
        </p>
        <div className="space-y-2 pt-1">
          {languages.map((lang) => {
            const isSelected = currentLanguage === lang.code;
            return (
              <GlassCard
                key={lang.code}
                onClick={() => {
                  triggerHaptic(8);
                  onSelectLanguage(lang.code);
                  onClose();
                }}
                className={`rounded-2xl p-4 flex items-center justify-between cursor-pointer spring-press transition-all ${
                  isSelected
                    ? 'border-pink-500/50 bg-pink-500/10 shadow-sm'
                    : 'hover:border-white/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-500 flex items-center justify-center text-lg shadow-xs">
                    {lang.flag}
                  </div>
                  <div>
                    <p className="text-body text-primary font-bold">{lang.label}</p>
                    <p className="text-foot text-secondary font-semibold">{lang.native}</p>
                  </div>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-xs">
                    <Check size={14} strokeWidth={3} />
                  </div>
                )}
              </GlassCard>
            );
          })}
        </div>
      </div>
    </GlassSheet>
  );
}
