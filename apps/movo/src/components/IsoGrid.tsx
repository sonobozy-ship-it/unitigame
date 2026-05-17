import React from 'react';
import { G, Polygon, Defs, LinearGradient, Stop } from 'react-native-svg';
import { COLORS } from '../constants/colors';
import { useIsoLayout, makeToIso } from '../constants/isoLayout';

interface IsoGridProps {
  size: number;
  exitRow: number;
}

export function IsoGrid({ size, exitRow }: IsoGridProps) {
  const layout = useIsoLayout();
  const toIso = makeToIso(layout);
  const { TW, TH } = layout;

  const tiles: React.ReactNode[] = [];

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const { x, y } = toIso(row, col);
      const isExit = row === exitRow && col === size - 1;
      const isDark = (row + col) % 2 === 1;
      const fill = isExit ? COLORS.water : isDark ? '#1C3D5A' : '#1A4A6E';
      const hw = TW / 2;
      const hh = TH / 2;
      const pts = `${x},${y - hh} ${x + hw},${y} ${x},${y + hh} ${x - hw},${y}`;

      tiles.push(
        <Polygon
          key={`tile-${row}-${col}`}
          points={pts}
          fill={fill}
          stroke={COLORS.tileEdge}
          strokeWidth={1}
        />,
      );
    }
  }

  const exitPos = toIso(exitRow, size - 1);
  const arrowX = exitPos.x + TW / 2 + 4;
  const arrowY = exitPos.y;
  const aw = Math.max(10, TW / 4);
  const ah = Math.max(6, TH / 3);

  return (
    <G>
      <Defs>
        <LinearGradient id="exitGrad" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#00FF88" stopOpacity="0.6" />
          <Stop offset="1" stopColor="#00FF88" stopOpacity="0" />
        </LinearGradient>
      </Defs>
      {tiles}
      <Polygon
        points={`${arrowX},${arrowY - ah} ${arrowX + aw},${arrowY} ${arrowX},${arrowY + ah}`}
        fill="#00FF88"
        opacity={0.9}
      />
    </G>
  );
}
