export type WorkerTemplate = {
  id: string;
  name: string;
  role: string;
  emoji: string;
  efficiency: number;
  dailyCost: number;
  hireCost: number;
  description: string;
  drinkRisk: number; // 0-1, chance per tick to "go on binge"
};

export const WORKER_TEMPLATES: WorkerTemplate[] = [
  {
    id: 'vasya',
    name: 'Вася',
    role: 'Разнорабочий',
    emoji: '👷',
    efficiency: 2,
    dailyCost: 3000,
    hireCost: 0,
    description: 'Берётся за всё. Периодически пьёт.',
    drinkRisk: 0.008,
  },
  {
    id: 'akhmed',
    name: 'Ахмед',
    role: 'Отделочник',
    emoji: '🧱',
    efficiency: 3,
    dailyCost: 4000,
    hireCost: 5000,
    description: 'Работает без выходных. Претензий нет.',
    drinkRisk: 0.001,
  },
  {
    id: 'kolya',
    name: 'Коля-Сварщик',
    role: 'Сварщик',
    emoji: '🔧',
    efficiency: 4,
    dailyCost: 6000,
    hireCost: 10000,
    description: 'Лучший сварщик в районе. Но только по металлу.',
    drinkRisk: 0.004,
  },
  {
    id: 'fedya',
    name: 'Дядя Федя',
    role: 'Электрик',
    emoji: '⚡',
    efficiency: 3,
    dailyCost: 7000,
    hireCost: 15000,
    description: 'Знает все нормы. Иногда знает лучше ПТО.',
    drinkRisk: 0.002,
  },
  {
    id: 'petrovich',
    name: 'Петрович',
    role: 'Бригадир',
    emoji: '🦺',
    efficiency: 6,
    dailyCost: 9000,
    hireCost: 20000,
    description: 'Умеет организовать. Дорогой, но стоит того.',
    drinkRisk: 0.001,
  },
  {
    id: 'sasha',
    name: 'Сашок-Прораб',
    role: 'Прораб',
    emoji: '📋',
    efficiency: 8,
    dailyCost: 12000,
    hireCost: 30000,
    description: 'Умеет договариваться с заказчиком и ПТО. Незаменим.',
    drinkRisk: 0.0005,
  },
];
