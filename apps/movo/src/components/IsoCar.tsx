import React from 'react';
import { G, Polygon, Ellipse, Circle } from 'react-native-svg';
import { TILE_W, TILE_H, PENGUIN_HEIGHT } from '../constants/theme';
import { toIso } from './IsoGrid';
import { Vehicle } from '../data/levels';

interface IsoCarProps {
  vehicle: Vehicle;
}

function lighten(hex: string, amount: number): string {
  const num = parseInt(hex.slice(1), 16);
  const r = Math.min(255, (num >> 16) + amount);
  const g = Math.min(255, ((num >> 8) & 0xff) + amount);
  const b = Math.min(255, (num & 0xff) + amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

function darken(hex: string, amount: number): string {
  const num = parseInt(hex.slice(1), 16);
  const r = Math.max(0, (num >> 16) - amount);
  const g = Math.max(0, ((num >> 8) & 0xff) - amount);
  const b = Math.max(0, (num & 0xff) - amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

export function IsoCar({ vehicle }: IsoCarProps) {
  const { row, col, length, orientation, color, isTarget } = vehicle;
  const hw = TILE_W / 2;
  const hh = TILE_H / 2;
  const ch = PENGUIN_HEIGHT;

  // Penguin body: dark with colored accent
  const bodyColor = isTarget ? '#2A1A00' : '#1A1A2E';
  const bodyTop = isTarget ? '#3A2800' : '#242440';
  const bodySide = isTarget ? '#1A0D00' : '#10101E';
  const accentColor = isTarget ? '#FFD700' : color;
  const glowColor = isTarget ? '#FFD70066' : `${color}44`;

  if (orientation === 'H') {
    const startIso = toIso(row, col);
    const endIso = toIso(row, col + length - 1);

    const tl = { x: startIso.x - hw, y: startIso.y };
    const tr = { x: endIso.x + hw, y: endIso.y };
    const br = { x: endIso.x, y: endIso.y + hh };
    const bl = { x: startIso.x, y: startIso.y + hh };

    const topPts = `${tl.x},${tl.y - ch} ${tr.x},${tr.y - ch} ${br.x},${br.y - ch} ${bl.x},${bl.y - ch}`;
    const frontPts = `${tr.x},${tr.y - ch} ${br.x},${br.y - ch} ${br.x},${br.y} ${tr.x},${tr.y}`;
    const sidePts = `${tl.x},${tl.y - ch} ${bl.x},${bl.y - ch} ${bl.x},${bl.y} ${tl.x},${tl.y}`;

    // Top face center for decorations
    const topCx = (tl.x + tr.x + br.x + bl.x) / 4;
    const topCy = (tl.y + tr.y + br.y + bl.y) / 4 - ch;

    // Belly ellipse on top face (white)
    const bellyRx = hw * length * 0.32;
    const bellyRy = hh * 0.55;

    // Beak: small orange triangle at front-right of top face
    const beakTip = { x: tr.x + 4, y: tr.y - ch + hh * 0.3 };
    const beakBase1 = { x: tr.x - 2, y: tr.y - ch - 3 };
    const beakBase2 = { x: tr.x - 2, y: tr.y - ch + 3 };
    const beakPts = `${beakTip.x},${beakTip.y} ${beakBase1.x},${beakBase1.y} ${beakBase2.x},${beakBase2.y}`;

    // Eyes near the beak end
    const eyeX = tr.x - 6;
    const eyeY1 = tr.y - ch - 4;
    const eyeY2 = tr.y - ch + 2;

    // Colored scarf/band across the middle of the body
    const scarfTop = (tl.y + bl.y) / 2 - ch - hh * 0.1;
    const scarfBot = scarfTop + hh * 0.55;
    const scarfMidX = (tl.x + tr.x) / 2;
    const scarfPts = `${tl.x},${scarfTop} ${tr.x},${scarfTop} ${br.x},${scarfBot} ${bl.x},${scarfBot}`;

    return (
      <G>
        {/* Glow outline for target */}
        {isTarget && (
          <Polygon points={topPts} fill="none" stroke={glowColor} strokeWidth={6} strokeLinejoin="round" />
        )}
        <Polygon points={sidePts} fill={bodySide} stroke="#0A0A18" strokeWidth={0.5} />
        <Polygon points={frontPts} fill={bodyColor} stroke="#0A0A18" strokeWidth={0.5} />
        <Polygon points={topPts} fill={bodyTop} stroke="#0A0A18" strokeWidth={0.5} />
        {/* Colored scarf stripe */}
        <Polygon points={scarfPts} fill={accentColor} opacity={0.85} />
        {/* White belly */}
        <Ellipse
          cx={topCx - hw * 0.2}
          cy={topCy + hh * 0.1}
          rx={bellyRx}
          ry={bellyRy}
          fill="#E8F4F8"
          opacity={0.9}
        />
        {/* Eyes */}
        <Circle cx={eyeX} cy={eyeY1} r={2} fill="#FFFFFF" />
        <Circle cx={eyeX} cy={eyeY2} r={2} fill="#FFFFFF" />
        <Circle cx={eyeX} cy={eyeY1} r={1} fill="#1A1A2E" />
        <Circle cx={eyeX} cy={eyeY2} r={1} fill="#1A1A2E" />
        {/* Beak */}
        <Polygon points={beakPts} fill="#FF8C00" />
      </G>
    );
  } else {
    // Vertical penguin: slides up-down, faces downward
    const startIso = toIso(row, col);
    const endIso = toIso(row + length - 1, col);

    const tl = { x: startIso.x - hw, y: startIso.y };
    const tr = { x: startIso.x, y: startIso.y - hh };
    const br = { x: endIso.x + hw, y: endIso.y };
    const bl = { x: endIso.x, y: endIso.y + hh };

    const topPts = `${tl.x},${tl.y - ch} ${tr.x},${tr.y - ch} ${br.x},${br.y - ch} ${bl.x},${bl.y - ch}`;
    const frontPts = `${tr.x},${tr.y - ch} ${br.x},${br.y - ch} ${br.x},${br.y} ${tr.x},${tr.y}`;
    const sidePts = `${tl.x},${tl.y - ch} ${bl.x},${bl.y - ch} ${bl.x},${bl.y} ${tl.x},${tl.y}`;

    const topCx = (tl.x + tr.x + br.x + bl.x) / 4;
    const topCy = (tl.y + tr.y + br.y + bl.y) / 4 - ch;

    const bellyRx = hw * 0.5;
    const bellyRy = hh * length * 0.3;

    const beakTip = { x: br.x + 4, y: br.y - ch + 2 };
    const beakBase1 = { x: br.x - 3, y: br.y - ch - 2 };
    const beakBase2 = { x: br.x - 3, y: br.y - ch + 4 };
    const beakPts = `${beakTip.x},${beakTip.y} ${beakBase1.x},${beakBase1.y} ${beakBase2.x},${beakBase2.y}`;

    const eyeX1 = br.x - 5;
    const eyeX2 = br.x - 5;
    const eyeY = br.y - ch - 3;

    const scarfPts = `${tl.x},${(tl.y + bl.y) / 2 - hh * 0.4 - ch} ${tr.x},${(tr.y + br.y) / 2 - hh * 0.4 - ch} ${br.x},${(tr.y + br.y) / 2 + hh * 0.15 - ch} ${bl.x},${(tl.y + bl.y) / 2 + hh * 0.15 - ch}`;

    return (
      <G>
        {isTarget && (
          <Polygon points={topPts} fill="none" stroke={glowColor} strokeWidth={6} strokeLinejoin="round" />
        )}
        <Polygon points={sidePts} fill={bodySide} stroke="#0A0A18" strokeWidth={0.5} />
        <Polygon points={frontPts} fill={bodyColor} stroke="#0A0A18" strokeWidth={0.5} />
        <Polygon points={topPts} fill={bodyTop} stroke="#0A0A18" strokeWidth={0.5} />
        <Polygon points={scarfPts} fill={accentColor} opacity={0.85} />
        <Ellipse
          cx={topCx}
          cy={topCy}
          rx={bellyRx}
          ry={bellyRy}
          fill="#E8F4F8"
          opacity={0.9}
        />
        <Circle cx={eyeX1 - 2} cy={eyeY} r={2} fill="#FFFFFF" />
        <Circle cx={eyeX2 + 3} cy={eyeY} r={2} fill="#FFFFFF" />
        <Circle cx={eyeX1 - 2} cy={eyeY} r={1} fill="#1A1A2E" />
        <Circle cx={eyeX2 + 3} cy={eyeY} r={1} fill="#1A1A2E" />
        <Polygon points={beakPts} fill="#FF8C00" />
      </G>
    );
  }
}
