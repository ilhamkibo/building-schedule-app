export interface Product {
    id: number;
    codeNo: string;
    sizeName: string;
    source: string;
    machines: string[];
    machinesRaw: string | null;
    cycleTimeSeconds: number;
    dandoryTimeSeconds: number;
    manualStock: number;
    buildingAch: number;
    curingAch: number;
    qtyScrap: number;
    faStock: number;
    curingTimeSeconds: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateProductRequest {
    codeNo: string;
    sizeName: string;
    source: string;
    machines: string[];
    machinesRaw?: string | null;
    cycleTimeSeconds: number;
    dandoryTimeSeconds: number;
    manualStock?: number;
    buildingAch?: number;
    curingAch?: number;
    qtyScrap?: number;
    faStock?: number;
    curingTimeSeconds?: number;
}

export interface UpdateProductRequest {
    codeNo?: string;
    sizeName?: string;
    source?: string;
    machines?: string[];
    machinesRaw?: string | null;
    cycleTimeSeconds?: number;
    dandoryTimeSeconds?: number;
    manualStock?: number;
    buildingAch?: number;
    curingAch?: number;
    qtyScrap?: number;
    faStock?: number;
    curingTimeSeconds?: number;
}


