export interface Role {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}
export interface CreateRoleRequest {
    name: string;
}

export interface UpdateRoleRequest {
    name?: string;
}
