import { PaginationParams } from "./pagination";

export interface PPLParams extends PaginationParams {
    month?: number | string;
    year?: number | string;
    isActive?: boolean;
}

export interface PPL {
    id: number;
    createDateTime: string;
    build: string | null;
    rim: string;
    typeMC: string[] | null;
    uph: number;
    tireCode: string;
    mold: number;
    moldStock: number;
    qty: number;
    note: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreatePPLRequest {
    createDateTime: string;
    build: string | null;
    rim: string;
    typeMC: string[] | null;
    uph: number;
    tireCode: string;
    mold: number;
    moldStock: number;
    qty: number;
    note?: string | null;
}

export interface UpdatePPLRequest {
    createDateTime?: string;
    build?: string | null;
    rim?: string;
    typeMC?: string[] | string | null;
    uph?: number;
    tireCode?: string;
    mold?: number;
    moldStock?: number;
    qty?: number;
    note?: string | null;
}
