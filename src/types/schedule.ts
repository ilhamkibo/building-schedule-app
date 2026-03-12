

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
    size: number;
    qty: number;
    rim: string;
    boQty: number;
    totalBoQty: number;
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
    prioritas: string;
    size: number | string;
    codeNo: string;
    qty: number;
    mold: number;
    stockRc: number;
    totalBoQty: number;
    boQty: number | null;
    rim: string;
    qtyPpl: number;
    buildingStart: string | null;
    buildingFinish: string | null;
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
    buildTime1?: string;
    buildTime2?: string;
    buildTime3?: string;
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
    prioritas: string;
    machineNo: string;
    codeNo: string;
    shiftNo: number;
    qty: number;
    remark: string;
    stockRc?: number;
    isManual?: boolean;
    size?: number | string;
    rim?: string;
    boQty?: number;
    totalBoQty?: number;
    qtyPpl?: number;
}