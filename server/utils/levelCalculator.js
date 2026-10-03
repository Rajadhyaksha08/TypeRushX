export const getLevelFromXP = (xp) => {
  if (xp < 500) return 1;
  if (xp < 1200) return 2;
  if (xp < 2200) return 3;
  if (xp < 3500) return 4;
  if (xp < 5000) return 5;

  return 6 + Math.floor((xp - 5000) / 1500);
};

export const getCurrentLevelThreshold = (level) => {
  if (level <= 1) return 0;
  if (level === 2) return 500;
  if (level === 3) return 1200;
  if (level === 4) return 2200;
  if (level === 5) return 3500;

  return 5000 + (level - 6) * 1500;
};

export const getNextLevelThreshold = (level) => {
  if (level === 1) return 500;
  if (level === 2) return 1200;
  if (level === 3) return 2200;
  if (level === 4) return 3500;
  if (level === 5) return 5000;

  return 5000 + (level - 5) * 1500;
};