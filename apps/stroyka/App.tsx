import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { GameProvider, useGame } from './src/store/gameStore';
import HomeScreen from './src/screens/HomeScreen';
import BrigadeScreen from './src/screens/BrigadeScreen';
import ContractsScreen from './src/screens/ContractsScreen';
import { theme } from './src/constants/theme';

type Tab = 'home' | 'brigade' | 'contracts';

const TABS: { id: Tab; label: string; emoji: string }[] = [
  { id: 'home', label: 'Объект', emoji: '🏗️' },
  { id: 'brigade', label: 'Бригада', emoji: '👷' },
  { id: 'contracts', label: 'Контракты', emoji: '📋' },
];

function TabBar({ active, onSelect }: { active: Tab; onSelect: (t: Tab) => void }) {
  const { state } = useGame();
  return (
    <View style={styles.tabBar}>
      {TABS.map(t => (
        <TouchableOpacity
          key={t.id}
          style={[styles.tab, active === t.id && styles.tabActive]}
          onPress={() => onSelect(t.id)}
        >
          {t.id === 'home' && state.activeEvents.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{state.activeEvents.length}</Text>
            </View>
          )}
          <Text style={styles.tabEmoji}>{t.emoji}</Text>
          <Text style={[styles.tabLabel, active === t.id && styles.tabLabelActive]}>{t.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function AppInner() {
  const [tab, setTab] = useState<Tab>('home');
  const { state } = useGame();

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🏗️ Стройка без иллюзий</Text>
        <Text style={[styles.headerMoney, state.money < 0 && { color: theme.danger }]}>
          {state.money >= 0 ? '' : '−'}{Math.abs(state.money).toLocaleString('ru')} ₽
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        {tab === 'home' && <HomeScreen />}
        {tab === 'brigade' && <BrigadeScreen />}
        {tab === 'contracts' && <ContractsScreen />}
      </View>
      <TabBar active={tab} onSelect={setTab} />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <GameProvider>
        <AppInner />
      </GameProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.bg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: theme.card,
    borderBottomWidth: 1,
    borderColor: theme.border,
  },
  headerTitle: { fontSize: 16, fontWeight: '700', color: theme.text },
  headerMoney: { fontSize: 15, fontWeight: '700', color: theme.primary },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: theme.card,
    borderTopWidth: 1,
    borderColor: theme.border,
    paddingBottom: Platform.OS === 'ios' ? 0 : 4,
  },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 8, position: 'relative' },
  tabActive: { borderTopWidth: 2, borderTopColor: theme.primary },
  tabEmoji: { fontSize: 20, marginBottom: 2 },
  tabLabel: { fontSize: 11, color: theme.textMuted },
  tabLabelActive: { color: theme.primary, fontWeight: '600' },
  badge: {
    position: 'absolute',
    top: 4,
    right: 16,
    backgroundColor: theme.danger,
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  badgeText: { fontSize: 10, color: '#fff', fontWeight: '700' },
});
