import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface LevelResult {
  stars: number;
  moves: number;
}

export interface Progress {
  results: Record<number, LevelResult>;  // levelId -> result
  streak: number;
  lastPlayDate: string;                  // ISO date string
}

const STORAGE_KEY = 'unitiflow_progress';

const defaultProgress: Progress = {
  results: {},
  streak: 0,
  lastPlayDate: '',
};

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(defaultProgress);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(raw => {
      if (raw) {
        try {
          setProgress(JSON.parse(raw));
        } catch {
          // corrupt data — reset
        }
      }
      setLoaded(true);
    });
  }, []);

  const save = useCallback(async (next: Progress) => {
    setProgress(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const recordResult = useCallback(async (levelId: number, stars: number, moves: number) => {
    setProgress(prev => {
      const existing = prev.results[levelId];
      if (existing && existing.stars >= stars) return prev;  // don't downgrade

      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86_400_000).toISOString().split('T')[0];
      const newStreak = prev.lastPlayDate === yesterday ? prev.streak + 1
                      : prev.lastPlayDate === today ? prev.streak
                      : 1;

      const next: Progress = {
        results: { ...prev.results, [levelId]: { stars, moves } },
        streak: newStreak,
        lastPlayDate: today,
      };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const getStars = useCallback((levelId: number) => {
    return progress.results[levelId]?.stars ?? 0;
  }, [progress]);

  const getTotalStars = useCallback(() => {
    return Object.values(progress.results).reduce((sum, r) => sum + r.stars, 0);
  }, [progress]);

  const isLevelUnlocked = useCallback((levelId: number) => {
    if (levelId <= 1) return true;
    return !!progress.results[levelId - 1];  // previous level must be completed
  }, [progress]);

  return { progress, loaded, recordResult, getStars, getTotalStars, isLevelUnlocked };
}
