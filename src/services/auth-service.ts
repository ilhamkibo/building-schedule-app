import { api } from "@/lib/api";
import { LoginRequest, LoginResponse } from "@/types/auth";

class AuthService {
    private endpoint = '/Auth/login';

    async login(params: LoginRequest): Promise<LoginResponse> {
        const { data } = await api.post<LoginResponse>(this.endpoint, params);
        return data;
    }

}

export const authService = new AuthService();