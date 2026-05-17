import React from 'react';
import { View, StyleSheet, useWindowDimensions, Pressable } from 'react-native';
import Svg, { Rect, Line, Polygon, Circle, Ellipse, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Level, SnakeDef, Wall, Direction } from '../data/levels';

interface GameBoardProps {
  level: Level;
  snakes: SnakeDef[];
  onTap: (id: string) => void;
  won: boolean;
}

function computeCell(screenW: number, screenH: number, size: number) {
  const avW = screenW - 32;
  const avH = screenH - 300; // header + moves + controls
  const fromW = Math.floor(avW / size);
  const fromH = Math.floor(avH / size);
  return Math.min(fromW, fromH, 72);
}

function headCell(s: SnakeDef): [number, number] {
  switch (s.direction) {
    case 'right': return [s.row, s.col + s.length - 1];
    case 'left':  return [s.row, s.col];
    case 'down':  return [s.row + s.length - 1, s.col];
    case 'up':    return [s.row, s.col];
  }
}

// ── Snake piece ────────────────────────────────────────────────
function SnakePiece({ snake, cs, ox, oy, onTap }: {
  snake: SnakeDef; cs: number; ox: number; oy: number;
  onTap: () => void;
}) {
  const p = 3;
  const isH = snake.direction === 'right' || snake.direction === 'left';
  const x  = ox + snake.col * cs + p;
  const y  = oy + snake.row * cs + p;
  const rw = isH ? snake.length * cs - 2 * p : cs - 2 * p;
  const rh = isH ? cs - 2 * p : snake.length * cs - 2 * p;
  const rx = Math.min(rw, rh) / 2;

  const [hr, hc] = headCell(snake);
  const hx = ox + hc * cs;
  const hy = oy + hr * cs;
  const hcx = hx + cs / 2;
  const hcy = hy + cs / 2;

  const er = Math.max(3, cs * 0.09);
  const eyeOff = cs * 0.18;

  // Eye positions relative to head center
  let e1x: number, e1y: number, e2x: number, e2y: number;
  let tx1: number, ty1: number, tx2: number, ty2: number, tx3: number, ty3: number;
  const tipDist = cs * 0.52;
  const forkSpread = cs * 0.12;
  const forkLen = cs * 0.12;

  switch (snake.direction) {
    case 'right':
      e1x = hcx + cs * 0.12; e1y = hcy - eyeOff;
      e2x = hcx + cs * 0.12; e2y = hcy + eyeOff;
      tx1 = hcx + tipDist; ty1 = hcy;
      tx2 = tx1 + forkLen; ty2 = ty1 - forkSpread;
      tx3 = tx1 + forkLen; ty3 = ty1 + forkSpread;
      break;
    case 'left':
      e1x = hcx - cs * 0.12; e1y = hcy - eyeOff;
      e2x = hcx - cs * 0.12; e2y = hcy + eyeOff;
      tx1 = hcx - tipDist; ty1 = hcy;
      tx2 = tx1 - forkLen; ty2 = ty1 - forkSpread;
      tx3 = tx1 - forkLen; ty3 = ty1 + forkSpread;
      break;
    case 'down':
      e1x = hcx - eyeOff; e1y = hcy + cs * 0.12;
      e2x = hcx + eyeOff; e2y = hcy + cs * 0.12;
      tx1 = hcx; ty1 = hcy + tipDist;
      tx2 = tx1 - forkSpread; ty2 = ty1 + forkLen;
      tx3 = tx1 + forkSpread; ty3 = ty1 + forkLen;
      break;
    case 'up':
      e1x = hcx - eyeOff; e1y = hcy - cs * 0.12;
      e2x = hcx + eyeOff; e2y = hcy - cs * 0.12;
      tx1 = hcx; ty1 = hcy - tipDist;
      tx2 = tx1 - forkSpread; ty2 = ty1 - forkLen;
      tx3 = tx1 + forkSpread; ty3 = ty1 - forkLen;
      break;
  }

  const gradId = `g_${snake.id}`;
  const isTarget = snake.isTarget;
  const col = snake.color;

  // Body scale lines
  const scales: React.ReactNode[] = [];
  const scaleCount = snake.length * 2;
  for (let i = 1; i < scaleCount; i++) {
    if (isH) {
      const sx = x + (rw / scaleCount) * i;
      scales.push(<Line key={i} x1={sx} y1={y + 2} x2={sx} y2={y + rh - 2} stroke={col} strokeWidth={0.8} opacity={0.25}/>);
    } else {
      const sy = y + (rh / scaleCount) * i;
      scales.push(<Line key={i} x1={x + 2} y1={sy} x2={x + rw - 2} y2={sy} stroke={col} strokeWidth={0.8} opacity={0.25}/>);
    }
  }

  return (
    <G onPress={onTap}>
      <Defs>
        <LinearGradient id={gradId} x1={isH ? '0%' : '0%'} y1={isH ? '0%' : '0%'} x2={isH ? '100%' : '0%'} y2={isH ? '0%' : '100%'}>
          <Stop offset="0%" stopColor={col} stopOpacity="0.7"/>
          <Stop offset="50%" stopColor={col} stopOpacity="1"/>
          <Stop offset="100%" stopColor={col} stopOpacity="0.6"/>
        </LinearGradient>
      </Defs>

      {/* Glow for target */}
      {isTarget && <Rect x={x - 3} y={y - 3} width={rw + 6} height={rh + 6} rx={rx + 3} fill="none" stroke={col} strokeWidth={3} opacity={0.4}/>}

      {/* Body */}
      <Rect x={x} y={y} width={rw} height={rh} rx={rx} fill={`url(#${gradId})`}/>

      {/* Scale detail */}
      {scales}

      {/* Head highlight */}
      <Rect x={hx + p + 1} y={hy + p + 1} width={cs - 2 * p - 2} height={cs - 2 * p - 2} rx={rx - 1} fill={col} opacity={0.3}/>

      {/* Tongue */}
      <Line x1={hcx} y1={hcy} x2={tx1} y2={ty1} stroke="#FF3366" strokeWidth={2} strokeLinecap="round"/>
      <Line x1={tx1} y1={ty1} x2={tx2} y2={ty2} stroke="#FF3366" strokeWidth={1.5} strokeLinecap="round"/>
      <Line x1={tx1} y1={ty1} x2={tx3} y2={ty3} stroke="#FF3366" strokeWidth={1.5} strokeLinecap="round"/>

      {/* Eyes white */}
      <Circle cx={e1x} cy={e1y} r={er} fill="white"/>
      <Circle cx={e2x} cy={e2y} r={er} fill="white"/>
      {/* Pupils */}
      <Circle cx={e1x} cy={e1y} r={er * 0.55} fill="#111"/>
      <Circle cx={e2x} cy={e2y} r={er * 0.55} fill="#111"/>
      {/* Shine */}
      <Circle cx={e1x - er * 0.3} cy={e1y - er * 0.3} r={er * 0.25} fill="white"/>
      <Circle cx={e2x - er * 0.3} cy={e2y - er * 0.3} r={er * 0.25} fill="white"/>

      {/* Target crown */}
      {isTarget && (
        <Polygon
          points={`${hcx - cs * 0.18},${hcy - cs * 0.42} ${hcx},${hcy - cs * 0.54} ${hcx + cs * 0.18},${hcy - cs * 0.42}`}
          fill="#FFD700" opacity={0.9}
        />
      )}
    </G>
  );
}

