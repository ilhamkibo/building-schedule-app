import { api } from "@/lib/api";
import { PaginatedResponse, PaginationParams } from "@/types/pagination";
import { CreateMachineRequest, Machine, UpdateMachineRequest } from "@/types/machine";

class MachineService {
    private endpoint = '/Machines';

    async getAll(params?: PaginationParams): Promise<PaginatedResponse<Machine>> {
        const { data } = await api.get<PaginatedResponse<Machine>>(this.endpoint, { params });
        return data;
    }

    async getById(id: number): Promise<Machine> {
        const { data } = await api.get<Machine>(`${this.endpoint}/${id}`);
        return data;
    }

    async create(machine: CreateMachineRequest): Promise<Machine> {
        const { data } = await api.post<Machine>(this.endpoint, machine);
        return data;
    }

    async update(id: number, machine: UpdateMachineRequest): Promise<Machine> {
        const { data } = await api.put<Machine>(`${this.endpoint}/${id}`, machine);
        return data;
    }

    async delete(id: number): Promise<void> {
        await api.delete(`${this.endpoint}/${id}`);
    }
}

export const machineService = new MachineService();
