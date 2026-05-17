export interface Vehicle {
  id: string;
  color: string;
  orientation: 'H' | 'V';
  row: number;
  col: number;
  length: 2 | 3;
  isTarget: boolean;
}

export interface Level {
  id: number;
  size: 6;
  exitRow: number;
  vehicles: Vehicle[];
  par: number;
}

export const LEVELS: Level[] = [
  // Level 1 - trivial
  {
    id: 1, size: 6, exitRow: 2, par: 1,
    vehicles: [
      { id: 'target', color: '#FF4444', orientation: 'H', row: 2, col: 3, length: 2, isTarget: true },
    ],
  },
  // Level 2
  {
    id: 2, size: 6, exitRow: 2, par: 2,
    vehicles: [
      { id: 'target', color: '#FF4444', orientation: 'H', row: 2, col: 2, length: 2, isTarget: true },
      { id: 'a', color: '#4ECDC4', orientation: 'V', row: 0, col: 4, length: 2, isTarget: false },
    ],
  },
  // Level 3
  {
    id: 3, size: 6, exitRow: 2, par: 3,
    vehicles: [
      { id: 'target', color: '#FF4444', orientation: 'H', row: 2, col: 1, length: 2, isTarget: true },
      { id: 'a', color: '#4ECDC4', orientation: 'V', row: 1, col: 3, length: 2, isTarget: false },
      { id: 'b', color: '#45B7D1', orientation: 'H', row: 1, col: 4, length: 2, isTarget: false },
    ],
  },
  // Level 4
  {
    id: 4, size: 6, exitRow: 2, par: 3,
    vehicles: [
      { id: 'target', color: '#FF4444', orientation: 'H', row: 2, col: 0, length: 2, isTarget: true },
      { id: 'a', color: '#4ECDC4', orientation: 'V', row: 0, col: 2, length: 3, isTarget: false },
      { id: 'b', color: '#45B7D1', orientation: 'H', row: 0, col: 3, length: 2, isTarget: false },
    ],
  },
  // Level 5
  {
    id: 5, size: 6, exitRow: 2, par: 4,
    vehicles: [
      { id: 'target', color: '#FF4444', orientation: 'H', row: 2, col: 0, length: 2, isTarget: true },
      { id: 'a', color: '#4ECDC4', orientation: 'V', row: 0, col: 2, length: 2, isTarget: false },
      { id: 'b', color: '#45B7D1', orientation: 'V', row: 2, col: 3, length: 2, isTarget: false },
      { id: 'c', color: '#96CEB4', orientation: 'H', row: 4, col: 3, length: 2, isTarget: false },
    ],
  },
  // Level 6
  {
    id: 6, size: 6, exitRow: 2, par: 4,
    vehicles: [
      { id: 'target', color: '#FF4444', orientation: 'H', row: 2, col: 1, length: 2, isTarget: true },
      { id: 'a', color: '#4ECDC4', orientation: 'V', row: 0, col: 3, length: 3, isTarget: false },
      { id: 'b', color: '#45B7D1', orientation: 'H', row: 0, col: 4, length: 2, isTarget: false },
      { id: 'c', color: '#96CEB4', orientation: 'V', row: 3, col: 3, length: 2, isTarget: false },
    ],
  },
  // Level 7
  {
    id: 7, size: 6, exitRow: 2, par: 4,
    vehicles: [
      { id: 'target', color: '#FF4444', orientation: 'H', row: 2, col: 0, length: 2, isTarget: true },
      { id: 'a', color: '#4ECDC4', orientation: 'V', row: 1, col: 2, length: 2, isTarget: false },
      { id: 'b', color: '#45B7D1', orientation: 'V', row: 2, col: 4, length: 2, isTarget: false },
      { id: 'c', color: '#96CEB4', orientation: 'H', row: 1, col: 3, length: 2, isTarget: false },
      { id: 'd', color: '#FFEAA7', orientation: 'H', row: 4, col: 4, length: 2, isTarget: false },
    ],
  },
  // Level 8
  {
    id: 8, size: 6, exitRow: 2, par: 5,
    vehicles: [
      { id: 'target', color: '#FF4444', orientation: 'H', row: 2, col: 0, length: 2, isTarget: true },
      { id: 'a', color: '#4ECDC4', orientation: 'V', row: 0, col: 2, length: 2, isTarget: false },
      { id: 'b', color: '#45B7D1', orientation: 'H', row: 0, col: 3, length: 2, isTarget: false },
      { id: 'c', color: '#96CEB4', orientation: 'V', row: 2, col: 3, length: 2, isTarget: false },
      { id: 'd', color: '#FFEAA7', orientation: 'H', row: 4, col: 3, length: 2, isTarget: false },
    ],
  },
  // Level 9
  {
    id: 9, size: 6, exitRow: 3, par: 4,
    vehicles: [
      { id: 'target', color: '#FF4444', orientation: 'H', row: 3, col: 1, length: 2, isTarget: true },
      { id: 'a', color: '#4ECDC4', orientation: 'V', row: 1, col: 3, length: 3, isTarget: false },
      { id: 'b', color: '#45B7D1', orientation: 'H', row: 1, col: 4, length: 2, isTarget: false },
      { id: 'c', color: '#96CEB4', orientation: 'H', row: 0, col: 0, length: 3, isTarget: false },
    ],
  },
  // Level 10
  {
    id: 10, size: 6, exitRow: 2, par: 5,
    vehicles: [
      { id: 'target', color: '#FF4444', orientation: 'H', row: 2, col: 0, length: 2, isTarget: true },
      { id: 'a', color: '#4ECDC4', orientation: 'V', row: 0, col: 2, length: 3, isTarget: false },
      { id: 'b', color: '#45B7D1', orientation: 'V', row: 3, col: 2, length: 2, isTarget: false },
      { id: 'c', color: '#96CEB4', orientation: 'H', row: 3, col: 3, length: 2, isTarget: false },
      { id: 'd', color: '#FFEAA7', orientation: 'V', row: 0, col: 4, length: 2, isTarget: false },
    ],
  },
  // Level 11
  {
    id: 11, size: 6, exitRow: 2, par: 5,
    vehicles: [
      { id: 'target', color: '#FF4444', orientation: 'H', row: 2, col: 0, length: 2, isTarget: true },
      { id: 'a', color: '#4ECDC4', orientation: 'V', row: 0, col: 2, length: 2, isTarget: false },
      { id: 'b', color: '#45B7D1', orientation: 'V', row: 2, col: 2, length: 2, isTarget: false },
      { id: 'c', color: '#96CEB4', orientation: 'H', row: 4, col: 2, length: 2, isTarget: false },
      { id: 'd', color: '#FFEAA7', orientation: 'V', row: 0, col: 4, length: 3, isTarget: false },
      { id: 'e', color: '#DDA0DD', orientation: 'H', row: 0, col: 3, length: 2, isTarget: false },
    ],
  },
  // Level 12
  {
    id: 12, size: 6, exitRow: 2, par: 6,
    vehicles: [
      { id: 'target', color: '#FF4444', orientation: 'H', row: 2, col: 0, length: 2, isTarget: true },
      { id: 'a', color: '#4ECDC4', orientation: 'V', row: 1, col: 2, length: 3, isTarget: false },
      { id: 'b', color: '#45B7D1', orientation: 'H', row: 0, col: 3, length: 2, isTarget: false },
      { id: 'c', color: '#96CEB4', orientation: 'V', row: 0, col: 5, length: 3, isTarget: false },
      { id: 'd', color: '#FFEAA7', orientation: 'H', row: 4, col: 3, length: 2, isTarget: false },
      { id: 'e', color: '#DDA0DD', orientation: 'V', row: 3, col: 4, length: 2, isTarget: false },
    ],
  },
  // Level 13
  {
    id: 13, size: 6, exitRow: 2, par: 6,
    vehicles: [
      { id: 'target', color: '#FF4444', orientation: 'H', row: 2, col: 0, length: 2, isTarget: true },
      { id: 'a', color: '#4ECDC4', orientation: 'V', row: 0, col: 2, length: 2, isTarget: false },
      { id: 'b', color: '#45B7D1', orientation: 'H', row: 0, col: 3, length: 3, isTarget: false },
      { id: 'c', color: '#96CEB4', orientation: 'V', row: 2, col: 3, length: 3, isTarget: false },
      { id: 'd', color: '#FFEAA7', orientation: 'H', row: 5, col: 3, length: 2, isTarget: false },
      { id: 'e', color: '#DDA0DD', orientation: 'V', row: 2, col: 5, length: 2, isTarget: false },
    ],
  },
  // Level 14
  {
    id: 14, size: 6, exitRow: 2, par: 6,
    vehicles: [
      { id: 'target', color: '#FF4444', orientation: 'H', row: 2, col: 0, length: 2, isTarget: true },
      { id: 'a', color: '#4ECDC4', orientation: 'V', row: 0, col: 2, length: 3, isTarget: false },
      { id: 'b', color: '#45B7D1', orientation: 'V', row: 3, col: 2, length: 2, isTarget: false },
      { id: 'c', color: '#96CEB4', orientation: 'H', row: 3, col: 3, length: 2, isTarget: false },
      { id: 'd', color: '#FFEAA7', orientation: 'V', row: 0, col: 4, length: 2, isTarget: false },
      { id: 'e', color: '#DDA0DD', orientation: 'H', row: 0, col: 3, length: 2, isTarget: false },
      { id: 'f', color: '#98D8C8', orientation: 'H', row: 5, col: 0, length: 3, isTarget: false },
    ],
  },
  // Level 15
  {
    id: 15, size: 6, exitRow: 2, par: 7,
    vehicles: [
      { id: 'target', color: '#FF4444', orientation: 'H', row: 2, col: 0, length: 2, isTarget: true },
      { id: 'a', color: '#4ECDC4', orientation: 'V', row: 0, col: 2, length: 2, isTarget: false },
      { id: 'b', color: '#45B7D1', orientation: 'V', row: 2, col: 2, length: 2, isTarget: false },
      { id: 'c', color: '#96CEB4', orientation: 'V', row: 4, col: 2, length: 2, isTarget: false },
      { id: 'd', color: '#FFEAA7', orientation: 'H', row: 0, col: 3, length: 2, isTarget: false },
      { id: 'e', color: '#DDA0DD', orientation: 'H', row: 4, col: 3, length: 2, isTarget: false },
      { id: 'f', color: '#98D8C8', orientation: 'V', row: 1, col: 4, length: 3, isTarget: false },
    ],
  },
  // Level 16 - medium start
  {
    id: 16, size: 6, exitRow: 2, par: 8,
    vehicles: [
      { id: 'target', color: '#FF4444', orientation: 'H', row: 2, col: 0, length: 2, isTarget: true },
      { id: 'a', color: '#4ECDC4', orientation: 'V', row: 0, col: 2, length: 3, isTarget: false },
      { id: 'b', color: '#45B7D1', orientation: 'V', row: 3, col: 2, length: 3, isTarget: false },
      { id: 'c', color: '#96CEB4', orientation: 'H', row: 0, col: 3, length: 3, isTarget: false },
      { id: 'd', color: '#FFEAA7', orientation: 'H', row: 5, col: 3, length: 3, isTarget: false },
      { id: 'e', color: '#DDA0DD', orientation: 'V', row: 1, col: 5, length: 2, isTarget: false },
      { id: 'f', color: '#98D8C8', orientation: 'V', row: 3, col: 5, length: 2, isTarget: false },
    ],
  },
  // Level 17
  {
    id: 17, size: 6, exitRow: 2, par: 8,
    vehicles: [
      { id: 'target', color: '#FF4444', orientation: 'H', row: 2, col: 0, length: 2, isTarget: true },
      { id: 'a', color: '#4ECDC4', orientation: 'H', row: 0, col: 0, length: 2, isTarget: false },
      { id: 'b', color: '#45B7D1', orientation: 'V', row: 0, col: 2, length: 2, isTarget: false },
      { id: 'c', color: '#96CEB4', orientation: 'V', row: 2, col: 2, length: 2, isTarget: false },
      { id: 'd', color: '#FFEAA7', orientation: 'H', row: 4, col: 0, length: 3, isTarget: false },
      { id: 'e', color: '#DDA0DD', orientation: 'V', row: 0, col: 3, length: 3, isTarget: false },
      { id: 'f', color: '#98D8C8', orientation: 'H', row: 3, col: 3, length: 2, isTarget: false },
      { id: 'g', color: '#F7DC6F', orientation: 'V', row: 4, col: 4, length: 2, isTarget: false },
    ],
  },
  // Level 18
  {
    id: 18, size: 6, exitRow: 2, par: 8,
    vehicles: [
      { id: 'target', color: '#FF4444', orientation: 'H', row: 2, col: 0, length: 2, isTarget: true },
      { id: 'a', color: '#4ECDC4', orientation: 'V', row: 0, col: 2, length: 3, isTarget: false },
      { id: 'b', color: '#45B7D1', orientation: 'H', row: 3, col: 2, length: 3, isTarget: false },
      { id: 'c', color: '#96CEB4', orientation: 'V', row: 3, col: 5, length: 2, isTarget: false },
      { id: 'd', color: '#FFEAA7', orientation: 'H', row: 0, col: 3, length: 2, isTarget: false },
      { id: 'e', color: '#DDA0DD', orientation: 'V', row: 0, col: 5, length: 3, isTarget: false },
      { id: 'f', color: '#98D8C8', orientation: 'H', row: 5, col: 0, length: 2, isTarget: false },
    ],
  },
  // Level 19
  {
    id: 19, size: 6, exitRow: 2, par: 9,
    vehicles: [
      { id: 'target', color: '#FF4444', orientation: 'H', row: 2, col: 0, length: 2, isTarget: true },
      { id: 'a', color: '#4ECDC4', orientation: 'V', row: 1, col: 2, length: 2, isTarget: false },
      { id: 'b', color: '#45B7D1', orientation: 'V', row: 3, col: 2, length: 2, isTarget: false },
      { id: 'c', color: '#96CEB4', orientation: 'H', row: 1, col: 3, length: 2, isTarget: false },
      { id: 'd', color: '#FFEAA7', orientation: 'H', row: 3, col: 3, length: 2, isTarget: false },
      { id: 'e', color: '#DDA0DD', orientation: 'V', row: 0, col: 5, length: 2, isTarget: false },
      { id: 'f', color: '#98D8C8', orientation: 'V', row: 2, col: 5, length: 2, isTarget: false },
      { id: 'g', color: '#F7DC6F', orientation: 'V', row: 4, col: 5, length: 2, isTarget: false },
    ],
  },
  // Level 20
  {
    id: 20, size: 6, exitRow: 2, par: 9,
    vehicles: [
      { id: 'target', color: '#FF4444', orientation: 'H', row: 2, col: 0, length: 2, isTarget: true },
      { id: 'a', color: '#4ECDC4', orientation: 'V', row: 0, col: 2, length: 3, isTarget: false },
      { id: 'b', color: '#45B7D1', orientation: 'V', row: 3, col: 2, length: 3, isTarget: false },
      { id: 'c', color: '#96CEB4', orientation: 'H', row: 0, col: 3, length: 2, isTarget: false },
      { id: 'd', color: '#FFEAA7', orientation: 'V', row: 0, col: 5, length: 2, isTarget: false },
      { id: 'e', color: '#DDA0DD', orientation: 'H', row: 3, col: 3, length: 2, isTarget: false },
      { id: 'f', color: '#98D8C8', orientation: 'V', row: 4, col: 5, length: 2, isTarget: false },
      { id: 'g', color: '#F7DC6F', orientation: 'H', row: 5, col: 3, length: 2, isTarget: false },
    ],
  },
  // Levels 21-40: slightly harder easy
  {
    id: 21, size: 6, exitRow: 2, par: 7,
    vehicles: [
      { id: 'target', color: '#FF4444', orientation: 'H', row: 2, col: 0, length: 2, isTarget: true },
      { id: 'a', color: '#4ECDC4', orientation: 'V', row: 0, col: 2, length: 2, isTarget: false },
      { id: 'b', color: '#45B7D1', orientation: 'H', row: 0, col: 3, length: 2, isTarget: false },
      { id: 'c', color: '#96CEB4', orientation: 'V', row: 1, col: 5, length: 2, isTarget: false },
      { id: 'd', color: '#FFEAA7', orientation: 'H', row: 3, col: 2, length: 3, isTarget: false },
      { id: 'e', color: '#DDA0DD', orientation: 'V', row: 3, col: 5, length: 3, isTarget: false },
    ],
  },
  {
    id: 22, size: 6, exitRow: 2, par: 7,
    vehicles: [
      { id: 'target', color: '#FF4444', orientation: 'H', row: 2, col: 0, length: 2, isTarget: true },
      { id: 'a', color: '#4ECDC4', orientation: 'H', row: 0, col: 2, length: 3, isTarget: false },
      { id: 'b', color: '#45B7D1', orientation: 'V', row: 1, col: 2, length: 2, isTarget: false },
      { id: 'c', color: '#96CEB4', orientation: 'V', row: 1, col: 4, length: 3, isTarget: false },
      { id: 'd', color: '#FFEAA7', orientation: 'H', row: 4, col: 2, length: 2, isTarget: false },
      { id: 'e', color: '#DDA0DD', orientation: 'H', row: 5, col: 0, length: 3, isTarget: false },
    ],
  },
  {
    id: 23, size: 6, exitRow: 2, par: 7,
    vehicles: [
      { id: 'target', color: '#FF4444', orientation: 'H', row: 2, col: 0, length: 2, isTarget: true },
      { id: 'a', color: '#4ECDC4', orientation: 'V', row: 0, col: 2, length: 2, isTarget: false },
      { id: 'b', color: '#45B7D1', orientation: 'V', row: 2, col: 3, length: 2, isTarget: false },
      { id: 'c', color: '#96CEB4', orientation: 'H', row: 0, col: 3, length: 2, isTarget: false },
      { id: 'd', color: '#FFEAA7', orientation: 'V', row: 0, col: 5, length: 3, isTarget: false },
      { id: 'e', color: '#DDA0DD', orientation: 'H', row: 4, col: 3, length: 3, isTarget: false },
      { id: 'f', color: '#98D8C8', orientation: 'V', row: 4, col: 2, length: 2, isTarget: false },
    ],
  },
  {
    id: 24, size: 6, exitRow: 2, par: 8,
    vehicles: [
      { id: 'target', color: '#FF4444', orientation: 'H', row: 2, col: 0, length: 2, isTarget: true },
      { id: 'a', color: '#4ECDC4', orientation: 'V', row: 0, col: 2, length: 3, isTarget: false },
      { id: 'b', color: '#45B7D1', orientation: 'V', row: 3, col: 2, length: 2, isTarget: false },
      { id: 'c', color: '#96CEB4', orientation: 'H', row: 5, col: 2, length: 3, isTarget: false },
      { id: 'd', color: '#FFEAA7', orientation: 'V', row: 0, col: 4, length: 2, isTarget: false },
      { id: 'e', color: '#DDA0DD', orientation: 'H', row: 0, col: 3, length: 2, isTarget: false },
      { id: 'f', color: '#98D8C8', orientation: 'V', row: 2, col: 5, length: 2, isTarget: false },
      { id: 'g', color: '#F7DC6F', orientation: 'H', row: 4, col: 3, length: 2, isTarget: false },
    ],
  },
  {
    id: 25, size: 6, exitRow: 2, par: 8,
    vehicles: [
      { id: 'target', color: '#FF4444', orientation: 'H', row: 2, col: 0, length: 2, isTarget: true },
      { id: 'a', color: '#4ECDC4', orientation: 'H', row: 0, col: 0, length: 3, isTarget: false },
      { id: 'b', color: '#45B7D1', orientation: 'V', row: 0, col: 3, length: 2, isTarget: false },
      { id: 'c', color: '#96CEB4', orientation: 'H', row: 0, col: 4, length: 2, isTarget: false },
      { id: 'd', color: '#FFEAA7', orientation: 'V', row: 1, col: 2, length: 3, isTarget: false },
      { id: 'e', color: '#DDA0DD', orientation: 'V', row: 1, col: 5, length: 2, isTarget: false },
      { id: 'f', color: '#98D8C8', orientation: 'H', row: 4, col: 2, length: 2, isTarget: false },
      { id: 'g', color: '#F7DC6F', orientation: 'V', row: 3, col: 5, length: 3, isTarget: false },
    ],
  },
  {
    id: 26, size: 6, exitRow: 2, par: 8,
    vehicles: [
      { id: 'target', color: '#FF4444', orientation: 'H', row: 2, col: 0, length: 2, isTarget: true },
      { id: 'a', color: '#4ECDC4', orientation: 'V', row: 0, col: 2, length: 2, isTarget: false },
      { id: 'b', color: '#45B7D1', orientation: 'H', row: 0, col: 3, length: 2, isTarget: false },
      { id: 'c', color: '#96CEB4', orientation: 'V', row: 0, col: 5, length: 2, isTarget: false },
      { id: 'd', color: '#FFEAA7', orientation: 'V', row: 2, col: 2, length: 2, isTarget: false },
      { id: 'e', color: '#DDA0DD', orientation: 'H', row: 2, col: 3, length: 2, isTarget: false },
      { id: 'f', color: '#98D8C8', orientation: 'V', row: 2, col: 5, length: 2, isTarget: false },
      { id: 'g', color: '#F7DC6F', orientation: 'H', row: 4, col: 2, length: 3, isTarget: false },
      { id: 'h', color: '#BB8FCE', orientation: 'V', row: 4, col: 5, length: 2, isTarget: false },
    ],
  },
  {
    id: 27, size: 6, exitRow: 2, par: 8,
    vehicles: [
      { id: 'target', color: '#FF4444', orientation: 'H', row: 2, col: 0, length: 2, isTarget: true },
      { id: 'a', color: '#4ECDC4', orientation: 'V', row: 1, col: 2, length: 2, isTarget: false },
      { id: 'b', color: '#45B7D1', orientation: 'H', row: 0, col: 2, length: 3, isTarget: false },
      { id: 'c', color: '#96CEB4', orientation: 'V', row: 1, col: 5, length: 3, isTarget: false },
      { id: 'd', color: '#FFEAA7', orientation: 'H', row: 3, col: 2, length: 2, isTarget: false },
      { id: 'e', color: '#DDA0DD', orientation: 'V', row: 3, col: 4, length: 2, isTarget: false },
      { id: 'f', color: '#98D8C8', orientation: 'H', row: 5, col: 2, length: 3, isTarget: false },
    ],
  },
  {
    id: 28, size: 6, exitRow: 2, par: 9,
    vehicles: [
      { id: 'target', color: '#FF4444', orientation: 'H', row: 2, col: 0, length: 2, isTarget: true },
      { id: 'a', color: '#4ECDC4', orientation: 'V', row: 0, col: 2, length: 3, isTarget: false },
      { id: 'b', color: '#45B7D1', orientation: 'V', row: 3, col: 2, length: 2, isTarget: false },
      { id: 'c', color: '#96CEB4', orientation: 'H', row: 3, col: 3, length: 2, isTarget: false },
      { id: 'd', color: '#FFEAA7', orientation: 'V', row: 0, col: 3, length: 2, isTarget: false },
      { id: 'e', color: '#DDA0DD', orientation: 'H', row: 0, col: 4, length: 2, isTarget: false },
      { id: 'f', color: '#98D8C8', orientation: 'V', row: 1, col: 5, length: 3, isTarget: false },
      { id: 'g', color: '#F7DC6F', orientation: 'H', row: 5, col: 0, length: 3, isTarget: false },
      { id: 'h', color: '#BB8FCE', orientation: 'V', row: 4, col: 3, length: 2, isTarget: false },
    ],
  },
  {
    id: 29, size: 6, exitRow: 2, par: 9,
    vehicles: [
      { id: 'target', color: '#FF4444', orientation: 'H', row: 2, col: 0, length: 2, isTarget: true },
      { id: 'a', color: '#4ECDC4', orientation: 'V', row: 0, col: 2, length: 2, isTarget: false },
      { id: 'b', color: '#45B7D1', orientation: 'V', row: 2, col: 2, length: 2, isTarget: false },
      { id: 'c', color: '#96CEB4', orientation: 'V', row: 4, col: 2, length: 2, isTarget: false },
      { id: 'd', color: '#FFEAA7', orientation: 'H', row: 0, col: 3, length: 3, isTarget: false },
      { id: 'e', color: '#DDA0DD', orientation: 'H', row: 2, col: 3, length: 2, isTarget: false },
      { id: 'f', color: '#98D8C8', orientation: 'H', row: 4, col: 3, length: 3, isTarget: false },
      { id: 'g', color: '#F7DC6F', orientation: 'V', row: 1, col: 5, length: 2, isTarget: false },
      { id: 'h', color: '#BB8FCE', orientation: 'V', row: 3, col: 5, length: 2, isTarget: false },
    ],
  },
  {
    id: 30, size: 6, exitRow: 2, par: 9,
    vehicles: [
      { id: 'target', color: '#FF4444', orientation: 'H', row: 2, col: 0, length: 2, isTarget: true },
      { id: 'a', color: '#4ECDC4', orientation: 'V', row: 0, col: 2, length: 3, isTarget: false },
      { id: 'b', color: '#45B7D1', orientation: 'V', row: 3, col: 2, length: 3, isTarget: false },
      { id: 'c', color: '#96CEB4', orientation: 'H', row: 0, col: 3, length: 2, isTarget: false },
      { id: 'd', color: '#FFEAA7', orientation: 'H', row: 5, col: 3, length: 2, isTarget: false },
      { id: 'e', color: '#DDA0DD', orientation: 'V', row: 0, col: 5, length: 3, isTarget: false },
      { id: 'f', color: '#98D8C8', orientation: 'V', row: 3, col: 5, length: 3, isTarget: false },
      { id: 'g', color: '#F7DC6F', orientation: 'H', row: 3, col: 3, length: 2, isTarget: false },
      { id: 'h', color: '#BB8FCE', orientation: 'H', row: 1, col: 3, length: 2, isTarget: false },
    ],
  },
  {
    id: 31, size: 6, exitRow: 2, par: 9,
    vehicles: [
      { id: 'target', color: '#FF4444', orientation: 'H', row: 2, col: 0, length: 2, isTarget: true },
      { id: 'a', color: '#4ECDC4', orientation: 'V', row: 0, col: 2, length: 2, isTarget: false },
      { id: 'b', color: '#45B7D1', orientation: 'H', row: 0, col: 3, length: 2, isTarget: false },
      { id: 'c', color: '#96CEB4', orientation: 'V', row: 2, col: 2, length: 2, isTarget: false },
      { id: 'd', color: '#FFEAA7', orientation: 'H', row: 2, col: 3, length: 3, isTarget: false },
      { id: 'e', color: '#DDA0DD', orientation: 'V', row: 4, col: 2, length: 2, isTarget: false },
      { id: 'f', color: '#98D8C8', orientation: 'H', row: 4, col: 3, length: 2, isTarget: false },
      { id: 'g', color: '#F7DC6F', orientation: 'V', row: 0, col: 5, length: 2, isTarget: false },
      { id: 'h', color: '#BB8FCE', orientation: 'V', row: 2, col: 5, length: 2, isTarget: false },
    ],
  },
  {
    id: 32, size: 6, exitRow: 2, par: 9,
    vehicles: [
      { id: 'target', color: '#FF4444', orientation: 'H', row: 2, col: 0, length: 2, isTarget: true },
      { id: 'a', color: '#4ECDC4', orientation: 'V', row: 0, col: 2, length: 3, isTarget: false },
      { id: 'b', color: '#45B7D1', orientation: 'H', row: 3, col: 2, length: 2, isTarget: false },
      { id: 'c', color: '#96CEB4', orientation: 'V', row: 3, col: 4, length: 3, isTarget: false },
      { id: 'd', color: '#FFEAA7', orientation: 'H', row: 0, col: 3, length: 3, isTarget: false },
      { id: 'e', color: '#DDA0DD', orientation: 'V', row: 1, col: 5, length: 2, isTarget: false },
      { id: 'f', color: '#98D8C8', orientation: 'H', row: 5, col: 2, length: 3, isTarget: false },
    ],
  },
  {
    id: 33, size: 6, exitRow: 2, par: 9,
    vehicles: [
      { id: 'target', color: '#FF4444', orientation: 'H', row: 2, col: 0, length: 2, isTarget: true },
      { id: 'a', color: '#4ECDC4', orientation: 'H', row: 0, col: 0, length: 2, isTarget: false },
      { id: 'b', color: '#45B7D1', orientation: 'V', row: 0, col: 2, length: 3, isTarget: false },
      { id: 'c', color: '#96CEB4', orientation: 'H', row: 0, col: 3, length: 2, isTarget: false },
      { id: 'd', color: '#FFEAA7', orientation: 'V', row: 0, col: 5, length: 2, isTarget: false },
      { id: 'e', color: '#DDA0DD', orientation: 'V', row: 3, col: 2, length: 3, isTarget: false },
      { id: 'f', color: '#98D8C8', orientation: 'H', row: 3, col: 3, length: 3, isTarget: false },
      { id: 'g', color: '#F7DC6F', orientation: 'V', row: 2, col: 5, length: 2, isTarget: false },
      { id: 'h', color: '#BB8FCE', orientation: 'V', row: 4, col: 5, length: 2, isTarget: false },
    ],
  },
  {
    id: 34, size: 6, exitRow: 2, par: 9,
    vehicles: [
      { id: 'target', color: '#FF4444', orientation: 'H', row: 2, col: 0, length: 2, isTarget: true },
      { id: 'a', color: '#4ECDC4', orientation: 'V', row: 0, col: 2, length: 2, isTarget: false },
      { id: 'b', color: '#45B7D1', orientation: 'H', row: 0, col: 3, length: 2, isTarget: false },
      { id: 'c', color: '#96CEB4', orientation: 'V', row: 0, col: 5, length: 3, isTarget: false },
      { id: 'd', color: '#FFEAA7', orientation: 'V', row: 2, col: 2, length: 3, isTarget: false },
      { id: 'e', color: '#DDA0DD', orientation: 'H', row: 2, col: 3, length: 2, isTarget: false },
      { id: 'f', color: '#98D8C8', orientation: 'V', row: 3, col: 5, length: 3, isTarget: false },
      { id: 'g', color: '#F7DC6F', orientation: 'H', row: 5, col: 3, length: 2, isTarget: false },
    ],
  },
  {
    id: 35, size: 6, exitRow: 2, par: 9,
    vehicles: [
      { id: 'target', color: '#FF4444', orientation: 'H', row: 2, col: 0, length: 2, isTarget: true },
      { id: 'a', color: '#4ECDC4', orientation: 'V', row: 0, col: 2, length: 3, isTarget: false },
      { id: 'b', color: '#45B7D1', orientation: 'H', row: 0, col: 3, length: 3, isTarget: false },
      { id: 'c', color: '#96CEB4', orientation: 'V', row: 1, col: 3, length: 2, isTarget: false },
      { id: 'd', color: '#FFEAA7', orientation: 'V', row: 3, col: 2, length: 2, isTarget: false },
      { id: 'e', color: '#DDA0DD', orientation: 'H', row: 3, col: 3, length: 2, isTarget: false },
      { id: 'f', color: '#98D8C8', orientation: 'V', row: 1, col: 5, length: 3, isTarget: false },
      { id: 'g', color: '#F7DC6F', orientation: 'H', row: 5, col: 2, length: 3, isTarget: false },
    ],
  },
  {
    id: 36, size: 6, exitRow: 2, par: 9,
    vehicles: [
      { id: 'target', color: '#FF4444', orientation: 'H', row: 2, col: 0, length: 2, isTarget: true },
      { id: 'a', color: '#4ECDC4', orientation: 'V', row: 0, col: 2, length: 2, isTarget: false },
      { id: 'b', color: '#45B7D1', orientation: 'H', row: 0, col: 3, length: 2, isTarget: false },
      { id: 'c', color: '#96CEB4', orientation: 'V', row: 0, col: 5, length: 2, isTarget: false },
      { id: 'd', color: '#FFEAA7', orientation: 'V', row: 2, col: 2, length: 2, isTarget: false },
      { id: 'e', color: '#DDA0DD', orientation: 'H', row: 2, col: 3, length: 3, isTarget: false },
      { id: 'f', color: '#98D8C8', orientation: 'V', row: 2, col: 5, length: 2, isTarget: false },
      { id: 'g', color: '#F7DC6F', orientation: 'V', row: 4, col: 2, length: 2, isTarget: false },
      { id: 'h', color: '#BB8FCE', orientation: 'H', row: 4, col: 3, length: 2, isTarget: false },
      { id: 'i', color: '#85C1E9', orientation: 'V', row: 4, col: 5, length: 2, isTarget: false },
    ],
  },
  {
    id: 37, size: 6, exitRow: 2, par: 9,
    vehicles: [
      { id: 'target', color: '#FF4444', orientation: 'H', row: 2, col: 0, length: 2, isTarget: true },
      { id: 'a', color: '#4ECDC4', orientation: 'V', row: 0, col: 2, length: 3, isTarget: false },
      { id: 'b', color: '#45B7D1', orientation: 'V', row: 3, col: 2, length: 2, isTarget: false },
      { id: 'c', color: '#96CEB4', orientation: 'H', row: 3, col: 3, length: 2, isTarget: false },
      { id: 'd', color: '#FFEAA7', orientation: 'V', row: 5, col: 2, length: 2, isTarget: false },
      { id: 'e', color: '#DDA0DD', orientation: 'H', row: 0, col: 3, length: 2, isTarget: false },
      { id: 'f', color: '#98D8C8', orientation: 'V', row: 0, col: 5, length: 2, isTarget: false },
      { id: 'g', color: '#F7DC6F', orientation: 'V', row: 2, col: 5, length: 2, isTarget: false },
      { id: 'h', color: '#BB8FCE', orientation: 'V', row: 4, col: 5, length: 2, isTarget: false },
    ],
  },
  {
    id: 38, size: 6, exitRow: 2, par: 9,
    vehicles: [
      { id: 'target', color: '#FF4444', orientation: 'H', row: 2, col: 0, length: 2, isTarget: true },
      { id: 'a', color: '#4ECDC4', orientation: 'H', row: 0, col: 0, length: 3, isTarget: false },
      { id: 'b', color: '#45B7D1', orientation: 'V', row: 0, col: 3, length: 3, isTarget: false },
      { id: 'c', color: '#96CEB4', orientation: 'H', row: 0, col: 4, length: 2, isTarget: false },
      { id: 'd', color: '#FFEAA7', orientation: 'V', row: 1, col: 2, length: 2, isTarget: false },
      { id: 'e', color: '#DDA0DD', orientation: 'V', row: 1, col: 5, length: 2, isTarget: false },
      { id: 'f', color: '#98D8C8', orientation: 'H', row: 3, col: 2, length: 3, isTarget: false },
      { id: 'g', color: '#F7DC6F', orientation: 'V', row: 3, col: 5, length: 3, isTarget: false },
      { id: 'h', color: '#BB8FCE', orientation: 'H', row: 5, col: 0, length: 3, isTarget: false },
    ],
  },
  {
    id: 39, size: 6, exitRow: 2, par: 9,
    vehicles: [
      { id: 'target', color: '#FF4444', orientation: 'H', row: 2, col: 0, length: 2, isTarget: true },
      { id: 'a', color: '#4ECDC4', orientation: 'V', row: 0, col: 2, length: 2, isTarget: false },
      { id: 'b', color: '#45B7D1', orientation: 'H', row: 0, col: 3, length: 3, isTarget: false },
      { id: 'c', color: '#96CEB4', orientation: 'V', row: 2, col: 2, length: 3, isTarget: false },
      { id: 'd', color: '#FFEAA7', orientation: 'H', row: 2, col: 3, length: 2, isTarget: false },
      { id: 'e', color: '#DDA0DD', orientation: 'V', row: 0, col: 5, length: 2, isTarget: false },
      { id: 'f', color: '#98D8C8', orientation: 'V', row: 2, col: 5, length: 2, isTarget: false },
      { id: 'g', color: '#F7DC6F', orientation: 'V', row: 4, col: 5, length: 2, isTarget: false },
      { id: 'h', color: '#BB8FCE', orientation: 'H', row: 5, col: 2, length: 3, isTarget: false },
    ],
  },
  {
    id: 40, size: 6, exitRow: 2, par: 9,
    vehicles: [
      { id: 'target', color: '#FF4444', orientation: 'H', row: 2, col: 0, length: 2, isTarget: true },
      { id: 'a', color: '#4ECDC4', orientation: 'V', row: 0, col: 2, length: 3, isTarget: false },
      { id: 'b', color: '#45B7D1', orientation: 'V', row: 3, col: 2, length: 3, isTarget: false },
      { id: 'c', color: '#96CEB4', orientation: 'H', row: 0, col: 3, length: 3, isTarget: false },
      { id: 'd', color: '#FFEAA7', orientation: 'H', row: 5, col: 3, length: 3, isTarget: false },
      { id: 'e', color: '#DDA0DD', orientation: 'V', row: 1, col: 5, length: 2, isTarget: false },
      { id: 'f', color: '#98D8C8', orientation: 'V', row: 3, col: 5, length: 2, isTarget: false },
      { id: 'g', color: '#F7DC6F', orientation: 'H', row: 2, col: 3, length: 2, isTarget: false },
    ],
  },
  // Levels 41-100: medium
  {
    id: 41, size: 6, exitRow: 2, par: 10,
    vehicles: [
      { id: 'target', color: '#FF4444', orientation: 'H', row: 2, col: 0, length: 2, isTarget: true },
      { id: 'a', color: '#4ECDC4', orientation: 'V', row: 0, col: 2, length: 2, isTarget: false },
      { id: 'b', color: '#45B7D1', orientation: 'H', row: 0, col: 3, length: 2, isTarget: false },
      { id: 'c', color: '#96CEB4', orientation: 'V', row: 0, col: 5, length: 3, isTarget: false },
      { id: 'd', color: '#FFEAA7', orientation: 'V', row: 2, col: 2, length: 2, isTarget: false },
      { id: 'e', color: '#DDA0DD', orientation: 'H', row: 2, col: 3, length: 2, isTarget: false },
      { id: 'f', color: '#98D8C8', orientation: 'V', row: 3, col: 5, length: 3, isTarget: false },
      { id: 'g', color: '#F7DC6F', orientation: 'H', row: 4, col: 2, length: 2, isTarget: false },
      { id: 'h', color: '#BB8FCE', orientation: 'H', row: 5, col: 2, length: 3, isTarget: false },
    ],
  },
  {
    id: 42, size: 6, exitRow: 2, par: 10,
    vehicles: [
      { id: 'target', color: '#FF4444', orientation: 'H', row: 2, col: 0, length: 2, isTarget: true },
      { id: 'a', color: '#4ECDC4', orientation: 'V', row: 0, col: 2, length: 3, isTarget: false },
      { id: 'b', color: '#45B7D1', orientation: 'H', row: 0, col: 3, length: 2, isTarget: false },
      { id: 'c', color: '#96CEB4', orientation: 'V', row: 0, col: 5, length: 2, isTarget: false },
      { id: 'd', color: '#FFEAA7', orientation: 'H', row: 1, col: 3, length: 2, isTarget: false },
      { id: 'e', color: '#DDA0DD', orientation: 'V', row: 2, col: 5, length: 2, isTarget: false },
      { id: 'f', color: '#98D8C8', orientation: 'V', row: 3, col: 2, length: 2, isTarget: false },
      { id: 'g', color: '#F7DC6F', orientation: 'H', row: 3, col: 3, length: 2, isTarget: false },
      { id: 'h', color: '#BB8FCE', orientation: 'V', row: 4, col: 5, length: 2, isTarget: false },
      { id: 'i', color: '#85C1E9', orientation: 'H', row: 5, col: 2, length: 3, isTarget: false },
    ],
  },
  {
    id: 43, size: 6, exitRow: 2, par: 10,
    vehicles: [
      { id: 'target', color: '#FF4444', orientation: 'H', row: 2, col: 0, length: 2, isTarget: true },
      { id: 'a', color: '#4ECDC4', orientation: 'H', row: 0, col: 0, length: 3, isTarget: false },
      { id: 'b', color: '#45B7D1', orientation: 'V', row: 0, col: 3, length: 2, isTarget: false },
      { id: 'c', color: '#96CEB4', orientation: 'H', row: 0, col: 4, length: 2, isTarget: false },
      { id: 'd', color: '#FFEAA7', orientation: 'V', row: 1, col: 2, length: 2, isTarget: false },
      { id: 'e', color: '#DDA0DD', orientation: 'V', row: 2, col: 3, length: 2, isTarget: false },
      { id: 'f', color: '#98D8C8', orientation: 'V', row: 1, col: 5, length: 3, isTarget: false },
      { id: 'g', color: '#F7DC6F', orientation: 'H', row: 4, col: 2, length: 2, isTarget: false },
      { id: 'h', color: '#BB8FCE', orientation: 'H', row: 5, col: 0, length: 3, isTarget: false },
    ],
  },
  {
    id: 44, size: 6, exitRow: 2, par: 10,
    vehicles: [
      { id: 'target', color: '#FF4444', orientation: 'H', row: 2, col: 0, length: 2, isTarget: true },
      { id: 'a', color: '#4ECDC4', orientation: 'V', row: 0, col: 2, length: 2, isTarget: false },
      { id: 'b', color: '#45B7D1', orientation: 'H', row: 0, col: 3, length: 3, isTarget: false },
      { id: 'c', color: '#96CEB4', orientation: 'V', row: 1, col: 2, length: 2, isTarget: false },
      { id: 'd', color: '#FFEAA7', orientation: 'V', row: 1, col: 4, length: 2, isTarget: false },
      { id: 'e', color: '#DDA0DD', orientation: 'V', row: 1, col: 5, length: 2, isTarget: false },
      { id: 'f', color: '#98D8C8', orientation: 'H', row: 3, col: 2, length: 2, isTarget: false },
      { id: 'g', color: '#F7DC6F', orientation: 'V', row: 3, col: 4, length: 2, isTarget: false },
      { id: 'h', color: '#BB8FCE', orientation: 'V', row: 3, col: 5, length: 3, isTarget: false },
      { id: 'i', color: '#85C1E9', orientation: 'H', row: 5, col: 0, length: 2, isTarget: false },
    ],
  },
  {
    id: 45, size: 6, exitRow: 2, par: 11,
    vehicles: [
      { id: 'target', color: '#FF4444', orientation: 'H', row: 2, col: 0, length: 2, isTarget: true },
      { id: 'a', color: '#4ECDC4', orientation: 'V', row: 0, col: 2, length: 3, isTarget: false },
      { id: 'b', color: '#45B7D1', orientation: 'H', row: 0, col: 3, length: 3, isTarget: false },
      { id: 'c', color: '#96CEB4', orientation: 'V', row: 1, col: 3, length: 2, isTarget: false },
      { id: 'd', color: '#FFEAA7', orientation: 'V', row: 1, col: 5, length: 2, isTarget: false },
      { id: 'e', color: '#DDA0DD', orientation: 'V', row: 3, col: 2, length: 3, isTarget: false },
      { id: 'f', color: '#98D8C8', orientation: 'H', row: 3, col: 3, length: 2, isTarget: false },
      { id: 'g', color: '#F7DC6F', orientation: 'V', row: 3, col: 5, length: 2, isTarget: false },
      { id: 'h', color: '#BB8FCE', orientation: 'H', row: 5, col: 3, length: 3, isTarget: false },
    ],
  },
  {
    id: 46, size: 6, exitRow: 2, par: 11,
    vehicles: [
      { id: 'target', color: '#FF4444', orientation: 'H', row: 2, col: 0, length: 2, isTarget: true },
      { id: 'a', color: '#4ECDC4', orientation: 'V', row: 0, col: 2, length: 2, isTarget: false },
      { id: 'b', color: '#45B7D1', orientation: 'H', row: 0, col: 3, length: 2, isTarget: false },
      { id: 'c', color: '#96CEB4', orientation: 'V', row: 0, col: 5, length: 2, isTarget: false },
      { id: 'd', color: '#FFEAA7', orientation: 'V', row: 2, col: 2, length: 2, isTarget: false },
      { id: 'e', color: '#DDA0DD', orientation: 'H', row: 2, col: 3, length: 2, isTarget: false },
      { id: 'f', color: '#98D8C8', orientation: 'V', row: 2, col: 5, length: 2, isTarget: false },
      { id: 'g', color: '#F7DC6F', orientation: 'V', row: 4, col: 2, length: 2, isTarget: false },
      { id: 'h', color: '#BB8FCE', orientation: 'H', row: 4, col: 3, length: 3, isTarget: false },
      { id: 'i', color: '#85C1E9', orientation: 'V', row: 4, col: 5, length: 2, isTarget: false },
    ],
  },
  {
    id: 47, size: 6, exitRow: 2, par: 11,
    vehicles: [
      { id: 'target', color: '#FF4444', orientation: 'H', row: 2, col: 0, length: 2, isTarget: true },
      { id: 'a', color: '#4ECDC4', orientation: 'H', row: 0, col: 0, length: 2, isTarget: false },
      { id: 'b', color: '#45B7D1', orientation: 'V', row: 0, col: 2, length: 3, isTarget: false },
      { id: 'c', color: '#96CEB4', orientation: 'H', row: 0, col: 3, length: 3, isTarget: false },
      { id: 'd', color: '#FFEAA7', orientation: 'V', row: 1, col: 5, length: 2, isTarget: false },
      { id: 'e', color: '#DDA0DD', orientation: 'V', row: 3, col: 2, length: 3, isTarget: false },
      { id: 'f', color: '#98D8C8', orientation: 'H', row: 3, col: 3, length: 2, isTarget: false },
      { id: 'g', color: '#F7DC6F', orientation: 'V', row: 3, col: 5, length: 3, isTarget: false },
      { id: 'h', color: '#BB8FCE', orientation: 'H', row: 5, col: 0, length: 3, isTarget: false },
    ],
  },
  {
    id: 48, size: 6, exitRow: 2, par: 11,
    vehicles: [
      { id: 'target', color: '#FF4444', orientation: 'H', row: 2, col: 0, length: 2, isTarget: true },
      { id: 'a', color: '#4ECDC4', orientation: 'V', row: 0, col: 2, length: 2, isTarget: false },
      { id: 'b', color: '#45B7D1', orientation: 'H', row: 0, col: 3, length: 2, isTarget: false },
      { id: 'c', color: '#96CEB4', orientation: 'V', row: 0, col: 5, length: 3, isTarget: false },
      { id: 'd', color: '#FFEAA7', orientation: 'V', row: 2, col: 2, length: 3, isTarget: false },
      { id: 'e', color: '#DDA0DD', orientation: 'H', row: 2, col: 3, length: 2, isTarget: false },
      { id: 'f', color: '#98D8C8', orientation: 'V', row: 3, col: 5, length: 3, isTarget: false },
      { id: 'g', color: '#F7DC6F', orientation: 'H', row: 5, col: 3, length: 2, isTarget: false },
    ],
  },
  {
    id: 49, size: 6, exitRow: 2, par: 11,
    vehicles: [
      { id: 'target', color: '#FF4444', orientation: 'H', row: 2, col: 0, length: 2, isTarget: true },
      { id: 'a', color: '#4ECDC4', orientation: 'V', row: 0, col: 2, length: 3, isTarget: false },
      { id: 'b', color: '#45B7D1', orientation: 'V', row: 3, col: 2, length: 3, isTarget: false },
      { id: 'c', color: '#96CEB4', orientation: 'H', row: 0, col: 3, length: 2, isTarget: false },
      { id: 'd', color: '#FFEAA7', orientation: 'V', row: 0, col: 5, length: 2, isTarget: false },
      { id: 'e', color: '#DDA0DD', orientation: 'H', row: 1, col: 3, length: 2, isTarget: false },
      { id: 'f', color: '#98D8C8', orientation: 'V', row: 2, col: 5, length: 2, isTarget: false },
      { id: 'g', color: '#F7DC6F', orientation: 'H', row: 3, col: 3, length: 2, isTarget: false },
      { id: 'h', color: '#BB8FCE', orientation: 'V', row: 4, col: 5, length: 2, isTarget: false },
      { id: 'i', color: '#85C1E9', orientation: 'H', row: 5, col: 0, length: 3, isTarget: false },
    ],
  },
  {
    id: 50, size: 6, exitRow: 2, par: 12,
    vehicles: [
      { id: 'target', color: '#FF4444', orientation: 'H', row: 2, col: 0, length: 2, isTarget: true },
      { id: 'a', color: '#4ECDC4', orientation: 'V', row: 0, col: 2, length: 2, isTarget: false },
      { id: 'b', color: '#45B7D1', orientation: 'H', row: 0, col: 3, length: 2, isTarget: false },
      { id: 'c', color: '#96CEB4', orientation: 'V', row: 0, col: 5, length: 2, isTarget: false },
      { id: 'd', color: '#FFEAA7', orientation: 'V', row: 2, col: 2, length: 2, isTarget: false },
      { id: 'e', color: '#DDA0DD', orientation: 'H', row: 2, col: 3, length: 2, isTarget: false },
      { id: 'f', color: '#98D8C8', orientation: 'V', row: 2, col: 5, length: 2, isTarget: false },
      { id: 'g', color: '#F7DC6F', orientation: 'V', row: 4, col: 2, length: 2, isTarget: false },
      { id: 'h', color: '#BB8FCE', orientation: 'H', row: 4, col: 3, length: 2, isTarget: false },
      { id: 'i', color: '#85C1E9', orientation: 'V', row: 4, col: 5, length: 2, isTarget: false },
      { id: 'j', color: '#82E0AA', orientation: 'H', row: 0, col: 0, length: 2, isTarget: false },
    ],
  },
];

