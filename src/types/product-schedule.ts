import { PaginationParams } from "./pagination";

export interface ProductSchedule {
    cat: number;
    date: string; // "20260125"
    mc: number;
    sizeCode: number;
    qty: number;
    mold: number;
    updatedAt: string; // "2026-02-24T14:06:00"
}

export interface ProductScheduleParams extends PaginationParams {
    date?: string;
    categoryNo?: number;
}

export interface MachineDetailItem {
    size: number;
    qty: number;
    mold: number;
    updatedAt: string;
}

export interface PPCMachine {
    machineNo: number;
    details: MachineDetailItem[];
}

export interface ProductScheduleDetail {
    categoryNo: number;
    scheduleDate: string;
    machines: PPCMachine[];
}
