import { api } from "@/lib/api";
import { Schedule, CreateScheduleRequest, UpdateScheduleRequest, ScheduleBoard, TodayLineSchedule } from "@/types/schedule";
import { PaginatedResponse, PaginationParams } from "@/types/pagination";
import { ApiResponse } from "@/types/api-response";

class ScheduleService {
    private endpoint = "/Schedules";
    async getAll(params?: PaginationParams): Promise<PaginatedResponse<Schedule>> {
        const response = await api.get<PaginatedResponse<Schedule>>(this.endpoint, {
            params,
        });
        return response.data;
    }

    async getById(id: number): Promise<ApiResponse<ScheduleBoard>> {
        const response = await api.get<ApiResponse<ScheduleBoard>>(`${this.endpoint}/${id}`);
        return response.data;
    }

    async create(data: CreateScheduleRequest): Promise<Schedule> {
        const response = await api.post<Schedule>(this.endpoint, data);
        return response.data;
    }

    async update(id: number, data: UpdateScheduleRequest): Promise<Schedule> {
        const response = await api.put<Schedule>(`${this.endpoint}/${id}`, data);
        return response.data;
    }

    async delete(id: number): Promise<void> {
        await api.delete(`${this.endpoint}/${id}`);
    }

    async getTodayLineSchedule(lineNo: number, date: string): Promise<ApiResponse<TodayLineSchedule[]>> {
        const response = await api.get<ApiResponse<TodayLineSchedule[]>>(`${this.endpoint}/${lineNo}/${date}`);
        return response.data;
    }
}

export const scheduleService = new ScheduleService();