// Generate additional levels 51-200 algorithmically based on templates
function generateLevel(id: number): Level {
  const seed = id * 7919;
  const rng = (max: number) => Math.abs((seed * (id + 3)) % max);
  
  const exitRow = 2 + (rng(3));
  const targetCol = rng(3);
  
  const usedCells = new Set<string>();
  const markCells = (row: number, col: number, length: number, orientation: 'H' | 'V') => {
    for (let i = 0; i < length; i++) {
      if (orientation === 'H') usedCells.add(`${row},${col + i}`);
      else usedCells.add(`${row + i},${col}`);
    }
  };
  const canPlace = (row: number, col: number, length: number, orientation: 'H' | 'V'): boolean => {
    for (let i = 0; i < length; i++) {
      const r = orientation === 'H' ? row : row + i;
      const c = orientation === 'H' ? col + i : col;
      if (r < 0 || r >= 6 || c < 0 || c >= 6) return false;
      if (usedCells.has(`${r},${c}`)) return false;
    }
    return true;
  };

  const vehicles: Vehicle[] = [];
  
  // Place target
  if (canPlace(exitRow, targetCol, 2, 'H')) {
    vehicles.push({ id: 'target', color: '#FF4444', orientation: 'H', row: exitRow, col: targetCol, length: 2, isTarget: true });
    markCells(exitRow, targetCol, 2, 'H');
  } else {
    vehicles.push({ id: 'target', color: '#FF4444', orientation: 'H', row: 2, col: 0, length: 2, isTarget: true });
    markCells(2, 0, 2, 'H');
  }

  const carColors = ['#4ECDC4','#45B7D1','#96CEB4','#FFEAA7','#DDA0DD','#98D8C8','#F7DC6F','#BB8FCE','#85C1E9','#82E0AA'];
  const numVehicles = Math.min(5 + Math.floor((id - 50) / 15), 10);
  
  let colorIdx = 0;
  let attempts = 0;
  while (vehicles.length - 1 < numVehicles && attempts < 100) {
    attempts++;
    const orientation: 'H' | 'V' = ((seed + attempts) % 2 === 0) ? 'H' : 'V';
    const length: 2 | 3 = ((seed + attempts) % 3 === 0) ? 3 : 2;
    const row = Math.abs((seed * attempts + attempts) % 6);
    const col = Math.abs((seed + attempts * 3) % 6);
    
    if (canPlace(row, col, length, orientation)) {
      vehicles.push({
        id: String.fromCharCode(97 + vehicles.length - 1),
        color: carColors[colorIdx % carColors.length],
        orientation,
        row,
        col,
        length,
        isTarget: false,
      });
      markCells(row, col, length, orientation);
      colorIdx++;
    }
  }

  const difficulty = id <= 100 ? 12 : id <= 150 ? 18 : 25;
  return { id, size: 6, exitRow: vehicles[0].row, vehicles, par: difficulty };
}

// Fill levels 51-200
for (let i = 51; i <= 200; i++) {
  LEVELS.push(generateLevel(i));
}

export const getTotalLevels = () => LEVELS.length;
export const getLevel = (id: number): Level | undefined => LEVELS.find(l => l.id === id);
