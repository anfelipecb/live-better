import { LEVELS } from '@/types';
import type { XPEvent } from '@/types';

/**
 * Returns the current level object based on total XP.
 * Walks the LEVELS array in reverse to find the highest level whose minXP
 * the player has reached.
 */
export function getLevel(totalXP: number) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (totalXP >= LEVELS[i].minXP) {
      return LEVELS[i];
    }
  }
  return LEVELS[0];
}

/**
 * Returns the next level object, or null if the player is already at max level.
 */
export function getNextLevel(totalXP: number) {
  const current = getLevel(totalXP);
  const nextIndex = LEVELS.findIndex((l) => l.level === current.level) + 1;
  return nextIndex < LEVELS.length ? LEVELS[nextIndex] : null;
}

/**
 * Returns progress toward the next level:
 * - current: XP earned above the current level's threshold
 * - needed: total XP span between current and next level
 * - percentage: 0-100 progress
 */
export function getXPProgress(totalXP: number) {
  const current = getLevel(totalXP);
  const next = getNextLevel(totalXP);

  if (!next) {
    return { current: 0, needed: 0, percentage: 100 };
  }

  const xpIntoCurrent = totalXP - current.minXP;
  const xpSpan = next.minXP - current.minXP;

  return {
    current: xpIntoCurrent,
    needed: xpSpan,
    percentage: Math.min(Math.round((xpIntoCurrent / xpSpan) * 100), 100),
  };
}

/**
 * Returns total XP earned on a given day (YYYY-MM-DD string).
 */
export function getTodayXP(xpEvents: XPEvent[], today: string): number {
  return xpEvents
    .filter((e) => e.date === today)
    .reduce((sum, e) => sum + e.xp, 0);
}

/**
 * Returns the amount of XP available to spend on rewards.
 * Because we subtract costXP from totalXP when unlocking, totalXP already
 * represents the spendable balance.
 */
export function getAvailableXP(totalXP: number): number {
  return totalXP;
}
