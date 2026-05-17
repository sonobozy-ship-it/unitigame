export type Direction = 'right' | 'left' | 'up' | 'down';
export type ExitSide = 'right' | 'left' | 'top' | 'bottom';

export interface Wall {
  r1: number; c1: number;
  r2: number; c2: number;
}

export interface SnakeDef {
  id: string;
  color: string;
  row: number;
  col: number;
  length: 2 | 3 | 4;
  direction: Direction;
  isTarget: boolean;
}

export interface Level {
  id: number;
  size: number;
  walls: Wall[];
  snakes: SnakeDef[];
  exitSide: ExitSide;
  exitIndex: number;
  par: number;
}

function w(r1: number, c1: number, r2: number, c2: number): Wall {
  return { r1, c1, r2, c2 };
}
function s(
  id: string, color: string,
  row: number, col: number, length: 2 | 3 | 4,
  direction: Direction, isTarget = false,
): SnakeDef {
  return { id, color, row, col, length, direction, isTarget };
}

const C = {
  gold:   '#FFD700',
  red:    '#FF4455',
  blue:   '#44AAFF',
  green:  '#44EE88',
  purple: '#BB66FF',
  orange: '#FF9944',
  teal:   '#22DDCC',
  pink:   '#FF66BB',
  lime:   '#AAEE22',
  indigo: '#6677FF',
};

