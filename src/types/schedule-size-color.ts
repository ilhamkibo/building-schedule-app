export interface ScheduleSizeColor {
    id: number;
    typeCode: string;
    typeName: string;
    description: string;
    sortOrder: number;
    textColorHex: string;
    backgroundColorHex: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateScheduleSizeColorRequest {
    typeCode: string;
    typeName: string;
    description?: string;
    sortOrder?: number;
    textColorHex: string;
    backgroundColorHex: string;
}

export interface UpdateScheduleSizeColorRequest {
    typeCode?: string;
    typeName?: string;
    description?: string;
    sortOrder?: number;
    textColorHex?: string;
    backgroundColorHex?: string;
}
