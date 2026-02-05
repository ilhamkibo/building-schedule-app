export interface Line {
    id: number;
    code: string;
    name: string | null;
    description: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreateLineRequest {
    code: string;
    name?: string | null;
    description?: string | null;
}

export interface UpdateLineRequest {
    code?: string;
    name?: string | null;
    description?: string | null;
}
