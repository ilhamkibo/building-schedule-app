import { api } from "@/lib/api";
import { PaginatedResponse, PaginationParams } from "@/types/pagination";
import { CreateLineRequest, Line, UpdateLineRequest } from "@/types/line";

class LineService {
    private endpoint = '/Lines';

    async getAll(params?: PaginationParams): Promise<PaginatedResponse<Line>> {
        const { data } = await api.get<PaginatedResponse<Line>>(this.endpoint, { params });
        return data;
    }

    async getById(id: number): Promise<Line> {
        const { data } = await api.get<Line>(`${this.endpoint}/${id}`);
        return data;
    }

    async create(line: CreateLineRequest): Promise<Line> {
        const { data } = await api.post<Line>(this.endpoint, line);
        return data;
    }

    async update(id: number, line: UpdateLineRequest): Promise<Line> {
        const { data } = await api.put<Line>(`${this.endpoint}/${id}`, line);
        return data;
    }

    async delete(id: number): Promise<void> {
        await api.delete(`${this.endpoint}/${id}`);
    }
}

export const lineService = new LineService();
