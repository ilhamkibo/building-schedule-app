import { Shift } from "@/types/shift";

/**
 * Determines the current active shift based on the current time and provided shift configurations.
 *
 * @param shifts - Array of shift configurations
 * @returns The shift number of the active shift, or null if no shift is currently active
 */
export function getCurrentShift(shifts: Shift[]): number | null {
  const now = new Date();
  const currentSeconds =
    now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

  for (const shift of shifts) {
    if (!shift.startTime || !shift.endTime) continue;

    const [sH, sM, sS] = shift.startTime.split(":").map(Number);
    const [eH, eM, eS] = shift.endTime.split(":").map(Number);

    const startSeconds = sH * 3600 + (sM || 0) * 60 + (sS || 0);
    const endSeconds = eH * 3600 + (eM || 0) * 60 + (eS || 0);

    if (startSeconds < endSeconds) {
      // Normal shift (e.g., 08:00 - 16:00)
      if (currentSeconds >= startSeconds && currentSeconds < endSeconds) {
        return shift.shiftNo;
      }
    } else if (startSeconds > endSeconds) {
      // Overnight shift (e.g., 22:00 - 06:00)
      if (currentSeconds >= startSeconds || currentSeconds < endSeconds) {
        return shift.shiftNo;
      }
    }
  }
  return null;
}

/**
 * Gets the next shift and its start time.
 *
 * @param shifts - Array of shift configurations
 * @returns Object containing the next shift and its start time as a Date object
 */
export function getNextShiftInfo(
  shifts: Shift[],
): { nextShift: Shift; startTime: Date } | null {
  if (!shifts || shifts.length === 0) return null;

  const sortedShifts = [...shifts].sort((a, b) => a.shiftNo - b.shiftNo);
  const now = new Date();
  const currentSeconds =
    now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

  // Find current shift
  let currentShiftIndex = -1;
  for (let i = 0; i < sortedShifts.length; i++) {
    const shift = sortedShifts[i];
    const [sH, sM, sS] = shift.startTime.split(":").map(Number);
    const [eH, eM, eS] = shift.endTime.split(":").map(Number);
    const startSeconds = sH * 3600 + (sM || 0) * 60 + (sS || 0);
    const endSeconds = eH * 3600 + (eM || 0) * 60 + (eS || 0);

    if (startSeconds < endSeconds) {
      if (currentSeconds >= startSeconds && currentSeconds < endSeconds) {
        currentShiftIndex = i;
        break;
      }
    } else {
      if (currentSeconds >= startSeconds || currentSeconds < endSeconds) {
        currentShiftIndex = i;
        break;
      }
    }
  }

  // If no current shift found, find the first shift that starts after now
  if (currentShiftIndex === -1) {
    for (let i = 0; i < sortedShifts.length; i++) {
      const shift = sortedShifts[i];
      const [sH, sM] = shift.startTime.split(":").map(Number);
      const startSeconds = sH * 3600 + (sM || 0) * 60;
      if (startSeconds > currentSeconds) {
        currentShiftIndex = i - 1; // Treat the previous one as "current" even if it's inactive
        if (currentShiftIndex < 0) currentShiftIndex = sortedShifts.length - 1;
        break;
      }
    }
  }

  // Default to last shift if still not found (meaning it's after all starts)
  if (currentShiftIndex === -1) currentShiftIndex = sortedShifts.length - 1;

  const nextShiftIndex = (currentShiftIndex + 1) % sortedShifts.length;
  const nextShift = sortedShifts[nextShiftIndex];

  const [nH, nM] = nextShift.startTime.split(":").map(Number);
  const nextStartTime = new Date(now);
  nextStartTime.setHours(nH, nM, 0, 0);

  // If nextStartTime is earlier than now, it means the next shift starts tomorrow
  if (nextStartTime <= now) {
    nextStartTime.setDate(nextStartTime.getDate() + 1);
  }

  return { nextShift, startTime: nextStartTime };
}

/**
 * Gets the target shift for manual refresh based on the active refresh window (T-60 to T+15 of any shift).
 * If we are in the T-60 to T-0 window before a shift starts, it returns that next shift.
 * If we are in the T-0 to T+15 window after a shift starts, it returns that current shift.
 * Otherwise, returns null.
 *
 * @param shifts - Array of shift configurations
 * @returns The shift number to refresh, or null if outside any refresh window
 */
export function getManualRefreshTargetShift(shifts: Shift[]): number | null {
  if (!shifts || shifts.length === 0) return null;
  const now = new Date();

  // 1. Check current shift (for T-0 to T+15 window)
  const currentShiftNo = getCurrentShift(shifts);
  if (currentShiftNo) {
    const currentShift = shifts.find((s) => s.shiftNo === currentShiftNo);
    if (currentShift) {
      const [h, m] = currentShift.startTime.split(":").map(Number);
      const startTime = new Date(now);
      startTime.setHours(h, m, 0, 0);
      // Handle overnight
      if (startTime > now) {
        startTime.setDate(startTime.getDate() - 1);
      }
      const diffCurrent = (now.getTime() - startTime.getTime()) / (1000 * 60);
      if (diffCurrent >= 0 && diffCurrent <= 15) {
        return currentShift.shiftNo;
      }
    }
  }

  // 2. Check next shift (for T-60 to T-0 window)
  const nextInfo = getNextShiftInfo(shifts);
  if (nextInfo) {
    const diffNext =
      (nextInfo.startTime.getTime() - now.getTime()) / (1000 * 60);
    if (diffNext <= 60 && diffNext >= 0) {
      return nextInfo.nextShift.shiftNo;
    }
  }

  return null;
}

/**
 * Checks if the current time is within the manual refresh window (T-60 to T+15 of any shift)
 *
 * @param shifts - Array of shift configurations
 * @returns boolean
 */
export function isManualRefreshWindow(shifts: Shift[]): boolean {
  return getManualRefreshTargetShift(shifts) !== null;
}
