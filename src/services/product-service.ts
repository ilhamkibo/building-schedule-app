import { api } from "@/lib/api";
import { Product, CreateProductRequest, UpdateProductRequest, RealtimeBO } from "@/types/product";
import { PaginatedResponse, PaginationParams } from "@/types/pagination";

class ProductService {
    private endpoint = "/Products";

    async getAll(params?: PaginationParams): Promise<PaginatedResponse<Product>> {
        const response = await api.get<PaginatedResponse<Product>>(this.endpoint, {
            params,
        });
        return response.data;
    }

    async getById(id: number): Promise<Product> {
        const response = await api.get<Product>(`${this.endpoint}/${id}`);
        return response.data;
    }

    async create(data: CreateProductRequest): Promise<Product> {
        const response = await api.post<Product>(this.endpoint, data);
        return response.data;
    }

    async update(id: number, data: UpdateProductRequest): Promise<Product> {
        const response = await api.put<Product>(`${this.endpoint}/${id}`, data);
        return response.data;
    }

    async delete(id: number): Promise<void> {
        await api.delete(`${this.endpoint}/${id}`);
    }

    async getRealtimeBO(codes: string[], date: string): Promise<RealtimeBO[]> {
        const response = await api.get<{ status: boolean, message: string, data: RealtimeBO[] }>(`${this.endpoint}/bo-realtime`, {
            params: { codes, date }
        });
        return response.data.data;
    }
}

export const productService = new ProductService();
