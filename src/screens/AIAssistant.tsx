import { useState, useRef, useEffect } from 'react';
import { GlassCard, GlassButton } from '@/components/Glass';
import { getIcon, type IconName } from '@/lib/icons';

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
  'default': {
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
  return aiResponses['default'];
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

  const Back = getIcon('ArrowLeft');
  const Send = getIcon('Send');
  const Sparkles = getIcon('Sparkles');

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: AIMessage = { id: `u-${Date.now()}`, role: 'user', body: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const res = getAIResponse(text);
      const aiMsg: AIMessage = { id: `a-${Date.now()}`, role: 'ai', body: res.body, chips: res.chips };
      setMessages((prev) => [...prev, aiMsg]);
      setTyping(false);
    }, 1200);
  };

  return (
    <div className="relative h-full flex flex-col">
      {/* Header */}
      <div className="absolute inset-x-0 top-0 z-20 glass glass-specular px-5 pt-3 pb-3 animate-rise">
        <div className="p-2 flex items-center gap-3">
          <button onClick={onBack} className="w-9 h-9 rounded-full glass glass-specular flex items-center justify-center haptic shrink-0">
            <Back size={18} className="text-primary" strokeWidth={2.2} />
          </button>
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, rgb(244 114 182 / 0.3), rgb(59 130 246 / 0.3))' }}>
            <Sparkles size={20} className="text-pink-500" strokeWidth={2} />
          </div>
          <div className="flex-1">
            <p className="text-sub text-primary font-bold">Ekip AI</p>
            <p className="text-foot text-tertiary">Online · Ready to help</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar px-4 pt-24 pb-2 space-y-4 animate-rise-d1">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-rise`}>
            <div className={`max-w-[82%] ${m.role === 'user' ? '' : 'w-full'}`}>
              {m.role === 'ai' && (
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgb(244 114 182 / 0.3), rgb(59 130 246 / 0.3))' }}>
                    <Sparkles size={14} className="text-pink-500" strokeWidth={2.4} />
                  </div>
                  <span className="text-caption text-tertiary font-bold">Ekip AI</span>
                </div>
              )}
              <div
                className={`px-4 py-3 ${m.role === 'user' ? 'rounded-3xl rounded-br-lg text-white' : 'rounded-3xl rounded-bl-lg glass glass-specular text-primary'}`}
                style={m.role === 'user' ? { background: 'linear-gradient(135deg, rgb(244 114 182), rgb(59 130 246))' } : undefined}
              >
                <p className="text-body leading-relaxed whitespace-pre-line">{m.body}</p>
              </div>
              {m.chips && (
                <div className="flex flex-wrap gap-2 mt-2.5">
                  {m.chips.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => send(chip)}
                      className="px-3 py-1.5 rounded-full text-foot font-semibold glass-thin glass-specular text-pink-500 haptic"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {typing && (
          <div className="flex justify-start animate-fade">
            <div className="glass glass-specular rounded-3xl rounded-bl-lg px-4 py-3 flex items-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-tertiary"
                  style={{ animation: `bounce 1.4s ease-in-out ${i * 0.2}s infinite` }}
                />
              ))}
              <style>{`@keyframes bounce { 0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; } 40% { transform: scale(1); opacity: 1; } }`}</style>
            </div>
          </div>
        )}
      </div>

      {/* Suggestions (when few messages) */}
      {messages.length <= 2 && !typing && (
        <div className="px-4 pb-2 animate-rise-d2">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="shrink-0 px-3 py-2 rounded-2xl text-foot font-semibold glass-thin glass-specular text-secondary haptic"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-4 pb-5 pt-2 animate-rise-d3">
        <div className="glass-thick glass-specular glass-edge rounded-3xl p-2 flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send(input)}
            placeholder="Ask Ekip AI anything..."
            className="flex-1 bg-transparent outline-none text-body text-primary placeholder:text-tertiary"
          />
          <button
            onClick={() => send(input)}
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
