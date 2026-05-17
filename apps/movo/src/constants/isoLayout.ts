import { createContext, useContext } from 'react';

export interface IsoLayout {
  TW: number;   // tile width
  TH: number;   // tile height (= TW/2)
  PH: number;   // penguin/vehicle extrusion height
  OX: number;   // board SVG origin X
  OY: number;   // board SVG origin Y
  svgW: number;
  svgH: number;
}

const DEFAULT_LAYOUT: IsoLayout = {
  TW: 56, TH: 28, PH: 20, OX: 180, OY: 50, svgW: 360, svgH: 380,
};

export const IsoLayoutContext = createContext<IsoLayout>(DEFAULT_LAYOUT);

export function useIsoLayout() {
  return useContext(IsoLayoutContext);
}

export function makeToIso(layout: IsoLayout) {
  return (row: number, col: number) => ({
    x: layout.OX + (col - row) * (layout.TW / 2),
    y: layout.OY + (col + row) * (layout.TH / 2),
  });
}

export function computeIsoLayout(
  size: number,
  screenW: number,
  screenH: number,
): IsoLayout {
  const availW = screenW - 32;
  // header (~100) + moves row (~64) + controls (~64) + safe area (~48) + margins
  const availH = screenH - 320;

  // iso grid spans size*TW wide, (size-0.5)*TH tall
  const twFromW = Math.floor(availW / size);
  const twFromH = Math.floor((2 * availH) / (size + 1));
  const TW = Math.min(twFromW, twFromH, 76);
  const TH = Math.floor(TW / 2);
  const PH = Math.max(12, Math.floor(TH * 0.75));

  const svgW = screenW;
  // bottommost tile center y = OY + (size-1)*TH; add TH/2 for tile bottom + margin
  const svgH = PH + 30 + (size - 1) * TH + Math.ceil(TH / 2) + 24;

  const OX = screenW / 2;
  const OY = PH + 20;

  return { TW, TH, PH, OX, OY, svgW, svgH };
}
