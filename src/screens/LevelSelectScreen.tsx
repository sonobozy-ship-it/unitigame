import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, SafeAreaView, StatusBar,
} from 'react-native';
import { theme } from '../constants/theme';
import { PACKS, Pack } from '../data/levels';
import { useProgress } from '../hooks/useProgress';
import StarRating from '../components/StarRating';

interface Props {
  onBack: () => void;
  onSelectLevel: (levelId: number) => void;
}

export default function LevelSelectScreen({ onBack, onSelectLevel }: Props) {
  const { getStars, isLevelUnlocked } = useProgress();
  const [activePack, setActivePack] = useState<Pack>(PACKS[0]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.bg} />

      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Levels</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Pack tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.packTabs}>
        {PACKS.map(pack => (
          <TouchableOpacity
            key={pack.id}
            style={[styles.packTab, activePack.id === pack.id && styles.packTabActive]}
            onPress={() => setActivePack(pack)}
          >
            <Text style={[styles.packTabText, activePack.id === pack.id && styles.packTabTextActive]}>
              {pack.name}
            </Text>
            <Text style={styles.packTabGrid}>{pack.gridSize}×{pack.gridSize}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.packDesc}>{activePack.description}</Text>

      {/* Level grid */}
      <ScrollView contentContainerStyle={styles.levelsGrid}>
        {activePack.levels.map(level => {
          const stars = getStars(level.id);
          const unlocked = isLevelUnlocked(level.id);
          return (
            <TouchableOpacity
              key={level.id}
              style={[styles.levelCell, !unlocked && styles.levelLocked]}
              onPress={() => unlocked && onSelectLevel(level.id)}
              activeOpacity={unlocked ? 0.7 : 1}
            >
              {unlocked ? (
                <>
                  <Text style={styles.levelNumber}>{level.id}</Text>
                  <StarRating stars={stars} size={10} />
                </>
              ) : (
                <Text style={styles.lockIcon}>🔒</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:          { flex: 1, backgroundColor: theme.bg },
  header:             { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  backBtn:            { padding: 8 },
  backText:           { color: theme.accentLight, fontSize: 16 },
  title:              { flex: 1, textAlign: 'center', color: theme.textPrimary, fontSize: 20, fontWeight: 'bold' },

  packTabs:           { paddingHorizontal: 16, paddingVertical: 8, gap: 8 },
  packTab:            { backgroundColor: theme.bgCard, borderRadius: theme.radius, paddingHorizontal: 16, paddingVertical: 10, alignItems: 'center', borderWidth: 1, borderColor: theme.border },
  packTabActive:      { backgroundColor: theme.accent, borderColor: theme.accent },
  packTabText:        { color: theme.textSecond, fontWeight: 'bold', fontSize: 14 },
  packTabTextActive:  { color: '#fff' },
  packTabGrid:        { color: theme.textSecond, fontSize: 11, marginTop: 2 },

  packDesc:           { color: theme.textSecond, fontSize: 13, paddingHorizontal: 24, marginBottom: 12, textAlign: 'center' },

  levelsGrid:         { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 10, paddingBottom: 40 },
  levelCell:          { width: '18%', aspectRatio: 1, backgroundColor: theme.bgCard, borderRadius: theme.radius, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: theme.border },
  levelLocked:        { opacity: 0.4 },
  levelNumber:        { color: theme.textPrimary, fontWeight: 'bold', fontSize: 16 },
  lockIcon:           { fontSize: 16 },
});
