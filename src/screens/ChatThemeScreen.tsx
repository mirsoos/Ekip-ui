import { useState } from 'react';
import { useTheme, CHAT_THEMES, type ChatThemeId } from '@/lib/theme';
import { GlassCard, GlassBackButton, GlassAvatar } from '@/components/Glass';
import { Toast } from '@/components/Overlays';
import { getIcon } from '@/lib/icons';

interface ChatThemeScreenProps {
  onBack: () => void;
}

export function ChatThemeScreen({ onBack }: ChatThemeScreenProps) {
  const { chatTheme, setChatTheme } = useTheme();
  const [toastMsg, setToastMsg] = useState('');

  const Check = getIcon('Check');
  const Palette = getIcon('Palette');
  const Sparkles = getIcon('Sparkles');

  const selectedConfig = CHAT_THEMES[chatTheme] ?? CHAT_THEMES.default;

  const handleSelectTheme = (id: ChatThemeId) => {
    setChatTheme(id);
    setToastMsg(`Chat theme changed to ${CHAT_THEMES[id].name}`);
    if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
      try {
        navigator.vibrate(10);
      } catch {
        // ignore
      }
    }
  };

  return (
    <div className="h-full overflow-y-auto no-scrollbar screen-enter-items">
      {/* Header */}
      <div className="sticky top-0 z-20 glass glass-specular px-5 pt-3 pb-3">
        <div className="flex items-center gap-3 mb-2">
          <GlassBackButton onClick={onBack} />
          <div>
            <h1 className="text-title1 text-primary font-bold">Chat Theme</h1>
            <p className="text-foot text-tertiary">Personalize your squad conversation bubbles</p>
          </div>
        </div>
      </div>

      <div className="px-5 mt-4 pb-12 space-y-5">
        {/* Live Preview Card */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-1 text-foot font-bold text-tertiary uppercase tracking-wider">
            <Palette size={14} className="text-pink-500" />
            <span>Live Chat Preview</span>
          </div>

          <GlassCard variant="thick" className="rounded-3xl p-4 overflow-hidden relative min-h-[200px] flex flex-col justify-between shadow-xl">
            {/* Background Aura */}
            <div
              className="absolute inset-0 pointer-events-none transition-all duration-500 opacity-80"
              style={{ background: selectedConfig.bgAura }}
            />

            {/* Chat Header Micro Preview */}
            <div className="relative z-10 flex items-center justify-between pb-3 border-b border-white/10 mb-3">
              <div className="flex items-center gap-2.5">
                <GlassAvatar name="Alex Rivera" size={32} ring={false} online />
                <div>
                  <p className="text-foot font-bold text-primary">Alpha Lead · Alex</p>
                  <p className="text-[10px] text-emerald-400 font-medium">Active now in Squad Chat</p>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full glass-thin font-semibold text-secondary">
                {selectedConfig.name}
              </span>
            </div>

            {/* Sample Messages */}
            <div className="relative z-10 space-y-3 flex-1 flex flex-col justify-end">
              {/* Incoming Bubble */}
              <div className="flex items-end gap-2 justify-start animate-rise">
                <GlassAvatar name="Alex Rivera" size={24} ring={false} />
                <div className={`max-w-[80%] px-3.5 py-2 rounded-2xl rounded-bl-xs ${selectedConfig.theirBubbleClass} ${selectedConfig.theirBubbleText} shadow-sm`}>
                  <p className="text-[10px] font-bold mb-0.5" style={{ color: selectedConfig.accentHex }}>
                    Alex Rivera
                  </p>
                  <p className="text-sub leading-snug">Ready for tonight&apos;s mission briefing? Squad is ready! 🚀</p>
                  <span className="text-[9px] text-tertiary block text-right mt-1">18:42</span>
                </div>
              </div>

              {/* Outgoing Bubble (Me) */}
              <div className="flex items-end gap-2 justify-end animate-rise">
                <div
                  className={`max-w-[80%] px-3.5 py-2 rounded-2xl rounded-br-xs ${selectedConfig.myBubbleText} shadow-md`}
                  style={{ background: selectedConfig.myBubbleGradient }}
                >
                  <p className="text-sub leading-snug">Roger that! Telemetry synced. See you at briefing. 🔥</p>
                  <span className="text-[9px] text-white/80 block text-right mt-1">18:43</span>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Theme Preset Selection Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-foot font-bold text-tertiary uppercase tracking-wider">
              Available Themes
            </span>
            <span className="text-[11px] text-pink-500 font-semibold flex items-center gap-1">
              <Sparkles size={12} />
              Instant Apply
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {Object.values(CHAT_THEMES).map((item) => {
              const isSelected = chatTheme === item.id;
              return (
                <GlassCard
                  key={item.id}
                  onClick={() => handleSelectTheme(item.id)}
                  className={`rounded-3xl p-4 flex items-center justify-between transition-all duration-300 cursor-pointer spring-press ${
                    isSelected
                      ? 'ring-2 ring-pink-500/80 shadow-lg bg-pink-500/10'
                      : 'hover:border-white/30'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    {/* Swatch Circle */}
                    <div
                      className="w-12 h-12 rounded-2xl shrink-0 p-1 flex items-center justify-center shadow-md relative overflow-hidden"
                      style={{ background: item.myBubbleGradient }}
                    >
                      <div className="w-full h-full rounded-xl bg-black/20 flex items-center justify-center">
                        <Palette size={20} className="text-white drop-shadow-xs" />
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-body text-primary font-bold truncate">{item.name}</p>
                        {isSelected && (
                          <span className="text-[10px] font-bold text-pink-500 bg-pink-500/15 px-2 py-0.5 rounded-full">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-foot text-secondary truncate mt-0.5">{item.description}</p>

                      {/* Color dots preview */}
                      <div className="flex items-center gap-1.5 mt-2">
                        {item.previewColors.map((color, idx) => (
                          <div
                            key={idx}
                            className="w-3.5 h-3.5 rounded-full ring-1 ring-white/30 shadow-2xs"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Radio Indicator */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ml-3 transition-all ${
                      isSelected
                        ? 'bg-pink-500 text-white shadow-md'
                        : 'border-2 border-white/20 text-transparent'
                    }`}
                  >
                    <Check size={16} strokeWidth={3} />
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </div>

      {toastMsg && <Toast message={toastMsg} open={Boolean(toastMsg)} />}
    </div>
  );
}
