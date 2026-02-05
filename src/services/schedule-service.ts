import { api } from "@/lib/api";
import { Schedule, CreateScheduleRequest, UpdateScheduleRequest, ScheduleBoard } from "@/types/schedule";
import { PaginatedResponse, PaginationParams } from "@/types/pagination";
import { ApiResponse } from "@/types/api-response";

class ScheduleService {
    async getAll(params?: PaginationParams): Promise<PaginatedResponse<Schedule>> {
        const response = await api.get<PaginatedResponse<Schedule>>("/Schedules", {
            params,
        });
        return response.data;
    }

    async getById(id: number): Promise<ApiResponse<ScheduleBoard>> {
        const response = await api.get<ApiResponse<ScheduleBoard>>(`/Schedules/${id}`);
        return response.data;
    }

    async create(data: CreateScheduleRequest): Promise<Schedule> {
        const response = await api.post<Schedule>("/Schedules", data);
        return response.data;
    }

    async update(id: number, data: UpdateScheduleRequest): Promise<Schedule> {
        const response = await api.put<Schedule>(`/Schedules/${id}`, data);
        return response.data;
    }

    async delete(id: number): Promise<void> {
        await api.delete(`/Schedules/${id}`);
    }
}

export const scheduleService = new ScheduleService();
