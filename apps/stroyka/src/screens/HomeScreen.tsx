import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useGame } from '../store/gameStore';
import { theme } from '../constants/theme';

function StatBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min(1, value / max);
  return (
    <View style={styles.barBg}>
      <View style={[styles.barFill, { width: `${pct * 100}%` as any, backgroundColor: color }]} />
    </View>
  );
}

function EventCard({ event, onResolve }: { event: any; onResolve: (instanceId: string, idx: number) => void }) {
  return (
    <View style={styles.eventCard}>
      <Text style={styles.eventEmoji}>{event.emoji}</Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.eventTitle}>{event.title}</Text>
        <Text style={styles.eventDesc}>{event.description}</Text>
        <View style={styles.eventOptions}>
          {event.options.map((opt: any, idx: number) => (
            <TouchableOpacity
              key={idx}
              style={[styles.eventBtn, opt.cost > 0 && styles.eventBtnCost]}
              onPress={() => onResolve(event.instanceId, idx)}
            >
              <Text style={styles.eventBtnText}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const { state, dispatch } = useGame();
  const { money, stress, reputation, currentProject, activeEvents, log, day, gameOver } = state;

  if (gameOver) {
    return (
      <View style={styles.gameOver}>
        <Text style={styles.gameOverEmoji}>💀</Text>
        <Text style={styles.gameOverTitle}>Нервный срыв</Text>
        <Text style={styles.gameOverText}>
          Вы бросили строительный бизнес и устроились охранником в торговый центр.{'\n\n'}
          Завершено объектов: {state.completedProjects.length}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Касса</Text>
          <Text style={[styles.statValue, money < 0 && { color: theme.danger }]}>
            {money >= 0 ? '' : '−'}{Math.abs(money).toLocaleString('ru')} ₽
          </Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>День</Text>
          <Text style={styles.statValue}>{day}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Репутация</Text>
          <Text style={styles.statValue}>{reputation}</Text>
        </View>
      </View>

      {/* Stress */}
      <View style={styles.section}>
        <View style={styles.rowBetween}>
          <Text style={styles.label}>Стресс</Text>
          <Text style={[styles.label, { color: stress > 70 ? theme.danger : theme.textMuted }]}>
            {Math.round(stress)}%
          </Text>
        </View>
        <StatBar value={stress} max={100} color={stress > 70 ? theme.danger : stress > 40 ? theme.warning : theme.success} />
      </View>

      {/* Current project */}
      {currentProject ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Текущий объект</Text>
          <View style={styles.projectCard}>
            <View style={styles.rowBetween}>
              <Text style={styles.projectName}>{currentProject.emoji} {currentProject.name}</Text>
              <Text style={styles.projectValue}>{currentProject.totalValue.toLocaleString('ru')} ₽</Text>
            </View>
            <Text style={styles.projectClient}>Заказчик: {currentProject.client}</Text>

            <View style={styles.rowBetween} style={{ marginTop: 8 }}>
              <Text style={styles.label}>Готовность</Text>
              <Text style={styles.label}>{Math.round(currentProject.progress)}%</Text>
            </View>
            <StatBar value={currentProject.progress} max={100} color={theme.primary} />

            <View style={styles.rowBetween} style={{ marginTop: 8 }}>
              <Text style={styles.label}>Настроение заказчика</Text>
              <Text style={[styles.label, { color: currentProject.clientMood > 60 ? theme.success : theme.danger }]}>
                {currentProject.clientMood > 70 ? '😊' : currentProject.clientMood > 40 ? '😐' : '😡'} {currentProject.clientMood}
              </Text>
            </View>
            <StatBar value={currentProject.clientMood} max={100} color={currentProject.clientMood > 60 ? theme.success : theme.danger} />

            {currentProject.readyToClose && (
              <TouchableOpacity style={styles.closeBtn} onPress={() => dispatch({ type: 'CLOSE_PROJECT' })}>
                <Text style={styles.closeBtnText}>📝 Подписать КС-2 и получить оплату</Text>
              </TouchableOpacity>
            )}

            {state.hiredWorkers.filter(w => !w.isOnBinge).length === 0 && !currentProject.readyToClose && (
              <Text style={styles.warn}>⚠️ Нет активных рабочих — объект стоит!</Text>
            )}
          </View>
        </View>
      ) : (
        <View style={styles.section}>
          <View style={styles.noProject}>
            <Text style={styles.noProjectText}>🏗️ Нет активного объекта{'\n'}Возьмите контракт во вкладке «Контракты»</Text>
          </View>
        </View>
      )}

      {/* Active events */}
      {activeEvents.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚠️ Требуют решения ({activeEvents.length})</Text>
          {activeEvents.map(e => (
            <EventCard
              key={e.instanceId}
              event={e}
              onResolve={(id, idx) => dispatch({ type: 'RESOLVE_EVENT', instanceId: id, optionIndex: idx })}
            />
          ))}
        </View>
      )}

      {/* Log */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Журнал</Text>
        {log.slice(0, 8).map((msg, i) => (
          <Text key={i} style={[styles.logMsg, i === 0 && styles.logMsgNew]}>{msg}</Text>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg },
  content: { padding: 16, paddingBottom: 40 },
  gameOver: { flex: 1, backgroundColor: theme.bg, alignItems: 'center', justifyContent: 'center', padding: 32 },
  gameOverEmoji: { fontSize: 64, marginBottom: 16 },
  gameOverTitle: { fontSize: 28, fontWeight: '700', color: theme.danger, marginBottom: 12 },
  gameOverText: { fontSize: 16, color: theme.textMuted, textAlign: 'center', lineHeight: 24 },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  statBox: { flex: 1, backgroundColor: theme.card, borderRadius: 10, padding: 10, alignItems: 'center' },
  statLabel: { fontSize: 11, color: theme.textMuted, marginBottom: 2 },
  statValue: { fontSize: 15, fontWeight: '700', color: theme.text },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: theme.primary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  label: { fontSize: 13, color: theme.textMuted },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  barBg: { height: 8, backgroundColor: theme.border, borderRadius: 4, overflow: 'hidden' },
  barFill: { height: 8, borderRadius: 4 },
  projectCard: { backgroundColor: theme.card, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: theme.border },
  projectName: { fontSize: 15, fontWeight: '700', color: theme.text, flex: 1 },
  projectValue: { fontSize: 14, fontWeight: '600', color: theme.primary },
  projectClient: { fontSize: 12, color: theme.textMuted, marginBottom: 4 },
  closeBtn: { marginTop: 12, backgroundColor: theme.primary, borderRadius: 10, padding: 12, alignItems: 'center' },
  closeBtnText: { fontSize: 14, fontWeight: '700', color: '#000' },
  noProject: { backgroundColor: theme.card, borderRadius: 12, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: theme.border, borderStyle: 'dashed' },
  noProjectText: { fontSize: 14, color: theme.textMuted, textAlign: 'center', lineHeight: 22 },
  warn: { marginTop: 8, fontSize: 12, color: theme.warning },
  eventCard: { backgroundColor: '#2A1010', borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#5A2020', flexDirection: 'row', gap: 10 },
  eventEmoji: { fontSize: 28, marginTop: 2 },
  eventTitle: { fontSize: 14, fontWeight: '700', color: theme.text, marginBottom: 4 },
  eventDesc: { fontSize: 12, color: theme.textMuted, marginBottom: 8, lineHeight: 18 },
  eventOptions: { gap: 6 },
  eventBtn: { backgroundColor: theme.card, borderRadius: 8, padding: 8, borderWidth: 1, borderColor: theme.border },
  eventBtnCost: { borderColor: theme.danger },
  eventBtnText: { fontSize: 12, color: theme.text },
  logMsg: { fontSize: 12, color: theme.textMuted, paddingVertical: 3, borderBottomWidth: 1, borderColor: theme.border },
  logMsgNew: { color: theme.text },
});
