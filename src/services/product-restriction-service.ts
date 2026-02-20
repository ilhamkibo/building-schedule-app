import { api } from "@/lib/api";
import { PaginatedResponse, PaginationParams } from "@/types/pagination";
import {
    ProductRestriction,
    CreateProductRestrictionRequest,
    UpdateProductRestrictionRequest
} from "@/types/product-restriction";

class ProductRestrictionService {
    private endpoint = '/product-machine-restrictions';

    async getAll(params?: PaginationParams): Promise<PaginatedResponse<ProductRestriction>> {
        const { data } = await api.get<PaginatedResponse<ProductRestriction>>(this.endpoint, { params });
        return data;
    }

    async getById(id: number): Promise<ProductRestriction> {
        const { data } = await api.get<ProductRestriction>(`${this.endpoint}/${id}`);
        return data;
    }

    async create(payload: CreateProductRestrictionRequest): Promise<ProductRestriction> {
        const { data } = await api.post<ProductRestriction>(this.endpoint, payload);
        return data;
    }

    async update(id: number, payload: UpdateProductRestrictionRequest): Promise<ProductRestriction> {
        const { data } = await api.put<ProductRestriction>(`${this.endpoint}/${id}`, payload);
        return data;
    }

    async delete(id: number): Promise<void> {
        await api.delete(`${this.endpoint}/${id}`);
    }
}

export const productRestrictionService = new ProductRestrictionService();
