import { Dimensions } from 'react-native';

const DESIGN_WIDTH = 412;
const DESIGN_HEIGHT = 917;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Horizontal
export const s = (size) => Math.round((SCREEN_WIDTH / DESIGN_WIDTH) * size);

// Vertical
export const vs = (size) => Math.round((SCREEN_HEIGHT / DESIGN_HEIGHT) * size);

export const ms = (size, factor = 0.5) =>
  Math.round(size + (s(size) - size) * factor);

export const W = SCREEN_WIDTH;
export const H = SCREEN_HEIGHT;