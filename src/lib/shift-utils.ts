import { Shift } from "@/types/shift";

/**
 * Determines the current active shift based on the current time and provided shift configurations.
 * 
 * @param shifts - Array of shift configurations
 * @returns The shift number of the active shift, or null if no shift is currently active
 */
export function getCurrentShift(shifts: Shift[]): number | null {
    const now = new Date();
    const currentSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

    for (const shift of shifts) {
        if (!shift.startTime || !shift.endTime) continue;

        const [sH, sM, sS] = shift.startTime.split(':').map(Number);
        const [eH, eM, eS] = shift.endTime.split(':').map(Number);

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
