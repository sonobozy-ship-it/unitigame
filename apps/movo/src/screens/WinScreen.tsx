import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Share, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../constants/colors';
import { THEME } from '../constants/theme';

interface WinScreenProps {
  levelId: number;
  stars: number;
  moves: number;
  par: number;
  onNext: () => void;
  onReplay: () => void;
  onMenu: () => void;
}

export function WinScreen({ levelId, stars, moves, par, onNext, onReplay, onMenu }: WinScreenProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const star1Anim = useRef(new Animated.Value(0)).current;
  const star2Anim = useRef(new Animated.Value(0)).current;
  const star3Anim = useRef(new Animated.Value(0)).current;
  const starAnims = [star1Anim, star2Anim, star3Anim];

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, friction: 5, tension: 80 }),
      Animated.stagger(200, [
        Animated.spring(star1Anim, { toValue: stars >= 1 ? 1 : 0.3, useNativeDriver: true, friction: 4 }),
        Animated.spring(star2Anim, { toValue: stars >= 2 ? 1 : 0.3, useNativeDriver: true, friction: 4 }),
        Animated.spring(star3Anim, { toValue: stars >= 3 ? 1 : 0.3, useNativeDriver: true, friction: 4 }),
      ]),
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleShare = () => {
    const starStr = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
    Share.share({
      message: `I solved WADDLE Level ${levelId} in ${moves} moves! ${starStr}\nCan you beat me? #WADDLE #PenguinPuzzle`,
    }).catch(() => {});
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
        <Text style={styles.emoji}>🐧</Text>
        <Text style={styles.title}>Level Complete!</Text>
        <Text style={styles.levelText}>Level {levelId}</Text>

        <View style={styles.starsRow}>
          {starAnims.map((anim, i) => (
            <Animated.Text
              key={i}
              style={[
                styles.star,
                i < stars ? styles.starActive : styles.starInactive,
                { transform: [{ scale: anim }] },
              ]}
            >
              ★
            </Animated.Text>
          ))}
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{moves}</Text>
            <Text style={styles.statLabel}>MOVES</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{par}</Text>
            <Text style={styles.statLabel}>PAR</Text>
          </View>
        </View>

        {moves <= par && (
          <Text style={styles.perfectText}>Perfect waddle! 🏆</Text>
        )}
      </Animated.View>

      <Animated.View style={[styles.buttons, { opacity: fadeAnim }]}>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare} activeOpacity={0.8}>
          <Text style={styles.shareButtonText}>Share Your Waddle 🐧</Text>
        </TouchableOpacity>

        <View style={styles.navRow}>
          <TouchableOpacity style={styles.navButton} onPress={onMenu} activeOpacity={0.8}>
            <Text style={styles.navButtonText}>Levels</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={onReplay} activeOpacity={0.8}>
            <Text style={styles.navButtonText}>↺ Replay</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.navButton, styles.nextButton]} onPress={onNext} activeOpacity={0.8}>
            <Text style={[styles.navButtonText, styles.nextButtonText]}>Next →</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: THEME.spacing.xl,
    gap: THEME.spacing.xl,
  },
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: THEME.borderRadius.xl,
    padding: THEME.spacing.xl,
    alignItems: 'center',
    width: '100%',
    borderWidth: 2,
    borderColor: COLORS.starActive,
    shadowColor: COLORS.starActive,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
    gap: THEME.spacing.sm,
  },
  emoji: {
    fontSize: 64,
  },
  title: {
    fontSize: THEME.fontSize.xl,
    fontWeight: THEME.fontWeight.heavy,
    color: COLORS.textPrimary,
    letterSpacing: 2,
  },
  levelText: {
    fontSize: THEME.fontSize.md,
    color: COLORS.textSecondary,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: THEME.spacing.sm,
  },
  star: {
    fontSize: 48,
  },
  starActive: {
    color: COLORS.starActive,
  },
  starInactive: {
    color: COLORS.starInactive,
    opacity: 0.4,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCardDark,
    borderRadius: THEME.borderRadius.lg,
    paddingVertical: THEME.spacing.md,
    paddingHorizontal: THEME.spacing.xl,
    gap: THEME.spacing.xl,
    width: '100%',
    justifyContent: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: THEME.fontSize.xxl,
    fontWeight: THEME.fontWeight.heavy,
    color: COLORS.secondary,
  },
  statLabel: {
    fontSize: THEME.fontSize.xs,
    color: COLORS.textMuted,
    letterSpacing: 2,
  },
  statDivider: {
    width: 1,
    height: 50,
    backgroundColor: COLORS.bgCard,
  },
  perfectText: {
    fontSize: THEME.fontSize.lg,
    fontWeight: THEME.fontWeight.bold,
    color: COLORS.starActive,
    letterSpacing: 1,
  },
  buttons: {
    width: '100%',
    gap: THEME.spacing.md,
  },
  shareButton: {
    backgroundColor: COLORS.accent,
    borderRadius: THEME.borderRadius.xl,
    paddingVertical: THEME.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  shareButtonText: {
    fontSize: THEME.fontSize.lg,
    fontWeight: THEME.fontWeight.bold,
    color: COLORS.secondary,
    letterSpacing: 1,
  },
  navRow: {
    flexDirection: 'row',
    gap: THEME.spacing.sm,
  },
  navButton: {
    flex: 1,
    backgroundColor: COLORS.bgCard,
    borderRadius: THEME.borderRadius.lg,
    paddingVertical: THEME.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.bgCardDark,
  },
  nextButton: {
    backgroundColor: COLORS.buttonPrimary,
    borderColor: COLORS.primary,
  },
  navButtonText: {
    fontSize: THEME.fontSize.md,
    fontWeight: THEME.fontWeight.bold,
    color: COLORS.textSecondary,
  },
  nextButtonText: {
    color: COLORS.secondary,
  },
});
