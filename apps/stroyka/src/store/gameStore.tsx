import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WORKER_TEMPLATES, WorkerTemplate } from '../data/workers';
import { CONTRACT_TEMPLATES, ContractTemplate } from '../data/contracts';
import { EVENT_TEMPLATES, EventTemplate, EventOption } from '../data/events';

export type HiredWorker = WorkerTemplate & {
  isOnBinge: boolean;
  bingeTicksLeft: number;
};

export type ActiveEvent = EventTemplate & {
  instanceId: string;
  ticksLeft: number;
};

export type Project = {
  templateId: string;
  name: string;
  client: string;
  emoji: string;
  totalValue: number;
  advance: number;
  progress: number;
  clientMood: number;
  startDay: number;
  durationDays: number;
  eventMultiplier: number;
  extraRevenue: number;
  valuePenaltyPercent: number;
  readyToClose: boolean;
};

export type GameState = {
  money: number;
  stress: number;
  reputation: number;
  day: number;
  tick: number;
  hiredWorkers: HiredWorker[];
  currentProject: Project | null;
  activeEvents: ActiveEvent[];
  completedProjects: CompletedProject[];
  log: string[];
  gameOver: boolean;
};

export type CompletedProject = {
  name: string;
  client: string;
  emoji: string;
  earned: number;
  day: number;
};

type Action =
  | { type: 'TICK' }
  | { type: 'HIRE_WORKER'; workerId: string }
  | { type: 'FIRE_WORKER'; workerId: string }
  | { type: 'TAKE_CONTRACT'; templateId: string }
  | { type: 'RESOLVE_EVENT'; instanceId: string; optionIndex: number }
  | { type: 'CLOSE_PROJECT' }
  | { type: 'ADD_LOG'; message: string }
  | { type: 'LOAD'; state: GameState };

const INITIAL_STATE: GameState = {
  money: 50000,
  stress: 0,
  reputation: 50,
  day: 1,
  tick: 0,
  hiredWorkers: [],
  currentProject: null,
  activeEvents: [],
  completedProjects: [],
  log: ['🏗️ Добро пожаловать в строительный бизнес. Удачи — она вам понадобится.'],
  gameOver: false,
};

function clamp(val: number, min: number, max: number) {
  return Math.min(max, Math.max(min, val));
}

function randomEventId(): string {
  return Math.random().toString(36).slice(2);
}

