export type ContractTemplate = {
  id: string;
  name: string;
  client: string;
  emoji: string;
  value: number;
  advancePercent: number;
  durationDays: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'nightmare';
  description: string;
  clientMoodStart: number; // 0-100
  eventMultiplier: number; // how often bad things happen
};

export const CONTRACT_TEMPLATES: ContractTemplate[] = [
  {
    id: 'kvartira',
    name: 'Ремонт квартиры',
    client: 'Людмила Ивановна',
    emoji: '🏠',
    value: 500000,
    advancePercent: 0.3,
    durationDays: 30,
    difficulty: 'easy',
    description: '2-комнатная. "Мы хотим как в Pinterest". Небольшой объём.',
    clientMoodStart: 80,
    eventMultiplier: 0.7,
  },
  {
    id: 'ofis',
    name: 'Офис ООО Ромашка',
    client: 'Менеджер Дима',
    emoji: '🏢',
    value: 1500000,
    advancePercent: 0.25,
    durationDays: 60,
    difficulty: 'medium',
    description: 'Open space на 200 м². Дима уже видел 47 вариантов дизайна.',
    clientMoodStart: 60,
    eventMultiplier: 1.0,
  },
  {
    id: 'kottedzh',
    name: 'Коттедж в Подмосковье',
    client: 'Игорь Владимирович',
    emoji: '🏡',
    value: 3000000,
    advancePercent: 0.2,
    durationDays: 90,
    difficulty: 'hard',
    description: '400 м², 3 этажа, бассейн. "Всё по уму, деньги есть".',
    clientMoodStart: 70,
    eventMultiplier: 1.3,
  },
  {
    id: 'tk',
    name: 'Торговый центр (3 этажа)',
    client: 'ГК СтройГрупп',
    emoji: '🏪',
    value: 8000000,
    advancePercent: 0.15,
    durationDays: 180,
    difficulty: 'nightmare',
    description: 'Государственный заказ. КС-2 каждый месяц. ПТО каждую неделю.',
    clientMoodStart: 40,
    eventMultiplier: 2.0,
  },
];
