import React from 'react';
import { G, Polygon, Defs, LinearGradient, Stop } from 'react-native-svg';
import { COLORS } from '../constants/colors';
import { TILE_W, TILE_H, BOARD_ORIGIN_X, BOARD_ORIGIN_Y } from '../constants/theme';

interface IsoGridProps {
  size: number;
  exitRow: number;
}

export function toIso(row: number, col: number): { x: number; y: number } {
  return {
    x: BOARD_ORIGIN_X + (col - row) * (TILE_W / 2),
    y: BOARD_ORIGIN_Y + (col + row) * (TILE_H / 2),
  };
}

function diamondPoints(x: number, y: number): string {
  const hw = TILE_W / 2;
  const hh = TILE_H / 2;
  return `${x},${y - hh} ${x + hw},${y} ${x},${y + hh} ${x - hw},${y}`;
}

export function IsoGrid({ size, exitRow }: IsoGridProps) {
  const tiles: React.ReactNode[] = [];

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const { x, y } = toIso(row, col);
      const isExit = row === exitRow && col === size - 1;
      const isDark = (row + col) % 2 === 1;
      const fill = isExit ? COLORS.water : isDark ? '#1C3D5A' : '#1A4A6E';
      const stroke = COLORS.tileEdge;

      tiles.push(
        <Polygon
          key={`tile-${row}-${col}`}
          points={diamondPoints(x, y)}
          fill={fill}
          stroke={stroke}
          strokeWidth={1}
        />
      );
    }
  }

  // Exit arrow on right edge at exitRow
  const exitPos = toIso(exitRow, size - 1);
  const arrowX = exitPos.x + TILE_W / 2 + 4;
  const arrowY = exitPos.y;

  return (
    <G>
      <Defs>
        <LinearGradient id="exitGrad" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#00FF88" stopOpacity="0.6" />
          <Stop offset="1" stopColor="#00FF88" stopOpacity="0" />
        </LinearGradient>
      </Defs>
      {tiles}
      {/* Exit indicator arrow */}
      <Polygon
        points={`${arrowX},${arrowY - 8} ${arrowX + 14},${arrowY} ${arrowX},${arrowY + 8}`}
        fill="#00FF88"
        opacity={0.9}
      />
    </G>
  );
}
