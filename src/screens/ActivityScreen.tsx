import { useState } from 'react';
import { useAppData } from '@/lib/appData';
import { GlassCard, GlassEmpty } from '@/components/Glass';
import { Toast, GlassSheet } from '@/components/Overlays';
import { getIcon } from '@/lib/icons';

interface PasswordVaultScreenProps {
  onOpenNotifications: () => void;
}

interface VaultItem {
  id: string;
  title: string;
  username: string;
  category: 'Logins' | 'Secure Notes' | 'Credit Cards' | 'Wi-Fi';
  strength: 'Strong' | 'Medium' | 'Weak';
  maskedPassword: string;
}

const INITIAL_VAULT: VaultItem[] = [
  { id: 'v1', title: 'GitHub Enterprise', username: 'alex.dev@github', category: 'Logins', strength: 'Strong', maskedPassword: '••••••••••••••••' },
  { id: 'v2', title: 'AWS Root Console', username: 'root@aws-production', category: 'Logins', strength: 'Strong', maskedPassword: '••••••••••••••••' },
  { id: 'v3', title: 'Stripe Billing API Key', username: 'pk_live_51M...', category: 'Secure Notes', strength: 'Strong', maskedPassword: '••••••••••••••••' },
  { id: 'v4', title: 'Office Wi-Fi 6 Mesh', username: 'guest_secure_99', category: 'Wi-Fi', strength: 'Medium', maskedPassword: '••••••••••••••••' },
  { id: 'v5', title: 'Corporate Visa Card', username: '•••• 4092 · Exp 08/28', category: 'Credit Cards', strength: 'Strong', maskedPassword: '•••' },
];

export function ActivityScreen({ onOpenNotifications }: PasswordVaultScreenProps) {
  const { notifications } = useAppData();
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const [vaultItems, setVaultItems] = useState<VaultItem[]>(INITIAL_VAULT);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [toast, setToast] = useState<string | null>(null);

  // Add password modal
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newCategory, setNewCategory] = useState<'Logins' | 'Secure Notes' | 'Credit Cards' | 'Wi-Fi'>('Logins');
  const [newPass, setNewPass] = useState('');

  const Lock = getIcon('Lock');
  const Key = getIcon('Key');
  const Search = getIcon('Search');
  const Plus = getIcon('Plus');
  const Copy = getIcon('Copy');
  const Bell = getIcon('Bell');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleCopy = (title: string) => {
    navigator.clipboard.writeText('secure_password_mock_' + Math.random().toString(36).slice(-8));
    showToast(`Copied password for ${title}`);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUsername.trim()) {
      showToast('Please enter title and username');
      return;
    }
    const newItem: VaultItem = {
      id: `v-${Date.now()}`,
      title: newTitle.trim(),
      username: newUsername.trim(),
      category: newCategory,
      strength: 'Strong',
      maskedPassword: '••••••••••••••••',
    };
    setVaultItems([newItem, ...vaultItems]);
    setNewTitle('');
    setNewUsername('');
    setNewPass('');
    setShowModal(false);
    showToast(`Saved credentials for ${newItem.title}`);
  };

  const filteredItems = vaultItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.username.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="h-full overflow-y-auto no-scrollbar pb-32 screen-enter-items px-5 pt-6">
      {toast && <Toast message={toast} />}

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-title2 font-bold text-slate-100">Password Vault</h1>
          <p className="text-caption text-slate-400">Encrypted AES-256 Vault</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenNotifications}
            className="relative p-2.5 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-500" />}
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="px-3.5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-semibold text-footnote flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" /> Add Item
          </button>
        </div>
      </div>

      {/* Security Health Box */}
      <GlassCard className="p-4 mb-5 bg-gradient-to-r from-slate-900/90 to-blue-950/40 border-blue-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Key className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-body font-bold text-slate-100">Vault Health: 100% Secure</h3>
              <p className="text-caption text-slate-400">0 weak or reused passwords detected</p>
            </div>
          </div>
          <span className="text-footnote px-3 py-1.5 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-300 font-semibold">
            Protected
          </span>
        </div>
      </GlassCard>

      {/* Search & Categories */}
      <div className="space-y-3 mb-5">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search vault items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl py-3 pl-10 pr-4 text-slate-100 placeholder-slate-500 text-subbody focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {['All', 'Logins', 'Secure Notes', 'Credit Cards', 'Wi-Fi'].map((cat) => (
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

      {/* Vault Items List */}
      <div className="space-y-3.5">
        {filteredItems.length === 0 ? (
          <GlassEmpty icon="Key" title="No vault items found" subtitle="Add passwords, notes, or cards to secure them." />
        ) : (
          filteredItems.map((item) => (
            <GlassCard
              key={item.id}
              className="p-4 border-slate-800/80 bg-slate-900/60 hover:border-emerald-500/40 transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-slate-800 text-emerald-400 border border-slate-700">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-body font-bold text-slate-100">{item.title}</h4>
                  <p className="text-caption text-slate-400">{item.username}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-2xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {item.category}
                    </span>
                    <span className="text-2xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {item.strength}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(item.title)}
                  className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                  title="Copy Password"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </GlassCard>
          ))
        )}
      </div>

      {/* Add Modal */}
      {showModal && (
        <GlassSheet open={showModal} onClose={() => setShowModal(false)} title="Add Password Item">
          <form onSubmit={handleAddItem} className="space-y-4 pt-2">
            <div>
              <label className="block text-footnote font-semibold text-slate-300 mb-1.5">Item Title</label>
              <input
                type="text"
                placeholder="e.g. GitHub, AWS, Netflix"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3.5 text-slate-100 placeholder-slate-500 text-subbody focus:outline-none focus:border-emerald-500"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-footnote font-semibold text-slate-300 mb-1.5">Username or Email</label>
              <input
                type="text"
                placeholder="e.g. user@domain.com"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3.5 text-slate-100 placeholder-slate-500 text-subbody focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-footnote font-semibold text-slate-300 mb-1.5">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as 'Logins' | 'Secure Notes' | 'Credit Cards' | 'Wi-Fi')}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3.5 text-slate-100 text-subbody focus:outline-none focus:border-emerald-500"
              >
                <option value="Logins">Logins</option>
                <option value="Secure Notes">Secure Notes</option>
                <option value="Credit Cards">Credit Cards</option>
                <option value="Wi-Fi">Wi-Fi</option>
              </select>
            </div>
            <div>
              <label className="block text-footnote font-semibold text-slate-300 mb-1.5">Password</label>
              <input
                type="password"
                placeholder="Enter strong password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3.5 text-slate-100 placeholder-slate-500 text-subbody focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 rounded-xl bg-slate-800 font-semibold text-slate-300 hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl bg-emerald-500 font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition-colors"
              >
                Save Vault Item
              </button>
            </div>
          </form>
        </GlassSheet>
      )}
    </div>
  );
}
