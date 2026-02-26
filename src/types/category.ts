export interface Category {
    id: number;
    name: string;
    categoryNo: number;
    startCode: number;
    endCode: number;
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
