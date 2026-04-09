import { api } from "@/lib/api";
import { PaginatedResponse, PaginationParams } from "@/types/pagination";
import { CuringEfficiency } from "@/types/curing-efficiency";

class CuringEfficiencyService {
    private endpoint = '/curing-efficiencies';

    async getAll(params?: PaginationParams): Promise<PaginatedResponse<CuringEfficiency>> {
        const { data } = await api.get<PaginatedResponse<CuringEfficiency>>(this.endpoint, { params });
        return data;
    }
}

export const curingEfficiencyService = new CuringEfficiencyService();
