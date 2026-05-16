import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, StatusBar, Alert,
} from 'react-native';
import { theme } from '../constants/theme';
import { Level } from '../data/levels';
import { useGame, calcStars } from '../hooks/useGame';
import { useHints } from '../hooks/useHints';
import { useProgress } from '../hooks/useProgress';
import GameBoard from '../components/GameBoard';
import WinScreen from './WinScreen';

interface Props {
  level: Level;
  onBack: () => void;
  onNext: (nextId: number) => void;
}

export default function GameScreen({ level, onBack, onNext }: Props) {
  const gameHook = useGame(level);
  const { state, reset, undo } = gameHook;
  const { inventory, useHint } = useHints();
  const { recordResult } = useProgress();
  const [winSeen, setWinSeen] = useState(false);

  // Record result when puzzle is solved
  if (state.solved && !winSeen) {
    const stars = calcStars(state.moves, level.par);
    recordResult(level.id, stars, state.moves);
  }

  const handleUseHint = (type: 'reveal' | 'autoSolve' | 'clearWrong' | 'skip') => {
    const count = inventory[type];
    if (count <= 0) {
      Alert.alert('No hints', `You don't have any ${type} hints. Buy them in the Shop!`, [
        { text: 'Go to Shop', onPress: onBack },
        { text: 'Cancel', style: 'cancel' },
      ]);
      return;
    }

    if (type === 'clearWrong') {
      Alert.alert('Clear Wrong Pipes?', 'This will clear all incomplete pipes.', [
        { text: 'Use Hint', onPress: () => { useHint('clearWrong'); reset(); } },
        { text: 'Cancel', style: 'cancel' },
      ]);
    } else if (type === 'skip') {
      Alert.alert('Skip Level?', 'This will count as 1 star.', [
        {
          text: 'Skip',
          onPress: () => {
            useHint('skip');
            recordResult(level.id, 1, 999);
            onNext(level.id + 1);
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]);
    } else {
      // reveal / autoSolve — show placeholder message (would integrate with solver)
      Alert.alert('Hint Used!', `${type} hint activated.`);
      useHint(type);
    }
  };

  if (state.solved && !winSeen) {
    return (
      <WinScreen
        levelId={level.id}
        moves={state.moves}
        par={level.par}
        onNext={() => { setWinSeen(true); onNext(level.id + 1); }}
        onReplay={() => { setWinSeen(true); reset(); }}
        onMenu={() => { setWinSeen(true); onBack(); }}
      />
    );
  }

  const filledCells = state.grid.flat().filter(Boolean).length;
  const totalCells = level.size * level.size;
  const fillPct = Math.round((filledCells / totalCells) * 100);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.bg} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.headerBtn}>
          <Text style={styles.headerBtnText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.levelTitle}>Level {level.id}</Text>
          <Text style={styles.levelSub}>{level.size}×{level.size} • {fillPct}% filled</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.movesText}>{state.moves} moves</Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.progressBg}>
        <View style={[styles.progressFill, { width: `${fillPct}%` as any }]} />
      </View>

      {/* Board */}
      <View style={styles.boardWrapper}>
        <GameBoard level={level} gameHook={gameHook} />
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.ctrlBtn} onPress={undo}>
          <Text style={styles.ctrlEmoji}>↩️</Text>
          <Text style={styles.ctrlLabel}>Undo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.ctrlBtn} onPress={reset}>
          <Text style={styles.ctrlEmoji}>🔄</Text>
          <Text style={styles.ctrlLabel}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.ctrlBtn, styles.ctrlHint]} onPress={() => handleUseHint('clearWrong')}>
          <Text style={styles.ctrlEmoji}>🧹 {inventory.clearWrong}</Text>
          <Text style={styles.ctrlLabel}>Clear</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.ctrlBtn, styles.ctrlHint]} onPress={() => handleUseHint('reveal')}>
          <Text style={styles.ctrlEmoji}>💡 {inventory.reveal}</Text>
          <Text style={styles.ctrlLabel}>Hint</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.ctrlBtn, styles.ctrlHint]} onPress={() => handleUseHint('skip')}>
          <Text style={styles.ctrlEmoji}>⏭️ {inventory.skip}</Text>
          <Text style={styles.ctrlLabel}>Skip</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: theme.bg },
  header:        { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10 },
  headerBtn:     { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerBtnText: { color: theme.accentLight, fontSize: 22 },
  headerCenter:  { flex: 1, alignItems: 'center' },
  levelTitle:    { color: theme.textPrimary, fontWeight: 'bold', fontSize: 18 },
  levelSub:      { color: theme.textSecond, fontSize: 12 },
  headerRight:   { width: 80, alignItems: 'flex-end' },
  movesText:     { color: theme.textSecond, fontSize: 13 },

  progressBg:    { height: 4, backgroundColor: theme.border, marginHorizontal: 16, borderRadius: 2 },
  progressFill:  { height: 4, backgroundColor: theme.accent, borderRadius: 2 },

  boardWrapper:  { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },

  controls:      { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 8, paddingBottom: 20, paddingTop: 8 },
  ctrlBtn:       { alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: theme.radius, backgroundColor: theme.bgCard, minWidth: 56 },
  ctrlHint:      { borderWidth: 1, borderColor: theme.accent },
  ctrlEmoji:     { fontSize: 20 },
  ctrlLabel:     { color: theme.textSecond, fontSize: 11, marginTop: 2 },
});
