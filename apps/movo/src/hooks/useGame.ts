import { useState, useCallback, useRef } from 'react';
import { Level, SnakeDef, Wall, Direction, ExitSide } from '../data/levels';

export interface GameState {
  snakes: SnakeDef[];
  moveCount: number;
  won: boolean;
  history: SnakeDef[][];
}

function clone(snakes: SnakeDef[]): SnakeDef[] {
  return snakes.map(s => ({ ...s }));
}

// Cells occupied by a snake
function cells(s: SnakeDef): [number, number][] {
  const result: [number, number][] = [];
  for (let i = 0; i < s.length; i++) {
    if (s.direction === 'right' || s.direction === 'left') {
      result.push([s.row, s.col + i]);
    } else {
      result.push([s.row + i, s.col]);
    }
  }
  return result;
}

// Head cell (the end that moves first)
function headCell(s: SnakeDef): [number, number] {
  switch (s.direction) {
    case 'right': return [s.row, s.col + s.length - 1];
    case 'left':  return [s.row, s.col];
    case 'down':  return [s.row + s.length - 1, s.col];
    case 'up':    return [s.row, s.col];
  }
}

function dirDelta(d: Direction): [number, number] {
  switch (d) {
    case 'right': return [0, 1];
    case 'left':  return [0, -1];
    case 'down':  return [1, 0];
    case 'up':    return [-1, 0];
  }
}

function hasWall(r: number, c: number, dr: number, dc: number, walls: Wall[]): boolean {
  const nr = r + dr;
  const nc = c + dc;
  return walls.some(w =>
    (w.r1 === r && w.c1 === c && w.r2 === nr && w.c2 === nc) ||
    (w.r1 === nr && w.c1 === nc && w.r2 === r && w.c2 === c),
  );
}

// Check if cell (r,c) is occupied by any snake other than excludeId
function occupied(r: number, c: number, snakes: SnakeDef[], excludeId: string): boolean {
  for (const s of snakes) {
    if (s.id === excludeId) continue;
    for (const [sr, sc] of cells(s)) {
      if (sr === r && sc === c) return true;
    }
  }
  return false;
}

// How many steps the snake can slide in its direction
function calcSteps(snake: SnakeDef, snakes: SnakeDef[], walls: Wall[], size: number, exitSide: ExitSide, exitIndex: number): number {
  const [dr, dc] = dirDelta(snake.direction);
  const [hr, hc] = headCell(snake);
  let steps = 0;

  while (true) {
    const checkR = hr + (steps + 1) * dr;
    const checkC = hc + (steps + 1) * dc;

    // Wall between current head position and next
    const curR = hr + steps * dr;
    const curC = hc + steps * dc;
    if (hasWall(curR, curC, dr, dc, walls)) break;

    // Out of bounds — allow if this is the exit
    if (checkR < 0 || checkR >= size || checkC < 0 || checkC >= size) {
      if (snake.isTarget && isExitDirection(snake.direction, exitSide) && exitIndex === (snake.direction === 'right' || snake.direction === 'left' ? hr : hc)) {
        steps++; // allow one step out (win move)
      }
      break;
    }

    // Blocked by another snake
    if (occupied(checkR, checkC, snakes, snake.id)) break;

    steps++;
  }
  return steps;
}

function isExitDirection(dir: Direction, exitSide: ExitSide): boolean {
  return (
    (dir === 'right' && exitSide === 'right') ||
    (dir === 'left'  && exitSide === 'left')  ||
    (dir === 'down'  && exitSide === 'bottom') ||
    (dir === 'up'    && exitSide === 'top')
  );
}

function checkWin(snake: SnakeDef, size: number, exitSide: ExitSide, exitIndex: number): boolean {
  const [hr, hc] = headCell(snake);
  if (!isExitDirection(snake.direction, exitSide)) return false;
  switch (exitSide) {
    case 'right':  return hc >= size && hr === exitIndex;
    case 'left':   return hc < 0 && hr === exitIndex;
    case 'bottom': return hr >= size && hc === exitIndex;
    case 'top':    return hr < 0 && hc === exitIndex;
  }
}

export function useGame(level: Level) {
  const [state, setState] = useState<GameState>({
    snakes: clone(level.snakes),
    moveCount: 0,
    won: false,
    history: [],
  });

  const levelRef = useRef(level);
  levelRef.current = level;

  const resetGame = useCallback((newLevel?: Level) => {
    const l = newLevel ?? levelRef.current;
    setState({ snakes: clone(l.snakes), moveCount: 0, won: false, history: [] });
  }, []);

  const tapSnake = useCallback((id: string) => {
    setState(prev => {
      if (prev.won) return prev;
      const snake = prev.snakes.find(s => s.id === id);
      if (!snake) return prev;

      const { walls, size, exitSide, exitIndex } = levelRef.current;
      const steps = calcSteps(snake, prev.snakes, walls, size, exitSide, exitIndex);
      if (steps === 0) return prev;

      const [dr, dc] = dirDelta(snake.direction);
      const newSnakes = clone(prev.snakes);
      const ns = newSnakes.find(s => s.id === id)!;
      ns.row += dr * steps;
      ns.col += dc * steps;

      const won = checkWin(ns, size, exitSide, exitIndex);

      return {
        snakes: newSnakes,
        moveCount: prev.moveCount + 1,
        won,
        history: [...prev.history, clone(prev.snakes)],
      };
    });
  }, []);

  const undoMove = useCallback(() => {
    setState(prev => {
      if (prev.history.length === 0) return prev;
      const history = [...prev.history];
      const previous = history.pop()!;
      return { snakes: previous, moveCount: prev.moveCount - 1, won: false, history };
    });
  }, []);

  const getStars = useCallback((moves: number): number => {
    const { par } = levelRef.current;
    if (moves <= par) return 3;
    if (moves <= Math.ceil(par * 1.5)) return 2;
    return 1;
  }, []);

  return { state, tapSnake, undoMove, resetGame, getStars };
}
