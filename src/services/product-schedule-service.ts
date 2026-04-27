import { api } from "@/lib/api";
import { ProductSchedule, ProductScheduleParams } from "@/types/product-schedule";
import { PaginatedResponse } from "@/types/pagination";
import { ScheduleByDateAndLineNo } from "@/types/schedule";
import { ApiResponse } from "@/types/api-response";

class ProductScheduleService {
    private endpoint = "/ppc-schedules";

    async getAll(params?: ProductScheduleParams): Promise<PaginatedResponse<ProductSchedule>> {
        const response = await api.get<PaginatedResponse<ProductSchedule>>(this.endpoint, {
            params: {
                ...params,
                paginate: params?.paginate ?? true,
            },
        });
        return response.data;
    }

    async getByDateAndLineNo(date: string, lineNo: string): Promise<ApiResponse<ScheduleByDateAndLineNo>> {
        const response = await api.get<ApiResponse<ScheduleByDateAndLineNo>>(`${this.endpoint}/by-line-date`, {
            params: {
                date,
                lineNo,
            },
            validateStatus: (status) => status < 400 || status === 404,
        });

        // 404 means no PPC data exists for this line/date — return empty data
        if (response.status === 404) {
            return {
                status: "success",
                message: "Data tidak ada",
                data: {
                    lineNo: Number(lineNo),
                    scheduleDate: date,
                    details: [],
                },
            };
        }

        return response.data;
    }
}

export const productScheduleService = new ProductScheduleService();
