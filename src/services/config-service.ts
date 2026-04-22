import { api } from "@/lib/api";
import { PaginatedResponse, PaginationParams } from "@/types/pagination";
import { CreateConfigRequest, Config, UpdateConfigRequest } from "@/types/config";

class ConfigService {
    private endpoint = '/config';

    async getAll(params?: PaginationParams): Promise<PaginatedResponse<Config>> {
        const { data } = await api.get<PaginatedResponse<Config>>(this.endpoint, { params });
        return data;
    }

    async getById(id: number): Promise<Config> {
        const { data } = await api.get<Config>(`${this.endpoint}/${id}`);
        return data;
    }

    async create(config: CreateConfigRequest): Promise<Config> {
        const { data } = await api.post<Config>(this.endpoint, config);
        return data;
    }

    async update(id: number, config: UpdateConfigRequest): Promise<Config> {
        const { data } = await api.put<Config>(`${this.endpoint}/${id}`, config);
        return data;
    }

    async delete(id: number): Promise<void> {
        await api.delete(`${this.endpoint}/${id}`);
    }
}

export const configService = new ConfigService();
