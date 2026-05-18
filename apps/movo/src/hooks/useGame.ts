import { useState, useCallback, useRef } from 'react';
import { Level, SnakeDef, Direction } from '../data/levels';

export interface GameState {
  snakes: SnakeDef[];
  moveCount: number;
  won: boolean;
  history: SnakeDef[][];
}

function cloneSnakes(snakes: SnakeDef[]): SnakeDef[] {
  return snakes.map(s => ({ ...s, cells: s.cells.map(c => [c[0], c[1]] as [number, number]) }));
}

/** Derive head direction from last 2 cells (tail→head order) */
function dirOf(s: SnakeDef): Direction {
  if (s.cells.length < 2) return 'right';
  const prev = s.cells[s.cells.length - 2];
  const head = s.cells[s.cells.length - 1];
  const dr = head[0] - prev[0];
  const dc = head[1] - prev[1];
  if (dc === 1) return 'right';
  if (dc === -1) return 'left';
  if (dr === 1) return 'down';
  return 'up';
}

function dirDelta(d: Direction): [number, number] {
  switch (d) {
    case 'right': return [0, 1];
    case 'left':  return [0, -1];
    case 'down':  return [1, 0];
    case 'up':    return [-1, 0];
  }
}

function isExitDirection(dir: Direction, exitSide: string): boolean {
  return (
    (dir === 'right' && exitSide === 'right') ||
    (dir === 'left'  && exitSide === 'left')  ||
    (dir === 'down'  && exitSide === 'bottom') ||
    (dir === 'up'    && exitSide === 'top')
  );
}

export function useGame(level: Level) {
  const [state, setState] = useState<GameState>({
    snakes: cloneSnakes(level.snakes),
    moveCount: 0,
    won: false,
    history: [],
  });

  const levelRef = useRef(level);
  levelRef.current = level;

  const resetGame = useCallback((newLevel?: Level) => {
    const l = newLevel ?? levelRef.current;
    setState({ snakes: cloneSnakes(l.snakes), moveCount: 0, won: false, history: [] });
  }, []);

  const tapSnake = useCallback((id: string) => {
    setState(prev => {
      if (prev.won) return prev;
      const snake = prev.snakes.find(s => s.id === id);
      if (!snake) return prev;

      const { size, exitSide, exitIndex } = levelRef.current;
      const dir = dirOf(snake);
      const [dr, dc] = dirDelta(dir);

      // Build occupied set from all other snakes
      const occupied = new Set<string>();
      const key = (r: number, c: number) => `${r},${c}`;

      for (const s of prev.snakes) {
        if (s.id === id) continue;
        for (const [r, c] of s.cells) {
          occupied.add(key(r, c));
        }
      }

      // Build current snake's own occupied set (mutable as tail drops)
      const ownCells = snake.cells.map(c => [c[0], c[1]] as [number, number]);

      // Slide step by step up to size*2 steps limit
      const limit = size * 2;
      let steps = 0;
      let won = false;

      for (let i = 0; i < limit; i++) {
        const head = ownCells[ownCells.length - 1];
        const nr = head[0] + dr;
        const nc = head[1] + dc;

        // Check out of bounds
        if (nr < 0 || nr >= size || nc < 0 || nc >= size) {
          // Win condition: target snake exits through the exit
          if (
            snake.isTarget &&
            isExitDirection(dir, exitSide) &&
            (exitSide === 'right' || exitSide === 'left' ? head[0] === exitIndex : head[1] === exitIndex)
          ) {
            won = true;
            steps++;
          }
          break;
        }

        // Check blocked by another snake
        if (occupied.has(key(nr, nc))) break;

        // Move: drop tail, add new head
        const tail = ownCells[0];
        occupied.delete(key(tail[0], tail[1])); // free the tail cell (but don't re-add to "other" occupied)
        ownCells.shift();
        ownCells.push([nr, nc]);
        steps++;
      }

      if (steps === 0) return prev;

      const newSnakes = cloneSnakes(prev.snakes);
      const ns = newSnakes.find(s => s.id === id)!;
      ns.cells = ownCells;

      return {
        snakes: newSnakes,
        moveCount: prev.moveCount + 1,
        won,
        history: [...prev.history, cloneSnakes(prev.snakes)],
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
