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
import { PersonalInfoScreen } from '@/screens/PersonalInfoScreen';
import { VerificationScreen } from '@/screens/VerificationScreen';
import { PrivacyScreen } from '@/screens/PrivacyScreen';
import { SecurityScreen } from '@/screens/SecurityScreen';
import { LocationScreen } from '@/screens/LocationScreen';
import { SwipeNavigationContainer } from '@/components/common/SwipeNavigationContainer';
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
  | { name: 'plans' }
  | { name: 'personalInfo' }
  | { name: 'verification' }
  | { name: 'privacy' }
  | { name: 'security' }
  | { name: 'location' };

const mainTabs: TabKey[] = ['discover', 'activity', 'chat', 'profile'];

function EkipApp() {
  const [authed, setAuthed] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [tab, setTab] = useState<TabKey>('discover');
  const [screen, setScreen] = useState<Screen>({ name: 'discover' });
  const [history, setHistory] = useState<Screen[]>([]);

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

  const isMainScreen =
    history.length === 0 &&
    (screen.name === 'discover' ||
      screen.name === 'activity' ||
      screen.name === 'chatList' ||
      (screen.name === 'profile' && screen.userId === 'me'));

  const currentMainIndex = mainTabs.indexOf(tab);
  const canGoBack = history.length > 0;

  const handleNextTab = () => {
    if (currentMainIndex < mainTabs.length - 1) {
      switchTab(mainTabs[currentMainIndex + 1]);
    }
  };

  const handlePrevTab = () => {
    if (currentMainIndex > 0) {
      switchTab(mainTabs[currentMainIndex - 1]);
    }
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
    ['discover', 'activity', 'create', 'chatList'].includes(screen.name) ||
    (screen.name === 'profile' && screen.userId === 'me');

  return (
    <div className="relative w-full h-full flex flex-col">
      <SwipeNavigationContainer
        canGoBack={canGoBack}
        onGoBack={pop}
        canSwipeLeftTab={isMainScreen && currentMainIndex < mainTabs.length - 1}
        canSwipeRightTab={isMainScreen && currentMainIndex > 0}
        onSwipeNextTab={handleNextTab}
        onSwipePrevTab={handlePrevTab}
        className="flex-1"
      >
        <div key={`${screen.name}-${tab}-${history.length}`} className="w-full h-full relative overflow-hidden">
          {screen.name === 'discover' && (
            <DiscoverScreen
              onOpenGroup={(g) => push({ name: 'group', group: g })}
              onOpenProfile={(uid) => push({ name: 'profile', userId: uid })}
              onOpenOwnProfile={() => { setTab('profile'); setHistory([]); setScreen({ name: 'profile', userId: 'me' }); }}
              onOpenAI={() => push({ name: 'ai' })}
              onOpenNotifications={() => push({ name: 'notifications' })}
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
              onOpenPersonalInfo={() => push({ name: 'personalInfo' })}
              onOpenVerification={() => push({ name: 'verification' })}
            />
          )}
          {screen.name === 'activity' && (
            <ActivityScreen
              onOpenGroup={(g) => push({ name: 'group', group: g })}
              onOpenProfile={(uid) => push({ name: 'profile', userId: uid })}
              onOpenNotifications={() => push({ name: 'notifications' })}
            />
          )}
          {screen.name === 'chatList' && (
            <ChatListScreen
              onOpenConversation={(id) => push({ name: 'conversation', conversationId: id })}
              onOpenNotifications={() => push({ name: 'notifications' })}
            />
          )}
          {screen.name === 'conversation' && (
            <ConversationScreen conversationId={screen.conversationId} onBack={pop} />
          )}
          {screen.name === 'notifications' && (
            <NotificationsScreen
              onBack={pop}
              onOpenConversation={(id) => push({ name: 'conversation', conversationId: id })}
            />
          )}
          {screen.name === 'ai' && <AIAssistant onBack={pop} />}
          {screen.name === 'settings' && (
            <SettingsScreen
              onBack={pop}
              onOpenPlans={() => push({ name: 'plans' })}
              onOpenPersonalInfo={() => push({ name: 'personalInfo' })}
              onOpenVerification={() => push({ name: 'verification' })}
              onOpenPrivacy={() => push({ name: 'privacy' })}
              onOpenSecurity={() => push({ name: 'security' })}
              onOpenNotifications={() => push({ name: 'notifications' })}
              onOpenLocation={() => push({ name: 'location' })}
              onSignOut={() => { setAuthed(false); setOnboarded(false); setTab('discover'); setScreen({ name: 'discover' }); }}
            />
          )}
          {screen.name === 'plans' && <PlansScreen onBack={pop} />}
          {screen.name === 'personalInfo' && (
            <PersonalInfoScreen
              onBack={pop}
              onOpenVerification={() => push({ name: 'verification' })}
            />
          )}
          {screen.name === 'verification' && <VerificationScreen onBack={pop} />}
          {screen.name === 'privacy' && <PrivacyScreen onBack={pop} />}
          {screen.name === 'security' && <SecurityScreen onBack={pop} />}
          {screen.name === 'location' && <LocationScreen onBack={pop} />}
        </div>
      </SwipeNavigationContainer>

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
