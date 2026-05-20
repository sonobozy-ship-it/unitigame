import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useGame } from '../store/gameStore';
import { WORKER_TEMPLATES } from '../data/workers';
import { theme } from '../constants/theme';

export default function BrigadeScreen() {
  const { state, dispatch } = useGame();
  const { hiredWorkers, money } = state;

  const hiredIds = new Set(hiredWorkers.map(w => w.id));
  const availableToHire = WORKER_TEMPLATES.filter(w => !hiredIds.has(w.id));

  const totalDailyCost = hiredWorkers.reduce((s, w) => s + w.dailyCost, 0);
  const totalEff = hiredWorkers.filter(w => !w.isOnBinge).reduce((s, w) => s + w.efficiency, 0);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Summary */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryLabel}>Рабочих</Text>
          <Text style={styles.summaryValue}>{hiredWorkers.length}</Text>
        </View>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryLabel}>В день</Text>
          <Text style={[styles.summaryValue, { color: theme.danger }]}>−{totalDailyCost.toLocaleString('ru')} ₽</Text>
        </View>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryLabel}>Эффективность</Text>
          <Text style={[styles.summaryValue, { color: theme.primary }]}>{totalEff} ед/тик</Text>
        </View>
      </View>

      {/* Hired workers */}
      {hiredWorkers.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Ваша бригада</Text>
          {hiredWorkers.map(w => (
            <View key={w.id} style={[styles.workerCard, w.isOnBinge && styles.workerCardBinge]}>
              <Text style={styles.workerEmoji}>{w.emoji}</Text>
              <View style={{ flex: 1 }}>
                <View style={styles.workerRow}>
                  <Text style={styles.workerName}>{w.name}</Text>
                  <Text style={styles.workerRole}>{w.role}</Text>
                </View>
                <Text style={styles.workerDesc}>{w.description}</Text>
                {w.isOnBinge && (
                  <Text style={styles.bingeText}>🍺 В запое ({w.bingeTicksLeft} сек до возврата)</Text>
                )}
                <View style={styles.workerStats}>
                  <Text style={styles.stat}>⚡ Эфф: {w.efficiency}</Text>
                  <Text style={styles.stat}>💸 {w.dailyCost.toLocaleString('ru')} ₽/день</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.fireBtn} onPress={() => dispatch({ type: 'FIRE_WORKER', workerId: w.id })}>
                <Text style={styles.fireBtnText}>Уволить</Text>
              </TouchableOpacity>
            </View>
          ))}
        </>
      )}

      {hiredWorkers.length === 0 && (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>👷 Бригады нет{'\n'}Наймите хотя бы Васю, чтобы что-то строилось</Text>
        </View>
      )}

      {/* Available to hire */}
      {availableToHire.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Нанять</Text>
          {availableToHire.map(w => {
            const canAfford = money >= w.hireCost;
            return (
              <View key={w.id} style={styles.hireCard}>
                <Text style={styles.workerEmoji}>{w.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <View style={styles.workerRow}>
                    <Text style={styles.workerName}>{w.name}</Text>
                    <Text style={styles.workerRole}>{w.role}</Text>
                  </View>
                  <Text style={styles.workerDesc}>{w.description}</Text>
                  <View style={styles.workerStats}>
                    <Text style={styles.stat}>⚡ Эфф: {w.efficiency}</Text>
                    <Text style={styles.stat}>💸 {w.dailyCost.toLocaleString('ru')} ₽/день</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={[styles.hireBtn, !canAfford && styles.hireBtnDisabled]}
                  onPress={() => canAfford && dispatch({ type: 'HIRE_WORKER', workerId: w.id })}
                  disabled={!canAfford}
                >
                  <Text style={[styles.hireBtnText, !canAfford && { color: theme.textMuted }]}>
                    {w.hireCost === 0 ? 'Нанять' : `${w.hireCost.toLocaleString('ru')} ₽`}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg },
  content: { padding: 16, paddingBottom: 40 },
  summaryRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  summaryBox: { flex: 1, backgroundColor: theme.card, borderRadius: 10, padding: 10, alignItems: 'center' },
  summaryLabel: { fontSize: 11, color: theme.textMuted, marginBottom: 2 },
  summaryValue: { fontSize: 14, fontWeight: '700', color: theme.text },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: theme.primary, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  workerCard: { backgroundColor: theme.card, borderRadius: 12, padding: 12, marginBottom: 10, flexDirection: 'row', gap: 10, borderWidth: 1, borderColor: theme.border, alignItems: 'flex-start' },
  workerCardBinge: { borderColor: '#5A2A00', backgroundColor: '#1E1000' },
  workerEmoji: { fontSize: 28, marginTop: 2 },
  workerRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
  workerName: { fontSize: 15, fontWeight: '700', color: theme.text },
  workerRole: { fontSize: 11, color: theme.primary, backgroundColor: '#2A1F00', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  workerDesc: { fontSize: 12, color: theme.textMuted, marginBottom: 6 },
  bingeText: { fontSize: 12, color: theme.warning, marginBottom: 6 },
  workerStats: { flexDirection: 'row', gap: 12 },
  stat: { fontSize: 12, color: theme.textMuted },
  fireBtn: { backgroundColor: '#3A0A0A', borderRadius: 8, padding: 8, borderWidth: 1, borderColor: theme.danger, justifyContent: 'center' },
  fireBtnText: { fontSize: 11, color: theme.danger, fontWeight: '600' },
  hireCard: { backgroundColor: theme.cardHigh, borderRadius: 12, padding: 12, marginBottom: 10, flexDirection: 'row', gap: 10, borderWidth: 1, borderColor: theme.border, alignItems: 'flex-start' },
  hireBtn: { backgroundColor: theme.primary, borderRadius: 8, padding: 8, justifyContent: 'center', minWidth: 70, alignItems: 'center' },
  hireBtnDisabled: { backgroundColor: theme.card, borderWidth: 1, borderColor: theme.border },
  hireBtnText: { fontSize: 12, color: '#000', fontWeight: '700' },
  emptyCard: { backgroundColor: theme.card, borderRadius: 12, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: theme.border, borderStyle: 'dashed', marginBottom: 20 },
  emptyText: { fontSize: 14, color: theme.textMuted, textAlign: 'center', lineHeight: 22 },
});
