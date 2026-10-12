import { useLayoutEffect, useRef, useState } from 'react';
import { useAppData } from '@/lib/appData';
import { GlassCard, GlassAvatar, GlassInput, GlassEmpty } from '@/components/Glass';
import { getIcon, type IconName } from '@/lib/icons';
import { NotificationButton } from '@/components/NotificationButton';

interface ChatListScreenProps {
  onOpenConversation: (id: string) => void;
  onOpenNotifications: () => void;
}

export function ChatListScreen({ onOpenConversation, onOpenNotifications }: ChatListScreenProps) {
  const { conversations, me, notifications } = useAppData();
  const [search, setSearch] = useState('');

  const filtered = conversations.filter((c) => c.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="h-full overflow-y-auto no-scrollbar screen-enter-items">
      <div className="sticky top-0 z-20 glass glass-specular px-5 pt-3 pb-3">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-hero text-primary font-bold tracking-tight">Chats</h1>
            <p className="text-sub text-secondary mt-0.5">{conversations.filter((c) => c.unread_count > 0).length} unread</p>
          </div>
          <div className="flex items-center gap-2">
            <NotificationButton unreadCount={notifications.filter((notification) => !notification.is_read).length} onClick={onOpenNotifications} />
            <button className="w-10 h-10 rounded-full glass glass-specular glass-edge flex items-center justify-center haptic">
              {(() => { const I = getIcon('Edit'); return <I size={18} className="text-primary" strokeWidth={2.2} />; })()}
            </button>
          </div>
        </div>
        <GlassInput icon="Search" placeholder="Search conversations..." value={search} onChange={setSearch} />
      </div>

      <div className="px-5 mt-4 pb-32">
        {filtered.length === 0 ? (
          <GlassEmpty icon="MessageCircle" title="No conversations" subtitle="Start chatting by joining an Ekip or adding a friend." />
        ) : (
          <div className="space-y-2">
            {filtered.map((c) => {
              const time = c.last_message_at ? formatTime(c.last_message_at) : '';
              const isGroup = c.type === 'group';
              return (
                <button key={c.id} onClick={() => onOpenConversation(c.id)} className="w-full text-left haptic">
                  <GlassCard variant="thin" className="rounded-3xl p-3 flex items-center gap-3">
                    <div className="relative shrink-0">
                      <GlassAvatar src={c.avatar_url} name={c.title} size={52} />
                      {isGroup && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full glass-thick glass-specular flex items-center justify-center">
                          {(() => { const I = getIcon('Users'); return <I size={11} className="text-primary" strokeWidth={2.4} />; })()}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-body text-primary font-bold truncate">{c.title}</p>
                        <span className="text-[11px] text-tertiary shrink-0">{time}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2 mt-0.5">
                        <p className="text-foot text-secondary truncate">{c.last_message}</p>
                        {c.unread_count > 0 && (
                          <span
                            className="min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-bold text-white flex items-center justify-center shrink-0"
                            style={{ background: 'linear-gradient(135deg, rgb(244 114 182), rgb(59 130 246))' }}
                          >
                            {c.unread_count}
                          </span>
                        )}
                      </div>
                    </div>
                  </GlassCard>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function formatTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  if (diff < 60 * 60 * 1000) return `${Math.floor(diff / 60000)}m`;
  if (diff < 24 * 60 * 60 * 1000) return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  if (diff < 7 * 24 * 60 * 60 * 1000) return date.toLocaleDateString('en-US', { weekday: 'short' });
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ============================================
// Conversation screen
// ============================================
interface ConversationScreenProps {
  conversationId: string;
  onBack: () => void;
}

export function ConversationScreen({ conversationId, onBack }: ConversationScreenProps) {
  const { conversations, messages, me, addMessage, markConversationRead } = useAppData();
  const [input, setInput] = useState('');
  const messagesRef = useRef<HTMLDivElement>(null);

  const conv = conversations.find((c) => c.id === conversationId);
  const convMessages = messages[conversationId] ?? [];

  useLayoutEffect(() => {
    const messagesElement = messagesRef.current;
    if (messagesElement) messagesElement.scrollTo({ top: messagesElement.scrollHeight, behavior: 'smooth' });
  }, [conversationId, convMessages.length]);

  if (!conv) return null;

  const handleSend = () => {
    if (!input.trim()) return;
    addMessage(conversationId, input.trim());
    setInput('');
    // Simulated reply
    setTimeout(() => {
      const replies = ['Sounds great!', 'Let me check and get back to you.', 'Absolutely!', 'See you there!', "I'm in.", 'Got it, thanks!'];
      const reply = replies[Math.floor(Math.random() * replies.length)];
      addMessage(conversationId, reply);
    }, 1500);
  };

  const Back = getIcon('ArrowLeft');
  const Send = getIcon('Send');
  const isGroup = conv.type === 'group';

  return (
    <div className="h-full flex flex-col screen-enter-items">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 absolute top-0 left-0 right-0 z-20">
        <div className="glass-thick glass-specular glass-edge rounded-3xl p-2 flex items-center gap-3">
          <button onClick={onBack} className="w-9 h-9 rounded-full glass glass-specular flex items-center justify-center haptic shrink-0">
            <Back size={18} className="text-primary" strokeWidth={2.2} />
          </button>
          <GlassAvatar src={conv.avatar_url} name={conv.title} size={40} online={Math.random() > 0.3} />
          <div className="flex-1 min-w-0">
            <p className="text-sub text-primary font-bold truncate">{conv.title}</p>
            <p className="text-foot text-tertiary">{isGroup ? 'Group chat' : 'Active now'}</p>
          </div>
          <button className="w-9 h-9 rounded-full glass glass-specular flex items-center justify-center haptic">
            {(() => { const I = getIcon('MoreVertical'); return <I size={18} className="text-primary" strokeWidth={2.2} />; })()}
          </button>
        </div>
      </div>

      {/* Messages */}
      <div ref={messagesRef} className="flex-1 overflow-y-auto no-scrollbar px-4 pt-24 pb-2 space-y-3">
        {convMessages.map((m, i) => {
          const isMe = m.sender_id === 'me';
          const showAvatar = !isMe && (i === 0 || convMessages[i - 1].sender_id !== m.sender_id);
          return (
            <div key={m.id} className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'} animate-rise`}>
              {!isMe && (
                <div className="w-7 shrink-0">
                  {showAvatar && <GlassAvatar src={m.sender?.avatar_url} name={m.sender?.first_name ?? 'User'} size={28} ring={false} />}
                </div>
              )}
              <div
                className={`max-w-[75%] px-4 py-2.5 ${isMe ? 'rounded-3xl rounded-br-lg text-white' : 'rounded-3xl rounded-bl-lg glass glass-specular text-primary'}`}
                style={isMe ? { background: 'linear-gradient(135deg, rgb(244 114 182), rgb(59 130 246))' } : undefined}
              >
                {!isMe && isGroup && showAvatar && (
                  <p className="text-caption text-pink-500 font-bold mb-0.5">{m.sender?.first_name}</p>
                )}
                <p className="text-body leading-snug">{m.body}</p>
                <p className={`text-[10px] mt-1 ${isMe ? 'text-white/70' : 'text-tertiary'}`}>
                  {new Date(m.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="px-4 pb-24 pt-2">
        <div className="glass-thick glass-specular glass-edge rounded-3xl p-2 flex items-center gap-2">
          <button className="w-9 h-9 rounded-full glass glass-specular flex items-center justify-center haptic shrink-0">
            {(() => { const I = getIcon('Plus'); return <I size={18} className="text-secondary" strokeWidth={2.2} />; })()}
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Message..."
            className="flex-1 bg-transparent outline-none text-body text-primary placeholder:text-tertiary"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-9 h-9 rounded-full flex items-center justify-center haptic shrink-0 transition-all disabled:opacity-30"
            style={{ background: 'linear-gradient(135deg, rgb(244 114 182), rgb(59 130 246))' }}
          >
            <Send size={16} className="text-white" strokeWidth={2.4} />
          </button>
        </div>
      </div>
    </div>
  );
}
