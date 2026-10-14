import { useState, useEffect, type ReactNode, type CSSProperties } from 'react';
import { getIcon, type IconName } from '@/lib/icons';

// ============================================
// GLASS CARD — the foundational surface
// ============================================
interface GlassCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'thick' | 'thin';
  specular?: boolean;
  edge?: boolean;
  glow?: boolean;
  caustic?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
}

export function GlassCard({
  children,
  className = '',
  variant = 'default',
  specular = true,
  edge = true,
  glow = false,
  caustic = false,
  onClick,
  style,
}: GlassCardProps) {
  const base = variant === 'thick' ? 'glass-thick' : variant === 'thin' ? 'glass-thin' : 'glass';
  const mods = [
    specular && 'glass-specular',
    edge && 'glass-edge',
    glow && 'glass-glow',
    caustic && 'glass-caustic glass-caustic-drift',
    'liquid-motion',
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <div
      onClick={onClick}
      style={style}
      className={`${base} ${mods} ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

// ============================================
// GLASS BUTTON — liquid capsule
// ============================================
interface GlassButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  icon?: IconName;
  iconRight?: IconName;
  disabled?: boolean;
  fullWidth?: boolean;
}

export function GlassButton({
  children, onClick, variant = 'primary', size = 'md',
  className = '', icon, iconRight, disabled, fullWidth,
}: GlassButtonProps) {
  const sizes = {
    sm: 'px-4 py-2 text-sub rounded-2xl gap-1.5',
    md: 'px-5 py-3 text-body rounded-3xl gap-2',
    lg: 'px-6 py-4 text-title3 rounded-3xl gap-2.5',
  };

  const variants = {
    primary: 'text-white border-0',
    secondary: 'glass glass-specular glass-edge glass-button text-primary',
    ghost: 'bg-transparent border-0 text-secondary',
    danger: 'text-white border-0',
  };

  const bgGradient = {
    primary: 'linear-gradient(135deg, rgb(244 114 182 / 0.95), rgb(59 130 246 / 0.85))',
    danger: 'linear-gradient(135deg, rgb(239 68 68 / 0.95), rgb(220 38 38 / 0.9))',
    secondary: undefined,
    ghost: undefined,
  };

  if (variant === 'secondary' || variant === 'ghost') {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} inline-flex items-center justify-center font-semibold haptic ${disabled ? 'opacity-40' : ''} ${className}`}
      >
        {icon && renderIcon(icon, size)}
        {children}
        {iconRight && renderIcon(iconRight, size)}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ background: bgGradient[variant] }}
      className={`${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} glass-button inline-flex items-center justify-center font-semibold shadow-lg ${disabled ? 'opacity-40' : ''} ${className}`}
    >
      {icon && renderIcon(icon, size)}
      {children}
      {iconRight && renderIcon(iconRight, size)}
    </button>
  );
}

function renderIcon(name: IconName, size: 'sm' | 'md' | 'lg') {
  const Icon = getIcon(name);
  const s = size === 'sm' ? 16 : size === 'lg' ? 22 : 18;
  return <Icon size={s} strokeWidth={2.2} />;
}

// ============================================
// GLASS CHIP — pill tag / filter
// ============================================
interface GlassChipProps {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
  icon?: IconName;
  className?: string;
}

export function GlassChip({ children, active, onClick, icon, className = '' }: GlassChipProps) {
  return (
    <button
      onClick={onClick}
      className={`glass-button inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-foot font-semibold whitespace-nowrap transition-all duration-300 haptic ${active ? 'text-white animate-pop' : 'glass-thin glass-specular text-secondary'} ${className}`}
      style={active ? { background: 'linear-gradient(135deg, rgb(244 114 182 / 0.9), rgb(59 130 246 / 0.8))' } : undefined}
    >
      {icon && (() => { const Icon = getIcon(icon); return <Icon size={14} strokeWidth={2.4} />; })()}
      {children}
    </button>
  );
}

// ============================================
// GLASS INPUT — liquid text field
// ============================================
interface GlassInputProps {
  value?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  type?: 'text' | 'password' | 'email' | 'tel' | 'number';
  icon?: IconName;
  label?: string;
  className?: string;
  multiline?: boolean;
  rows?: number;
  secure?: boolean;
}

