import { Line } from "./line";

export interface Category {
    id: number;
    name: string;
    categoryNo: number;
    startCode: number;
    endCode: number;
    lines?: Line[];
    createdAt: string;
    updatedAt: string;
}

export interface CreateCategoryRequest {
    name: string;
    startCode: number;
    endCode: number;
}

export interface UpdateCategoryRequest {
    name?: string;
    startCode?: number;
    endCode?: number;
}

export interface AssignLinesRequest {
    categoryId: number;
    lineIds: number[];
}
