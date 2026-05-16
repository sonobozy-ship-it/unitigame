import React, { useState, useCallback, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, StatusBar, Alert,
} from 'react-native';
import { theme } from '../constants/theme';
import { Level } from '../data/levels';
import { calcStars } from '../hooks/useGame';
import { useHints } from '../hooks/useHints';
import { useProgress } from '../hooks/useProgress';
import GameView3D, { GameView3DHandle } from '../game3d/GameView3D';
import WinScreen from './WinScreen';

interface Props {
  level: Level;
  onBack: () => void;
  onNext: (nextId: number) => void;
}

export default function GameScreen({ level, onBack, onNext }: Props) {
  const gameRef = useRef<GameView3DHandle>(null);
  const [moves, setMoves]       = useState(0);
  const [fillPct, setFillPct]   = useState(0);
  const [solved, setSolved]     = useState(false);
  const [winSeen, setWinSeen]   = useState(false);

  const { inventory, useHint }  = useHints();
  const { recordResult }        = useProgress();

  const handleProgress = useCallback((pct: number, mv: number) => {
    setFillPct(pct);
    setMoves(mv);
  }, []);

  const handleWin = useCallback((mv: number) => {
    setMoves(mv);
    setSolved(true);
    const stars = calcStars(mv, level.par);
    recordResult(level.id, stars, mv);
  }, [level, recordResult]);

  const handleReset = () => {
    setMoves(0); setFillPct(0); setSolved(false); setWinSeen(false);
    gameRef.current?.resetLevel();
  };

  const handleHint = (type: 'reveal' | 'autoSolve' | 'clearWrong' | 'skip') => {
    if ((inventory[type] as number) <= 0) {
      Alert.alert('Нет подсказок', `Купи ${type} в магазине!`, [
        { text: 'Магазин', onPress: onBack },
        { text: 'Отмена', style: 'cancel' },
      ]);
      return;
    }
    if (type === 'clearWrong') {
      Alert.alert('Очистить?', 'Убрать все незаконченные трубы?', [
        { text: 'Да', onPress: () => { useHint('clearWrong'); gameRef.current?.hintClear(); } },
        { text: 'Отмена', style: 'cancel' },
      ]);
    } else if (type === 'skip') {
      Alert.alert('Пропустить?', 'Уровень засчитается с 1 звездой.', [
        { text: 'Пропустить', onPress: () => { useHint('skip'); recordResult(level.id, 1, 999); onNext(level.id + 1); } },
        { text: 'Отмена', style: 'cancel' },
      ]);
    } else {
      Alert.alert('Подсказка активирована');
      useHint(type);
    }
  };

  if (solved && !winSeen) {
    return (
      <WinScreen
        levelId={level.id}
        moves={moves}
        par={level.par}
        onNext={() => { setWinSeen(true); onNext(level.id + 1); }}
        onReplay={() => { setWinSeen(true); handleReset(); }}
        onMenu={() => { setWinSeen(true); onBack(); }}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A14" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.headerBtn}>
          <Text style={styles.headerBtnText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.levelTitle}>Level {level.id}</Text>
          <Text style={styles.levelSub}>{level.size}×{level.size} · {fillPct}% filled</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.movesText}>{moves} moves</Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.progressBg}>
        <View style={[styles.progressFill, { width: `${fillPct}%` as any }]} />
      </View>

      {/* 3D Game View */}
      <GameView3D
        ref={gameRef}
        onProgress={handleProgress}
        onWin={handleWin}
      />

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.ctrlBtn} onPress={handleReset}>
          <Text style={styles.ctrlEmoji}>🔄</Text>
          <Text style={styles.ctrlLabel}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.ctrlBtn, styles.ctrlHint]} onPress={() => handleHint('clearWrong')}>
          <Text style={styles.ctrlEmoji}>🧹 {inventory.clearWrong}</Text>
          <Text style={styles.ctrlLabel}>Clear</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.ctrlBtn, styles.ctrlHint]} onPress={() => handleHint('reveal')}>
          <Text style={styles.ctrlEmoji}>💡 {inventory.reveal}</Text>
          <Text style={styles.ctrlLabel}>Hint</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.ctrlBtn, styles.ctrlHint]} onPress={() => handleHint('skip')}>
          <Text style={styles.ctrlEmoji}>⏭️ {inventory.skip}</Text>
          <Text style={styles.ctrlLabel}>Skip</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: '#0A0A14' },
  header:        { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10 },
  headerBtn:     { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerBtnText: { color: '#3ECFB2', fontSize: 22 },
  headerCenter:  { flex: 1, alignItems: 'center' },
  levelTitle:    { color: '#E8E6F0', fontWeight: 'bold', fontSize: 18 },
  levelSub:      { color: '#6B6B8A', fontSize: 12 },
  headerRight:   { width: 80, alignItems: 'flex-end' },
  movesText:     { color: '#6B6B8A', fontSize: 13 },

  progressBg:    { height: 3, backgroundColor: '#1a2040', marginHorizontal: 16, borderRadius: 2 },
  progressFill:  { height: 3, backgroundColor: '#3ECFB2', borderRadius: 2 },

  controls:      { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 8, paddingBottom: 20, paddingTop: 8 },
  ctrlBtn:       { alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, backgroundColor: '#13131F', minWidth: 60 },
  ctrlHint:      { borderWidth: 1, borderColor: '#3ECFB2' },
  ctrlEmoji:     { fontSize: 20 },
  ctrlLabel:     { color: '#6B6B8A', fontSize: 11, marginTop: 2 },
});
