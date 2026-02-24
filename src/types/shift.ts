export interface ShiftBreak {
    startTime: string;
    endTime: string;
    breakSeconds?: number;
}

export interface Shift {
    id: number;
    shiftNo: number;
    shiftName: string;
    startTime: string;
    endTime: string;
    workSeconds: number;
    isActive: boolean;
    colorCode: string | null;
    colorBreak: string | null;
    shiftBreaks: ShiftBreak[];
}

export interface CreateShiftRequest {
    shiftNo: number;
    shiftName: string;
    startTime: string;
    endTime: string;
    workSeconds: number;
    isActive: boolean;
    colorCode: string | null;
    colorBreak: string | null;
    shiftBreaks: {
        startTime: string;
        endTime: string;
    }[];
}

export interface UpdateShiftRequest {
    shiftNo: number;
    shiftName: string;
    startTime: string;
    endTime: string;
    workSeconds: number;
    isActive: boolean;
    colorCode: string | null;
    colorBreak: string | null;
    shiftBreaks: {
        startTime: string;
        endTime: string;
    }[];
}
