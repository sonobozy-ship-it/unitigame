import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const SCREEN = {
  width,
  height,
};

export const TILE_W = 56;
export const TILE_H = 28; // TILE_W / 2
export const CAR_HEIGHT = 22; // 3D extrusion height for cars
export const GRID_SIZE = 6;

// Board origin offset (top of the isometric grid on screen)
// Centers the grid horizontally
export const BOARD_ORIGIN_X = width / 2;
export const BOARD_ORIGIN_Y = 60; // pixels from top of board area

export const THEME = {
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 20,
    xl: 32,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 40,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 28,
    xxl: 40,
    hero: 64,
  },
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    heavy: '900' as const,
  },
};
