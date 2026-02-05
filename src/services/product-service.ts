import { api } from "@/lib/api";
import { Product, CreateProductRequest, UpdateProductRequest } from "@/types/product";
import { PaginatedResponse, PaginationParams } from "@/types/pagination";

class ProductService {
    async getAll(params?: PaginationParams): Promise<PaginatedResponse<Product>> {
        const response = await api.get<PaginatedResponse<Product>>("/Products", {
            params,
        });
        return response.data;
    }

    async getById(id: number): Promise<Product> {
        const response = await api.get<Product>(`/Products/${id}`);
        return response.data;
    }

    async create(data: CreateProductRequest): Promise<Product> {
        const response = await api.post<Product>("/Products", data);
        return response.data;
    }

    async update(id: number, data: UpdateProductRequest): Promise<Product> {
        const response = await api.put<Product>(`/Products/${id}`, data);
        return response.data;
    }

    async delete(id: number): Promise<void> {
        await api.delete(`/Products/${id}`);
    }
}

export const productService = new ProductService();