// ── Grid + walls ───────────────────────────────────────────────
function Grid({ size, cs, ox, oy, walls, exitSide, exitIndex }: {
  size: number; cs: number; ox: number; oy: number;
  walls: Wall[]; exitSide: string; exitIndex: number;
}) {
  const W = size * cs;
  const H = size * cs;
  const cells: React.ReactNode[] = [];

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const isExit = (exitSide === 'right' && r === exitIndex && c === size - 1) ||
                     (exitSide === 'bottom' && c === exitIndex && r === size - 1) ||
                     (exitSide === 'left' && r === exitIndex && c === 0) ||
                     (exitSide === 'top' && c === exitIndex && r === 0);
      cells.push(
        <Rect key={`c${r}${c}`}
          x={ox + c * cs} y={oy + r * cs} width={cs} height={cs}
          fill={(r + c) % 2 === 0 ? '#0E1A2A' : '#0A1420'}
          stroke={isExit ? '#00FF88' : 'none'}
          strokeWidth={2}
        />,
      );
    }
  }

  // Grid lines
  const lines: React.ReactNode[] = [];
  for (let i = 0; i <= size; i++) {
    lines.push(<Line key={`v${i}`} x1={ox + i * cs} y1={oy} x2={ox + i * cs} y2={oy + H} stroke="#1A3050" strokeWidth={0.8}/>);
    lines.push(<Line key={`h${i}`} x1={ox} y1={oy + i * cs} x2={ox + W} y2={oy + i * cs} stroke="#1A3050" strokeWidth={0.8}/>);
  }

  // Outer border
  const outerBorder = (
    <Rect x={ox} y={oy} width={W} height={H} rx={6} fill="none" stroke="#2A4A70" strokeWidth={2}/>
  );

  // Exit gap & glow
  let exitGap: React.ReactNode = null;
  const gapStart = exitIndex * cs;
  if (exitSide === 'right') {
    exitGap = (
      <G>
        <Rect x={ox + W - 1} y={oy + gapStart + 4} width={8} height={cs - 8} fill="#0A1420"/>
        <Rect x={ox + W + 2} y={oy + gapStart + 4} width={4} height={cs - 8} rx={2} fill="#00FF88" opacity={0.8}/>
        <Polygon points={`${ox + W + 8},${oy + gapStart + cs / 2 - 6} ${ox + W + 16},${oy + gapStart + cs / 2} ${ox + W + 8},${oy + gapStart + cs / 2 + 6}`} fill="#00FF88"/>
      </G>
    );
  } else if (exitSide === 'bottom') {
    exitGap = (
      <G>
        <Rect x={ox + gapStart + 4} y={oy + H - 1} width={cs - 8} height={8} fill="#0A1420"/>
        <Rect x={ox + gapStart + 4} y={oy + H + 2} width={cs - 8} height={4} rx={2} fill="#00FF88" opacity={0.8}/>
        <Polygon points={`${ox + gapStart + cs / 2 - 6},${oy + H + 8} ${ox + gapStart + cs / 2},${oy + H + 16} ${ox + gapStart + cs / 2 + 6},${oy + H + 8}`} fill="#00FF88"/>
      </G>
    );
  }

  // Maze walls (thick, accent-coloured)
  const wallLines = walls.map((wl, idx) => {
    let x1: number, y1: number, x2: number, y2: number;
    if (wl.r1 === wl.r2) {
      // horizontal wall between col wl.c1 and wl.c2 in same row
      const mx = ox + Math.max(wl.c1, wl.c2) * cs;
      x1 = mx; y1 = oy + wl.r1 * cs; x2 = mx; y2 = oy + (wl.r1 + 1) * cs;
    } else {
      // vertical wall between row wl.r1 and wl.r2 in same col
      const my = oy + Math.max(wl.r1, wl.r2) * cs;
      x1 = ox + wl.c1 * cs; y1 = my; x2 = ox + (wl.c1 + 1) * cs; y2 = my;
    }
    return <Line key={`w${idx}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#4A8AC8" strokeWidth={4} strokeLinecap="round"/>;
  });

  return (
    <G>
      {cells}
      {lines}
      {wallLines}
      {outerBorder}
      {exitGap}
    </G>
  );
}

// ── Main board ─────────────────────────────────────────────────
export function GameBoard({ level, snakes, onTap, won }: GameBoardProps) {
  const { width, height } = useWindowDimensions();
  const cs = computeCell(width, height, level.size);
  const gridW = level.size * cs;
  const gridH = level.size * cs;
  const ox = Math.floor((width - gridW) / 2);
  const oy = 0;
  const svgH = gridH + 24;

  const sorted = [...snakes].sort((a, b) => {
    const ad = a.direction === 'right' || a.direction === 'down' ? 1 : 0;
    const bd = b.direction === 'right' || b.direction === 'down' ? 1 : 0;
    return ad - bd;
  });

  return (
    <View style={[styles.container, { height: svgH }]}>
      <Svg width={width} height={svgH}>
        <Grid
          size={level.size} cs={cs} ox={ox} oy={oy}
          walls={level.walls}
          exitSide={level.exitSide}
          exitIndex={level.exitIndex}
        />
        {sorted.map(snake => (
          <SnakePiece
            key={snake.id}
            snake={snake} cs={cs} ox={ox} oy={oy}
            onTap={() => !won && onTap(snake.id)}
          />
        ))}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%' },
});
