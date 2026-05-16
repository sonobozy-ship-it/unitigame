import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen';
import LevelSelectScreen from './src/screens/LevelSelectScreen';
import GameScreen from './src/screens/GameScreen';
import ShopScreen from './src/screens/ShopScreen';
import { ALL_LEVELS, getDailyLevel, getLevelById } from './src/data/levels';
import { theme } from './src/constants/theme';

type Screen = 'home' | 'levels' | 'game' | 'shop';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [activeLevelId, setActiveLevelId] = useState<number>(1);

  const goToGame = (levelId: number) => {
    setActiveLevelId(levelId);
    setScreen('game');
  };

  const goToNextLevel = (nextId: number) => {
    const next = getLevelById(nextId);
    if (next) {
      goToGame(nextId);
    } else {
      // No more levels
      setScreen('levels');
    }
  };

  const activeLevel = getLevelById(activeLevelId) ?? ALL_LEVELS[0];

  return (
    <SafeAreaProvider>
      <View style={styles.root}>
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
          <ShopScreen
            onBack={() => setScreen('home')}
          />
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.bg },
});
