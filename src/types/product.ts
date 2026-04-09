export interface Product {
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
    tireInch: number;
    beadRingDiameter: number;
    formerWidth: number;
    rim: number;
}

export interface RealtimeBO {
    sizeCode: string;
    date: string;
    shift: number;
    initialBo: string | null;
    realtimeBo: string | null;
    totalAchievement: number;
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


