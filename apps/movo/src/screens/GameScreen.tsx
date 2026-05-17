import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../constants/colors';
import { THEME } from '../constants/theme';
import { Level } from '../data/levels';
import { useGame } from '../hooks/useGame';
import { GameBoard } from '../components/GameBoard';

interface GameScreenProps {
  level: Level;
  onWin: (levelId: number, stars: number, moves: number) => void;
  onBack: () => void;
}

function StarBar({ par, moves }: { par: number; moves: number }) {
  const stars = moves === 0 ? 3 : moves <= par ? 3 : moves <= Math.ceil(par * 1.5) ? 2 : 1;
  return (
    <View style={{ flexDirection: 'row', gap: 4 }}>
      {[1, 2, 3].map(s => (
        <Text key={s} style={{ fontSize: 18, color: s <= stars ? COLORS.starActive : COLORS.starInactive }}>★</Text>
      ))}
    </View>
  );
}

export function GameScreen({ level, onWin, onBack }: GameScreenProps) {
  const { state, tapSnake, undoMove, resetGame, getStars } = useGame(level);
  const winHandled = useRef(false);
  const winAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    winHandled.current = false;
    resetGame(level);
    winAnim.setValue(0);
  }, [level.id]);

  useEffect(() => {
    if (state.won && !winHandled.current) {
      winHandled.current = true;
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      Animated.spring(winAnim, { toValue: 1, useNativeDriver: true, friction: 5 }).start();
      const stars = getStars(state.moveCount);
      setTimeout(() => onWin(level.id, stars, state.moveCount), 800);
    }
  }, [state.won]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg}/>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.headerButton}>
          <Text style={styles.headerButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.levelLabel}>Level {level.id}</Text>
          <StarBar par={level.par} moves={state.moveCount}/>
        </View>
        <TouchableOpacity onPress={() => resetGame(level)} style={styles.headerButton}>
          <Text style={styles.headerButtonText}>↺</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.movesRow}>
        <View style={styles.movesBox}>
          <Text style={styles.movesNumber}>{state.moveCount}</Text>
          <Text style={styles.movesLabel}>MOVES</Text>
        </View>
        <View style={styles.parBox}>
          <Text style={styles.parNumber}>{level.par}</Text>
          <Text style={styles.parLabel}>PAR</Text>
        </View>
      </View>

      <View style={styles.boardContainer}>
        <GameBoard level={level} snakes={state.snakes} onTap={tapSnake} won={state.won}/>
      </View>

      {state.won && (
        <Animated.View style={[styles.winOverlay, { opacity: winAnim, transform: [{ scale: winAnim }] }]}>
          <Text style={styles.winText}>🎉 SOLVED!</Text>
        </Animated.View>
      )}

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlButton, state.history.length === 0 && styles.controlButtonDisabled]}
          onPress={undoMove}
          disabled={state.history.length === 0}
        >
          <Text style={styles.controlButtonText}>⟵ Undo</Text>
        </TouchableOpacity>
        <View style={styles.hintBox}>
          <Text style={styles.hintText}>Нажми — змейка уползёт</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing.md, paddingVertical: THEME.spacing.sm,
    borderBottomWidth: 1, borderBottomColor: COLORS.bgCard,
  },
  headerButton: {
    width: 44, height: 44, alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.bgCard, borderRadius: THEME.borderRadius.md,
  },
  headerButtonText: { fontSize: 22, color: COLORS.secondary, fontWeight: THEME.fontWeight.bold },
  headerCenter: { alignItems: 'center', gap: 4 },
  levelLabel: { fontSize: THEME.fontSize.lg, fontWeight: THEME.fontWeight.bold, color: COLORS.textPrimary, letterSpacing: 2 },
  movesRow: { flexDirection: 'row', justifyContent: 'center', gap: THEME.spacing.lg, paddingVertical: THEME.spacing.sm },
  movesBox: { alignItems: 'center', minWidth: 60 },
  movesNumber: { fontSize: THEME.fontSize.xxl, fontWeight: THEME.fontWeight.heavy, color: COLORS.secondary },
  movesLabel: { fontSize: THEME.fontSize.xs, color: COLORS.textMuted, letterSpacing: 2 },
  parBox: { alignItems: 'center', minWidth: 60 },
  parNumber: { fontSize: THEME.fontSize.xxl, fontWeight: THEME.fontWeight.heavy, color: COLORS.textMuted },
  parLabel: { fontSize: THEME.fontSize.xs, color: COLORS.textMuted, letterSpacing: 2 },
  boardContainer: { flex: 1, justifyContent: 'center' },
  winOverlay: {
    position: 'absolute', top: '40%', left: '50%', transform: [{ translateX: -80 }],
    backgroundColor: COLORS.bgCard, borderRadius: THEME.borderRadius.xl,
    paddingHorizontal: THEME.spacing.xl, paddingVertical: THEME.spacing.lg,
    borderWidth: 2, borderColor: COLORS.starActive, zIndex: 100,
  },
  winText: { fontSize: THEME.fontSize.xl, fontWeight: THEME.fontWeight.heavy, color: COLORS.starActive },
  controls: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing.md, paddingVertical: THEME.spacing.md,
    borderTopWidth: 1, borderTopColor: COLORS.bgCard,
  },
  controlButton: {
    backgroundColor: COLORS.bgCard, paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm, borderRadius: THEME.borderRadius.md,
    borderWidth: 1, borderColor: COLORS.secondary,
  },
  controlButtonDisabled: { opacity: 0.4, borderColor: COLORS.bgCardDark },
  controlButtonText: { color: COLORS.secondary, fontSize: THEME.fontSize.md, fontWeight: THEME.fontWeight.medium },
  hintBox: { flex: 1, alignItems: 'flex-end' },
  hintText: { fontSize: THEME.fontSize.xs, color: COLORS.textMuted },
});
