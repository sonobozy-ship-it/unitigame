export const COLORS = {
  // Background
  bg: '#1A1A2E',
  bgDark: '#0D0D1A',
  bgCard: '#16213E',
  bgCardDark: '#0F3460',

  // Accents
  primary: '#00D4FF',
  primaryDark: '#00A0CC',
  secondary: '#FF6B9D',
  accent: '#FFD700',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0B0',
  textMuted: '#606080',

  // Target car
  targetCar: '#FF4444',
  targetCarTop: '#FF6666',
  targetCarSide: '#CC2222',

  // Car palette
  carColors: [
    '#4ECDC4',
    '#45B7D1',
    '#96CEB4',
    '#FFEAA7',
    '#DDA0DD',
    '#98D8C8',
    '#F7DC6F',
    '#BB8FCE',
    '#85C1E9',
    '#82E0AA',
    '#F0B27A',
    '#AED6F1',
    '#A9DFBF',
    '#F9E79F',
    '#D7BDE2',
  ],

  // Grid / board
  tile: '#1E2840',
  tileDark: '#161E30',
  tileEdge: '#2A3A5C',
  boardBg: '#0F1629',
  exitGlow: '#00FF88',

  // UI elements
  buttonPrimary: '#00D4FF',
  buttonSecondary: '#FF6B9D',
  buttonDisabled: '#3A3A5C',
  starActive: '#FFD700',
  starInactive: '#3A3A5C',

  // Stars
  star1: '#FFD700',
  star2: '#FFA500',
  star3: '#FF6B00',
};

export type CarColor = typeof COLORS.carColors[number];
