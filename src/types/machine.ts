import { Line } from "./line";

export interface Machine {
    id: number;
    code: string;
    name: string | null;
    line: Line;
    description: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreateMachineRequest {
    code: string;
    lineId: number;
    name?: string | null;
    description?: string | null;
}

export interface UpdateMachineRequest {
    code?: string;
    lineId?: number;
    name?: string | null;
    description?: string | null;
}
