import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PROGRESS_KEY = 'waddle_progress_v1';

export interface LevelProgress {
  completed: boolean;
  stars: number;
  bestMoves: number;
}

export interface Progress {
  [levelId: number]: LevelProgress;
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(PROGRESS_KEY)
      .then(data => {
        if (data) {
          setProgress(JSON.parse(data));
        }
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const saveProgress = useCallback(async (newProgress: Progress) => {
    try {
      await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(newProgress));
    } catch {}
  }, []);

  const completeLevel = useCallback((levelId: number, stars: number, moves: number) => {
    setProgress(prev => {
      const existing = prev[levelId];
      const updated: LevelProgress = {
        completed: true,
        stars: Math.max(existing?.stars ?? 0, stars),
        bestMoves: existing?.bestMoves ? Math.min(existing.bestMoves, moves) : moves,
      };
      const newProgress = { ...prev, [levelId]: updated };
      saveProgress(newProgress);
      return newProgress;
    });
  }, [saveProgress]);

  const isUnlocked = useCallback((levelId: number): boolean => {
    if (levelId === 1) return true;
    return !!(progress[levelId - 1]?.completed);
  }, [progress]);

  const getLevelProgress = useCallback((levelId: number): LevelProgress | null => {
    return progress[levelId] ?? null;
  }, [progress]);

  const getCompletedCount = useCallback((): number => {
    return Object.values(progress).filter(p => p.completed).length;
  }, [progress]);

  const resetProgress = useCallback(async () => {
    setProgress({});
    try {
      await AsyncStorage.removeItem(PROGRESS_KEY);
    } catch {}
  }, []);

  return {
    progress,
    loaded,
    completeLevel,
    isUnlocked,
    getLevelProgress,
    getCompletedCount,
    resetProgress,
  };
}
