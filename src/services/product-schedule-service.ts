import { api } from "@/lib/api";
import { ProductSchedule, ProductScheduleParams } from "@/types/product-schedule";
import { PaginatedResponse } from "@/types/pagination";
import { ScheduleByDateAndCategoryNo } from "@/types/schedule";
import { ApiResponse } from "@/types/api-response";

class ProductScheduleService {
    private endpoint = "/product-schedules";

    async getAll(params?: ProductScheduleParams): Promise<PaginatedResponse<ProductSchedule>> {
        const response = await api.get<PaginatedResponse<ProductSchedule>>(this.endpoint, {
            params,
        });
        return response.data;
    }

    async getByDateAndCategoryNo(date: string, categoryNo: string): Promise<ApiResponse<ScheduleByDateAndCategoryNo>> {
        const response = await api.get<ApiResponse<ScheduleByDateAndCategoryNo>>(`${this.endpoint}/by-category-date`, {
            params: {
                date,
                categoryNo,
            },
        });
        return response.data;
    }
}

export const productScheduleService = new ProductScheduleService();
