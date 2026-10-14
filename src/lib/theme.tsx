import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type Theme = 'light' | 'dark';

export type ChatThemeId = 'default' | 'aurora' | 'emerald' | 'obsidian' | 'nebula' | 'sakura';

export interface ChatThemeConfig {
  id: ChatThemeId;
  name: string;
  description: string;
  myBubbleGradient: string;
  myBubbleText: string;
  theirBubbleClass: string;
  theirBubbleText: string;
  bgAura: string;
  previewColors: [string, string, string];
  accentHex: string;
}

export const CHAT_THEMES: Record<ChatThemeId, ChatThemeConfig> = {
  default: {
    id: 'default',
    name: 'Liquid Crystal',
    description: 'Classic iOS liquid glass with signature pink-blue gradient',
    myBubbleGradient: 'linear-gradient(135deg, rgb(244 114 182), rgb(59 130 246))',
    myBubbleText: 'text-white',
    theirBubbleClass: 'glass glass-specular',
    theirBubbleText: 'text-primary',
    bgAura: 'radial-gradient(circle at 50% 0%, rgba(244, 114, 182, 0.14), transparent 70%)',
    previewColors: ['#f472b6', '#3b82f6', '#10b981'],
    accentHex: '#f472b6',
  },
  aurora: {
    id: 'aurora',
    name: 'Neon Aurora',
    description: 'Vibrant sky blue and glowing neon cyan liquid lights',
    myBubbleGradient: 'linear-gradient(135deg, rgb(56 189 248), rgb(168 85 247))',
    myBubbleText: 'text-white',
    theirBubbleClass: 'glass glass-specular border-cyan-500/20',
    theirBubbleText: 'text-primary',
    bgAura: 'radial-gradient(circle at 50% 0%, rgba(56, 189, 248, 0.18), transparent 70%)',
    previewColors: ['#38bdf8', '#a855f7', '#06b6d4'],
    accentHex: '#38bdf8',
  },
  emerald: {
    id: 'emerald',
    name: 'Tactical Cyber',
    description: 'Deep emerald, electric mint, and covert matrix glass',
    myBubbleGradient: 'linear-gradient(135deg, rgb(16 185 129), rgb(6 182 212))',
    myBubbleText: 'text-white',
    theirBubbleClass: 'glass glass-specular border-emerald-500/20',
    theirBubbleText: 'text-primary',
    bgAura: 'radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.18), transparent 70%)',
    previewColors: ['#10b981', '#06b6d4', '#14b8a6'],
    accentHex: '#10b981',
  },
  obsidian: {
    id: 'obsidian',
    name: 'Stealth Onyx',
    description: 'Ultra dark midnight obsidian with royal sapphire highlights',
    myBubbleGradient: 'linear-gradient(135deg, rgb(99 102 241), rgb(79 70 229))',
    myBubbleText: 'text-white',
    theirBubbleClass: 'glass-thick border-indigo-500/20 bg-slate-900/80',
    theirBubbleText: 'text-primary',
    bgAura: 'radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.20), transparent 70%)',
    previewColors: ['#6366f1', '#4f46e5', '#3b82f6'],
    accentHex: '#6366f1',
  },
  nebula: {
    id: 'nebula',
    name: 'Cosmic Violet',
    description: 'Galactic deep purple, electric violet, and magenta haze',
    myBubbleGradient: 'linear-gradient(135deg, rgb(168 85 247), rgb(236 72 153))',
    myBubbleText: 'text-white',
    theirBubbleClass: 'glass glass-specular border-purple-500/20',
    theirBubbleText: 'text-primary',
    bgAura: 'radial-gradient(circle at 50% 0%, rgba(168, 85, 247, 0.20), transparent 70%)',
    previewColors: ['#a855f7', '#ec4899', '#8b5cf6'],
    accentHex: '#a855f7',
  },
  sakura: {
    id: 'sakura',
    name: 'Sakura Glow',
    description: 'Rose quartz, soft coral warmth, and golden hour liquid shimmer',
    myBubbleGradient: 'linear-gradient(135deg, rgb(251 113 133), rgb(245 158 11))',
    myBubbleText: 'text-white',
    theirBubbleClass: 'glass glass-specular border-rose-400/20',
    theirBubbleText: 'text-primary',
    bgAura: 'radial-gradient(circle at 50% 0%, rgba(251, 113, 133, 0.18), transparent 70%)',
    previewColors: ['#fb7185', '#f59e0b', '#f43f5e'],
    accentHex: '#fb7185',
  },
};

interface ThemeContextValue {
  theme: Theme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
  chatTheme: ChatThemeId;
  setChatTheme: (ct: ChatThemeId) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'dark';
    const stored = localStorage.getItem('ekip-theme') as Theme | null;
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [chatTheme, setChatThemeState] = useState<ChatThemeId>(() => {
    if (typeof window === 'undefined') return 'default';
    const stored = localStorage.getItem('ekip-chat-theme') as ChatThemeId | null;
    return stored && CHAT_THEMES[stored] ? stored : 'default';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('ekip-theme', theme);
  }, [theme]);

  const setChatTheme = (ct: ChatThemeId) => {
    setChatThemeState(ct);
    localStorage.setItem('ekip-chat-theme', ct);
  };

  const toggle = () => {
    const updateTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
    const transitionDocument = document as Document & {
      startViewTransition?: (update: () => void) => unknown;
    };

    if (transitionDocument.startViewTransition) {
      transitionDocument.startViewTransition(updateTheme);
      return;
    }

    document.documentElement.classList.add('theme-transition');
    updateTheme();
    window.setTimeout(() => document.documentElement.classList.remove('theme-transition'), 360);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggle, setTheme, chatTheme, setChatTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
