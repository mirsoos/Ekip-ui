import { useState, useEffect } from 'react';
import { useAppData } from '@/lib/appData';
import { GlassCard, GlassAvatar } from '@/components/Glass';
import { Toast, GlassSheet } from '@/components/Overlays';
import { getIcon } from '@/lib/icons';

interface AuthenticatorScreenProps {
  onOpenProfile: (uid: string) => void;
  onOpenOwnProfile: () => void;
  onOpenAI: () => void;
  onOpenNotifications: () => void;
}

interface TwoFAAccount {
  id: string;
  issuer: string;
  accountName: string;
  code: string;
  category: 'Cloud' | 'Dev' | 'Finance' | 'Social' | 'Work';
  icon: string;
  color: string;
}

const INITIAL_2FA_ACCOUNTS: TwoFAAccount[] = [
  { id: '1', issuer: 'GitHub', accountName: 'alex.dev@github.com', code: '482 910', category: 'Dev', icon: 'Code', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  { id: '2', issuer: 'AWS Console', accountName: 'root-admin@production', code: '915 204', category: 'Cloud', icon: 'Cloud', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  { id: '3', issuer: 'Google Workspace', accountName: 'alex@company.com', code: '331 849', category: 'Work', icon: 'Shield', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { id: '4', issuer: 'Stripe Dashboard', accountName: 'finance@startup.io', code: '702 118', category: 'Finance', icon: 'CreditCard', color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' },
  { id: '5', issuer: 'Discord Developer', accountName: 'AlexDev#0001', code: '198 426', category: 'Social', icon: 'MessageCircle', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
];

export function DiscoverScreen({
  onOpenOwnProfile,
  onOpenAI,
  onOpenNotifications,
}: AuthenticatorScreenProps) {
  const { me, notifications } = useAppData();
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const [accounts, setAccounts] = useState<TwoFAAccount[]>(INITIAL_2FA_ACCOUNTS);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [timeLeft, setTimeLeft] = useState(30);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Add modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newIssuer, setNewIssuer] = useState('');
  const [newAccountName, setNewAccountName] = useState('');
  const [newCategory, setNewCategory] = useState<'Cloud' | 'Dev' | 'Finance' | 'Social' | 'Work'>('Dev');

  const ShieldCheck = getIcon('ShieldCheck');
  const Search = getIcon('Search');
  const Plus = getIcon('Plus');
  const Copy = getIcon('Copy');
  const Check = getIcon('Check');
  const Lock = getIcon('Lock');
  const Sparkles = getIcon('Sparkles');
  const Bell = getIcon('Bell');

  // TOTP countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setAccounts((accs) =>
            accs.map((acc) => {
              const rand1 = Math.floor(100 + Math.random() * 900);
              const rand2 = Math.floor(100 + Math.random() * 900);
              return { ...acc, code: `${rand1} ${rand2}` };
            })
          );
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  };

  const handleCopyCode = (id: string, code: string, issuer: string) => {
    navigator.clipboard.writeText(code.replace(/\s+/g, ''));
    setCopiedId(id);
    showToast(`Copied 2FA code for ${issuer}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIssuer.trim() || !newAccountName.trim()) {
      showToast('Please fill in all account details');
      return;
    }
    const rand1 = Math.floor(100 + Math.random() * 900);
    const rand2 = Math.floor(100 + Math.random() * 900);
    const newAcc: TwoFAAccount = {
      id: `acc-${Date.now()}`,
      issuer: newIssuer.trim(),
      accountName: newAccountName.trim(),
      code: `${rand1} ${rand2}`,
      category: newCategory,
      icon: 'Shield',
      color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    };
    setAccounts([newAcc, ...accounts]);
    setNewIssuer('');
    setNewAccountName('');
    setShowAddModal(false);
    showToast(`Added 2FA account for ${newAcc.issuer}`);
  };

  const filteredAccounts = accounts.filter((acc) => {
    const matchesSearch =
      acc.issuer.toLowerCase().includes(search.toLowerCase()) ||
      acc.accountName.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'All' || acc.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="h-full overflow-y-auto no-scrollbar pb-32 screen-enter-items px-5 pt-6">
      {toast && <Toast message={toast} />}

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div
            onClick={onOpenOwnProfile}
            className="w-11 h-11 rounded-full overflow-hidden border border-emerald-500/40 cursor-pointer active:scale-95 transition-transform"
          >
            <GlassAvatar src={me.avatar_url} name={me.username} size={44} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-title2 font-bold text-slate-100">EKIP Authenticator</h1>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-caption text-slate-400">Zero-Knowledge 2FA Vault</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenNotifications}
            className="relative p-2.5 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Security Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-500" />
            )}
          </button>
          <button
            onClick={onOpenAI}
            className="p-2.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
            title="AI Security Assistant"
          >
            <Sparkles className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Security Status Banner */}
      <GlassCard className="p-4 mb-5 bg-gradient-to-r from-slate-900/90 to-emerald-950/40 border-emerald-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-body font-bold text-slate-100">All 2FA Tokens Secure</h3>
              <p className="text-caption text-slate-400">Encrypted AES-256 with Biometric Lock</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-semibold text-footnote flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" /> Add 2FA
          </button>
        </div>
      </GlassCard>

      {/* Search & Categories */}
      <div className="space-y-3 mb-5">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search accounts (GitHub, AWS, Stripe...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl py-3 pl-10 pr-4 text-slate-100 placeholder-slate-500 text-subbody focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {['All', 'Dev', 'Cloud', 'Finance', 'Work', 'Social'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-footnote font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-slate-950 font-semibold shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900/70 border border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 2FA Accounts List */}
      <div className="space-y-3.5">
        {filteredAccounts.length === 0 ? (
          <div className="text-center py-12">
            <Lock className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-body font-semibold text-slate-300">No authenticator accounts found</h3>
            <p className="text-caption text-slate-500 mt-1">Try another search or add a new account.</p>
          </div>
        ) : (
          filteredAccounts.map((acc) => {
            const isCopied = copiedId === acc.id;
            return (
              <GlassCard
                key={acc.id}
                className="p-4 border-slate-800/80 bg-slate-900/60 hover:border-emerald-500/40 transition-all group relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl border ${acc.color}`}>
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-body font-bold text-slate-100">{acc.issuer}</h4>
                      <p className="text-caption text-slate-400">{acc.accountName}</p>
                    </div>
                  </div>
                  <span className="text-2xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {acc.category}
                  </span>
                </div>

                <div className="flex items-center justify-between bg-slate-950/60 border border-slate-800/80 rounded-xl px-4 py-3">
                  <div className="font-mono text-xl font-bold tracking-wider text-emerald-400">
                    {acc.code}
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Countdown ring progress */}
                    <div className="relative w-7 h-7 flex items-center justify-center">
                      <svg className="w-7 h-7 -rotate-90">
                        <circle cx="14" cy="14" r="11" stroke="currentColor" strokeWidth="2" className="text-slate-800 fill-none" />
                        <circle
                          cx="14"
                          cy="14"
                          r="11"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="text-emerald-400 fill-none transition-all duration-1000"
                          strokeDasharray={69.1}
                          strokeDashoffset={69.1 * (1 - timeLeft / 30)}
                        />
                      </svg>
                      <span className="absolute text-2xs font-bold text-slate-400">{timeLeft}</span>
                    </div>

                    <button
                      onClick={() => handleCopyCode(acc.id, acc.code, acc.issuer)}
                      className={`p-2 rounded-lg transition-all ${
                        isCopied
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                      }`}
                      title="Copy 2FA code"
                    >
                      {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </GlassCard>
            );
          })
        )}
      </div>

      {/* Add Account Modal */}
      {showAddModal && (
        <GlassSheet open={showAddModal} onClose={() => setShowAddModal(false)} title="Add 2FA Account">
          <form onSubmit={handleAddAccount} className="space-y-4 pt-2">
            <div>
              <label className="block text-footnote font-semibold text-slate-300 mb-1.5">Service Name / Issuer</label>
              <input
                type="text"
                placeholder="e.g. Notion, Heroku, Bank"
                value={newIssuer}
                onChange={(e) => setNewIssuer(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3.5 text-slate-100 placeholder-slate-500 text-subbody focus:outline-none focus:border-emerald-500"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-footnote font-semibold text-slate-300 mb-1.5">Account / Email</label>
              <input
                type="text"
                placeholder="e.g. user@domain.com"
                value={newAccountName}
                onChange={(e) => setNewAccountName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3.5 text-slate-100 placeholder-slate-500 text-subbody focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-footnote font-semibold text-slate-300 mb-1.5">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as 'Cloud' | 'Dev' | 'Finance' | 'Social' | 'Work')}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3.5 text-slate-100 text-subbody focus:outline-none focus:border-emerald-500"
              >
                <option value="Dev">Dev</option>
                <option value="Cloud">Cloud</option>
                <option value="Finance">Finance</option>
                <option value="Work">Work</option>
                <option value="Social">Social</option>
              </select>
            </div>
            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-3 rounded-xl bg-slate-800 font-semibold text-slate-300 hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl bg-emerald-500 font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition-colors"
              >
                Save Account
              </button>
            </div>
          </form>
        </GlassSheet>
      )}
    </div>
  );
}
