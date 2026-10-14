import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useAppData } from '@/lib/appData';
import { GlassInput, GlassEmpty } from '@/components/Glass';
import { NotificationButton } from '@/components/NotificationButton';
import { ChatListItem } from '@/components/chat/ChatListItem';
import { ChatMessageBubble } from '@/components/chat/ChatMessageBubble';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { ChatInputBar } from '@/components/chat/ChatInputBar';

interface ChatListScreenProps {
  onOpenConversation: (id: string) => void;
  onOpenNotifications: () => void;
}

export function ChatListScreen({ onOpenConversation, onOpenNotifications }: ChatListScreenProps) {
  const { conversations, notifications } = useAppData();
  const [search, setSearch] = useState('');

  const filtered = conversations.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );
  const unreadTotal = conversations.reduce((s, c) => s + c.unread_count, 0);

  return (
    <div className="h-full overflow-y-auto no-scrollbar screen-enter-items">
      <div className="sticky top-0 z-20 glass glass-specular px-5 pt-3 pb-3">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-hero text-primary font-bold tracking-tight">Chats</h1>
            <p className="text-sub text-secondary mt-0.5">{unreadTotal} unread</p>
          </div>
          <NotificationButton
            unreadCount={notifications.filter((n) => !n.is_read).length}
            onClick={onOpenNotifications}
          />
        </div>

        <GlassInput
          icon="Search"
          placeholder="Search conversations..."
          value={search}
          onChange={setSearch}
        />
      </div>

      <div className="px-5 mt-4 space-y-2 pb-32">
        {filtered.length === 0 ? (
          <GlassEmpty
            icon="MessageCircle"
            title="No chats yet"
            subtitle="Join an Ekip or start a conversation with a friend."
          />
        ) : (
          filtered.map((c) => (
            <ChatListItem
              key={c.id}
              conversation={c}
              onClick={() => onOpenConversation(c.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

interface ConversationScreenProps {
  conversationId: string;
  onBack: () => void;
}

export function ConversationScreen({ conversationId, onBack }: ConversationScreenProps) {
  const { conversations, messages, addMessage } = useAppData();
  const [input, setInput] = useState('');
  const messagesRef = useRef<HTMLDivElement>(null);

  const conv = conversations.find((c) => c.id === conversationId);
  const convMessages = messages[conversationId] ?? [];

  useLayoutEffect(() => {
    const el = messagesRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [conversationId, convMessages.length]);

  const replyTimersRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      replyTimersRef.current.forEach((t) => window.clearTimeout(t));
      replyTimersRef.current = [];
    };
  }, []);

  if (!conv) return null;

  const handleSend = () => {
    if (!input.trim()) return;
    const body = input.trim();
    addMessage(conversationId, body);
    setInput('');

    // Simulated reply
    const t = window.setTimeout(() => {
      const replies = [
        'Sounds great!',
        'Let me check and get back to you.',
        'Absolutely!',
        'See you there!',
        "I'm in.",
        'Got it, thanks!',
      ];
      const reply = replies[Math.floor(Math.random() * replies.length)];
      addMessage(conversationId, reply);
    }, 1500);
    replyTimersRef.current.push(t);
  };

  return (
    <div className="h-full flex flex-col screen-enter-items">
      <ChatHeader conversation={conv} onBack={onBack} />

      <div
        ref={messagesRef}
        className="flex-1 overflow-y-auto no-scrollbar px-4 pt-24 pb-2 space-y-3"
      >
        {convMessages.map((m, i) => {
          const isMe = m.sender_id === 'me';
          const showAvatar = !isMe && (i === 0 || convMessages[i - 1].sender_id !== m.sender_id);
          return (
            <ChatMessageBubble
              key={m.id}
              message={m}
              isMe={isMe}
              showAvatar={showAvatar}
            />
          );
        })}
      </div>

      <ChatInputBar value={input} onChange={setInput} onSend={handleSend} />
    </div>
  );
}
