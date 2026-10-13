import { useState } from 'react';
import { useAppData } from '@/lib/appData';
import { GlassCard } from '@/components/Glass';
import { Toast } from '@/components/Overlays';
import { getIcon } from '@/lib/icons';

interface ChatListScreenProps {
  onOpenConversation?: (id: string) => void;
  onOpenNotifications: () => void;
}

interface TrustedDevice {
  id: string;
  name: string;
  type: 'phone' | 'laptop' | 'tablet';
  location: string;
  ip: string;
  lastActive: string;
  isCurrent: boolean;
}

const INITIAL_DEVICES: TrustedDevice[] = [
  { id: 'd1', name: 'iPhone 16 Pro', type: 'phone', location: 'London, UK', ip: '82.165.197.42', lastActive: 'Active now', isCurrent: true },
  { id: 'd2', name: 'MacBook Pro 16"', type: 'laptop', location: 'London, UK', ip: '82.165.197.42', lastActive: '2 hours ago', isCurrent: false },
  { id: 'd3', name: 'iPad Air 5th Gen', type: 'tablet', location: 'Oxford, UK', ip: '146.198.81.12', lastActive: 'Yesterday at 18:24', isCurrent: false },
];

export function ChatListScreen({ onOpenNotifications }: ChatListScreenProps) {
  const { notifications } = useAppData();
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const [devices, setDevices] = useState<TrustedDevice[]>(INITIAL_DEVICES);
  const [toast, setToast] = useState<string | null>(null);

  const Laptop = getIcon('Laptop');
  const Smartphone = getIcon('Smartphone');
  const ShieldCheck = getIcon('ShieldCheck');
  const Trash = getIcon('Trash');
  const Bell = getIcon('Bell');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleRevokeDevice = (id: string, name: string) => {
    setDevices(devices.filter((d) => d.id !== id));
    showToast(`Revoked session and access for ${name}`);
  };

  return (
    <div className="h-full overflow-y-auto no-scrollbar pb-32 screen-enter-items px-5 pt-6">
      {toast && <Toast message={toast} />}

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-title2 font-bold text-slate-100">Trusted Devices</h1>
          <p className="text-caption text-slate-400">Manage active sessions & hardware keys</p>
        </div>
        <button
          onClick={onOpenNotifications}
          className="relative p-2.5 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white transition-colors"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-500" />}
        </button>
      </div>

      {/* Overview Card */}
      <GlassCard className="p-4 mb-5 bg-gradient-to-r from-slate-900/90 to-emerald-950/40 border-emerald-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-body font-bold text-slate-100">{devices.length} Active Sessions</h3>
              <p className="text-caption text-slate-400">All sessions encrypted with TLS 1.3</p>
            </div>
          </div>
          <button
            onClick={() => {
              setDevices(devices.filter((d) => d.isCurrent));
              showToast('Signed out all remote devices');
            }}
            className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-footnote font-semibold transition-colors"
          >
            Sign Out All Others
          </button>
        </div>
      </GlassCard>

      {/* Devices List */}
      <div className="space-y-3.5">
        {devices.map((dev) => (
          <GlassCard
            key={dev.id}
            className={`p-4 border-slate-800/80 bg-slate-900/60 transition-all ${
              dev.isCurrent ? 'border-emerald-500/40 bg-emerald-950/10' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-slate-800 text-emerald-400 border border-slate-700">
                  {dev.type === 'laptop' ? <Laptop className="w-5 h-5" /> : <Smartphone className="w-5 h-5" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-body font-bold text-slate-100">{dev.name}</h4>
                    {dev.isCurrent && (
                      <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Current Device
                      </span>
                    )}
                  </div>
                  <p className="text-caption text-slate-400">
                    {dev.location} · <span className="font-mono">{dev.ip}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-caption text-slate-400">
              <span>Last active: {dev.lastActive}</span>
              {!dev.isCurrent && (
                <button
                  onClick={() => handleRevokeDevice(dev.id, dev.name)}
                  className="flex items-center gap-1.5 text-rose-400 hover:text-rose-300 font-medium transition-colors"
                >
                  <Trash className="w-3.5 h-3.5" /> Revoke Access
                </button>
              )}
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

interface ConversationScreenProps {
  onBack: () => void;
}

export function ConversationScreen({ onBack }: ConversationScreenProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center p-5 text-center">
      <h2 className="text-title3 font-bold text-slate-200 mb-2">Device Detail</h2>
      <p className="text-caption text-slate-400 mb-4">Detailed session telemetry and IP fingerprinting.</p>
      <button onClick={onBack} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 font-semibold text-footnote">
        Go Back
      </button>
    </div>
  );
}
