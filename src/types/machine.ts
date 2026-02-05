export interface Machine {
    id: number;
    code: string;
    name: string | null;
    description: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreateMachineRequest {
    code: string;
    name?: string | null;
    description?: string | null;
}

export interface UpdateMachineRequest {
    code?: string;
    name?: string | null;
    description?: string | null;
}