export function GlassInput({
  value, onChange, placeholder, type = 'text', icon, className = '', multiline, rows = 3, secure,
}: GlassInputProps) {
  const inputCls = 'w-full bg-transparent outline-none text-body text-primary placeholder:text-tertiary';
  const wrapper = `glass-thin glass-specular rounded-3xl px-4 py-3.5 flex items-center gap-3 ${className}`;

  if (multiline) {
    return (
      <div className={wrapper}>
        <textarea
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className={`${inputCls} resize-none`}
        />
      </div>
    );
  }

  return (
    <div className={wrapper}>
      {icon && (() => { const Icon = getIcon(icon); return <Icon size={18} className="text-tertiary shrink-0" strokeWidth={2} />; })()}
      <input
        type={secure ? 'password' : type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className={inputCls}
      />
    </div>
  );
}

// ============================================
// GLASS AVATAR — profile image with glass ring
// ============================================
interface GlassAvatarProps {
  src?: string | null;
  name: string;
  size?: number;
  className?: string;
  ring?: boolean;
  online?: boolean;
}

export function GlassAvatar({ src, name, size = 44, className = '', ring = true, online }: GlassAvatarProps) {
  const initials = name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  return (
    <div className={`relative shrink-0 ${className}`} style={{ width: size, height: size }}>
      <div
        className={`w-full h-full rounded-full overflow-hidden ${ring ? 'ring-1 ring-white/30' : ''}`}
        style={{ boxShadow: '0 4px 14px rgb(15 23 42 / 0.18), inset 0 1px 1px rgb(255 255 255 / 0.3)' }}
      >
        {src ? (
          <img src={src} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white font-bold"
            style={{ fontSize: size * 0.36, background: 'linear-gradient(135deg, rgb(244 114 182), rgb(59 130 246))' }}>
            {initials}
          </div>
        )}
      </div>
      {online && (
        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 ring-2 ring-white/80 dark:ring-black/40" />
      )}
    </div>
  );
}

// ============================================
// GLASS BACK BUTTON — Telegram-style liquid circular back button
// ============================================
export function GlassBackButton({ onClick, className = '' }: { onClick: () => void; className?: string }) {
  const Back = getIcon('ArrowLeft');
  const handleClick = () => {
    if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
      try {
        navigator.vibrate(8);
      } catch {
        // ignore
      }
    }
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Go back"
      className={`w-9 h-9 rounded-full glass-thick glass-specular glass-edge flex items-center justify-center spring-press text-primary shrink-0 cursor-pointer shadow-sm ${className}`}
    >
      <Back size={18} strokeWidth={2.4} />
    </button>
  );
}

// ============================================
// GLASS SEGMENTED CONTROL — iOS segmented
// ============================================
interface GlassSegmentedProps {
  options: { label: string; value: string; icon?: IconName }[];
  value: string;
  onChange: (v: string) => void;
  className?: string;
}

