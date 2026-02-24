"use client";

import { Product } from "@/types/product";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Package,
    Factory,
    Clock,
    Timer,
    Layers,
    TrendingUp,
    ClipboardCheck,
    Database,
    Trash2
} from "lucide-react";

interface ProductDetailsProps {
    product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
    return (
        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label className="text-muted-foreground text-[10px] uppercase font-bold">Code No</Label>
                    <div className="text-lg font-semibold flex items-center gap-2">
                        <Package className="h-4 w-4 text-primary" />
                        {product.codeNo}
                    </div>
                </div>
                <div className="space-y-1">
                    <Label className="text-muted-foreground text-[10px] uppercase font-bold">Source</Label>
                    <div>
                        <Badge variant="outline" className="font-mono text-xs">
                            {product.source}
                        </Badge>
                    </div>
                </div>
            </div>

            <div className="space-y-1">
                <Label className="text-muted-foreground text-[10px] uppercase font-bold">Size Name</Label>
                <div className="text-sm font-medium leading-relaxed p-3 border rounded-md bg-muted/20">
                    {product.sizeName}
                </div>
            </div>

            {/* Inventory Section */}
            <div className="space-y-3">
                <Label className="text-[10px] uppercase font-bold flex items-center gap-1 text-orange-500">
                    <Database className="h-3 w-3" /> Inventory & Stock
                </Label>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 border rounded-md bg-orange-500/5">
                        <Label className="text-muted-foreground text-[10px] uppercase font-medium">Manual Stock</Label>
                        <div className="text-base font-bold">{product.manualStock ?? 0}</div>
                    </div>
                    <div className="p-3 border rounded-md bg-orange-500/5">
                        <Label className="text-muted-foreground text-[10px] uppercase font-medium">FA Stock</Label>
                        <div className="text-base font-bold">{product.faStock ?? 0}</div>
                    </div>
                </div>
            </div>

            {/* Achievement Section */}
            <div className="space-y-3">
                <Label className="text-[10px] uppercase font-bold flex items-center gap-1 text-green-500">
                    <TrendingUp className="h-3 w-3" /> Production Achievement
                </Label>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 border rounded-md bg-green-500/5">
                        <Label className="text-muted-foreground text-[10px] uppercase font-medium">Building Ach</Label>
                        <div className="text-base font-bold text-green-600">{product.buildingAch ?? 0}</div>
                    </div>
                    <div className="p-3 border rounded-md bg-green-500/5">
                        <Label className="text-muted-foreground text-[10px] uppercase font-medium">Curing Ach</Label>
                        <div className="text-base font-bold text-green-600">{product.curingAch ?? 0}</div>
                    </div>
                </div>
            </div>

            {/* Production Timings */}
            <div className="space-y-3">
                <Label className="text-[10px] uppercase font-bold flex items-center gap-1 text-blue-500">
                    <Clock className="h-3 w-3" /> Performance & Timing
                </Label>
                <div className="grid grid-cols-3 gap-3">
                    <div className="p-2 border rounded-md bg-blue-500/5 text-center">
                        <Label className="text-muted-foreground text-[9px] uppercase font-medium truncate block">Cycle</Label>
                        <div className="text-sm font-bold">{product.cycleTimeSeconds}s</div>
                    </div>
                    <div className="p-2 border rounded-md bg-blue-500/5 text-center">
                        <Label className="text-muted-foreground text-[9px] uppercase font-medium truncate block">Dandory</Label>
                        <div className="text-sm font-bold">{product.dandoryTimeSeconds}s</div>
                    </div>
                    <div className="p-2 border rounded-md bg-blue-500/5 text-center">
                        <Label className="text-muted-foreground text-[9px] uppercase font-medium truncate block">Curing</Label>
                        <div className="text-sm font-bold">{product.curingTimeSeconds ?? 0}s</div>
                    </div>
                </div>
                <div className="flex items-center gap-2 p-2 border rounded-md bg-red-500/5">
                    <Trash2 className="h-4 w-4 text-red-500" />
                    <span className="text-xs font-medium">Quantity Scrap:</span>
                    <span className="text-sm font-bold text-red-600">{product.qtyScrap ?? 0}</span>
                </div>
            </div>

            {/* Machines Section */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <Label className="text-[10px] uppercase font-bold flex items-center gap-1 text-purple-500">
                        <Factory className="h-3 w-3" /> Compatible Machines
                    </Label>
                    {product.machinesRaw && (
                        <Badge variant="secondary" className="text-[9px] font-normal px-2 py-0">
                            RAW: {product.machinesRaw}
                        </Badge>
                    )}
                </div>
                <div className="flex flex-wrap gap-2">
                    {product.machines && product.machines.length > 0 ? (
                        product.machines.map((m) => (
                            <Badge key={m} variant="secondary" className="px-2 py-1 gap-1 text-xs">
                                <Layers className="h-3 w-3 opacity-70 text-purple-500" />
                                {m}
                            </Badge>
                        ))
                    ) : (
                        <p className="text-xs text-muted-foreground italic">No machines assigned</p>
                    )}
                </div>
            </div>

            <div className="pt-4 border-t flex justify-between text-[10px] text-muted-foreground uppercase font-medium bg-background sticky bottom-0 py-2">
                <span>ID: {product.id}</span>
                <span>Created: {new Date(product.createdAt).toLocaleDateString()}</span>
            </div>
        </div>
    );
}
