export interface ScheduleSizeColor {
    typeCode: string;
    typeName: string;
    description: string;
    priority: number;
    textColorHex: string;
    backgroundColorHex: string;
    createdAt: string;
    updatedAt: string;
    details: string[];
}

export interface CreateScheduleSizeColorRequest {
    typeCode: string;
    typeName: string;
    description?: string;
    priority?: number;
    textColorHex: string;
    backgroundColorHex: string;
}

export interface UpdateScheduleSizeColorRequest {
    typeCode?: string;
    typeName?: string;
    description?: string;
    priority?: number;
    textColorHex?: string;
    backgroundColorHex?: string;
}
