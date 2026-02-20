export interface ProductRestrictionDetail {
    id: number;
    machineCode: string;
    reason: string;
}

export interface ProductRestriction {
    id: number;
    codeNo: string;
    details: ProductRestrictionDetail[];
    createdAt: string;
    updatedAt: string;
}

export interface CreateProductRestrictionDetailRequest {
    machineCode: string;
    reason: string;
}

export interface CreateProductRestrictionRequest {
    codeNo: string;
    details: CreateProductRestrictionDetailRequest[];
}

export interface UpdateProductRestrictionRequest {
    codeNo?: string;
    details?: CreateProductRestrictionDetailRequest[];
}
