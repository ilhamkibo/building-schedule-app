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
    categoryNo: number;
    updatedAt: string | null;
}

export interface CreateScheduleDetail {
    priority: string;
    size: number;
    codeNo: string;
    qty: number;
    rim: string;
    remark: string;
}

export interface CreateScheduleShift {
    shiftNo: number;
    details: CreateScheduleDetail[];
}

export interface CreateScheduleMachine {
    machine: string;
    shifts: CreateScheduleShift[];
}

export interface CreateScheduleRequest {
    date: string;
    categoryNo: number;
    machines: CreateScheduleMachine[];
}

export interface UpdateScheduleRequest {
    code?: string;
    date?: string;
    createdBy?: string;
    machines?: CreateScheduleMachine[];
}

export interface ScheduleBoard {
    id: number;
    code: string;
    date: string;
    categoryNo: number;
    details: MachineBoardDetail[];
}

export interface MachineBoardDetail {
    machine: string;
    shifts: MachineShiftDetail[];
}

export interface MachineShiftDetail {
    shiftNo: number;
    buildingStart: string | null;
    buildingFinish: string | null;
    details: ScheduleBoardDetailItem[];
}

export interface ScheduleBoardDetailItem {
    priority: string | null;
    codeNo: string;
    rim: string | null;
    stockRc: number | null;
    cureEst: number | null;
    bo: number | null;
    buildingStart?: string | null;
    buildingFinish?: string | null;
    loadingTime?: number | null;
    shortageEst?: number | null;
    fw: number | string | null;
    br: number | string | null;
    deck: string | null;
    qty: number;
    remark: string;
    timelines?: BoardTimelineItem[];
}

export interface BoardTimelineItem {
    processType: string;
    startTime: string | null;
    endTime: string | null;
    shift: {
        shiftNo: number;
        shiftName: string;
        startTime: string;
        endTime: string;
        workSeconds: number;
        colorCode: string | null;
        colorBreak: string | null;
    };
}

export interface ScheduleByDateAndCategoryNo {
    id: number;
    scheduleDate: string;
    categoryNo: number;
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
    boQty: number | null;
    rim: string;
}

export interface TimelineItem {
    processType: string;
    startTime: string;
    endTime: string;
    shift: ShiftInfo;
}

export interface ShiftInfo {
    shiftNo: number;
    shiftName: string;
    startTime: string;
    endTime: string;
    workSeconds: number;
    colorCode: string | null;
    colorBreak: string | null;
}

export interface TimelineItemToday {
    processType: string;
    startTime: string | null;
    endTime: string | null;
    shift: string | null;
}

export interface ScheduleDetailToday {
    priority: string | null;
    codeNo: string;
    rim: string | null;
    stockRc: number | null;
    cureEst: string | null;
    bo: string | null;
    buildingStart?: string | null;
    buildingFinish?: string | null;
    qty: number;
    remark: string;
    fw: string | null;
    br: string | null;
    deck: string | null;
    timelines: TimelineItemToday[];
}

export interface MachineShiftToday {
    shiftNo: number;
    buildingStart: string | null;
    buildingFinish: string | null;
    details: ScheduleDetailToday[];
}

export interface MachineScheduleToday {
    machine: string;
    shifts: MachineShiftToday[];
}

export interface TodayCategorySchedule {
    id: number;
    code: string;
    date: string;
    categoryNo: number;
    details: MachineScheduleToday[];
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
    qtyPpl?: string;
}
