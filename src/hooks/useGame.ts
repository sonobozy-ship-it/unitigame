import { useState, useCallback, useRef } from 'react';
import { Level } from '../data/levels';

export type CellPos = [number, number];

export interface PipeState {
  color: string;
  cells: CellPos[];
  completed: boolean;
}

export interface GameState {
  pipes: Record<string, PipeState>;  // keyed by color
  grid: (string | null)[][];         // color occupying each cell, null = empty
  moves: number;
  solved: boolean;
}

function emptyGrid(size: number): (string | null)[][] {
  return Array.from({ length: size }, () => Array(size).fill(null));
}

function posKey(pos: CellPos) {
  return `${pos[0]},${pos[1]}`;
}

function isAdjacent(a: CellPos, b: CellPos) {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) === 1;
}

function buildInitialState(level: Level): GameState {
  const grid = emptyGrid(level.size);
  const pipes: Record<string, PipeState> = {};

  for (const dot of level.dots) {
    // place both endpoints on grid
    grid[dot.start[0]][dot.start[1]] = dot.color;
    grid[dot.end[0]][dot.end[1]] = dot.color;
    pipes[dot.color] = { color: dot.color, cells: [dot.start], completed: false };
  }

  return { pipes, grid, moves: 0, solved: false };
}

function checkSolved(state: GameState, level: Level): boolean {
  // All pipes must be completed
  for (const color of Object.keys(state.pipes)) {
    if (!state.pipes[color].completed) return false;
  }
  // All cells must be filled
  for (let r = 0; r < level.size; r++) {
    for (let c = 0; c < level.size; c++) {
      if (state.grid[r][c] === null) return false;
    }
  }
  return true;
}

export function calcStars(moves: number, par: number): number {
  if (moves <= par) return 3;
  if (moves <= par * 2) return 2;
  return 1;
}