export function GlassSegmented({ options, value, onChange, className = '' }: GlassSegmentedProps) {
  const activeIndex = Math.max(0, options.findIndex((option) => option.value === value));
  const count = options.length;

  const handleSelect = (v: string) => {
    if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
      try {
        navigator.vibrate(6);
      } catch {
        // ignore
      }
    }
    onChange(v);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const relX = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100));
    const relY = Math.min(100, Math.max(0, ((e.clientY - rect.top) / rect.height) * 100));
    e.currentTarget.style.setProperty('--mouse-x', `${relX.toFixed(1)}%`);
    e.currentTarget.style.setProperty('--mouse-y', `${relY.toFixed(1)}%`);
  };

  return (
    <div
      onPointerMove={handlePointerMove}
      className={`relative glass-thin glass-specular rounded-2xl p-1 grid liquid-motion ${className}`}
      style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-y-1 rounded-xl glass-lens pointer-events-none liquid-motion transition-all duration-300 ease-[cubic-bezier(0.25,1,0.3,1)]"
        style={{
          width: `calc((100% - 0.5rem) / ${count})`,
          left: '0.25rem',
          transform: `translateX(${activeIndex * 100}%)`,
        }}
      />
      {options.map((opt) => {
        const active = opt.value === value;
        const Icon = opt.icon ? getIcon(opt.icon) : null;
        return (
          <button
            key={opt.value}
            onClick={() => handleSelect(opt.value)}
            className={`relative z-10 flex items-center justify-center gap-1.5 py-2 rounded-xl text-foot font-semibold transition-all duration-200 spring-press cursor-pointer ${
              active ? 'text-primary font-bold' : 'text-tertiary hover:text-secondary'
            }`}
          >
            {Icon && <Icon size={15} strokeWidth={active ? 2.5 : 2} />}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

// ============================================
// GLASS PROGRESS — XP / mission progress
// ============================================
interface GlassProgressProps {
  value: number;
  max: number;
  className?: string;
  color?: 'accent' | 'success' | 'warning';
  animateFromZero?: boolean;
}

export function GlassProgress({
  value,
  max,
  className = '',
  color = 'accent',
  animateFromZero = false,
}: GlassProgressProps) {
  const [currentVal, setCurrentVal] = useState(animateFromZero ? 0 : value);

  useEffect(() => {
    if (animateFromZero) {
      const t = setTimeout(() => {
        setCurrentVal(value);
      }, 50);
      return () => clearTimeout(t);
    } else {
      setCurrentVal(value);
    }
  }, [value, animateFromZero]);

  const pct = Math.min(100, Math.max(0, (currentVal / max) * 100));
  const colors = {
    accent: 'linear-gradient(90deg, rgb(244 114 182), rgb(59 130 246))',
    success: 'linear-gradient(90deg, rgb(34 197 94), rgb(16 185 129))',
    warning: 'linear-gradient(90deg, rgb(234 179 8), rgb(245 158 11))',
  };
  return (
    <div className={`glass-thin rounded-full h-2.5 overflow-hidden ${className}`}>
      <div
        className="h-full rounded-full transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ width: `${pct}%`, background: colors[color], boxShadow: '0 0 12px rgb(244 114 182 / 0.5)' }}
      />
    </div>
  );
}

// ============================================
// GLASS BADGE — verification / premium pill
// ============================================
interface GlassBadgeProps {
  icon: IconName;
  label: string;
  color?: string;
  className?: string;
}

export function GlassBadgeIcon({ icon, label, color = 'pink', className = '' }: GlassBadgeProps) {
  const Icon = getIcon(icon);
  const colorMap: Record<string, string> = {
    pink: 'rgb(244 114 182)',
    blue: 'rgb(59 130 246)',
    green: 'rgb(34 197 94)',
    amber: 'rgb(234 179 8)',
    purple: 'rgb(168 85 247)',
  };
  return (
    <div
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-caption font-bold ${className}`}
      style={{ color: colorMap[color] ?? color, background: `${colorMap[color] ?? color}20` }}
    >
      <Icon size={11} strokeWidth={2.5} />
      {label}
    </div>
  );
}

// ============================================
// GLASS TOGGLE — iOS switch
// ============================================
interface GlassToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}

export function GlassToggle({ checked, onChange, label }: GlassToggleProps) {
  return (
    <div className="flex items-center gap-3">
      {label && <span className="text-body text-primary">{label}</span>}
      <button
        onClick={() => onChange(!checked)}
        className="relative w-[52px] h-[32px] rounded-full transition-all duration-300 haptic"
        style={{
          background: checked
            ? 'linear-gradient(135deg, rgb(34 197 94), rgb(16 185 129))'
            : 'rgb(var(--glass-tint) / 0.3)',
          boxShadow: 'inset 0 1px 2px rgb(0 0 0 / 0.15)',
        }}
      >
        <div
          className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300"
          style={{ left: checked ? '24px' : '4px' }}
        />
      </button>
    </div>
  );
}

// ============================================
// GLASS LIST ITEM — iOS settings row
// ============================================
interface GlassListItemProps {
  icon?: IconName;
  iconBg?: string;
  title: string;
  subtitle?: string;
  right?: ReactNode;
  onClick?: () => void;
  showChevron?: boolean;
  avatar?: string | null;
  avatarName?: string;
}

export function GlassListItem({
  icon, iconBg, title, subtitle, right, onClick, showChevron, avatar, avatarName,
}: GlassListItemProps) {
  const Icon = icon ? getIcon(icon) : null;
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 ${onClick ? 'cursor-pointer haptic-soft' : ''}`}
    >
      {avatar && <GlassAvatar src={avatar} name={avatarName ?? title} size={40} />}
      {Icon && !avatar && (
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: iconBg ?? 'rgb(244 114 182 / 0.15)' }}
        >
          <Icon size={18} className="text-white" strokeWidth={2.2} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="text-body text-primary font-semibold truncate">{title}</div>
        {subtitle && <div className="text-foot text-secondary truncate">{subtitle}</div>}
      </div>
      {right}
      {showChevron && (() => { const C = getIcon('ChevronRight'); return <C size={18} className="text-tertiary shrink-0" />; })()}
    </div>
  );
}

// ============================================
// GLASS SECTION HEADER
// ============================================
export function GlassSectionHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between px-1 mb-3">
      <h3 className="text-title3 text-primary font-bold">{title}</h3>
      {action}
    </div>
  );
}

// ============================================
// GLASS EMPTY STATE
// ============================================
interface GlassEmptyProps {
  icon: IconName;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function GlassEmpty({ icon, title, subtitle, action }: GlassEmptyProps) {
  const Icon = getIcon(icon);
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="w-16 h-16 rounded-full glass glass-specular glass-edge flex items-center justify-center mb-4 animate-float">
        <Icon size={28} className="text-tertiary" strokeWidth={1.8} />
      </div>
      <h3 className="text-title3 text-primary font-bold mb-1">{title}</h3>
      {subtitle && <p className="text-sub text-secondary max-w-xs">{subtitle}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
