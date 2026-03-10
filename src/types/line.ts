import { Machine } from "./machine";

export interface Line {
    id: number;
    name: string | null;
    lineNo: number;
    description: string | null;
    machines: Machine[];
    createdAt: string;
    updatedAt: string;
}

export interface CreateLineRequest {
    name?: string | null;
    lineNo?: number;
    description?: string | null;
}

export interface UpdateLineRequest {
    name?: string | null;
    lineNo?: number;
    description?: string | null;
}
