import { api } from "@/lib/api";
import { PPL, CreatePPLRequest, UpdatePPLRequest } from "@/types/ppl";
import { PaginatedResponse, PaginationParams } from "@/types/pagination";

class PPLService {
    async getAll(params?: PaginationParams): Promise<PaginatedResponse<PPL>> {
        const response = await api.get<PaginatedResponse<PPL>>("/PPLs", {
            params,
        });
        return response.data;
    }

    async getById(id: number): Promise<PPL> {
        const response = await api.get<PPL>(`/PPLs/${id}`);
        return response.data;
    }

    async create(data: CreatePPLRequest): Promise<PPL> {
        const response = await api.post<PPL>("/PPLs", data);
        return response.data;
    }

    async update(id: number, data: UpdatePPLRequest): Promise<PPL> {
        const response = await api.put<PPL>(`/PPLs/${id}`, data);
        return response.data;
    }

    async delete(id: number): Promise<void> {
        await api.delete(`/PPLs/${id}`);
    }
}

export const pplService = new PPLService();
