export interface ScheduleItem {
    id: number;
    codeNo: string;
    machineCode: string;
    quantity: number;
    stdDandatory: number;
    cycleTime: number;
    totalSecondShift: number;
    capacityPerShift: number;
}

export interface Schedule {
    id: number;
    code: string;
    date: string;
    createdAt: string;
    createdBy: string;
    updatedAt: string | null;
    items: ScheduleItem[];
}

export interface CreateScheduleItemRequest {
    codeNo: string;
    machineCode: string;
    quantity: number;
    stdDandatory: number;
}

export interface CreateScheduleRequest {
    code: string;
    date: string;
    createdBy: string;
    items: CreateScheduleItemRequest[];
}

export interface UpdateScheduleRequest {
    code?: string;
    date?: string;
    createdBy?: string;
    items?: CreateScheduleItemRequest[];
}

// --- Board View Types ---

export interface ScheduleBoardItem {
    codeNo: string;
    qtyAssign: number;
    remaining: number;
    cycleTimeSeconds: number;
    totalSeconds: number;
}

export interface MachineSchedule {
    machineCode: string;
    items: ScheduleBoardItem[];
}

export interface Shift {
    dayIndex: number;
    shiftDate: string;
    shiftNo: number;
    shiftName: string;
    maxShiftSeconds: number;
    startTime: string | null;
    endTime: string | null;
    totalShiftSeconds: number;
    items: any[]; // The JSON shows empty array but likely for future use
    machines: MachineSchedule[];
}

export interface ScheduleBoard {
    scheduleId: number;
    scheduleCode: string;
    date: string;
    shifts: Shift[];
    machines: any; // The JSON says null
}
