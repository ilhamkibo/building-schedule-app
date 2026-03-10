import { api } from "@/lib/api";
import { ProductSchedule, ProductScheduleParams } from "@/types/product-schedule";
import { PaginatedResponse } from "@/types/pagination";
import { ScheduleByDateAndLineNo } from "@/types/schedule";
import { ApiResponse } from "@/types/api-response";

class ProductScheduleService {
    private endpoint = "/product-schedules";

    async getAll(params?: ProductScheduleParams): Promise<PaginatedResponse<ProductSchedule>> {
        const response = await api.get<PaginatedResponse<ProductSchedule>>(this.endpoint, {
            params,
        });
        return response.data;
    }

    async getByDateAndLineNo(date: string, lineNo: string): Promise<ApiResponse<ScheduleByDateAndLineNo>> {
        const response = await api.get<ApiResponse<ScheduleByDateAndLineNo>>(`${this.endpoint}/by-line-date`, {
            params: {
                date,
                lineNo,
            },
        });
        return response.data;
    }
}

export const productScheduleService = new ProductScheduleService();
