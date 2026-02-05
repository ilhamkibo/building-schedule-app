import { Role } from "./role";

export interface User {
    id: number;
    name: string;
    username: string;
    role: Role;
    createdAt: string;
    updatedAt: string;
}

export type AuthUser = {
    name: string;
    username: string;
    role: string;
};

export interface CreateUserRequest {
    name: string;
    username: string;
    password: string;
    passwordConfirmation: string;
    roleId: number;
}

export interface UpdateUserRequest {
    name?: string;
    username?: string;
    password?: string;
    passwordConfirmation?: string;
    roleId?: number;
}