export function useGame(level: Level) {
  const [state, setState] = useState<GameState>(() => buildInitialState(level));
  const history = useRef<GameState[]>([]);
  const dragging = useRef<string | null>(null);  // color being dragged

  const reset = useCallback(() => {
    history.current = [];
    dragging.current = null;
    setState(buildInitialState(level));
  }, [level]);

  const undo = useCallback(() => {
    if (history.current.length === 0) return;
    const prev = history.current.pop()!;
    dragging.current = null;
    setState(prev);
  }, []);

  const isDotCell = useCallback((pos: CellPos): string | null => {
    for (const dot of level.dots) {
      if (dot.start[0] === pos[0] && dot.start[1] === pos[1]) return dot.color;
      if (dot.end[0] === pos[0] && dot.end[1] === pos[1]) return dot.color;
    }
    return null;
  }, [level]);

  const startDrag = useCallback((pos: CellPos) => {
    setState(prev => {
      const dotColor = isDotCell(pos);
      // Can only start drag from a dot cell or existing pipe cell
      const cellColor = prev.grid[pos[0]][pos[1]];
      const color = dotColor ?? cellColor;
      if (!color) return prev;

      dragging.current = color;

      // Save snapshot
      history.current.push(JSON.parse(JSON.stringify(prev)));

      // Clear this pipe from grid and restart from touched dot/cell
      const newGrid = prev.grid.map(row => [...row]);
      const pipe = prev.pipes[color];

      // Remove all cells of this color except the two endpoint dots
      for (const [r, c] of pipe.cells) {
        const isDot = level.dots.some(
          d => (d.start[0] === r && d.start[1] === c && d.color === color) ||
               (d.end[0] === r && d.end[1] === c && d.color === color)
        );
        if (!isDot) newGrid[r][c] = null;
      }
      // Unset non-dot pipe cells and reset start dot position
      for (const [r, c] of pipe.cells) {
        const isDot = level.dots.some(
          d => (d.start[0] === r && d.start[1] === c && d.color === color) ||
               (d.end[0] === r && d.end[1] === c && d.color === color)
        );
        if (!isDot) newGrid[r][c] = null;
      }

      // Determine start anchor: find which dot of this color we're closest to
      const dot = level.dots.find(d => d.color === color)!;
      let startCell: CellPos;
      if (dotColor) {
        startCell = pos; // started on a dot
      } else {
        // Started mid-pipe — truncate to the segment up to touched cell
        const idx = pipe.cells.findIndex(([r, c]) => r === pos[0] && c === pos[1]);
        if (idx >= 0) {
          // Truncate pipe here
          const truncated = pipe.cells.slice(0, idx + 1);
          const newPipes = { ...prev.pipes, [color]: { color, cells: truncated, completed: false } };
          // Re-fill grid
          for (const [r, c] of pipe.cells) {
            const d = level.dots.find(x => (x.start[0]===r&&x.start[1]===c&&x.color===color)||(x.end[0]===r&&x.end[1]===c&&x.color===color));
            if (!d) newGrid[r][c] = null;
          }
          for (const [r, c] of truncated) newGrid[r][c] = color;
          return { ...prev, grid: newGrid, pipes: newPipes };
        }
        startCell = dot.start;
      }

      // Reset pipe to just the start cell
      newGrid[startCell[0]][startCell[1]] = color;
      const newPipes = {
        ...prev.pipes,
        [color]: { color, cells: [startCell], completed: false },
      };

      return { ...prev, grid: newGrid, pipes: newPipes };
    });
  }, [level, isDotCell]);

  const continueDrag = useCallback((pos: CellPos) => {
    const color = dragging.current;
    if (!color) return;

    setState(prev => {
      const pipe = prev.pipes[color];
      if (!pipe) return prev;

      const last = pipe.cells[pipe.cells.length - 1];
      if (last[0] === pos[0] && last[1] === pos[1]) return prev; // same cell

      // Check adjacency
      if (!isAdjacent(last, pos)) return prev;

      // Check bounds
      if (pos[0] < 0 || pos[0] >= level.size || pos[1] < 0 || pos[1] >= level.size) return prev;

      // Allow backtracking (shrink pipe)
      if (pipe.cells.length >= 2) {
        const prev2 = pipe.cells[pipe.cells.length - 2];
        if (prev2[0] === pos[0] && prev2[1] === pos[1]) {
          const trimmed = pipe.cells.slice(0, -1);
          const newGrid = prev.grid.map(r => [...r]);
          newGrid[last[0]][last[1]] = isDotCell(last) ? color : null;
          const newPipes = { ...prev.pipes, [color]: { ...pipe, cells: trimmed, completed: false } };
          return { ...prev, grid: newGrid, pipes: newPipes };
        }
      }

      // Can't go into a cell occupied by another color
      const existing = prev.grid[pos[0]][pos[1]];
      if (existing && existing !== color) return prev;

      // Can't revisit own cells (except backtrack handled above)
      if (pipe.cells.some(([r, c]) => r === pos[0] && c === pos[1])) return prev;

      const newGrid = prev.grid.map(r => [...r]);
      newGrid[pos[0]][pos[1]] = color;
      const newCells: CellPos[] = [...pipe.cells, pos];

      // Check if this completes the pipe (reached end dot)
      const dot = level.dots.find(d => d.color === color)!;
      const isEnd =
        (dot.end[0] === pos[0] && dot.end[1] === pos[1]) ||
        (dot.start[0] === pos[0] && dot.start[1] === pos[1] && pipe.cells.length > 1);

      const newPipe: PipeState = { color, cells: newCells, completed: isEnd };
      const newPipes = { ...prev.pipes, [color]: newPipe };

      if (isEnd) dragging.current = null;

      const newState: GameState = {
        ...prev,
        grid: newGrid,
        pipes: newPipes,
        moves: prev.moves + 1,
      };
      newState.solved = checkSolved(newState, level);
      return newState;
    });
  }, [level, isDotCell]);

  const endDrag = useCallback(() => {
    dragging.current = null;
  }, []);

  return { state, startDrag, continueDrag, endDrag, reset, undo, isDotCell };
}
