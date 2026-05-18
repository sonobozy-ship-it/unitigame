import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HomeScreen } from './src/screens/HomeScreen';
import { LevelSelectScreen } from './src/screens/LevelSelectScreen';
import { GameScreen } from './src/screens/GameScreen';
import { WinScreen } from './src/screens/WinScreen';
import { generateLevel } from './src/data/levels';
import type { Level } from './src/data/levels';
import { useProgress } from './src/hooks/useProgress';

type Screen = 'home' | 'select' | 'game' | 'win';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [currentLevelId, setCurrentLevelId] = useState(1);
  const [currentLevel, setCurrentLevel] = useState<Level>(() => generateLevel(1));
  const [winData, setWinData] = useState({ stars: 1, moves: 0 });
  const { completeLevel } = useProgress();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        {screen === 'home' && (
          <HomeScreen onPlay={() => setScreen('select')} />
        )}
        {screen === 'select' && (
          <LevelSelectScreen
            onSelectLevel={(id) => {
              setCurrentLevel(generateLevel(id));
              setCurrentLevelId(id);
              setScreen('game');
            }}
            onBack={() => setScreen('home')}
          />
        )}
        {screen === 'game' && (
          <GameScreen
            level={currentLevel}
            onWin={(levelId, stars, moves) => {
              completeLevel(levelId, stars, moves);
              setWinData({ stars, moves });
              setScreen('win');
            }}
            onBack={() => setScreen('select')}
          />
        )}
        {screen === 'win' && (
          <WinScreen
            levelId={currentLevelId}
            stars={winData.stars}
            moves={winData.moves}
            par={currentLevel.par}
            onNext={() => {
              const nextId = currentLevelId + 1;
              setCurrentLevel(generateLevel(nextId));
              setCurrentLevelId(nextId);
              setScreen('game');
            }}
            onReplay={() => {
              setCurrentLevel(generateLevel(currentLevelId));
              setScreen('game');
            }}
            onMenu={() => setScreen('select')}
          />
        )}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
