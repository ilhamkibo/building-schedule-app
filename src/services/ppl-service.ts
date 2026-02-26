import { api } from "@/lib/api";
import { PPL, CreatePPLRequest, UpdatePPLRequest, PPLParams } from "@/types/ppl";
import { PaginatedResponse } from "@/types/pagination";

class PPLService {
    private endpoint = "/PPLs";
    async getAll(params?: PPLParams): Promise<PaginatedResponse<PPL>> {
        const response = await api.get<PaginatedResponse<PPL>>(this.endpoint, {
            params,
        });
        return response.data;
    }

    async getById(id: number): Promise<PPL> {
        const response = await api.get<PPL>(`${this.endpoint}/${id}`);
        return response.data;
    }

    async create(data: CreatePPLRequest): Promise<PPL> {
        const response = await api.post<PPL>(this.endpoint, data);
        return response.data;
    }

    async update(id: number, data: UpdatePPLRequest): Promise<PPL> {
        const response = await api.put<PPL>(`${this.endpoint}/${id}`, data);
        return response.data;
    }

    async delete(id: number): Promise<void> {
        await api.delete(`${this.endpoint}/${id}`);
    }
}

export const pplService = new PPLService();
