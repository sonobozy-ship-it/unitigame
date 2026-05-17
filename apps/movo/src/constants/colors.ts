export const COLORS = {
  // Background
  bg: '#0D1B2A',
  bgDark: '#060E17',
  bgCard: '#122233',
  bgCardDark: '#0A1622',

  // Brand / ice palette
  primary: '#A8DADC',       // ice blue
  primaryDark: '#78B9BC',
  secondary: '#F1FAEE',     // white
  accent: '#457B9D',        // teal

  // Penguin colors
  penguinBlack: '#1A1A2A',
  penguinBelly: '#F1FAEE',
  penguinBeak: '#FF8C00',
  penguinFeet: '#FF8C00',

  // Text
  textPrimary: '#F1FAEE',
  textSecondary: '#A8DADC',
  textMuted: '#457B9D',

  // Target penguin
  targetGlow: '#FFD700',

  // Penguin palette (for non-target penguins)
  penguinColors: [
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

  // Grid / board (ice floe)
  tile: '#C8E8EA',
  tileDark: '#A8D0D2',
  tileEdge: '#78B0B2',
  tileHighlight: '#E8F8FA',
  boardBg: '#0D1B2A',
  exitGlow: '#A8DADC',
  water: '#1A3A5C',

  // UI elements
  buttonPrimary: '#457B9D',
  buttonSecondary: '#A8DADC',
  buttonDisabled: '#2A3A4C',
  starActive: '#FFD700',
  starInactive: '#2A3A4C',

  // Stars
  star1: '#FFD700',
  star2: '#FFA500',
  star3: '#FF6B00',
};

export type PenguinColor = typeof COLORS.penguinColors[number];
