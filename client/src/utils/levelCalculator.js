const PREDEFINED_THRESHOLDS = [0, 500, 1200, 2200, 3500];

export const getThresholdForLevel = (level) => {
  if (level <= PREDEFINED_THRESHOLDS.length) {
    return PREDEFINED_THRESHOLDS[level - 1];
  }
  let threshold = PREDEFINED_THRESHOLDS[PREDEFINED_THRESHOLDS.length - 1];
  let step = 1300;
  for (let i = 5; i < level; i++) {
    step += 300;
    threshold += step;
  }
  return threshold;
};

export const calculateLevelInfo = (xp = 0) => {
  const currentXP = Math.max(0, Number(xp) || 0);
  let currentLevel = 1;

  while (true) {
    const nextThreshold = getThresholdForLevel(currentLevel + 1);
    if (currentXP < nextThreshold) {
      const currentLevelThreshold = getThresholdForLevel(currentLevel);
      const nextLevelThreshold = nextThreshold;
      const xpNeeded = nextLevelThreshold - currentXP;
      const levelXPProgress = currentXP - currentLevelThreshold;
      const levelXPTotal = nextLevelThreshold - currentLevelThreshold;
      const progressPercent = Math.min(
        100,
        Math.max(0, Math.round((levelXPProgress / levelXPTotal) * 100))
      );

      return {
        level: currentLevel,
        currentLevelThreshold,
        nextLevelThreshold,
        xpNeeded,
        progressPercent,
        levelXPProgress,
        levelXPTotal
      };
    }
    currentLevel++;
  }
};
