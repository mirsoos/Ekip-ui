import { type ReactNode, useEffect, useState } from 'react';
import { getIcon, type IconName } from '@/lib/icons';
import { GlassButton } from '@/components/Glass';

// Glass sheet — bottom sheet modal
interface GlassSheetProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  fullHeight?: boolean;
  contentClassName?: string;
}

export function GlassSheet({ open, onClose, children, title, fullHeight, contentClassName = '' }: GlassSheetProps) {
  const [isRendered, setIsRendered] = useState(open);

  useEffect(() => {
    if (open) setIsRendered(true);
    const closeTimer = open ? undefined : window.setTimeout(() => setIsRendered(false), 550);
    return () => {
      if (closeTimer) window.clearTimeout(closeTimer);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!isRendered) return null;

  return (
    <div className="screen-overlay absolute inset-0 z-50 flex items-end" onClick={onClose}>
      <div key={`backdrop-${open}`} className={`absolute inset-0 bg-black/45 dark:bg-black/75 backdrop-blur-[24px] ${open ? 'animate-fade' : 'animate-fade-out'}`} />
      <div
        key={`sheet-${open}`}
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full glass-thick glass-specular glass-edge rounded-t-[32px] ${open ? 'animate-sheet-up' : 'animate-sheet-down'} max-h-[92%] flex flex-col ${fullHeight ? 'h-[92%]' : ''}`}
      >
        <div className="flex items-center justify-between px-5 pt-3 pb-2 shrink-0">
          <div className="w-10 h-1.5 rounded-full bg-current/20 mx-auto absolute left-1/2 -translate-x-1/2 top-2.5" />
          {title && <h2 className="text-title2 text-primary font-bold mt-2">{title}</h2>}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full glass-thin glass-specular flex items-center justify-center ml-auto haptic mt-1"
          >
            {(() => { const X = getIcon('X'); return <X size={16} className="text-secondary" strokeWidth={2.4} />; })()}
          </button>
        </div>
        <div className={`overflow-y-auto no-scrollbar px-5 pb-8 pt-2 flex-1 ${contentClassName}`}>
          {children}
        </div>
      </div>
    </div>
  );
}

// Glass dialog — centered modal
interface GlassDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  body?: string;
  children?: ReactNode;
  actions?: { label: string; variant?: 'primary' | 'secondary' | 'danger'; onClick: () => void }[];
}

export function GlassDialog({ open, onClose, title, body, children, actions }: GlassDialogProps) {
  const [isRendered, setIsRendered] = useState(open);

  useEffect(() => {
    if (open) setIsRendered(true);
    const closeTimer = open ? undefined : window.setTimeout(() => setIsRendered(false), 500);
    return () => {
      if (closeTimer) window.clearTimeout(closeTimer);
    };
  }, [open]);

  if (!isRendered) return null;
  return (
    <div className="screen-overlay absolute inset-0 z-[60] flex items-center justify-center p-6" onClick={onClose}>
      <div className={`absolute inset-0 bg-black/40 dark:bg-black/75 backdrop-blur-[8px] ${open ? 'animate-fade' : 'animate-fade-out'}`} />
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-[340px] glass-thick glass-specular glass-edge rounded-[28px] p-6 ${open ? 'animate-scale-in' : 'animate-scale-out'}`}
      >
        <h2 className="text-title2 text-primary font-bold text-center">{title}</h2>
        {body && <p className="text-sub text-secondary text-center mt-2">{body}</p>}
        {children}
        {actions && (
          <div className="flex flex-col gap-2 mt-5">
            {actions.map((a, i) => (
              <GlassButton
                key={i}
                variant={a.variant ?? 'secondary'}
                fullWidth
                onClick={a.onClick}
              >
                {a.label}
              </GlassButton>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Toast — transient message
export function Toast({ message, icon = 'CheckCircle2', visible }: { message: string; icon?: IconName; visible: boolean }) {
  if (!visible) return null;
  const Icon = getIcon(icon);
  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[70] animate-pop">
      <div className="glass-thick glass-specular glass-edge rounded-2xl px-4 py-3 flex items-center gap-2.5 max-w-[300px]">
        <Icon size={20} className="text-green-500 shrink-0" strokeWidth={2.2} />
        <span className="text-sub text-primary font-medium">{message}</span>
      </div>
    </div>
  );
}
