export type Direction = 'right' | 'left' | 'up' | 'down';
export type ExitSide = 'right' | 'left' | 'top' | 'bottom';

export interface SnakeDef {
  id: string;
  color: string;
  /** cell path from tail to head, each cell is [row, col] */
  cells: [number, number][];
  isTarget: boolean;
}

export interface Level {
  id: number;
  size: number;
  exitSide: ExitSide;
  exitIndex: number;
  snakes: SnakeDef[];
  par: number;
}

// ── RNG ────────────────────────────────────────────────────────────────────────
function mulberry32(a: number): () => number {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// 25 distinct bright non-gold colors
const COLORS = [
  '#FF4455', '#44AAFF', '#44EE88', '#BB66FF', '#FF9944',
  '#22DDCC', '#FF66BB', '#AAEE22', '#6677FF', '#FF3388',
  '#00CCFF', '#FF8800', '#33FF99', '#FF44CC', '#88FF00',
  '#0088FF', '#FF6644', '#44FFDD', '#CC44FF', '#FFCC00',
  '#FF2266', '#66FF44', '#FF00AA', '#44BBFF', '#CCFF33',
];

function gridSize(levelId: number): number {
  if (levelId <= 10) return 20;
  if (levelId <= 25) return 25;
  if (levelId <= 50) return 30;
  if (levelId <= 80) return 35;
  return 40;
}

export function getTotalLevels(): number {
  return 100;
}

export function generateLevel(levelId: number, seed?: number): Level {
  const rngSeed = ((seed ?? levelId * 997331) ^ 0xABCD1234) >>> 0;
  const rng = mulberry32(rngSeed);

  const size = gridSize(levelId);

  // Pick exit index avoiding edges by 2
  const exitIndex = 2 + Math.floor(rng() * (size - 4));
  const exitSide: ExitSide = 'right';

  // Target snake: horizontal at exitIndex row, from col 0 to targetLen-1
  const targetLen = 3 + Math.floor(rng() * 3); // 3-5
  const targetCells: [number, number][] = [];
  for (let c = 0; c < targetLen; c++) {
    targetCells.push([exitIndex, c]);
  }

  const targetSnake: SnakeDef = {
    id: 't',
    color: '#FFD700',
    cells: targetCells,
    isTarget: true,
  };

  // Build occupied set
  const occupiedSet = new Set<string>();
  const key = (r: number, c: number) => `${r},${c}`;

  for (const [r, c] of targetCells) {
    occupiedSet.add(key(r, c));
  }

  // Shuffle all empty cells
  const allCells: [number, number][] = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!occupiedSet.has(key(r, c))) {
        allCells.push([r, c]);
      }
    }
  }

  // Fisher-Yates shuffle
  for (let i = allCells.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [allCells[i], allCells[j]] = [allCells[j], allCells[i]];
  }

  const directions: Direction[] = ['right', 'left', 'up', 'down'];
  const deltas: Record<Direction, [number, number]> = {
    right: [0, 1], left: [0, -1], up: [-1, 0], down: [1, 0],
  };

  const extraSnakes: SnakeDef[] = [];
  let colorIdx = 0;

  for (const startCell of allCells) {
    if (occupiedSet.has(key(startCell[0], startCell[1]))) continue;

    // Random walk snake
    const desiredLen = 4 + Math.floor(rng() * 7); // 4-10
    const snakeCells: [number, number][] = [startCell];
    occupiedSet.add(key(startCell[0], startCell[1]));

    // Pick initial direction
    let dir = directions[Math.floor(rng() * 4)];

    for (let step = 1; step < desiredLen; step++) {
      // Prefer continuing, but sometimes turn
      const candidates: Direction[] = [];
      if (rng() < 0.65) {
        candidates.push(dir);
      }
      // Add shuffled alternates
      const others = directions.filter(d => d !== dir);
      for (let i = others.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [others[i], others[j]] = [others[j], others[i]];
      }
      for (const d of others) candidates.push(d);
      candidates.push(dir); // ensure dir is always in list

      const head = snakeCells[snakeCells.length - 1];
      let moved = false;
      for (const d of candidates) {
        const [dr, dc] = deltas[d];
        const nr = head[0] + dr;
        const nc = head[1] + dc;
        if (nr >= 0 && nr < size && nc >= 0 && nc < size && !occupiedSet.has(key(nr, nc))) {
          snakeCells.push([nr, nc]);
          occupiedSet.add(key(nr, nc));
          dir = d;
          moved = true;
          break;
        }
      }
      if (!moved) break;
    }

    if (snakeCells.length >= 1) {
      const color = COLORS[colorIdx % COLORS.length];
      colorIdx++;
      extraSnakes.push({
        id: `s${extraSnakes.length}`,
        color,
        cells: snakeCells,
        isTarget: false,
      });
    }
  }

  // Calculate par: count blockers in target row at cols >= targetLen, multiply by 2 + 2
  let blockerCount = 0;
  for (const s of extraSnakes) {
    for (const [r, c] of s.cells) {
      if (r === exitIndex && c >= targetLen) {
        blockerCount++;
        break; // count each snake once
      }
    }
  }
  const par = blockerCount * 2 + 2;

  return {
    id: levelId,
    size,
    exitSide,
    exitIndex,
    snakes: [targetSnake, ...extraSnakes],
    par: Math.max(par, 2),
  };
}