export const LEVELS: Level[] = [
  // ━━━ Pack 1 — 4×4, no walls ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  { id: 1, size: 4, walls: [],
    snakes: [s('t',C.gold,1,0,2,'right',true), s('a',C.blue,1,3,2,'up')],
    exitSide:'right', exitIndex:1, par:2 },
  { id: 2, size: 4, walls: [],
    snakes: [s('t',C.gold,2,0,2,'right',true), s('a',C.red,2,2,2,'left')],
    exitSide:'right', exitIndex:2, par:2 },
  { id: 3, size: 4, walls: [],
    snakes: [s('t',C.gold,1,0,2,'right',true), s('a',C.red,1,2,2,'left'), s('b',C.blue,0,3,2,'down')],
    exitSide:'right', exitIndex:1, par:3 },
  { id: 4, size: 4, walls: [],
    snakes: [s('t',C.gold,0,0,2,'right',true), s('a',C.green,0,2,2,'up'), s('b',C.purple,2,1,2,'right')],
    exitSide:'right', exitIndex:0, par:2 },
  { id: 5, size: 4, walls: [],
    snakes: [s('t',C.gold,1,0,2,'right',true), s('a',C.red,0,2,2,'down'), s('b',C.blue,1,3,2,'up')],
    exitSide:'right', exitIndex:1, par:3 },
  { id: 6, size: 4, walls: [],
    snakes: [s('t',C.gold,0,2,2,'down',true), s('a',C.teal,2,2,2,'right'), s('b',C.orange,1,0,2,'right')],
    exitSide:'bottom', exitIndex:2, par:2 },
  { id: 7, size: 4, walls: [],
    snakes: [s('t',C.gold,2,0,2,'right',true), s('a',C.red,2,2,2,'up'), s('b',C.blue,0,3,2,'down'), s('c',C.green,0,2,2,'left')],
    exitSide:'right', exitIndex:2, par:4 },
  { id: 8, size: 4, walls: [],
    snakes: [s('t',C.gold,1,0,3,'right',true), s('a',C.purple,0,3,2,'down')],
    exitSide:'right', exitIndex:1, par:2 },
  { id: 9, size: 4, walls: [],
    snakes: [s('t',C.gold,0,0,2,'right',true), s('a',C.red,0,2,2,'down'), s('b',C.blue,2,1,2,'right'), s('c',C.green,3,3,2,'up')],
    exitSide:'right', exitIndex:0, par:3 },
  { id: 10, size: 4, walls: [],
    snakes: [s('t',C.gold,2,0,2,'right',true), s('a',C.teal,0,2,3,'down'), s('b',C.pink,3,3,2,'up')],
    exitSide:'right', exitIndex:2, par:3 },

  // ━━━ Pack 2 — 5×5, walls ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  { id: 11, size: 5, walls: [w(1,2,1,3)],
    snakes: [s('t',C.gold,1,0,2,'right',true), s('a',C.blue,0,4,2,'down'), s('b',C.red,3,3,2,'up')],
    exitSide:'right', exitIndex:1, par:3 },
  { id: 12, size: 5, walls: [w(2,1,3,1)],
    snakes: [s('t',C.gold,2,0,2,'right',true), s('a',C.purple,2,3,2,'left'), s('b',C.green,4,2,2,'up')],
    exitSide:'right', exitIndex:2, par:3 },
  { id: 13, size: 5, walls: [w(1,2,2,2), w(2,3,2,4)],
    snakes: [s('t',C.gold,1,0,2,'right',true), s('a',C.red,0,3,2,'down'), s('b',C.blue,1,4,2,'up'), s('c',C.orange,3,2,2,'right')],
    exitSide:'right', exitIndex:1, par:4 },
  { id: 14, size: 5, walls: [w(3,2,3,3)],
    snakes: [s('t',C.gold,0,3,2,'down',true), s('a',C.teal,3,3,2,'left'), s('b',C.pink,2,0,2,'right')],
    exitSide:'bottom', exitIndex:3, par:2 },
  { id: 15, size: 5, walls: [w(0,2,1,2), w(3,1,4,1)],
    snakes: [s('t',C.gold,2,0,2,'right',true), s('a',C.red,2,3,2,'up'), s('b',C.blue,0,3,3,'down'), s('c',C.green,4,2,2,'left')],
    exitSide:'right', exitIndex:2, par:4 },
  { id: 16, size: 5, walls: [w(1,1,1,2), w(2,2,2,3)],
    snakes: [s('t',C.gold,1,0,2,'right',true), s('a',C.purple,0,2,2,'down'), s('b',C.orange,1,3,2,'up'), s('c',C.lime,3,0,2,'right')],
    exitSide:'right', exitIndex:1, par:4 },
  { id: 17, size: 5, walls: [w(0,3,1,3)],
    snakes: [s('t',C.gold,0,0,2,'right',true), s('a',C.red,0,3,2,'down'), s('b',C.blue,2,3,2,'up'), s('c',C.teal,1,2,2,'right')],
    exitSide:'right', exitIndex:0, par:4 },
  { id: 18, size: 5, walls: [w(2,0,2,1), w(2,3,2,4)],
    snakes: [s('t',C.gold,2,1,2,'right',true), s('a',C.indigo,1,3,2,'down'), s('b',C.pink,3,3,2,'up')],
    exitSide:'right', exitIndex:2, par:3 },
  { id: 19, size: 5, walls: [w(1,2,1,3), w(3,2,3,3)],
    snakes: [s('t',C.gold,2,0,2,'right',true), s('a',C.green,2,3,2,'left'), s('b',C.red,0,4,3,'down'), s('c',C.blue,4,1,2,'right')],
    exitSide:'right', exitIndex:2, par:4 },
  { id: 20, size: 5, walls: [w(1,1,2,1), w(2,3,3,3)],
    snakes: [s('t',C.gold,1,0,3,'right',true), s('a',C.purple,1,3,2,'up'), s('b',C.orange,3,2,2,'up'), s('c',C.teal,4,0,2,'right')],
    exitSide:'right', exitIndex:1, par:4 },

  // ━━━ Pack 3 — 6×6 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  { id: 21, size: 6, walls: [w(2,2,2,3), w(3,1,4,1)],
    snakes: [s('t',C.gold,2,0,2,'right',true), s('a',C.red,2,3,2,'up'), s('b',C.blue,0,4,3,'down'), s('c',C.green,4,2,2,'right'), s('d',C.purple,5,4,2,'up')],
    exitSide:'right', exitIndex:2, par:5 },
  { id: 22, size: 6, walls: [w(1,3,2,3), w(3,3,3,4)],
    snakes: [s('t',C.gold,1,0,2,'right',true), s('a',C.teal,1,3,2,'up'), s('b',C.orange,0,4,2,'down'), s('c',C.pink,3,1,2,'right'), s('d',C.indigo,4,4,2,'up')],
    exitSide:'right', exitIndex:1, par:5 },
  { id: 23, size: 6, walls: [w(0,2,1,2), w(2,4,3,4)],
    snakes: [s('t',C.gold,3,0,2,'right',true), s('a',C.red,3,3,2,'up'), s('b',C.blue,1,3,2,'down'), s('c',C.green,5,2,3,'right'), s('d',C.lime,0,5,3,'down')],
    exitSide:'right', exitIndex:3, par:5 },

  // ━━━ Packs 4–6 — generated 24–100 ━━━━━━━━━━━━━━━━━━━━━━━
  ...Array.from({ length: 77 }, (_, i): Level => {
    const id = 24 + i;
    const size = id < 41 ? 6 : id < 61 ? 7 : id < 81 ? 8 : 9;
    const maxR = size - 2;
    const row = (id * 7 + 3) % maxR;
    const mid = Math.floor(size / 2);
    const walls: Wall[] = [
      w(row, mid - 1, row, mid),
      w((row + 2) % maxR, size - 3, (row + 2) % maxR + 1, size - 3),
    ];
    if (size >= 7) walls.push(w((row + 4) % maxR, 1, (row + 4) % maxR, 2));
    if (size >= 8) walls.push(w((row + 3) % maxR, size - 4, (row + 3) % maxR, size - 3));

    const snakes: SnakeDef[] = [
      s('t', C.gold,   row, 0, 2, 'right', true),
      s('a', C.red,    row, mid, 2, 'up'),
      s('b', C.blue,   0, size - 2, size >= 8 ? 3 : 2, 'down'),
      s('c', C.green,  (row + 3) % maxR + 1, 1, 2, 'right'),
      s('d', C.purple, size - 1, (id % (size - 2)) + 1, 2, 'up'),
    ];
    if (size >= 7) snakes.push(s('e', C.teal,   (row + 1) % maxR, mid - 1, 2, 'left'));
    if (size >= 8) snakes.push(s('f', C.orange, (row + 5) % maxR, size - 3, 2, 'up'));
    if (size >= 9) snakes.push(s('g', C.pink,   (row + 6) % maxR, 2, 2, 'down'));

    return {
      id, size, walls, snakes,
      exitSide: 'right', exitIndex: row,
      par: 3 + Math.floor(size / 2) + (id % 3),
    };
  }),
];

export function getLevel(id: number): Level {
  return LEVELS.find(l => l.id === id) ?? LEVELS[0];
}
