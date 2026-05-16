import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useGame } from '../store/gameStore';
import { CONTRACT_TEMPLATES } from '../data/contracts';
import { theme } from '../constants/theme';

const DIFFICULTY_LABEL: Record<string, string> = {
  easy: '🟢 Лёгкий',
  medium: '🟡 Средний',
  hard: '🔴 Тяжёлый',
  nightmare: '💀 Кошмар',
};

const DIFFICULTY_COLOR: Record<string, string> = {
  easy: theme.success,
  medium: theme.warning,
  hard: theme.danger,
  nightmare: '#9B59B6',
};

export default function ContractsScreen() {
  const { state, dispatch } = useGame();
  const { currentProject, completedProjects } = state;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {currentProject && (
        <View style={styles.activeNotice}>
          <Text style={styles.activeNoticeText}>
            ⚠️ У вас есть активный объект: {currentProject.emoji} {currentProject.name}{'\n'}
            Завершите его перед новым контрактом.
          </Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>Доступные контракты</Text>

      {CONTRACT_TEMPLATES.map(tmpl => {
        const advance = Math.round(tmpl.value * tmpl.advancePercent);
        const canTake = !currentProject;
        return (
          <View key={tmpl.id} style={styles.contractCard}>
            <View style={styles.contractHeader}>
              <Text style={styles.contractEmoji}>{tmpl.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.contractName}>{tmpl.name}</Text>
                <Text style={styles.contractClient}>Заказчик: {tmpl.client}</Text>
              </View>
              <Text style={[styles.difficulty, { color: DIFFICULTY_COLOR[tmpl.difficulty] }]}>
                {DIFFICULTY_LABEL[tmpl.difficulty]}
              </Text>
            </View>

            <Text style={styles.contractDesc}>{tmpl.description}</Text>

            <View style={styles.contractStats}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Сумма</Text>
                <Text style={[styles.statValue, { color: theme.primary }]}>{tmpl.value.toLocaleString('ru')} ₽</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Аванс</Text>
                <Text style={[styles.statValue, { color: theme.success }]}>+{advance.toLocaleString('ru')} ₽</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Срок</Text>
                <Text style={styles.statValue}>{tmpl.durationDays} дней</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.takeBtn, !canTake && styles.takeBtnDisabled]}
              onPress={() => canTake && dispatch({ type: 'TAKE_CONTRACT', templateId: tmpl.id })}
              disabled={!canTake}
            >
              <Text style={[styles.takeBtnText, !canTake && styles.takeBtnTextDisabled]}>
                {canTake ? `✍️ Подписать контракт` : '⛔ Завершите текущий объект'}
              </Text>
            </TouchableOpacity>
          </View>
        );
      })}

      {completedProjects.length > 0 && (
        <>
          <Text style={[styles.sectionTitle, { marginTop: 8 }]}>Закрытые объекты</Text>
          {completedProjects.map((p, i) => (
            <View key={i} style={styles.completedCard}>
              <Text style={styles.completedEmoji}>{p.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.completedName}>{p.name}</Text>
                <Text style={styles.completedClient}>{p.client} · день {p.day}</Text>
              </View>
              <Text style={styles.completedEarned}>+{p.earned.toLocaleString('ru')} ₽</Text>
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg },
  content: { padding: 16, paddingBottom: 40 },
  activeNotice: { backgroundColor: '#2A1800', borderRadius: 10, padding: 12, marginBottom: 16, borderWidth: 1, borderColor: theme.warning },
  activeNoticeText: { fontSize: 13, color: theme.warning, lineHeight: 20 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: theme.primary, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  contractCard: { backgroundColor: theme.card, borderRadius: 14, padding: 14, marginBottom: 14, borderWidth: 1, borderColor: theme.border },
  contractHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 8 },
  contractEmoji: { fontSize: 28 },
  contractName: { fontSize: 15, fontWeight: '700', color: theme.text, marginBottom: 2 },
  contractClient: { fontSize: 12, color: theme.textMuted },
  difficulty: { fontSize: 12, fontWeight: '600' },
  contractDesc: { fontSize: 13, color: theme.textMuted, lineHeight: 20, marginBottom: 12 },
  contractStats: { flexDirection: 'row', gap: 0, marginBottom: 12, backgroundColor: theme.cardHigh, borderRadius: 8, padding: 10 },
  statItem: { flex: 1, alignItems: 'center' },
  statLabel: { fontSize: 11, color: theme.textMuted, marginBottom: 2 },
  statValue: { fontSize: 14, fontWeight: '700', color: theme.text },
  takeBtn: { backgroundColor: theme.primary, borderRadius: 10, padding: 12, alignItems: 'center' },
  takeBtnDisabled: { backgroundColor: theme.card, borderWidth: 1, borderColor: theme.border },
  takeBtnText: { fontSize: 14, fontWeight: '700', color: '#000' },
  takeBtnTextDisabled: { color: theme.textMuted },
  completedCard: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#0A1A0A', borderRadius: 10, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: '#1A3A1A' },
  completedEmoji: { fontSize: 20 },
  completedName: { fontSize: 13, fontWeight: '600', color: theme.text },
  completedClient: { fontSize: 11, color: theme.textMuted },
  completedEarned: { fontSize: 14, fontWeight: '700', color: theme.success },
});
