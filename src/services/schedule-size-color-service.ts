import { api } from "@/lib/api";
import { PaginatedResponse, PaginationParams } from "@/types/pagination";
import {
    ScheduleSizeColor,
    CreateScheduleSizeColorRequest,
    UpdateScheduleSizeColorRequest,
} from "@/types/schedule-size-color";

class ScheduleSizeColorService {
    private endpoint = '/schedule-size-colors';

    async getAll(params?: PaginationParams): Promise<PaginatedResponse<ScheduleSizeColor>> {
        const { data } = await api.get<PaginatedResponse<ScheduleSizeColor>>(this.endpoint, { params });
        return data;
    }

    async getById(id: number): Promise<ScheduleSizeColor> {
        const { data } = await api.get<ScheduleSizeColor>(`${this.endpoint}/${id}`);
        return data;
    }

    async create(payload: CreateScheduleSizeColorRequest): Promise<ScheduleSizeColor> {
        const { data } = await api.post<ScheduleSizeColor>(this.endpoint, payload);
        return data;
    }

    async update(id: number, payload: UpdateScheduleSizeColorRequest): Promise<ScheduleSizeColor> {
        const { data } = await api.put<ScheduleSizeColor>(`${this.endpoint}/${id}`, payload);
        return data;
    }

    async delete(id: number): Promise<void> {
        await api.delete(`${this.endpoint}/${id}`);
    }
}

export const scheduleSizeColorService = new ScheduleSizeColorService();
