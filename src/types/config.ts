export interface Config {
    id: number;
    configKey: string;
    configValue: string;
    description: string;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateConfigRequest {
    configKey: string;
    configValue: string;
    description: string;
    isActive: boolean;
}

export interface UpdateConfigRequest {
    configKey: string;
    configValue: string;
    description: string;
    isActive: boolean;
}
