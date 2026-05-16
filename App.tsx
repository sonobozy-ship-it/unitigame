import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen';
import LevelSelectScreen from './src/screens/LevelSelectScreen';
import GameScreen from './src/screens/GameScreen';
import ShopScreen from './src/screens/ShopScreen';
import OnboardingScreen, { isEulaAccepted } from './src/screens/OnboardingScreen';
import { ALL_LEVELS, getDailyLevel, getLevelById } from './src/data/levels';

type Screen = 'loading' | 'onboarding' | 'home' | 'levels' | 'game' | 'shop';

export default function App() {
  const [screen, setScreen]       = useState<Screen>('loading');
  const [activeLevelId, setActiveLevelId] = useState<number>(1);

  // Check EULA on first load
  useEffect(() => {
    isEulaAccepted().then(accepted => {
      setScreen(accepted ? 'home' : 'onboarding');
    });
  }, []);

  const goToGame = (levelId: number) => {
    setActiveLevelId(levelId);
    setScreen('game');
  };

  const goToNextLevel = (nextId: number) => {
    const next = getLevelById(nextId);
    if (next) goToGame(nextId);
    else setScreen('levels');
  };

  const activeLevel = getLevelById(activeLevelId) ?? ALL_LEVELS[0];

  if (screen === 'loading') {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color="#3ECFB2" size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <View style={styles.root}>
        {screen === 'onboarding' && (
          <OnboardingScreen onAccept={() => setScreen('home')} />
        )}
        {screen === 'home' && (
          <HomeScreen
            onPlay={() => setScreen('levels')}
            onDaily={() => goToGame(getDailyLevel().id)}
            onShop={() => setScreen('shop')}
          />
        )}
        {screen === 'levels' && (
          <LevelSelectScreen
            onBack={() => setScreen('home')}
            onSelectLevel={goToGame}
          />
        )}
        {screen === 'game' && (
          <GameScreen
            level={activeLevel}
            onBack={() => setScreen('levels')}
            onNext={goToNextLevel}
          />
        )}
        {screen === 'shop' && (
          <ShopScreen onBack={() => setScreen('home')} />
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root:    { flex: 1, backgroundColor: '#0A0A14' },
  loading: { flex: 1, backgroundColor: '#0A0A14', justifyContent: 'center', alignItems: 'center' },
});
