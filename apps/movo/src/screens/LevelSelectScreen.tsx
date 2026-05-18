import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';
import { THEME } from '../constants/theme';
import { getTotalLevels } from '../data/levels';
import { useProgress } from '../hooks/useProgress';

interface LevelSelectScreenProps {
  onSelectLevel: (levelId: number) => void;
  onBack: () => void;
}

function StarDisplay({ stars, max = 3 }: { stars: number; max?: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {Array.from({ length: max }).map((_, i) => (
        <Text key={i} style={{ fontSize: 8, color: i < stars ? COLORS.starActive : COLORS.starInactive }}>
          ★
        </Text>
      ))}
    </View>
  );
}

export function LevelSelectScreen({ onSelectLevel, onBack }: LevelSelectScreenProps) {
  const { isUnlocked, getLevelProgress } = useProgress();
  const totalLevels = getTotalLevels();

  const renderItem = useCallback(({ item }: { item: number }) => {
    const unlocked = isUnlocked(item);
    const prog = getLevelProgress(item);
    const completed = prog?.completed ?? false;
    const stars = prog?.stars ?? 0;

    let bgColor = COLORS.bgCard;
    let borderColor = COLORS.bgCardDark;
    let textColor = COLORS.textPrimary;

    if (!unlocked) {
      bgColor = COLORS.bgCardDark;
      textColor = COLORS.textMuted;
    } else if (completed) {
      borderColor = COLORS.star1;
    }

    return (
      <TouchableOpacity
        style={[styles.levelButton, { backgroundColor: bgColor, borderColor }]}
        onPress={() => unlocked && onSelectLevel(item)}
        activeOpacity={unlocked ? 0.7 : 1}
        disabled={!unlocked}
      >
        {!unlocked ? (
          <Text style={[styles.lockIcon]}>🔒</Text>
        ) : (
          <>
            <Text style={[styles.levelNumber, { color: textColor }]}>{item}</Text>
            {completed && <StarDisplay stars={stars} />}
          </>
        )}
      </TouchableOpacity>
    );
  }, [isUnlocked, getLevelProgress, onSelectLevel]);

  const data = Array.from({ length: totalLevels }, (_, i) => i + 1);

  const getDifficultyLabel = (id: number) => {
    if (id <= 40) return { label: 'Easy', color: '#82E0AA' };
    if (id <= 100) return { label: 'Medium', color: '#F7DC6F' };
    if (id <= 150) return { label: 'Hard', color: '#F0B27A' };
    return { label: 'Expert', color: '#FF6B9D' };
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Select Level</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.difficultyLegend}>
        {[{ label: 'Easy', color: '#82E0AA' }, { label: 'Medium', color: '#F7DC6F' }, { label: 'Hard', color: '#F0B27A' }, { label: 'Expert', color: '#FF6B9D' }].map(d => (
          <View key={d.label} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: d.color }]} />
            <Text style={styles.legendText}>{d.label}</Text>
          </View>
        ))}
      </View>

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => String(item)}
        numColumns={5}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
        getItemLayout={(_, index) => ({ length: 64, offset: 64 * Math.floor(index / 5), index })}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.bgCard,
  },
  backButton: {
    padding: THEME.spacing.sm,
  },
  backText: {
    color: COLORS.secondary,
    fontSize: THEME.fontSize.md,
    fontWeight: THEME.fontWeight.medium,
  },
  title: {
    fontSize: THEME.fontSize.lg,
    fontWeight: THEME.fontWeight.bold,
    color: COLORS.textPrimary,
    letterSpacing: 2,
  },
  difficultyLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    paddingVertical: THEME.spacing.sm,
    backgroundColor: COLORS.bgCard,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: THEME.fontSize.xs,
    color: COLORS.textSecondary,
  },
  grid: {
    padding: THEME.spacing.md,
    gap: 8,
  },
  levelButton: {
    width: 56,
    height: 56,
    margin: 4,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelNumber: {
    fontSize: THEME.fontSize.md,
    fontWeight: THEME.fontWeight.bold,
  },
  lockIcon: {
    fontSize: 18,
  },
});
