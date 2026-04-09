

export interface Schedule {
    id: number;
    date: string;
    createdAt: string;
    machineCount: number;
    lineNo: number;
}

export interface CreateScheduleRequest {
    date: string;
    lineNo: number;
    machines: CreateScheduleMachine[];
}

export interface CreateScheduleMachine {
    machine: string;
    shifts: CreateScheduleShift[];
}

export interface CreateScheduleShift {
    shiftNo: number;
    details: CreateScheduleDetail[];
}

export interface CreateScheduleDetail {
    priority: string;
    codeNo: string;
    size: string;
    qty: number;
    mold: number;
    stockRc: number;
    rim: string;
    boQty: string;
    remainingBoQty: string;
    buildAchQty: number;
    isBuildAch: boolean;
    totalBoQty: string;
    qtyPpl: number;
    rcStockDuration: string;
    rcStockDurationType: string;
    remark: string;
}

export interface UpdateScheduleRequest {
    code?: string;
    date?: string;
    createdBy?: string;
    machines?: CreateScheduleMachine[];
}

// PPC
export interface ScheduleByDateAndLineNo {
    lineNo: number;
    scheduleDate: string;
    details: PpcMachine[];
}

export interface PpcMachine {
    machine: string;
    shifts: PpcShift[];
}

export interface PpcShift {
    shiftNo: number;
    details: PpcDetailItem[];
}

export interface PpcDetailItem {
    priority: string;
    size: number | string;
    qty: number;
    mold: number;
    stockRc: number;
    boQty: number | string | null;
    remainingBoQty: number | string | null;
    buildAchQty: number | null;
    isBuildAch: boolean;
    rim: string | null;
    qtyPpl: number | null;
    rcStockDuration: string | null;
    rcStockDurationType: string | null;
}

// SCHEDULE DETAIL
export interface ScheduleBoard {
    scheduleId: number;
    date: string;
    machineCount: number;
    machines: TodayLineSchedule[];
}

//NEW DASHBOARD
export interface TodayLineSchedule {
    id: string | number;
    machine: string;
    shift: string;
    rows: ScheduleLineDetailToday[];
}

export interface MachineInfo {
    code: string;
    stock: number;
    totalQty: number;
    startTime: string;
    endTime: string;
}

export interface ScheduleLineDetailToday {
    code: string;
    rim?: string;
    rcStock?: number;
    cureShift?: number;
    cureEst?: string;
    balanceOut?: string | number;
    buildTimes?: {
        shift1?: string[];
        shift2?: string[];
        shift3?: string[];
    };
    priority1?: string;
    priority2?: string;
    priority3?: string;
    shift1Qty: number;
    shift2Qty: number;
    shift3Qty: number;
    totalQty?: number;
    remark: string;
    phases: SchedulePhase[];
}

export interface SchedulePhase {
    type: string;
    start: number | string;
    end: number | string;
}

export interface FormItem {
    id: string;
    priority: string;
    codeNo?: string;
    size?: number | string;
    machineNo: string;
    shiftNo: number;
    qty: number;
    remark: string;
    stockRc?: number;
    isManual?: boolean;
    rim?: string | null;
    boQty?: number | string | null;
    qtyPpl?: number | null;
    remainingBoQty?: number | string | null;
    buildAchQty?: number | null;
    isBuildAch?: boolean;
    mold?: number | null;
    rcStockDuration?: string | null;
    rcStockDurationType?: string | null;
}