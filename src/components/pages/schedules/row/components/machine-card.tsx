"use client";

import { FormItem } from "@/types/schedule";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShiftColumn } from "./shift-column";

interface MachineCardProps {
    machineNo: string;
    items: FormItem[];
    allProducts: any[];
    isProductsLoading: boolean;
    onAddItem: (machineNo: string, shiftNo: number) => void;
    onRemoveItem: (index: number) => void;
    onUpdateItem: (index: number, updates: Partial<FormItem>) => void;
    onSearchChange: (search: string) => void;
    findItemIndex: (id: string) => number;
    onAddMachineItem?: (machineNo: string) => void;
}

export function MachineCard({
    machineNo,
    items,
    allProducts,
    isProductsLoading,
    onAddItem,
    onRemoveItem,
    onUpdateItem,
    onSearchChange,
    findItemIndex,
    onAddMachineItem,
}: MachineCardProps) {
    return (
        <div className="space-y-4 border rounded-lg p-3 bg-muted/5 shadow-sm">
            <div className="flex items-center justify-between border-b pb-2 px-1">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <div className="w-2 h-6 bg-primary rounded-full" />
                    Machine: <span className="text-primary">{machineNo}</span>
                </h3>
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-2 border-primary/20 hover:bg-primary/5 hover:text-primary transition-colors px-3 font-semibold text-xs uppercase tracking-wider"
                    onClick={() => onAddMachineItem?.(machineNo)}
                >
                    <Plus className="w-3.5 h-3.5" />
                    Add to All Shifts
                </Button>
            </div>

            <div className="flex flex-col gap-3">
                {[1, 2, 3].map((sNo) => (
                    <ShiftColumn
                        key={sNo}
                        machineNo={machineNo}
                        shiftNo={sNo}
                        items={items.filter(i => i.machineNo === machineNo && i.shiftNo === sNo)}
                        allProducts={allProducts}
                        isProductsLoading={isProductsLoading}
                        onAddItem={onAddItem}
                        onRemoveItem={onRemoveItem}
                        onUpdateItem={onUpdateItem}
                        onSearchChange={onSearchChange}
                        findItemIndex={findItemIndex}
                    />
                ))}
            </div>
        </div>
    );
}