function addLog(log: string[], message: string): string[] {
  return [message, ...log].slice(0, 30);
}

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'TICK': {
      if (state.gameOver) return state;

      let { money, stress, reputation, day, tick, hiredWorkers, currentProject, activeEvents, completedProjects, log } = state;
      tick += 1;
      const newDay = Math.floor(tick / 30) + 1;
      const dayChanged = newDay !== day;
      day = newDay;

      // Worker binge recovery
      hiredWorkers = hiredWorkers.map(w => {
        if (w.isOnBinge) {
          const ticks = w.bingeTicksLeft - 1;
          if (ticks <= 0) {
            log = addLog(log, `✅ ${w.name} вернулся на объект.`);
            return { ...w, isOnBinge: false, bingeTicksLeft: 0 };
          }
          return { ...w, bingeTicksLeft: ticks };
        }
        // Random binge
        if (Math.random() < w.drinkRisk && !w.isOnBinge && currentProject) {
          log = addLog(log, `🍺 ${w.name} ушёл в запой! Работает медленнее.`);
          return { ...w, isOnBinge: true, bingeTicksLeft: 60 };
        }
        return w;
      });

      // Daily costs
      if (dayChanged && hiredWorkers.length > 0) {
        const dailyCost = hiredWorkers.reduce((s, w) => s + w.dailyCost, 0);
        money -= dailyCost;
        if (money < -200000) {
          stress = Math.min(100, stress + 20);
          log = addLog(log, `💸 Долг уже ${Math.abs(money).toLocaleString('ru')} ₽. Нервы на пределе.`);
        }
      }

      // Progress current project
      if (currentProject && !currentProject.readyToClose) {
        const activeWorkers = hiredWorkers.filter(w => !w.isOnBinge);
        const totalEff = activeWorkers.reduce((s, w) => s + w.efficiency, 0);
        const progressPerTick = totalEff / 40;
        const newProgress = Math.min(100, currentProject.progress + progressPerTick);

        // Deadline stress
        const daysLeft = currentProject.startDay + currentProject.durationDays - day;
        if (daysLeft < 5 && daysLeft > 0) {
          stress = Math.min(100, stress + 0.3);
        }
        if (daysLeft <= 0 && newProgress < 100) {
          stress = Math.min(100, stress + 1);
          if (Math.random() < 0.05) {
            log = addLog(log, `⏰ ${currentProject.client} звонит уже по 5 раз в день. Дедлайн прошёл.`);
          }
        }

        currentProject = { ...currentProject, progress: newProgress };

        if (newProgress >= 100 && !currentProject.readyToClose) {
          currentProject = { ...currentProject, readyToClose: true };
          log = addLog(log, `📝 Объект готов! Можно закрывать КС-2 и выбивать оплату.`);
        }

        // Random events
        const eventChance = 0.005 * currentProject.eventMultiplier;
        if (Math.random() < eventChance && activeEvents.length < 2) {
          const available = EVENT_TEMPLATES.filter(e => !activeEvents.find(ae => ae.id === e.id));
          if (available.length > 0) {
            const tmpl = available[Math.floor(Math.random() * available.length)];
            const newEvent: ActiveEvent = { ...tmpl, instanceId: randomEventId(), ticksLeft: tmpl.autoResolveAfterTicks };
            activeEvents = [...activeEvents, newEvent];
            log = addLog(log, `⚠️ Новое событие: ${tmpl.title}`);
          }
        }
      }

      // Tick down events
      activeEvents = activeEvents.map(e => ({ ...e, ticksLeft: e.ticksLeft - 1 }));
      const expiredEvents = activeEvents.filter(e => e.ticksLeft <= 0);
      activeEvents = activeEvents.filter(e => e.ticksLeft > 0);
      for (const e of expiredEvents) {
        const opt = e.options[e.autoResolveOption];
        money -= opt.cost;
        stress = clamp(stress + opt.stressDelta + 5, 0, 100);
        reputation = clamp(reputation + opt.reputationDelta - 3, 0, 100);
        if (currentProject) {
          currentProject = {
            ...currentProject,
            progress: Math.max(0, currentProject.progress - opt.progressPenalty),
            clientMood: clamp(currentProject.clientMood + opt.clientMoodDelta - 5, 0, 100),
          };
        }
        log = addLog(log, `⏱️ "${e.title}" разрешилось автоматически (плохо).`);
      }

      // Stress recovery (slow)
      if (activeEvents.length === 0 && stress > 0) {
        stress = Math.max(0, stress - 0.05);
      }

      const gameOver = stress >= 100;
      if (gameOver) {
        log = addLog(log, `💀 Нервный срыв. Вы бросили строительный бизнес. Работаете охранником.`);
      }

      return {
        ...state,
        money,
        stress,
        reputation,
        day,
        tick,
        hiredWorkers,
        currentProject,
        activeEvents,
        completedProjects,
        log,
        gameOver,
      };
    }

    case 'HIRE_WORKER': {
      const tmpl = WORKER_TEMPLATES.find(w => w.id === action.workerId);
      if (!tmpl) return state;
      if (state.hiredWorkers.find(w => w.id === action.workerId)) return state;
      if (state.money < tmpl.hireCost) return state;
      const worker: HiredWorker = { ...tmpl, isOnBinge: false, bingeTicksLeft: 0 };
      return {
        ...state,
        money: state.money - tmpl.hireCost,
        hiredWorkers: [...state.hiredWorkers, worker],
        log: addLog(state.log, `✅ ${tmpl.name} (${tmpl.role}) принят на работу.`),
      };
    }

    case 'FIRE_WORKER': {
      const worker = state.hiredWorkers.find(w => w.id === action.workerId);
      if (!worker) return state;
      return {
        ...state,
        hiredWorkers: state.hiredWorkers.filter(w => w.id !== action.workerId),
        log: addLog(state.log, `👋 ${worker.name} уволен.`),
      };
    }

    case 'TAKE_CONTRACT': {
      if (state.currentProject) return state;
      const tmpl = CONTRACT_TEMPLATES.find(c => c.id === action.templateId);
      if (!tmpl) return state;
      const advance = Math.round(tmpl.value * tmpl.advancePercent);
      const project: Project = {
        templateId: tmpl.id,
        name: tmpl.name,
        client: tmpl.client,
        emoji: tmpl.emoji,
        totalValue: tmpl.value,
        advance,
        progress: 0,
        clientMood: tmpl.clientMoodStart,
        startDay: state.day,
        durationDays: tmpl.durationDays,
        eventMultiplier: tmpl.eventMultiplier,
        extraRevenue: 0,
        valuePenaltyPercent: 0,
        readyToClose: false,
      };
      return {
        ...state,
        money: state.money + advance,
        currentProject: project,
        log: addLog(state.log, `🤝 Контракт подписан: ${tmpl.name}. Аванс: ${advance.toLocaleString('ru')} ₽.`),
      };
    }

    case 'RESOLVE_EVENT': {
      const event = state.activeEvents.find(e => e.instanceId === action.instanceId);
      if (!event) return state;
      const opt = event.options[action.optionIndex];
      let { money, stress, reputation, currentProject, log } = state;
      money -= opt.cost;
      stress = clamp(stress + opt.stressDelta, 0, 100);
      reputation = clamp(reputation + opt.reputationDelta, 0, 100);
      if (currentProject) {
        currentProject = {
          ...currentProject,
          progress: Math.max(0, currentProject.progress - opt.progressPenalty),
          clientMood: clamp(currentProject.clientMood + opt.clientMoodDelta, 0, 100),
          extraRevenue: currentProject.extraRevenue + (opt.cost < 0 ? -opt.cost : 0),
        };
      }
      log = addLog(log, `✅ ${event.title}: ${opt.outcome}`);
      return {
        ...state,
        money,
        stress,
        reputation,
        currentProject,
        activeEvents: state.activeEvents.filter(e => e.instanceId !== action.instanceId),
        log,
      };
    }

    case 'CLOSE_PROJECT': {
      const p = state.currentProject;
      if (!p || !p.readyToClose) return state;
      const remaining = p.totalValue - p.advance + p.extraRevenue;
      const moodMultiplier = clamp(0.6 + (p.clientMood / 100) * 0.4, 0.6, 1.0);
      const earned = Math.round(remaining * moodMultiplier);
      const reputationGain = Math.round((p.clientMood - 50) / 10);
      const stressRelief = Math.round(p.clientMood / 10);
      const completed: CompletedProject = {
        name: p.name,
        client: p.client,
        emoji: p.emoji,
        earned: earned + p.advance,
        day: state.day,
      };
      return {
        ...state,
        money: state.money + earned,
        reputation: clamp(state.reputation + reputationGain, 0, 100),
        stress: Math.max(0, state.stress - stressRelief),
        currentProject: null,
        completedProjects: [completed, ...state.completedProjects],
        log: addLog(state.log, `💰 КС-2 подписан! Получено: ${earned.toLocaleString('ru')} ₽. ${p.clientMood > 70 ? 'Заказчик доволен!' : p.clientMood > 40 ? 'Заказчик принял.' : 'Заказчик недоволен, но деньги отдал.'}`),
      };
    }

    case 'ADD_LOG':
      return { ...state, log: addLog(state.log, action.message) };

    case 'LOAD':
      return action.state;

    default:
      return state;
  }
}

const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

const SAVE_KEY = 'stroyka_save_v1';

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    AsyncStorage.getItem(SAVE_KEY).then(raw => {
      if (raw) {
        try {
          dispatch({ type: 'LOAD', state: JSON.parse(raw) });
        } catch {}
      }
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({ type: 'TICK' });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const save = setInterval(() => {
      AsyncStorage.setItem(SAVE_KEY, JSON.stringify(stateRef.current));
    }, 10000);
    return () => clearInterval(save);
  }, []);

  return <GameContext.Provider value={{ state, dispatch }}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame outside GameProvider');
  return ctx;
}
