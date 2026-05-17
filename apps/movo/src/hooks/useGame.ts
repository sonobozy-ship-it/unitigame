import { useState, useCallback, useRef } from 'react';
import { Level, Vehicle } from '../data/levels';

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface GameState {
  vehicles: Vehicle[];
  moveCount: number;
  won: boolean;
  history: Vehicle[][];
}

function deepCloneVehicles(vehicles: Vehicle[]): Vehicle[] {
  return vehicles.map(v => ({ ...v }));
}

function buildGrid(vehicles: Vehicle[], size: number): (string | null)[][] {
  const grid: (string | null)[][] = Array.from({ length: size }, () => Array(size).fill(null));
  for (const v of vehicles) {
    for (let i = 0; i < v.length; i++) {
      const r = v.orientation === 'H' ? v.row : v.row + i;
      const c = v.orientation === 'H' ? v.col + i : v.col;
      if (r >= 0 && r < size && c >= 0 && c < size) {
        grid[r][c] = v.id;
      }
    }
  }
  return grid;
}

function canMove(vehicle: Vehicle, direction: Direction, vehicles: Vehicle[], gridSize: number): boolean {
  const grid = buildGrid(vehicles, gridSize);
  
  if (vehicle.orientation === 'H') {
    if (direction === 'up' || direction === 'down') return false;
    if (direction === 'left') {
      const nextCol = vehicle.col - 1;
      if (nextCol < 0) return false;
      return grid[vehicle.row][nextCol] === null;
    }
    if (direction === 'right') {
      const nextCol = vehicle.col + vehicle.length;
      if (nextCol >= gridSize) return vehicle.isTarget; // target can exit
      return grid[vehicle.row][nextCol] === null;
    }
  } else {
    if (direction === 'left' || direction === 'right') return false;
    if (direction === 'up') {
      const nextRow = vehicle.row - 1;
      if (nextRow < 0) return false;
      return grid[nextRow][vehicle.col] === null;
    }
    if (direction === 'down') {
      const nextRow = vehicle.row + vehicle.length;
      if (nextRow >= gridSize) return false;
      return grid[nextRow][vehicle.col] === null;
    }
  }
  return false;
}

function maxMoves(vehicle: Vehicle, direction: Direction, vehicles: Vehicle[], gridSize: number): number {
  let count = 0;
  const tempVehicles = deepCloneVehicles(vehicles);
  const tv = tempVehicles.find(v => v.id === vehicle.id)!;
  
  while (canMove(tv, direction, tempVehicles, gridSize)) {
    if (direction === 'left') tv.col -= 1;
    else if (direction === 'right') tv.col += 1;
    else if (direction === 'up') tv.row -= 1;
    else if (direction === 'down') tv.row += 1;
    count++;
    if (tv.isTarget && direction === 'right' && tv.col + tv.length >= gridSize) break;
    if (count > gridSize) break;
  }
  return count;
}

function checkWin(vehicles: Vehicle[], gridSize: number): boolean {
  const target = vehicles.find(v => v.isTarget);
  if (!target) return false;
  return target.col + target.length >= gridSize;
}

export function useGame(level: Level) {
  const [state, setState] = useState<GameState>({
    vehicles: deepCloneVehicles(level.vehicles),
    moveCount: 0,
    won: false,
    history: [],
  });

  const levelRef = useRef(level);
  levelRef.current = level;

  const resetGame = useCallback((newLevel?: Level) => {
    const l = newLevel ?? levelRef.current;
    setState({
      vehicles: deepCloneVehicles(l.vehicles),
      moveCount: 0,
      won: false,
      history: [],
    });
  }, []);

  const moveVehicle = useCallback((vehicleId: string, direction: Direction, steps?: number) => {
    setState(prev => {
      if (prev.won) return prev;
      
      const vehicle = prev.vehicles.find(v => v.id === vehicleId);
      if (!vehicle) return prev;
      if (!canMove(vehicle, direction, prev.vehicles, level.size)) return prev;

      const newVehicles = deepCloneVehicles(prev.vehicles);
      const tv = newVehicles.find(v => v.id === vehicleId)!;
      
      const stepsToMove = steps ?? maxMoves(tv, direction, newVehicles, level.size);
      const clampedSteps = Math.max(1, Math.min(stepsToMove, level.size));

      let moved = 0;
      for (let i = 0; i < clampedSteps; i++) {
        if (!canMove(tv, direction, newVehicles, level.size)) break;
        if (direction === 'left') tv.col -= 1;
        else if (direction === 'right') tv.col += 1;
        else if (direction === 'up') tv.row -= 1;
        else if (direction === 'down') tv.row += 1;
        moved++;
        if (tv.isTarget && direction === 'right' && tv.col + tv.length >= level.size) break;
      }

      if (moved === 0) return prev;

      const won = checkWin(newVehicles, level.size);

      return {
        vehicles: newVehicles,
        moveCount: prev.moveCount + 1,
        won,
        history: [...prev.history, deepCloneVehicles(prev.vehicles)],
      };
    });
  }, [level.size]);

  const undoMove = useCallback(() => {
    setState(prev => {
      if (prev.history.length === 0) return prev;
      const newHistory = [...prev.history];
      const previousVehicles = newHistory.pop()!;
      return {
        vehicles: previousVehicles,
        moveCount: prev.moveCount - 1,
        won: false,
        history: newHistory,
      };
    });
  }, []);

  const getStars = useCallback((moves: number): number => {
    if (moves <= level.par) return 3;
    if (moves <= level.par * 1.5) return 2;
    return 1;
  }, [level.par]);

  const canMoveVehicle = useCallback((vehicleId: string, direction: Direction): boolean => {
    const vehicle = state.vehicles.find(v => v.id === vehicleId);
    if (!vehicle) return false;
    return canMove(vehicle, direction, state.vehicles, level.size);
  }, [state.vehicles, level.size]);

  const getMaxMoves = useCallback((vehicleId: string, direction: Direction): number => {
    const vehicle = state.vehicles.find(v => v.id === vehicleId);
    if (!vehicle) return 0;
    return maxMoves(vehicle, direction, state.vehicles, level.size);
  }, [state.vehicles, level.size]);

  return {
    state,
    moveVehicle,
    undoMove,
    resetGame,
    getStars,
    canMoveVehicle,
    getMaxMoves,
  };
}
