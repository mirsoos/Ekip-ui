import { useState, useRef, useEffect } from 'react';
import { GlassBackButton } from '@/components/Glass';
import { AIChatBubble } from '@/components/ai/AIChatBubble';
import { AITypingIndicator } from '@/components/ai/AITypingIndicator';
import { getIcon } from '@/lib/icons';

interface AIMessage {
  id: string;
  role: 'user' | 'ai';
  body: string;
  chips?: string[];
}

interface AIAssistantProps {
  onBack: () => void;
}

const suggestions = [
  'Help me create an Ekip',
  'Recommend activities near me',
  'Suggest a good location for a group dinner',
  'What skills should I look for in a startup co-founder Ekip?',
];

const aiResponses: Record<string, { body: string; chips?: string[] }> = {
  'help me create an ekip': {
    body: "I'd love to help you create an Ekip! Let's start with a few questions:\n\n1. What type of activity? (Work or Entertainment)\n2. How many people are you looking for?\n3. What city are you in?\n\nBased on your profile, I think a small group format (4-8 people) would work great for your first Ekip. Your interests in Design and Coffee suggest you could host a 'Design Coffee Chat' — a casual meetup for creative professionals.",
    chips: ['Create a Design Coffee Chat', 'See more ideas', 'Different activity'],
  },
  'recommend activities near me': {
    body: "Based on your location in San Francisco and your interests, here are my top recommendations:\n\n• Golden Hour Photo Walk — matches your Photography interest\n• Startup Founder Roundtable — matches your Startups interest\n• Dawn Surf Session — great for weekend outdoor activity\n• Ramen Night — premium, matches your Food interest\n\nWould you like me to find more specific matches?",
    chips: ['Show photo walk', 'Show startup roundtable', 'More options'],
  },
  'suggest a good location for a group dinner': {
    body: "For a group dinner in San Francisco, here are some excellent sponsored and AI-recommended locations:\n\n• Mission District — vibrant food scene, great for groups up to 12\n• Ferry Building — waterfront views, perfect for special occasions\n• NOPA — central, lively atmosphere, group-friendly\n\nTip: Blue Bottle Coffee offers 20% off for Ekip meetups at their Mission location. I can help you add a location to your Ekip when you create one.",
    chips: ['Add Mission District', 'See sponsored locations', 'Create dinner Ekip'],
  },
  'what skills should i look for in a startup co-founder ekip?': {
    body: "For a startup co-founder matching Ekip, I recommend looking for complementary skills:\n\n• Technical: A full-stack or backend engineer who can build the product\n• Design: A product designer who understands user experience\n• Growth: Someone with marketing or sales experience\n• Domain expertise: Someone who knows your target industry\n\nBased on your profile as a Product Designer, you'd pair well with a technical co-founder. I can filter existing Ekips or suggest compatible users with engineering backgrounds.",
    chips: ['Find compatible users', 'Create a co-founder Ekip', 'See matching Ekips'],
  },
  default: {
    body: "I'm your Ekip AI assistant! I can help you:\n\n• Create better Ekip listings with smart suggestions\n• Discover activities that match your interests\n• Find compatible users to invite\n• Recommend locations for your meetups\n• Suggest skills or requirements for your group\n\nWhat would you like help with today?",
    chips: ['Create an Ekip', 'Find activities', 'Recommend users'],
  },
};

function getAIResponse(input: string): { body: string; chips?: string[] } {
  const lower = input.toLowerCase();
  if (lower.includes('create') && lower.includes('ekip')) return aiResponses['help me create an ekip'];
  if (lower.includes('recommend') && lower.includes('activit')) return aiResponses['recommend activities near me'];
  if (lower.includes('location') && lower.includes('dinner')) return aiResponses['suggest a good location for a group dinner'];
  if (lower.includes('skill') && lower.includes('co-founder')) return aiResponses['what skills should i look for in a startup co-founder ekip?'];
  if (lower.includes('recommend')) return aiResponses['recommend activities near me'];
  return aiResponses.default;
}

export function AIAssistant({ onBack }: AIAssistantProps) {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'init',
      role: 'ai',
      body: "Hi Aria! I'm your Ekip AI assistant. I can help you create better Ekip listings, discover activities, find compatible people, and recommend locations. What can I help you with today?",
      chips: suggestions.slice(0, 2),
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const Send = getIcon('Send');
  const Sparkles = getIcon('Sparkles');

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, []);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: AIMessage = { id: `u-${Date.now()}`, role: 'user', body: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      const res = getAIResponse(text);
      const aiMsg: AIMessage = { id: `a-${Date.now()}`, role: 'ai', body: res.body, chips: res.chips };
      setMessages((prev) => [...prev, aiMsg]);
      setTyping(false);
      timerRef.current = null;
    }, 1200);
  };

  return (
    <div className="relative h-full flex flex-col">
      {/* Header */}
      <div className="absolute inset-x-0 top-0 z-20 glass glass-specular px-5 pt-3 pb-3 animate-rise">
        <div className="p-1 flex items-center gap-3">
          <GlassBackButton onClick={onBack} />
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
            style={{
              background: 'linear-gradient(135deg, rgb(244 114 182 / 0.35), rgb(59 130 246 / 0.35))',
            }}
          >
            <Sparkles size={20} className="text-pink-500" strokeWidth={2.2} />
          </div>
          <div className="flex-1">
            <p className="text-sub text-primary font-bold">Ekip AI</p>
            <p className="text-foot text-tertiary">Online · Ready to help</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto no-scrollbar px-4 pt-24 pb-2 space-y-4 animate-rise-d1"
      >
        {messages.map((m) => (
          <AIChatBubble
            key={m.id}
            role={m.role}
            body={m.body}
            chips={m.chips}
            onSelectChip={send}
          />
        ))}

        {typing && <AITypingIndicator />}
      </div>

      {/* Prompt chips when thread is young */}
      {messages.length <= 2 && !typing && (
        <div className="px-4 pb-2 animate-rise-d2">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => send(s)}
                className="shrink-0 px-3 py-2 rounded-2xl text-foot font-semibold glass-thin glass-specular text-secondary spring-press cursor-pointer"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-4 pb-5 pt-2 animate-rise-d3">
        <div className="glass-thick glass-specular glass-edge rounded-3xl p-2 flex items-center gap-2 shadow-lg">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send(input)}
            placeholder="Ask Ekip AI anything..."
            className="flex-1 bg-transparent outline-none text-body text-primary placeholder:text-tertiary px-2"
          />
          <button
            type="button"
            onClick={() => send(input)}
            disabled={!input.trim()}
            aria-label="Send query"
            className="w-10 h-10 rounded-full flex items-center justify-center spring-press cursor-pointer shrink-0 transition-all shadow-md disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ background: 'linear-gradient(135deg, rgb(244 114 182), rgb(59 130 246))' }}
          >
            <Send size={16} className="text-white" strokeWidth={2.4} />
          </button>
        </div>
      </div>
    </div>
  );
}
