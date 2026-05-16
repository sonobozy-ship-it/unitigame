import pack1 from './packs/pack1';
import pack2 from './packs/pack2';
import pack3 from './packs/pack3';
import pack4 from './packs/pack4';

export interface Dot {
  color: string;
  start: [number, number];
  end: [number, number];
}

export interface Level {
  id: number;
  size: number;
  par: number;
  dots: Dot[];
}

export interface Pack {
  id: number;
  name: string;
  description: string;
  levels: Level[];
  gridSize: number;
}

export const PACKS: Pack[] = [
  { id: 1, name: 'Starter',  description: '5×5 grid — learn the basics',      gridSize: 5, levels: pack1 },
  { id: 2, name: 'Explorer', description: '6×6 grid — expand your thinking',  gridSize: 6, levels: pack2 },
  { id: 3, name: 'Master',   description: '7×7 grid — serious challenge',      gridSize: 7, levels: pack3 },
  { id: 4, name: 'Expert',   description: '8×8 & 9×9 — only the fearless',    gridSize: 8, levels: pack4 },
];

export const ALL_LEVELS: Level[] = [...pack1, ...pack2, ...pack3, ...pack4];

export function getLevelById(id: number): Level | undefined {
  return ALL_LEVELS.find(l => l.id === id);
}

export function getPackForLevel(levelId: number): Pack | undefined {
  return PACKS.find(p => p.levels.some(l => l.id === levelId));
}

export function getDailyLevel(): Level {
  const epoch = new Date('2024-01-01').getTime();
  const dayIndex = Math.floor((Date.now() - epoch) / 86_400_000) % ALL_LEVELS.length;
  return ALL_LEVELS[dayIndex];
}
