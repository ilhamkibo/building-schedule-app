import { api } from "@/lib/api";
import { PaginatedResponse, PaginationParams } from "@/types/pagination";
import { Category, CreateCategoryRequest, UpdateCategoryRequest, AssignLinesRequest } from "@/types/category";

class CategoryService {
    private endpoint = '/categories';

    async getAll(params?: PaginationParams): Promise<PaginatedResponse<Category>> {
        const { data } = await api.get<PaginatedResponse<Category>>(this.endpoint, { params });
        return data;
    }

    async getById(id: number): Promise<Category> {
        const { data } = await api.get<Category>(`${this.endpoint}/${id}`);
        return data;
    }

    async create(category: CreateCategoryRequest): Promise<Category> {
        const { data } = await api.post<Category>(this.endpoint, category);
        return data;
    }

    async update(id: number, category: UpdateCategoryRequest): Promise<Category> {
        const { data } = await api.put<Category>(`${this.endpoint}/${id}`, category);
        return data;
    }

    async delete(id: number): Promise<void> {
        await api.delete(`${this.endpoint}/${id}`);
    }

    async assignLines(payload: AssignLinesRequest): Promise<void> {
        await api.post(`${this.endpoint}/assign-lines/${payload.categoryId}`, payload);
    }
}

export const categoryService = new CategoryService();
