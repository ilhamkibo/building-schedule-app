export interface Product {
    id: number;
    codeNo: string;
    sizeName: string;
    source: string;
    machines: string[];
    cycleTimeSeconds: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateProductRequest {
    codeNo: string;
    sizeName: string;
    source: string;
    machines: string[];
    cycleTimeSeconds: number;
}

export interface UpdateProductRequest {
    codeNo?: string;
    sizeName?: string;
    source?: string;
    machines?: string[];
    cycleTimeSeconds?: number;
}
