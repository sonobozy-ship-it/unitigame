import React, { useCallback, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg from 'react-native-svg';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { IsoGrid, toIso } from './IsoGrid';
import { IsoCar } from './IsoCar';
import { Vehicle } from '../data/levels';
import { Direction } from '../hooks/useGame';
import { TILE_W, TILE_H, BOARD_ORIGIN_X, BOARD_ORIGIN_Y, SCREEN } from '../constants/theme';

const BOARD_HEIGHT = 380;
const SWIPE_THRESHOLD = 20;

interface IsoBoardProps {
  size: number;
  exitRow: number;
  vehicles: Vehicle[];
  onMove: (vehicleId: string, direction: Direction, steps?: number) => void;
  won: boolean;
}

function getVehicleCenter(vehicle: Vehicle): { x: number; y: number } {
  if (vehicle.orientation === 'H') {
    const midCol = vehicle.col + (vehicle.length - 1) / 2;
    return toIso(vehicle.row, midCol);
  } else {
    const midRow = vehicle.row + (vehicle.length - 1) / 2;
    return toIso(midRow, vehicle.col);
  }
}

function findVehicleAt(tx: number, ty: number, vehicles: Vehicle[]): Vehicle | null {
  let closest: Vehicle | null = null;
  let minDist = Infinity;

  for (const v of vehicles) {
    const center = getVehicleCenter(v);
    // Expand hit area by vehicle length
    const hitW = v.orientation === 'H' ? TILE_W * v.length * 0.7 : TILE_W * 0.8;
    const hitH = v.orientation === 'V' ? TILE_H * v.length * 1.4 : TILE_H * 1.4;
    const dx = Math.abs(tx - center.x);
    const dy = Math.abs(ty - center.y);
    if (dx < hitW / 2 && dy < hitH / 2) {
      const dist = dx * dx + dy * dy;
      if (dist < minDist) {
        minDist = dist;
        closest = v;
      }
    }
  }
  return closest;
}

function screenToGrid(sx: number, sy: number): { row: number; col: number } {
  // Inverse isometric transform
  const x = sx - BOARD_ORIGIN_X;
  const y = sy - BOARD_ORIGIN_Y;
  const col = (x / (TILE_W / 2) + y / (TILE_H / 2)) / 2;
  const row = (y / (TILE_H / 2) - x / (TILE_W / 2)) / 2;
  return { row: Math.round(row), col: Math.round(col) };
}

function getSwipeDirection(dx: number, dy: number, vehicle: Vehicle): Direction | null {
  if (Math.abs(dx) < SWIPE_THRESHOLD && Math.abs(dy) < SWIPE_THRESHOLD) return null;

  // In isometric space, screen-right moves diagonally
  // Convert screen delta to isometric grid delta
  const gridDx = (dx / (TILE_W / 2) + dy / (TILE_H / 2)) / 2;
  const gridDy = (dy / (TILE_H / 2) - dx / (TILE_W / 2)) / 2;

  if (vehicle.orientation === 'H') {
    return gridDx > 0 ? 'right' : 'left';
  } else {
    return gridDy > 0 ? 'down' : 'up';
  }
}

export function IsoBoard({ size, exitRow, vehicles, onMove, won }: IsoBoardProps) {
  const activeVehicleRef = useRef<Vehicle | null>(null);
  const gestureStartRef = useRef({ x: 0, y: 0 });
  const hasMoved = useRef(false);

  // Sort vehicles for correct isometric draw order (back-to-front)
  const sortedVehicles = [...vehicles].sort((a, b) => {
    const aDepth = a.row + a.col;
    const bDepth = b.row + b.col;
    return aDepth - bDepth;
  });

  const panGesture = Gesture.Pan()
    .runOnJS(true)
    .onBegin((e) => {
      gestureStartRef.current = { x: e.x, y: e.y };
      hasMoved.current = false;
      // Find which vehicle was touched
      activeVehicleRef.current = findVehicleAt(e.x, e.y, vehicles);
    })
    .onUpdate((e) => {
      if (!activeVehicleRef.current || won) return;
      const dx = e.x - gestureStartRef.current.x;
      const dy = e.y - gestureStartRef.current.y;
      if (!hasMoved.current && (Math.abs(dx) > SWIPE_THRESHOLD || Math.abs(dy) > SWIPE_THRESHOLD)) {
        hasMoved.current = true;
      }
    })
    .onEnd((e) => {
      if (!activeVehicleRef.current || won || !hasMoved.current) {
        activeVehicleRef.current = null;
        return;
      }
      const vehicle = activeVehicleRef.current;
      const dx = e.x - gestureStartRef.current.x;
      const dy = e.y - gestureStartRef.current.y;
      const direction = getSwipeDirection(dx, dy, vehicle);

      if (direction) {
        // Estimate steps from drag distance
        const dragDist = Math.sqrt(dx * dx + dy * dy);
        const steps = Math.max(1, Math.round(dragDist / (TILE_W / 2)));
        onMove(vehicle.id, direction, steps);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      }

      activeVehicleRef.current = null;
      hasMoved.current = false;
    });

  return (
    <View style={styles.container}>
      <GestureDetector gesture={panGesture}>
        <View style={styles.svgContainer}>
          <Svg width={SCREEN.width} height={BOARD_HEIGHT} style={styles.svg}>
            <IsoGrid size={size} exitRow={exitRow} />
            {sortedVehicles.map(vehicle => (
              <IsoCar key={vehicle.id} vehicle={vehicle} />
            ))}
          </Svg>
        </View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  svgContainer: {
    width: SCREEN.width,
    height: BOARD_HEIGHT,
  },
  svg: {
    backgroundColor: 'transparent',
  },
});
