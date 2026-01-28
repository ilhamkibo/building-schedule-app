import { AccessToken } from "./access_token";
import { AuthUser } from "./user";

export interface LoginResponse {
    status: string;
    message: string;
    data: {
        user: AuthUser;
        accessToken: AccessToken;
    };
}

export interface LoginRequest {
    username: string;
    password: string;
}
