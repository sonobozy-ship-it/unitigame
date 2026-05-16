import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, StatusBar, Alert,
} from 'react-native';
import { theme } from '../constants/theme';
import { getDailyLevel } from '../data/levels';
import { useHints } from '../hooks/useHints';

interface Props {
  onPlay: () => void;
  onDaily: () => void;
  onShop: () => void;
}

export default function HomeScreen({ onPlay, onDaily, onShop }: Props) {
  const { inventory, canClaimGift } = useHints();
  const dailyLevel = getDailyLevel();
  const giftReady = canClaimGift();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.bg} />

      {/* Logo area */}
      <View style={styles.logoArea}>
        <Text style={styles.logo}>UnitiFlow</Text>
        <Text style={styles.tagline}>Connect the dots. Fill the grid.</Text>
      </View>

      {/* Coins */}
      <TouchableOpacity style={styles.coinsRow} onPress={onShop}>
        <Text style={styles.coinsText}>🪙 {inventory.coins}</Text>
        <Text style={styles.coinsPlus}>＋</Text>
      </TouchableOpacity>

      {/* Daily gift banner */}
      {giftReady && (
        <TouchableOpacity style={styles.giftBanner} onPress={onShop}>
          <Text style={styles.giftBannerText}>🎁  Your daily gift is ready!</Text>
        </TouchableOpacity>
      )}

      {/* Main buttons */}
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.playBtn} onPress={onPlay}>
          <Text style={styles.playBtnText}>▶  Play</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.dailyBtn} onPress={onDaily}>
          <View>
            <Text style={styles.dailyBtnTitle}>📅  Daily Challenge</Text>
            <Text style={styles.dailyBtnSub}>Level {dailyLevel.id} • {dailyLevel.size}×{dailyLevel.size} grid</Text>
          </View>
          <Text style={styles.dailyArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.shopBtn} onPress={onShop}>
          <Text style={styles.shopBtnText}>🛒  Shop & Hints</Text>
        </TouchableOpacity>
      </View>

      {/* Streak */}
      {inventory.giftStreak > 0 && (
        <View style={styles.streakBadge}>
          <Text style={styles.streakText}>🔥 {inventory.giftStreak} day streak</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: theme.bg, paddingHorizontal: 24 },
  logoArea:       { marginTop: 60, alignItems: 'center' },
  logo:           { fontSize: 48, fontWeight: '900', color: theme.accentLight, letterSpacing: -1 },
  tagline:        { fontSize: 16, color: theme.textSecond, marginTop: 8 },

  coinsRow:       { flexDirection: 'row', alignSelf: 'flex-end', alignItems: 'center', backgroundColor: theme.bgCard, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, marginTop: 24, gap: 8 },
  coinsText:      { color: theme.starFilled, fontWeight: 'bold', fontSize: 16 },
  coinsPlus:      { color: theme.accentLight, fontSize: 18, fontWeight: 'bold' },

  giftBanner:     { backgroundColor: '#3a2a00', borderWidth: 1, borderColor: theme.starFilled, borderRadius: theme.radius, padding: 12, marginTop: 16, alignItems: 'center' },
  giftBannerText: { color: theme.starFilled, fontWeight: 'bold', fontSize: 15 },

  buttons:        { marginTop: 40, gap: 14 },
  playBtn:        { backgroundColor: theme.accent, borderRadius: theme.radiusLg, paddingVertical: 20, alignItems: 'center' },
  playBtnText:    { color: '#fff', fontSize: 22, fontWeight: 'bold', letterSpacing: 1 },

  dailyBtn:       { backgroundColor: theme.bgCard, borderRadius: theme.radiusLg, paddingVertical: 16, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: theme.border },
  dailyBtnTitle:  { color: theme.textPrimary, fontSize: 16, fontWeight: 'bold' },
  dailyBtnSub:    { color: theme.textSecond, fontSize: 13, marginTop: 2 },
  dailyArrow:     { marginLeft: 'auto', color: theme.textSecond, fontSize: 24 },

  shopBtn:        { backgroundColor: theme.bgCard, borderRadius: theme.radiusLg, paddingVertical: 16, alignItems: 'center', borderWidth: 1, borderColor: theme.accent },
  shopBtnText:    { color: theme.accentLight, fontSize: 16, fontWeight: 'bold' },

  streakBadge:    { marginTop: 'auto', marginBottom: 20, alignSelf: 'center', backgroundColor: '#3a1a00', borderRadius: 20, paddingHorizontal: 18, paddingVertical: 8 },
  streakText:     { color: '#FF8C00', fontWeight: 'bold', fontSize: 15 },
});
