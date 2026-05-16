import React, { useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, StatusBar, Animated,
} from 'react-native';
import { theme } from '../constants/theme';
import StarRating from '../components/StarRating';
import { shareResult } from '../utils/shareResult';
import { calcStars } from '../hooks/useGame';

interface Props {
  levelId: number;
  moves: number;
  par: number;
  onNext: () => void;
  onReplay: () => void;
  onMenu: () => void;
}

export default function WinScreen({ levelId, moves, par, onNext, onReplay, onMenu }: Props) {
  const stars = calcStars(moves, par);
  const scale = new Animated.Value(0);

  useEffect(() => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 5,
      tension: 80,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.bg} />

      <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
        <Text style={styles.trophy}>🏆</Text>
        <Text style={styles.title}>Level {levelId} Complete!</Text>

        <StarRating stars={stars} size={40} />

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{moves}</Text>
            <Text style={styles.statLabel}>Moves</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{par}</Text>
            <Text style={styles.statLabel}>Par</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{stars}/3</Text>
            <Text style={styles.statLabel}>Stars</Text>
          </View>
        </View>

        {stars < 3 && (
          <Text style={styles.hint}>
            {moves <= par * 1.5
              ? '💪 So close! Try to beat par!'
              : '🎯 Can you solve it in fewer moves?'}
          </Text>
        )}

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.nextBtn} onPress={onNext}>
            <Text style={styles.nextBtnText}>Next Level ›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.shareBtn} onPress={() => shareResult(levelId, stars, moves)}>
            <Text style={styles.shareBtnText}>📤 Share Result</Text>
          </TouchableOpacity>

          <View style={styles.smallBtns}>
            <TouchableOpacity style={styles.smallBtn} onPress={onReplay}>
              <Text style={styles.smallBtnText}>↺ Replay</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.smallBtn} onPress={onMenu}>
              <Text style={styles.smallBtnText}>⊟ Menu</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: theme.bg, justifyContent: 'center', alignItems: 'center' },
  card:         { backgroundColor: theme.bgCard, borderRadius: theme.radiusLg, padding: 32, alignItems: 'center', width: '88%', borderWidth: 1, borderColor: theme.border },
  trophy:       { fontSize: 64, marginBottom: 8 },
  title:        { color: theme.textPrimary, fontSize: 24, fontWeight: 'bold', marginBottom: 16 },

  statsRow:     { flexDirection: 'row', marginTop: 20, alignItems: 'center' },
  stat:         { alignItems: 'center', paddingHorizontal: 20 },
  statValue:    { color: theme.textPrimary, fontSize: 28, fontWeight: 'bold' },
  statLabel:    { color: theme.textSecond, fontSize: 13, marginTop: 2 },
  statDivider:  { width: 1, height: 40, backgroundColor: theme.border },

  hint:         { color: theme.textSecond, fontSize: 14, marginTop: 16, textAlign: 'center' },

  buttons:      { width: '100%', marginTop: 28, gap: 10 },
  nextBtn:      { backgroundColor: theme.accent, borderRadius: theme.radius, paddingVertical: 16, alignItems: 'center' },
  nextBtnText:  { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  shareBtn:     { backgroundColor: '#1a3a2a', borderRadius: theme.radius, paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: theme.success },
  shareBtnText: { color: theme.success, fontSize: 16, fontWeight: '600' },
  smallBtns:    { flexDirection: 'row', gap: 10 },
  smallBtn:     { flex: 1, backgroundColor: theme.bgCellEmpty, borderRadius: theme.radius, paddingVertical: 12, alignItems: 'center', borderWidth: 1, borderColor: theme.border },
  smallBtnText: { color: theme.textSecond, fontSize: 15 },
});
