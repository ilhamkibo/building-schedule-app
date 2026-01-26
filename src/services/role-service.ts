import { api } from "@/lib/api";
import { PaginatedResponse, PaginationParams } from "@/types/pagination";
import { CreateRoleRequest, Role, UpdateRoleRequest } from "@/types/role";

class RoleService {
    private endpoint = '/Roles';

    async getAll(params?: PaginationParams): Promise<PaginatedResponse<Role>> {
        const { data } = await api.get<PaginatedResponse<Role>>(this.endpoint, { params });
        return data;
    }

    async getById(id: number): Promise<Role> {
        const { data } = await api.get<Role>(`${this.endpoint}/${id}`);
        return data;
    }

    async create(role: CreateRoleRequest): Promise<Role> {
        const { data } = await api.post<Role>(this.endpoint, role);
        return data;
    }

    async update(id: number, role: UpdateRoleRequest): Promise<Role> {
        const { data } = await api.put<Role>(`${this.endpoint}/${id}`, role);
        return data;
    }

    async delete(id: number): Promise<void> {
        await api.delete(`${this.endpoint}/${id}`);
    }
}

export const roleService = new RoleService();
