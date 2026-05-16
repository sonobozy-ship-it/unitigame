import React, { useCallback } from 'react';
import { View, StyleSheet, PanResponder, Dimensions } from 'react-native';
import { Level } from '../data/levels';
import { GameState, CellPos, useGame } from '../hooks/useGame';
import { PIPE_COLORS } from '../constants/colors';
import { theme } from '../constants/theme';
import Svg, { Line, Circle } from 'react-native-svg';

const SCREEN_W = Dimensions.get('window').width;
const BOARD_PADDING = 16;

interface Props {
  level: Level;
  gameHook: ReturnType<typeof useGame>;
}

export default function GameBoard({ level, gameHook }: Props) {
  const { state, startDrag, continueDrag, endDrag, isDotCell } = gameHook;

  const cellSize = (SCREEN_W - BOARD_PADDING * 2) / level.size;
  const boardSize = cellSize * level.size;

  const posFromXY = useCallback((x: number, y: number): CellPos => {
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);
    return [
      Math.max(0, Math.min(level.size - 1, row)),
      Math.max(0, Math.min(level.size - 1, col)),
    ];
  }, [cellSize, level.size]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt) => {
      const { locationX, locationY } = evt.nativeEvent;
      startDrag(posFromXY(locationX, locationY));
    },
    onPanResponderMove: (evt) => {
      const { locationX, locationY } = evt.nativeEvent;
      continueDrag(posFromXY(locationX, locationY));
    },
    onPanResponderRelease: endDrag,
    onPanResponderTerminate: endDrag,
  });

  // Render pipe SVG segments
  const renderPipes = () => {
    const lines: React.ReactElement[] = [];
    const half = cellSize / 2;

    for (const pipe of Object.values(state.pipes)) {
      if (pipe.cells.length < 2) continue;
      const color = PIPE_COLORS[pipe.color] ?? '#fff';
      for (let i = 0; i < pipe.cells.length - 1; i++) {
        const [r1, c1] = pipe.cells[i];
        const [r2, c2] = pipe.cells[i + 1];
        const x1 = c1 * cellSize + half;
        const y1 = r1 * cellSize + half;
        const x2 = c2 * cellSize + half;
        const y2 = r2 * cellSize + half;
        lines.push(
          <Line key={`${pipe.color}-${i}`} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={color} strokeWidth={cellSize * 0.45} strokeLinecap="round" />
        );
      }
    }
    return lines;
  };

  // Render dot endpoints
  const renderDots = () => {
    const circles: React.ReactElement[] = [];
    const half = cellSize / 2;
    const r = cellSize * 0.32;

    for (const dot of level.dots) {
      const color = PIPE_COLORS[dot.color] ?? '#fff';
      for (const pos of [dot.start, dot.end]) {
        const cx = pos[1] * cellSize + half;
        const cy = pos[0] * cellSize + half;
        circles.push(
          <Circle key={`dot-${dot.color}-${pos[0]}-${pos[1]}`}
            cx={cx} cy={cy} r={r} fill={color} stroke="#fff" strokeWidth={2} />
        );
      }
    }
    return circles;
  };

  // Grid lines
  const renderGrid = () => {
    const lines: React.ReactElement[] = [];
    for (let i = 0; i <= level.size; i++) {
      const x = i * cellSize;
      const y = i * cellSize;
      lines.push(
        <Line key={`v${i}`} x1={x} y1={0} x2={x} y2={boardSize}
          stroke={theme.border} strokeWidth={1} />,
        <Line key={`h${i}`} x1={0} y1={y} x2={boardSize} y2={y}
          stroke={theme.border} strokeWidth={1} />
      );
    }
    return lines;
  };

  return (
    <View style={[styles.board, { width: boardSize, height: boardSize }]}
      {...panResponder.panHandlers}>
      <Svg width={boardSize} height={boardSize} style={StyleSheet.absoluteFill}>
        {renderGrid()}
        {renderPipes()}
        {renderDots()}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    backgroundColor: theme.bgCell,
    borderRadius: theme.radius,
    overflow: 'hidden',
  },
});
