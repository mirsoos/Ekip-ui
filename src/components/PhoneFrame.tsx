import { type ReactNode } from 'react';

// Animated aurora background — provides the dynamic reflections for the glass
export function AuroraBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(160deg, rgb(var(--bg-canvas)) 0%, rgb(var(--bg-canvas-2)) 40%, rgb(var(--bg-canvas-3)) 75%, rgb(var(--bg-canvas-4)) 100%)',
        }}
      />
      {/* Floating color blobs — liquid refraction with signature pink & blue glow */}
      <div
        className="absolute -top-16 -left-16 w-[440px] h-[440px] rounded-full blur-[85px] opacity-45 dark:opacity-8 animate-blob"
        style={{
          background:
            'radial-gradient(circle, rgb(56 189 248 / 0.50) 0%, rgb(59 130 246 / 0.25) 45%, transparent 70%)',
        }}
      />
      <div
        className="absolute top-1/4 -right-20 w-[420px] h-[420px] rounded-full blur-[90px] opacity-40 dark:opacity-7 animate-blob-rev"
        style={{
          background:
            'radial-gradient(circle, rgb(244 114 182 / 0.40) 0%, rgb(59 130 246 / 0.25) 50%, transparent 70%)',
        }}
      />
      <div
        className="absolute -bottom-28 left-1/5 w-[480px] h-[480px] rounded-full blur-[100px] opacity-35 dark:opacity-6 animate-blob"
        style={{
          background:
            'radial-gradient(circle, rgb(99 102 241 / 0.35) 0%, rgb(56 189 248 / 0.20) 45%, transparent 70%)',
        }}
      />
      <div
        className="absolute top-1/2 left-1/3 w-[340px] h-[340px] rounded-full blur-[75px] opacity-30 dark:opacity-6 animate-blob-rev"
        style={{
          background:
            'radial-gradient(circle, rgb(56 189 248 / 0.30) 0%, rgb(244 114 182 / 0.20) 60%, transparent 70%)',
        }}
      />
      {/* Subtle grain for realism */}
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}

// iPhone-style frame that wraps the app on desktop, full-screen on mobile
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      {/* On large screens, render in a phone frame. On small, fill the viewport. */}
      <div className="relative w-full h-full max-w-[440px] max-h-[960px] sm:my-auto overflow-hidden">
        {/* Frame bezel (visible on desktop) */}
        <div className="absolute inset-0 sm:shadow-[0_0_0_12px_rgb(15_23_42),0_30px_80px_rgb(0_0_0_0.5)] sm:border sm:border-white/10 pointer-events-none z-50" />
        <div className="relative w-full h-full overflow-hidden bg-transparent">
          {children}
        </div>
      </div>
    </div>
  );
}
