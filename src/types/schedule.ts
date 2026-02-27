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

export interface CreateScheduleItemRequest {
    prioritas: string;
    machineNo: string;
    codeNo: string;
    shift1Qty: number;
    shift2Qty: number;
    shift3Qty: number;
    remark: string;
    stockRc?: number;
    isManual?: boolean;
}

export interface CreateScheduleRequest {
    date: string;
    categoryNo: number;
    items: CreateScheduleItemRequest[];
}

export interface UpdateScheduleRequest {
    code?: string;
    date?: string;
    createdBy?: string;
    items?: CreateScheduleItemRequest[];
}

export interface ScheduleBoard {
    id: number;
    code: string;
    date: string;
    categoryNo: number;
    details: MachineBoardDetail[];
}

export interface MachineBoardDetail {
    machineNo: string;
    details: ScheduleBoardDetailItem[];
}

export interface ScheduleBoardDetailItem {
    detailId: number;
    prioritas: string | null;
    codeNo: string;
    rim: string | null;
    stockRc: number | null;
    cureEst: number | null;
    bo: number | null;
    buildingStart: string | null;
    buildingFinish: string | null;
    shift1Qty: number;
    shift2Qty: number;
    shift3Qty: number;
    fw: number | string | null;
    br: number | string | null;
    deck: string | null;
    timelines: BoardTimelineItem[];
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
    machines: MachineScheduleDetail[];
}

export interface MachineScheduleDetail {
    machineNo: number;
    details: MachineDetailItem[];
}

export interface MachineDetailItem {
    size: number | string;
    codeNo: string;
    qty: number;
    mold: number;
    stockRc: number;
    updatedAt: string;
    prioritas: string;
    boQty: number;
    rim: string;
    fw: string;
    br: string;
    shift1Qty: number;
    shift2Qty: number;
    shift3Qty: number;
    buildingStart: string;
    buildingFinish: string;
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
    detailId: number;
    codeNo: string;
    rim: string | null;
    stockRc: number;
    cureEst: string | null;
    bo: string | null;
    buildingStart: string | null;
    buildingFinish: string | null;
    shift1Qty: number;
    shift2Qty: number;
    shift3Qty: number;
    fw: string | null;
    br: string | null;
    deck: string | null;
    timelines: TimelineItemToday[];
}

export interface MachineScheduleToday {
    machineNo: string;
    details: ScheduleDetailToday[];
}

export interface TodayCategorySchedule {
    id: number;
    code: string;
    date: string;
    categoryNo: number;
    details: MachineScheduleToday[];
}
