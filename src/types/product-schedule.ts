import { PaginationParams } from "./pagination";

export interface ProductSchedule {
    factoryKbn: string;
    datePlan: string; // "20260125"
    lineNo: number;
    machineNo: number;
    sizeCode: number;
    qtyPlan: number;
    qtyMold: number;
    remark: string;
    updatedAt: string;
}

export interface ProductScheduleParams extends PaginationParams {
    Date?: string;
    LineNo?: number;
    Paginate?: boolean;
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
