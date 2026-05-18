import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';
import { THEME } from '../constants/theme';
import { getTotalLevels } from '../data/levels';

interface HomeScreenProps {
  onPlay: () => void;
}

export function HomeScreen({ onPlay }: HomeScreenProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(-50)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
    ]).start();

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      <Animated.View style={[styles.hero, { transform: [{ translateY: slideAnim }], opacity: fadeAnim }]}>
        {/* Isometric car icon placeholder */}
        <View style={styles.iconContainer}>
          <View style={styles.iconBg}>
            <Text style={styles.iconEmoji}>🐧</Text>
          </View>
        </View>

        <Text style={styles.title}>WADDLE</Text>
        <Text style={styles.tagline}>Slide. Escape. Waddle!</Text>
      </Animated.View>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{getTotalLevels()}</Text>
            <Text style={styles.statLabel}>Levels</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>2.5D</Text>
            <Text style={styles.statLabel}>Isometric</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>∞</Text>
            <Text style={styles.statLabel}>Undo</Text>
          </View>
        </View>

        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <TouchableOpacity style={styles.playButton} onPress={onPlay} activeOpacity={0.8}>
            <Text style={styles.playButtonText}>PLAY</Text>
          </TouchableOpacity>
        </Animated.View>

        <Text style={styles.subtitle}>
          Swipe penguins across the ice.{'\n'}
          Free the golden penguin to escape!
        </Text>
      </Animated.View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 SonoBzy</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hero: {
    alignItems: 'center',
    paddingTop: THEME.spacing.xl,
  },
  iconContainer: {
    marginBottom: THEME.spacing.md,
  },
  iconBg: {
    width: 100,
    height: 100,
    borderRadius: 24,
    backgroundColor: COLORS.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },
  iconEmoji: {
    fontSize: 50,
  },
  title: {
    fontSize: THEME.fontSize.hero,
    fontWeight: THEME.fontWeight.heavy,
    color: COLORS.primary,
    letterSpacing: 12,
    textShadowColor: COLORS.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  tagline: {
    fontSize: THEME.fontSize.md,
    color: COLORS.textSecondary,
    letterSpacing: 3,
    marginTop: THEME.spacing.sm,
    textTransform: 'uppercase',
  },
  content: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: THEME.spacing.xl,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: THEME.borderRadius.lg,
    paddingVertical: THEME.spacing.md,
    paddingHorizontal: THEME.spacing.lg,
    marginBottom: THEME.spacing.xl,
    width: '100%',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: THEME.fontSize.xl,
    fontWeight: THEME.fontWeight.bold,
    color: COLORS.secondary,
  },
  statLabel: {
    fontSize: THEME.fontSize.xs,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.bgCardDark,
  },
  playButton: {
    backgroundColor: COLORS.buttonPrimary,
    paddingHorizontal: 64,
    paddingVertical: 20,
    borderRadius: THEME.borderRadius.xl,
    shadowColor: COLORS.buttonPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  playButtonText: {
    fontSize: THEME.fontSize.xl,
    fontWeight: THEME.fontWeight.heavy,
    color: COLORS.bg,
    letterSpacing: 8,
  },
  subtitle: {
    fontSize: THEME.fontSize.sm,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: THEME.spacing.xl,
    lineHeight: 22,
  },
  footer: {
    paddingBottom: THEME.spacing.md,
  },
  footerText: {
    fontSize: THEME.fontSize.xs,
    color: COLORS.textMuted,
  },
});
