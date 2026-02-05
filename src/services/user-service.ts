import { api } from "@/lib/api";
import { PaginatedResponse, PaginationParams } from "@/types/pagination";
import { CreateUserRequest, User, UpdateUserRequest } from "@/types/user";

class UserService {
    private endpoint = '/Users';

    async getAll(params?: PaginationParams): Promise<PaginatedResponse<User>> {
        const { data } = await api.get<PaginatedResponse<User>>(this.endpoint, { params });
        return data;
    }

    async getById(id: number): Promise<User> {
        const { data } = await api.get<User>(`${this.endpoint}/${id}`);
        return data;
    }

    async create(user: CreateUserRequest): Promise<User> {
        const { data } = await api.post<User>(this.endpoint, user);
        return data;
    }

    async update(id: number, user: UpdateUserRequest): Promise<User> {
        const { data } = await api.put<User>(`${this.endpoint}/${id}`, user);
        return data;
    }

    async delete(id: number): Promise<void> {
        await api.delete(`${this.endpoint}/${id}`);
    }
}

export const userService = new UserService();
