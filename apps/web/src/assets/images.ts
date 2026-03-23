/**
 * Mascot Image Assets
 * All mascot images are stored in /public/assets/mascots/
 */

export const mascots = {
  passport: '/assets/mascots/mascot-passport.png',
  happy: '/assets/mascots/mascot-happy.png',
  suitcase: '/assets/mascots/mascot-suitcase.png',
  peek: '/assets/mascots/mascot-peek.png',
  traveling: '/assets/mascots/mascot-traveling.png',
  pair: '/assets/mascots/mascot-pair.png',
} as const;

export type MascotKey = keyof typeof mascots;
