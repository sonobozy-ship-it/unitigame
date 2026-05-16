import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface HintInventory {
  reveal: number;       // reveal one correct pipe path segment
  autoSolve: number;    // solve one pipe automatically
  clearWrong: number;   // clear all wrong/incomplete pipes
  skip: number;         // skip current level and count as 1-star
  coins: number;        // soft currency
  lastGiftDate: string; // ISO date of last daily gift
  giftStreak: number;   // consecutive daily gift claims
}

const STORAGE_KEY = 'unitiflow_hints';

const DEFAULT: HintInventory = {
  reveal: 3,
  autoSolve: 1,
  clearWrong: 3,
  skip: 1,
  coins: 50,
  lastGiftDate: '',
  giftStreak: 0,
};

// Prices in coins
export const HINT_PRICES = {
  reveal:    10,
  autoSolve: 30,
  clearWrong: 15,
  skip:      25,
};

// Daily gift schedule: giftStreak -> coins reward
export const DAILY_GIFTS: Record<number, { coins: number; bonus?: keyof HintInventory }> = {
  1: { coins: 10 },
  2: { coins: 15 },
  3: { coins: 15, bonus: 'reveal' },
  4: { coins: 20 },
  5: { coins: 20 },
  6: { coins: 25, bonus: 'clearWrong' },
  7: { coins: 50, bonus: 'autoSolve' },
};

function getDayKey(streak: number) {
  return ((streak - 1) % 7) + 1;
}

export function useHints() {
  const [inventory, setInventory] = useState<HintInventory>(DEFAULT);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(raw => {
      if (raw) {
        try { setInventory({ ...DEFAULT, ...JSON.parse(raw) }); } catch {}
      }
      setLoaded(true);
    });
  }, []);

  const persist = useCallback((next: HintInventory) => {
    setInventory(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  // Returns false if not enough coins
  const buyHint = useCallback((type: keyof typeof HINT_PRICES): boolean => {
    let success = false;
    setInventory(prev => {
      const price = HINT_PRICES[type];
      if (prev.coins < price) return prev;
      const next = { ...prev, coins: prev.coins - price, [type]: (prev[type] as number) + 1 };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      success = true;
      return next;
    });
    return success;
  }, []);

  const useHint = useCallback((type: keyof typeof HINT_PRICES): boolean => {
    let success = false;
    setInventory(prev => {
      const count = prev[type] as number;
      if (count <= 0) return prev;
      const next = { ...prev, [type]: count - 1 };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      success = true;
      return next;
    });
    return success;
  }, []);

  // Called when user watches an ad — reward coins or hint
  const rewardAd = useCallback((reward: 'coins' | 'reveal' | 'autoSolve' | 'clearWrong') => {
    setInventory(prev => {
      let next = { ...prev };
      if (reward === 'coins') next.coins += 20;
      else next[reward] = (prev[reward] as number) + 1;
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  // Add coins directly (from IAP)
  const addCoins = useCallback((amount: number) => {
    setInventory(prev => {
      const next = { ...prev, coins: prev.coins + amount };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  // Returns null if already claimed today, otherwise the reward
  const claimDailyGift = useCallback((): { coins: number; bonus?: keyof HintInventory } | null => {
    const today = new Date().toISOString().split('T')[0];
    let reward: { coins: number; bonus?: keyof HintInventory } | null = null;

    setInventory(prev => {
      if (prev.lastGiftDate === today) return prev;
      const newStreak = prev.lastGiftDate === new Date(Date.now() - 86_400_000).toISOString().split('T')[0]
        ? prev.giftStreak + 1 : 1;
      const dayKey = getDayKey(newStreak);
      reward = DAILY_GIFTS[dayKey] ?? { coins: 10 };

      const next: HintInventory = {
        ...prev,
        coins: prev.coins + reward.coins,
        lastGiftDate: today,
        giftStreak: newStreak,
      };
      if (reward.bonus) {
        (next[reward.bonus] as number) += 1;
      }
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    return reward;
  }, []);

  const canClaimGift = useCallback((): boolean => {
    const today = new Date().toISOString().split('T')[0];
    return inventory.lastGiftDate !== today;
  }, [inventory.lastGiftDate]);

  return {
    inventory, loaded,
    buyHint, useHint, rewardAd, addCoins,
    claimDailyGift, canClaimGift,
  };
}
