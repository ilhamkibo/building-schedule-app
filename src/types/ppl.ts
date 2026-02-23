import { PaginationParams } from "./pagination";

export interface PPLParams extends PaginationParams {
    paginate?: boolean;
    month?: number | string;
    year?: number | string;
    isActive?: boolean;
}

export interface PPL {
    id: number;
    createDateTime: string;
    build: string;
    rim: string;
    typeMC: string[];
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
    build: string;
    rim: string;
    typeMC: string[];
    uph: number;
    tireCode: string;
    mold: number;
    moldStock: number;
    qty: number;
    note?: string | null;
}

export interface UpdatePPLRequest {
    createDateTime?: string;
    build?: string;
    rim?: string;
    typeMC?: string[];
    uph?: number;
    tireCode?: string;
    mold?: number;
    moldStock?: number;
    qty?: number;
    note?: string | null;
}
