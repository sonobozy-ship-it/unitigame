import React, { useRef } from 'react';
import { View, StyleSheet, useWindowDimensions, Pressable, Animated } from 'react-native';
import Svg, { Rect, Line, Polygon, Circle, G, Polyline } from 'react-native-svg';
import {
  PinchGestureHandler,
  State,
} from 'react-native-gesture-handler';
import type {
  PinchGestureHandlerStateChangeEvent,
  PinchGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import { Level, SnakeDef, Direction } from '../data/levels';

interface GameBoardProps {
  level: Level;
  snakes: SnakeDef[];
  onTap: (id: string) => void;
  won: boolean;
}

function computeCell(screenW: number, screenH: number, size: number): number {
  const fromW = Math.floor((screenW - 32) / size);
  const fromH = Math.floor((screenH - 320) / size);
  return Math.min(fromW, fromH, 60);
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

// ── Snake piece ────────────────────────────────────────────────
function SnakePiece({ snake, cs, ox, oy, onTap }: {
  snake: SnakeDef; cs: number; ox: number; oy: number;
  onTap: () => void;
}) {
  const dir = dirOf(snake);
  const col = snake.color;
  const isTarget = snake.isTarget;

  // Build polyline points through all cell centers
  const points = snake.cells
    .map(([r, c]) => `${ox + c * cs + cs / 2},${oy + r * cs + cs / 2}`)
    .join(' ');

  const strokeW = cs * 0.55;

  // Head cell
  const head = snake.cells[snake.cells.length - 1];
  const hcx = ox + head[1] * cs + cs / 2;
  const hcy = ox + head[0] * cs + cs / 2; // Note: using oy below properly
  const hcxReal = ox + head[1] * cs + cs / 2;
  const hcyReal = oy + head[0] * cs + cs / 2;

  // Eye positions
  const er = Math.max(2, cs * 0.09);
  const eyeOff = cs * 0.18;
  let e1x = 0, e1y = 0, e2x = 0, e2y = 0;
  let tx1 = 0, ty1 = 0, tx2 = 0, ty2 = 0, tx3 = 0, ty3 = 0;
  const tipDist = cs * 0.52;
  const forkSpread = cs * 0.12;
  const forkLen = cs * 0.12;

  switch (dir) {
    case 'right':
      e1x = hcxReal + cs * 0.12; e1y = hcyReal - eyeOff;
      e2x = hcxReal + cs * 0.12; e2y = hcyReal + eyeOff;
      tx1 = hcxReal + tipDist; ty1 = hcyReal;
      tx2 = tx1 + forkLen; ty2 = ty1 - forkSpread;
      tx3 = tx1 + forkLen; ty3 = ty1 + forkSpread;
      break;
    case 'left':
      e1x = hcxReal - cs * 0.12; e1y = hcyReal - eyeOff;
      e2x = hcxReal - cs * 0.12; e2y = hcyReal + eyeOff;
      tx1 = hcxReal - tipDist; ty1 = hcyReal;
      tx2 = tx1 - forkLen; ty2 = ty1 - forkSpread;
      tx3 = tx1 - forkLen; ty3 = ty1 + forkSpread;
      break;
    case 'down':
      e1x = hcxReal - eyeOff; e1y = hcyReal + cs * 0.12;
      e2x = hcxReal + eyeOff; e2y = hcyReal + cs * 0.12;
      tx1 = hcxReal; ty1 = hcyReal + tipDist;
      tx2 = tx1 - forkSpread; ty2 = ty1 + forkLen;
      tx3 = tx1 + forkSpread; ty3 = ty1 + forkLen;
      break;
    case 'up':
      e1x = hcxReal - eyeOff; e1y = hcyReal - cs * 0.12;
      e2x = hcxReal + eyeOff; e2y = hcyReal - cs * 0.12;
      tx1 = hcxReal; ty1 = hcyReal - tipDist;
      tx2 = tx1 - forkSpread; ty2 = ty1 - forkLen;
      tx3 = tx1 + forkSpread; ty3 = ty1 - forkLen;
      break;
  }

  const showDetails = cs >= 18;

  return (
    <G onPress={onTap}>
      {/* Shadow */}
      <Polyline
        points={points}
        fill="none"
        stroke="#000000"
        strokeWidth={strokeW + 4}
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity={0.2}
      />
      {/* Body */}
      <Polyline
        points={points}
        fill="none"
        stroke={col}
        strokeWidth={strokeW}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* Highlight */}
      <Polyline
        points={points}
        fill="none"
        stroke="#FFFFFF"
        strokeWidth={cs * 0.18}
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity={0.3}
      />
      {/* Head circle */}
      <Circle cx={hcxReal} cy={hcyReal} r={cs * 0.48} fill={col}/>
      {/* Radial highlight blob on head */}
      <Circle cx={hcxReal - cs * 0.1} cy={hcyReal - cs * 0.1} r={cs * 0.2} fill="white" opacity={0.25}/>

      {/* Eyes & tongue only if cs >= 18 */}
      {showDetails && (
        <>
          {/* Tongue */}
          <Line x1={hcxReal} y1={hcyReal} x2={tx1} y2={ty1} stroke="#FF3366" strokeWidth={2} strokeLinecap="round"/>
          <Line x1={tx1} y1={ty1} x2={tx2} y2={ty2} stroke="#FF3366" strokeWidth={1.5} strokeLinecap="round"/>
          <Line x1={tx1} y1={ty1} x2={tx3} y2={ty3} stroke="#FF3366" strokeWidth={1.5} strokeLinecap="round"/>
          {/* Eyes white */}
          <Circle cx={e1x} cy={e1y} r={er} fill="white"/>
          <Circle cx={e2x} cy={e2y} r={er} fill="white"/>
          {/* Pupils */}
          <Circle cx={e1x} cy={e1y} r={er * 0.55} fill="#111111"/>
          <Circle cx={e2x} cy={e2y} r={er * 0.55} fill="#111111"/>
          {/* Shine */}
          <Circle cx={e1x - er * 0.3} cy={e1y - er * 0.3} r={er * 0.25} fill="white"/>
          <Circle cx={e2x - er * 0.3} cy={e2y - er * 0.3} r={er * 0.25} fill="white"/>
        </>
      )}

      {/* Crown for target snake */}
      {isTarget && (
        <Polygon
          points={`${hcxReal - cs * 0.18},${hcyReal - cs * 0.42} ${hcxReal},${hcyReal - cs * 0.54} ${hcxReal + cs * 0.18},${hcyReal - cs * 0.42}`}
          fill="#FFD700"
          opacity={0.9}
        />
      )}
    </G>
  );
}

// ── Grid ───────────────────────────────────────────────────────
function Grid({ size, cs, ox, oy, exitSide, exitIndex }: {
  size: number; cs: number; ox: number; oy: number;
  exitSide: string; exitIndex: number;
}) {
  const W = size * cs;
  const H = size * cs;
  const cells: React.ReactNode[] = [];

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      cells.push(
        <Rect key={`c${r}_${c}`}
          x={ox + c * cs} y={oy + r * cs} width={cs} height={cs}
          fill={(r + c) % 2 === 0 ? '#0E1A2A' : '#0A1420'}
        />,
      );
    }
  }

  // Grid lines
  const lines: React.ReactNode[] = [];
  for (let i = 0; i <= size; i++) {
    lines.push(<Line key={`v${i}`} x1={ox + i * cs} y1={oy} x2={ox + i * cs} y2={oy + H} stroke="#1A3050" strokeWidth={0.5}/>);
    lines.push(<Line key={`h${i}`} x1={ox} y1={oy + i * cs} x2={ox + W} y2={oy + i * cs} stroke="#1A3050" strokeWidth={0.5}/>);
  }

  // Outer border
  const border = (
    <Rect x={ox} y={oy} width={W} height={H} rx={4} fill="none" stroke="#2A4A70" strokeWidth={2}/>
  );

  // Exit gap
  let exitGap: React.ReactNode = null;
  const gapStart = exitIndex * cs;
  if (exitSide === 'right') {
    exitGap = (
      <G>
        <Rect x={ox + W - 1} y={oy + gapStart + 4} width={8} height={cs - 8} fill="#0A1420"/>
        <Rect x={ox + W + 2} y={oy + gapStart + 4} width={4} height={cs - 8} rx={2} fill="#00FF88" opacity={0.8}/>
        <Polygon
          points={`${ox + W + 8},${oy + gapStart + cs / 2 - 6} ${ox + W + 16},${oy + gapStart + cs / 2} ${ox + W + 8},${oy + gapStart + cs / 2 + 6}`}
          fill="#00FF88"
        />
      </G>
    );
  } else if (exitSide === 'bottom') {
    exitGap = (
      <G>
        <Rect x={ox + gapStart + 4} y={oy + H - 1} width={cs - 8} height={8} fill="#0A1420"/>
        <Rect x={ox + gapStart + 4} y={oy + H + 2} width={cs - 8} height={4} rx={2} fill="#00FF88" opacity={0.8}/>
        <Polygon
          points={`${ox + gapStart + cs / 2 - 6},${oy + H + 8} ${ox + gapStart + cs / 2},${oy + H + 16} ${ox + gapStart + cs / 2 + 6},${oy + H + 8}`}
          fill="#00FF88"
        />
      </G>
    );
  } else if (exitSide === 'left') {
    exitGap = (
      <G>
        <Rect x={ox - 7} y={oy + gapStart + 4} width={8} height={cs - 8} fill="#0A1420"/>
        <Rect x={ox - 11} y={oy + gapStart + 4} width={4} height={cs - 8} rx={2} fill="#00FF88" opacity={0.8}/>
        <Polygon
          points={`${ox - 14},${oy + gapStart + cs / 2 - 6} ${ox - 22},${oy + gapStart + cs / 2} ${ox - 14},${oy + gapStart + cs / 2 + 6}`}
          fill="#00FF88"
        />
      </G>
    );
  } else if (exitSide === 'top') {
    exitGap = (
      <G>
        <Rect x={ox + gapStart + 4} y={oy - 7} width={cs - 8} height={8} fill="#0A1420"/>
        <Rect x={ox + gapStart + 4} y={oy - 11} width={cs - 8} height={4} rx={2} fill="#00FF88" opacity={0.8}/>
        <Polygon
          points={`${ox + gapStart + cs / 2 - 6},${oy - 14} ${ox + gapStart + cs / 2},${oy - 22} ${ox + gapStart + cs / 2 + 6},${oy - 14}`}
          fill="#00FF88"
        />
      </G>
    );
  }

  return (
    <G>
      {cells}
      {lines}
      {border}
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
  const svgH = gridH + 32;

  // Pinch-to-zoom state
  const baseScale = useRef(new Animated.Value(1)).current;
  const pinchScale = useRef(new Animated.Value(1)).current;
  const composedScale = Animated.multiply(baseScale, pinchScale);
  const lastScale = useRef(1);

  const onGestureEvent = (event: PinchGestureHandlerGestureEvent) => {
    pinchScale.setValue(event.nativeEvent.scale);
  };

  const onHandlerStateChange = (event: PinchGestureHandlerStateChangeEvent) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      lastScale.current *= event.nativeEvent.scale;
      // clamp between 0.5 and 3
      lastScale.current = Math.min(Math.max(lastScale.current, 0.5), 3);
      baseScale.setValue(lastScale.current);
      pinchScale.setValue(1);
    }
  };

  return (
    <PinchGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
    >
      <Animated.View style={[styles.container, { transform: [{ scale: composedScale }] }]}>
        <View style={{ height: svgH }}>
          <Svg width={width} height={svgH}>
            <Grid
              size={level.size} cs={cs} ox={ox} oy={oy}
              exitSide={level.exitSide}
              exitIndex={level.exitIndex}
            />
            {snakes.map(snake => (
              <SnakePiece
                key={snake.id}
                snake={snake} cs={cs} ox={ox} oy={oy}
                onTap={() => { if (!won) onTap(snake.id); }}
              />
            ))}
          </Svg>
        </View>
      </Animated.View>
    </PinchGestureHandler>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%' },
});
