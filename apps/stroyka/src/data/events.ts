export type EventOption = {
  label: string;
  cost: number;
  progressPenalty: number;
  stressDelta: number;
  reputationDelta: number;
  clientMoodDelta: number;
  outcome: string;
};

export type EventTemplate = {
  id: string;
  title: string;
  description: string;
  emoji: string;
  autoResolveAfterTicks: number;
  autoResolveOption: number;
  options: EventOption[];
};

export const EVENT_TEMPLATES: EventTemplate[] = [
  {
    id: 'zapoi',
    title: 'Вася ушёл в запой',
    description: 'Вася не вышел на объект. Телефон недоступен. По слухам — на даче у брата.',
    emoji: '🍺',
    autoResolveAfterTicks: 60,
    autoResolveOption: 0,
    options: [
      {
        label: 'Подождать (2 дня)',
        cost: 0,
        progressPenalty: 0,
        stressDelta: 10,
        reputationDelta: 0,
        clientMoodDelta: -5,
        outcome: 'Вася вернулся. Стыдно, но жив.',
      },
      {
        label: 'Найти замену (15 000 ₽)',
        cost: 15000,
        progressPenalty: 0,
        stressDelta: 3,
        reputationDelta: 0,
        clientMoodDelta: 0,
        outcome: 'Нашли временщика. Работа продолжается.',
      },
    ],
  },
  {
    id: 'perenos_steny',
    title: 'Заказчик хочет перенести стену',
    description: 'Звонок в 21:00: "Слушай, а можно стену вот здесь немного сдвинуть? Ну чуть-чуть!"',
    emoji: '🧱',
    autoResolveAfterTicks: 90,
    autoResolveOption: 0,
    options: [
      {
        label: 'Принять изменения (+80 000 ₽ к смете)',
        cost: -80000,
        progressPenalty: 15,
        stressDelta: 8,
        reputationDelta: 5,
        clientMoodDelta: 10,
        outcome: 'Стену перенесли. Дополнительное соглашение подписано.',
      },
      {
        label: 'Отказать',
        cost: 0,
        progressPenalty: 0,
        stressDelta: 5,
        reputationDelta: -5,
        clientMoodDelta: -20,
        outcome: 'Заказчик недоволен, но стена стоит где стоит.',
      },
    ],
  },
  {
    id: 'rostech',
    title: 'Ростехнадзор с проверкой',
    description: 'На объекте появились люди в форме с папками. Смотрят на каску у Васи.',
    emoji: '🔍',
    autoResolveAfterTicks: 45,
    autoResolveOption: 1,
    options: [
      {
        label: 'Заплатить штраф (50 000 ₽)',
        cost: 50000,
        progressPenalty: 0,
        stressDelta: 12,
        reputationDelta: -5,
        clientMoodDelta: -10,
        outcome: 'Штраф уплачен. Проверка завершена.',
      },
      {
        label: 'Договориться (20 000 ₽ "неформально")',
        cost: 20000,
        progressPenalty: 0,
        stressDelta: 15,
        reputationDelta: -10,
        clientMoodDelta: 0,
        outcome: 'Вопрос решён. Квитанции нет.',
      },
      {
        label: 'Показать документы',
        cost: 0,
        progressPenalty: 5,
        stressDelta: 20,
        reputationDelta: 10,
        clientMoodDelta: 0,
        outcome: 'После 3 часов проверки — предписание на устранение замечаний.',
      },
    ],
  },
  {
    id: 'pto',
    title: 'ПТО нашло замечания',
    description: 'Технический надзор нашёл несоответствия по 7 пунктам. Акт прилагается.',
    emoji: '📋',
    autoResolveAfterTicks: 75,
    autoResolveOption: 0,
    options: [
      {
        label: 'Переделать (-10% прогресса)',
        cost: 0,
        progressPenalty: 10,
        stressDelta: 15,
        reputationDelta: 5,
        clientMoodDelta: 5,
        outcome: 'Замечания устранены. ПТО доволен.',
      },
      {
        label: 'Оспорить через проектировщиков (30 000 ₽)',
        cost: 30000,
        progressPenalty: 0,
        stressDelta: 10,
        reputationDelta: 0,
        clientMoodDelta: 0,
        outcome: 'После долгих переговоров — 3 из 7 пунктов сняты.',
      },
    ],
  },
  {
    id: 'ks2',
    title: 'КС-2 не подписывают',
    description: '"Нам надо согласовать с юристами. С финансовым директором. И ещё с женой собственника."',
    emoji: '📝',
    autoResolveAfterTicks: 120,
    autoResolveOption: 0,
    options: [
      {
        label: 'Подождать (теряем время)',
        cost: 0,
        progressPenalty: 0,
        stressDelta: 15,
        reputationDelta: 0,
        clientMoodDelta: 0,
        outcome: 'Через неделю подписали. Нервы — не резиновые.',
      },
      {
        label: 'Надавить через директора',
        cost: 0,
        progressPenalty: 0,
        stressDelta: 8,
        reputationDelta: -5,
        clientMoodDelta: -15,
        outcome: 'Подписали в тот же день. Отношения немного испортились.',
      },
      {
        label: 'Предложить скидку 5%',
        cost: 0,
        progressPenalty: 0,
        stressDelta: 5,
        reputationDelta: 0,
        clientMoodDelta: 10,
        outcome: 'Подписали радостно. Потеряли часть прибыли.',
      },
    ],
  },
  {
    id: 'subpodryad',
    title: 'Субподрядчик пропал с авансом',
    description: 'ООО "СтройПодрядМонтаж" взяло аванс 80 000 ₽ и перестало отвечать на звонки.',
    emoji: '🏃',
    autoResolveAfterTicks: 30,
    autoResolveOption: 0,
    options: [
      {
        label: 'Списать потери (−80 000 ₽)',
        cost: 80000,
        progressPenalty: 0,
        stressDelta: 20,
        reputationDelta: 0,
        clientMoodDelta: 0,
        outcome: 'Деньги потеряны. Урок получен.',
      },
      {
        label: 'Подать в суд (долго, дорого)',
        cost: 25000,
        progressPenalty: 0,
        stressDelta: 25,
        reputationDelta: 5,
        clientMoodDelta: 0,
        outcome: 'Иск подан. Решение будет через 8 месяцев. Наверное.',
      },
    ],
  },
  {
    id: 'materialy',
    title: 'Материалы подорожали на 20%',
    description: 'Поставщик сообщил о "корректировке цен". Смета не учитывала такой рост.',
    emoji: '📈',
    autoResolveAfterTicks: 60,
    autoResolveOption: 0,
    options: [
      {
        label: 'Принять новые цены (−5% прибыли)',
        cost: 0,
        progressPenalty: 0,
        stressDelta: 10,
        reputationDelta: 0,
        clientMoodDelta: 0,
        outcome: 'Купили по новым ценам. Маржа просела.',
      },
      {
        label: 'Найти другого поставщика (задержка)',
        cost: 0,
        progressPenalty: 8,
        stressDelta: 12,
        reputationDelta: 0,
        clientMoodDelta: -5,
        outcome: 'Нашли дешевле, но с задержкой на доставку.',
      },
      {
        label: 'Переложить на заказчика (допсоглашение)',
        cost: -30000,
        progressPenalty: 0,
        stressDelta: 15,
        reputationDelta: -5,
        clientMoodDelta: -20,
        outcome: 'Заказчик подписал, но очень недоволен.',
      },
    ],
  },
  {
    id: 'zarplata',
    title: 'Рабочие требуют зарплату',
    description: '"Петрович, мы уже 2 недели без денег. Либо платишь — либо мы к конкурентам."',
    emoji: '💸',
    autoResolveAfterTicks: 40,
    autoResolveOption: 1,
    options: [
      {
        label: 'Выдать аванс (60 000 ₽)',
        cost: 60000,
        progressPenalty: 0,
        stressDelta: 5,
        reputationDelta: 5,
        clientMoodDelta: 0,
        outcome: 'Рабочие довольны. Работают.',
      },
      {
        label: 'Попросить подождать',
        cost: 0,
        progressPenalty: 10,
        stressDelta: 20,
        reputationDelta: -10,
        clientMoodDelta: 0,
        outcome: 'Половина бригады ушла. Темп упал.',
      },
    ],
  },
];
