/**
 * Color palette matching sip-native design system
 * Dark nightlife theme with neon accents
 */

export const Colors = {
  // Primary brand colors
  primary: {
    pink: '#FF5DA0',
    neonPink: '#FF3D9A',
    orange: '#FFA84E',
  },

  // Background colors
  background: {
    primary: '#120028',      // Deep dark purple
    secondary: '#260046',    // Mid dark purple
    tertiary: '#2A0033',     // Outline purple
    dark: '#120028',
    darkAlt: '#260046',
    overlay: 'rgba(18, 0, 40, 0.95)',
  },

  // Accent colors
  accent: {
    gold: '#FFD36E',
    sparkleYellow: '#FFD36E',
    sparklePurple: '#B864F6',
    sparkleAqua: '#4FF0E8',
    teal: '#4ECDC4',
    mint: '#52E5BA',
  },

  // Text colors
  text: {
    primary: '#FFFFFF',
    secondary: '#A3A3A3',
    tertiary: '#525252',
    inverse: '#171717',
  },

  // Gradients
  gradient: {
    logoTitle: ['#FF5DA0', '#FFA84E'],           // Pink to orange
    nightlife: ['#120028', '#260046'],            // Dark purple gradient (main background)
    deepPurple: ['#2A0033', '#4C0073'],
    neonPink: ['#FF3D9A', '#FF5DA0'],
    goldShine: ['#FFD36E', '#FFA84E'],           // Gold to orange (premium button)
    sparkles: ['#B864F6', '#4FF0E8'],            // Purple to aqua
    vibrantNight: ['#FF5DA0', '#FFA84E', '#FFD36E'], // 3-color gradient
  },

  // Status colors
  status: {
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#B864F6',
  },

  // Neutral colors
  gray: {
    50: '#FFFFFF',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },

  // Shadow colors for glow effects
  shadow: {
    pink: '#FF5DA0',
    purple: '#B864F6',
    gold: '#FFD36E',
  },
};

export default Colors;
