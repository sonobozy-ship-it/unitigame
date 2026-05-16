import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Alert, SafeAreaView, StatusBar,
} from 'react-native';
import { theme } from '../constants/theme';
import { useHints, HINT_PRICES, DAILY_GIFTS } from '../hooks/useHints';

interface Props {
  onBack: () => void;
}

interface HintItemProps {
  emoji: string;
  title: string;
  description: string;
  count: number;
  price: number;
  coins: number;
  onBuy: () => void;
  onWatchAd: () => void;
}

function HintItem({ emoji, title, description, count, price, coins, onBuy, onWatchAd }: HintItemProps) {
  const canBuy = coins >= price;
  return (
    <View style={styles.hintCard}>
      <Text style={styles.hintEmoji}>{emoji}</Text>
      <View style={styles.hintInfo}>
        <Text style={styles.hintTitle}>{title}</Text>
        <Text style={styles.hintDesc}>{description}</Text>
        <Text style={styles.hintCount}>You have: {count}</Text>
      </View>
      <View style={styles.hintActions}>
        <TouchableOpacity
          style={[styles.buyBtn, !canBuy && styles.disabledBtn]}
          onPress={onBuy}
          disabled={!canBuy}
        >
          <Text style={styles.buyBtnText}>🪙 {price}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.adBtn} onPress={onWatchAd}>
          <Text style={styles.adBtnText}>📺 Ad</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const COIN_PACKS = [
  { id: 'coins_50',  label: '50 Coins',   price: '$0.99',  amount: 50,   emoji: '🥉' },
  { id: 'coins_200', label: '200 Coins',  price: '$2.99',  amount: 200,  emoji: '🥈' },
  { id: 'coins_500', label: '500 Coins',  price: '$5.99',  amount: 500,  emoji: '🥇' },
  { id: 'noads',     label: 'Remove Ads', price: '$3.99',  amount: 100,  emoji: '🚫' },
];

export default function ShopScreen({ onBack }: Props) {
  const { inventory, buyHint, rewardAd, addCoins, claimDailyGift, canClaimGift } = useHints();
  const [giftClaimed, setGiftClaimed] = useState(false);

  const handleClaimGift = () => {
    const reward = claimDailyGift();
    if (reward) {
      setGiftClaimed(true);
      Alert.alert(
        'Daily Gift! 🎁',
        `You received ${reward.coins} coins${reward.bonus ? ` + 1 ${reward.bonus} hint` : ''}!`,
        [{ text: 'Nice!' }]
      );
    }
  };

  const handleWatchAd = (reward: Parameters<typeof rewardAd>[0]) => {
    Alert.alert(
      'Watch Ad',
      'Simulate watching an ad...',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Watched!',
          onPress: () => {
            rewardAd(reward);
            Alert.alert('Reward!', reward === 'coins' ? '+20 coins!' : `+1 ${reward} hint!`);
          },
        },
      ]
    );
  };

  const handleBuyCoinPack = (pack: typeof COIN_PACKS[0]) => {
    Alert.alert(
      'Purchase',
      `Buy ${pack.label} for ${pack.price}?\n(This is a demo — no real payment)`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Buy',
          onPress: () => {
            addCoins(pack.amount);
            Alert.alert('Success!', `You received ${pack.amount} coins!`);
          },
        },
      ]
    );
  };

  const dailyGiftAvailable = canClaimGift() && !giftClaimed;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.bg} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Shop</Text>
        <View style={styles.coinsDisplay}>
          <Text style={styles.coinsText}>🪙 {inventory.coins}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Daily Gift */}
        <Text style={styles.section}>Daily Gift 🎁</Text>
        <TouchableOpacity
          style={[styles.giftCard, !dailyGiftAvailable && styles.giftClaimed]}
          onPress={handleClaimGift}
          disabled={!dailyGiftAvailable}
        >
          <Text style={styles.giftEmoji}>🎁</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.giftTitle}>Day {((inventory.giftStreak - 1) % 7) + 2} Gift</Text>
            <Text style={styles.giftDesc}>
              {dailyGiftAvailable ? 'Tap to claim your daily reward!' : 'Come back tomorrow!'}
            </Text>
            <View style={styles.streakRow}>
              {[1,2,3,4,5,6,7].map(day => (
                <View key={day} style={[styles.streakDot, day <= ((inventory.giftStreak % 7) || 7) && styles.streakDotFilled]} />
              ))}
            </View>
          </View>
          {dailyGiftAvailable && (
            <View style={styles.claimBadge}>
              <Text style={styles.claimText}>CLAIM</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Hints */}
        <Text style={styles.section}>Hints</Text>

        <HintItem
          emoji="💡"
          title="Reveal Hint"
          description="Shows one correct step for a pipe"
          count={inventory.reveal}
          price={HINT_PRICES.reveal}
          coins={inventory.coins}
          onBuy={() => {
            if (buyHint('reveal')) Alert.alert('Purchased!', 'Reveal hint added.');
            else Alert.alert('Not enough coins', 'Watch an ad or buy coins.');
          }}
          onWatchAd={() => handleWatchAd('reveal')}
        />

        <HintItem
          emoji="🤖"
          title="Auto-Solve"
          description="Automatically solves one pipe completely"
          count={inventory.autoSolve}
          price={HINT_PRICES.autoSolve}
          coins={inventory.coins}
          onBuy={() => {
            if (buyHint('autoSolve')) Alert.alert('Purchased!', 'Auto-solve hint added.');
            else Alert.alert('Not enough coins', 'Watch an ad or buy coins.');
          }}
          onWatchAd={() => handleWatchAd('autoSolve')}
        />

        <HintItem
          emoji="🧹"
          title="Clear Wrong"
          description="Clears all incomplete/wrong pipes"
          count={inventory.clearWrong}
          price={HINT_PRICES.clearWrong}
          coins={inventory.coins}
          onBuy={() => {
            if (buyHint('clearWrong')) Alert.alert('Purchased!', 'Clear hint added.');
            else Alert.alert('Not enough coins', 'Watch an ad or buy coins.');
          }}
          onWatchAd={() => handleWatchAd('clearWrong')}
        />

        <HintItem
          emoji="⏭️"
          title="Skip Level"
          description="Skip current level (counts as 1 star)"
          count={inventory.skip}
          price={HINT_PRICES.skip}
          coins={inventory.coins}
          onBuy={() => {
            if (buyHint('skip')) Alert.alert('Purchased!', 'Skip added.');
            else Alert.alert('Not enough coins', 'Watch an ad or buy coins.');
          }}
          onWatchAd={() => handleWatchAd('coins')}
        />

        {/* Coins CTA ad */}
        <TouchableOpacity style={styles.adCoinsCard} onPress={() => handleWatchAd('coins')}>
          <Text style={styles.adCoinsEmoji}>📺</Text>
          <View>
            <Text style={styles.adCoinsTitle}>Watch Ad for Coins</Text>
            <Text style={styles.adCoinsDesc}>+20 coins per ad</Text>
          </View>
          <Text style={styles.adCoinsReward}>+20 🪙</Text>
        </TouchableOpacity>

        {/* Coin Packs */}
        <Text style={styles.section}>Coin Packs</Text>
        <View style={styles.coinPacksRow}>
          {COIN_PACKS.map(pack => (
            <TouchableOpacity
              key={pack.id}
              style={styles.coinPack}
              onPress={() => handleBuyCoinPack(pack)}
            >
              <Text style={styles.coinPackEmoji}>{pack.emoji}</Text>
              <Text style={styles.coinPackLabel}>{pack.label}</Text>
              <Text style={styles.coinPackPrice}>{pack.price}</Text>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: theme.bg },
  header:        { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  backBtn:       { padding: 8 },
  backText:      { color: theme.accentLight, fontSize: 16 },
  title:         { flex: 1, textAlign: 'center', color: theme.textPrimary, fontSize: 20, fontWeight: 'bold' },
  coinsDisplay:  { backgroundColor: theme.bgCard, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  coinsText:     { color: theme.starFilled, fontWeight: 'bold', fontSize: 14 },
  scroll:        { padding: 16, paddingBottom: 40 },

  section: { color: theme.textSecond, fontSize: 13, fontWeight: '700', letterSpacing: 1, marginTop: 20, marginBottom: 10, textTransform: 'uppercase' },

  giftCard:      { backgroundColor: theme.bgCard, borderRadius: theme.radius, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: theme.starFilled },
  giftClaimed:   { borderColor: theme.border, opacity: 0.6 },
  giftEmoji:     { fontSize: 36 },
  giftTitle:     { color: theme.textPrimary, fontWeight: 'bold', fontSize: 16 },
  giftDesc:      { color: theme.textSecond, fontSize: 13, marginTop: 2 },
  streakRow:     { flexDirection: 'row', gap: 4, marginTop: 8 },
  streakDot:     { width: 10, height: 10, borderRadius: 5, backgroundColor: theme.border },
  streakDotFilled: { backgroundColor: theme.starFilled },
  claimBadge:    { backgroundColor: theme.success, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  claimText:     { color: '#fff', fontWeight: 'bold', fontSize: 12 },

  hintCard:      { backgroundColor: theme.bgCard, borderRadius: theme.radius, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  hintEmoji:     { fontSize: 28 },
  hintInfo:      { flex: 1 },
  hintTitle:     { color: theme.textPrimary, fontWeight: 'bold', fontSize: 15 },
  hintDesc:      { color: theme.textSecond, fontSize: 12, marginTop: 2 },
  hintCount:     { color: theme.accentLight, fontSize: 12, marginTop: 4 },
  hintActions:   { flexDirection: 'column', gap: 6 },
  buyBtn:        { backgroundColor: theme.accent, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, alignItems: 'center' },
  disabledBtn:   { opacity: 0.4 },
  buyBtnText:    { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  adBtn:         { backgroundColor: theme.bgCellEmpty, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, alignItems: 'center', borderWidth: 1, borderColor: theme.border },
  adBtnText:     { color: theme.textSecond, fontSize: 13 },

  adCoinsCard:   { backgroundColor: theme.bgCard, borderRadius: theme.radius, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 4, borderWidth: 1, borderColor: theme.accent },
  adCoinsEmoji:  { fontSize: 28 },
  adCoinsTitle:  { color: theme.textPrimary, fontWeight: 'bold', fontSize: 15 },
  adCoinsDesc:   { color: theme.textSecond, fontSize: 12 },
  adCoinsReward: { marginLeft: 'auto', color: theme.starFilled, fontWeight: 'bold', fontSize: 18 },

  coinPacksRow:  { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  coinPack:      { backgroundColor: theme.bgCard, borderRadius: theme.radius, padding: 16, alignItems: 'center', flex: 1, minWidth: '45%', borderWidth: 1, borderColor: theme.border },
  coinPackEmoji: { fontSize: 32, marginBottom: 6 },
  coinPackLabel: { color: theme.textPrimary, fontWeight: 'bold', fontSize: 14 },
  coinPackPrice: { color: theme.accentLight, fontSize: 13, marginTop: 4 },
});
