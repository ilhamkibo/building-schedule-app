import { api } from "@/lib/api";
import { PaginatedResponse, PaginationParams } from "@/types/pagination";
import { ScheduleSizeType } from "@/types/schedule-size-type";

class ScheduleSizeTypeService {
    private endpoint = '/schedule-size-types';

    async getAll(params?: PaginationParams): Promise<PaginatedResponse<ScheduleSizeType>> {
        const { data } = await api.get<PaginatedResponse<ScheduleSizeType>>(this.endpoint, { params });
        return data;
    }
}

export const scheduleSizeTypeService = new ScheduleSizeTypeService();
