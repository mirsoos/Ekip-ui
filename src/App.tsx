import { useState } from 'react';
import { ThemeProvider } from '@/lib/theme';
import { AppDataProvider } from '@/lib/appData';
import { AuroraBackground, PhoneFrame } from '@/components/PhoneFrame';
import { BottomNav, type TabKey } from '@/components/BottomNav';
import { AuthScreen } from '@/screens/AuthScreen';
import { Onboarding } from '@/screens/Onboarding';
import { DiscoverScreen } from '@/screens/DiscoverScreen';
import { EkipDetail } from '@/screens/EkipDetail';
import { CreateScreen } from '@/screens/CreateScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';
import { ActivityScreen } from '@/screens/ActivityScreen';
import { ChatListScreen, ConversationScreen } from '@/screens/ChatScreens';
import { NotificationsScreen } from '@/screens/NotificationsScreen';
import { AIAssistant } from '@/screens/AIAssistant';
import { SettingsScreen } from '@/screens/SettingsScreen';
import { PlansScreen } from '@/screens/PlansScreen';
import { GlassSheet } from '@/components/Overlays';
import type { Group } from '@/types/database';

type Screen =
  | { name: 'auth' }
  | { name: 'onboarding' }
  | { name: 'discover' }
  | { name: 'group'; group: Group }
  | { name: 'create' }
  | { name: 'profile'; userId: string }
  | { name: 'activity' }
  | { name: 'chatList' }
  | { name: 'conversation'; conversationId: string }
  | { name: 'notifications' }
  | { name: 'ai' }
  | { name: 'settings' }
  | { name: 'plans' };

function EkipApp() {
  const [authed, setAuthed] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [tab, setTab] = useState<TabKey>('discover');
  const [screen, setScreen] = useState<Screen>({ name: 'discover' });
  const [history, setHistory] = useState<Screen[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const push = (s: Screen) => {
    setHistory((prev) => [...prev, screen]);
    setScreen(s);
  };

  const pop = () => {
    setHistory((prev) => {
      if (prev.length === 0) return prev;
      const next = [...prev];
      const last = next.pop()!;
      setScreen(last);
      return next;
    });
  };

  const switchTab = (t: TabKey) => {
    // If clicking 'create' while already on create tab/screen, toggle back to discover
    if (t === 'create' && (tab === 'create' || screen.name === 'create')) {
      setTab('discover');
      setHistory([]);
      setScreen({ name: 'discover' });
      return;
    }
    setTab(t);
    setHistory([]);
    if (t === 'discover') setScreen({ name: 'discover' });
    else if (t === 'activity') setScreen({ name: 'activity' });
    else if (t === 'create') setScreen({ name: 'create' });
    else if (t === 'chat') setScreen({ name: 'chatList' });
    else if (t === 'profile') setScreen({ name: 'profile', userId: 'me' });
  };

  if (!authed) {
    return (
      <AuthScreen
        onComplete={() => {
          setAuthed(true);
        }}
      />
    );
  }

  if (!onboarded) {
    return <Onboarding onComplete={() => setOnboarded(true)} />;
  }

  // Determine if bottom nav should show
  const showBottomNav =
    ['discover', 'activity', 'create', 'chatList', 'conversation'].includes(screen.name) ||
    (screen.name === 'profile' && screen.userId === 'me');

  return (
    <div className="relative w-full h-full flex flex-col">
      <div key={`${screen.name}-${tab}-${history.length}`} className="flex-1 relative overflow-hidden">
        {screen.name === 'discover' && (
          <DiscoverScreen
            onOpenGroup={(g) => push({ name: 'group', group: g })}
            onOpenProfile={(uid) => push({ name: 'profile', userId: uid })}
            onOpenOwnProfile={() => { setTab('profile'); setHistory([]); setScreen({ name: 'profile', userId: 'me' }); }}
            onOpenAI={() => push({ name: 'ai' })}
            onOpenNotifications={() => setShowNotifications(true)}
          />
        )}
        {screen.name === 'group' && (
          <EkipDetail
            group={screen.group}
            onBack={() => { setTab('activity'); setHistory([]); setScreen({ name: 'activity' }); }}
            onOpenProfile={(uid) => {
              if (uid === 'me') setTab('profile');
              push({ name: 'profile', userId: uid });
            }}
            onOpenChat={(cid) => { setTab('chat'); push({ name: 'conversation', conversationId: cid }); }}
          />
        )}
        {screen.name === 'create' && (
          <CreateScreen
            onBack={() => {
              if (history.length > 0) pop();
              else {
                setTab('discover');
                setHistory([]);
                setScreen({ name: 'discover' });
              }
            }}
            onCreated={(g) => {
              setHistory([]);
              setScreen({ name: 'group', group: g });
              setTab('activity');
            }}
          />
        )}
        {screen.name === 'profile' && (
          <ProfileScreen
            userId={screen.userId}
            isOwnProfile={screen.userId === 'me'}
            onBack={pop}
            onOpenGroup={(g) => push({ name: 'group', group: g })}
            onOpenSettings={() => push({ name: 'settings' })}
          />
        )}
        {screen.name === 'activity' && (
          <ActivityScreen
            onOpenGroup={(g) => push({ name: 'group', group: g })}
            onOpenProfile={(uid) => push({ name: 'profile', userId: uid })}
            onOpenNotifications={() => setShowNotifications(true)}
          />
        )}
        {screen.name === 'chatList' && (
          <ChatListScreen
            onOpenConversation={(id) => push({ name: 'conversation', conversationId: id })}
            onOpenNotifications={() => setShowNotifications(true)}
          />
        )}
        {screen.name === 'conversation' && (
          <ConversationScreen conversationId={screen.conversationId} onBack={pop} />
        )}
        {screen.name === 'ai' && <AIAssistant onBack={pop} />}
        {screen.name === 'settings' && (
          <SettingsScreen onBack={pop} onOpenPlans={() => push({ name: 'plans' })} onSignOut={() => { setAuthed(false); setOnboarded(false); setTab('discover'); setScreen({ name: 'discover' }); }} />
        )}
        {screen.name === 'plans' && <PlansScreen onBack={pop} />}
      </div>

      <GlassSheet open={showNotifications} onClose={() => setShowNotifications(false)} title="Notifications" contentClassName="overflow-hidden flex flex-col">
        <NotificationsScreen open={showNotifications} />
      </GlassSheet>

      {showBottomNav && <BottomNav active={tab} onChange={switchTab} />}

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppDataProvider>
        <AuroraBackground />
        <PhoneFrame>
          <EkipApp />
        </PhoneFrame>
      </AppDataProvider>
    </ThemeProvider>
  );
}
