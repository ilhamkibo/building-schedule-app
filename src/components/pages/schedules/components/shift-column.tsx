"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { FormItem } from "@/types/schedule";
import { SortableRow } from "./sortable-row";

interface ShiftColumnProps {
    machineNo: string;
    shiftNo: number;
    items: FormItem[];
    allProducts: any[];
    isProductsLoading: boolean;
    onAddItem: (machineNo: string, shiftNo: number) => void;
    onRemoveItem: (index: number) => void;
    onUpdateItem: (index: number, updates: Partial<FormItem>) => void;
    onSearchChange: (search: string) => void;
    findItemIndex: (id: string) => number;
    canEditBO?: boolean;
}

export function ShiftColumn({
    machineNo,
    shiftNo,
    items,
    allProducts,
    isProductsLoading,
    onAddItem,
    onRemoveItem,
    onUpdateItem,
    onSearchChange,
    findItemIndex,
    canEditBO = true,
}: ShiftColumnProps) {
    const { setNodeRef } = useDroppable({
        id: `container-${machineNo}-${shiftNo}`,
    });

    return (
        <div
            ref={setNodeRef}
            className="flex-1 flex flex-col bg-background rounded-md border border-dashed border-muted-foreground/20 p-2 min-h-37.5"
        >
            <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${shiftNo === 1 ? 'bg-blue-500' : shiftNo === 2 ? 'bg-orange-500' : 'bg-purple-500'}`} />
                    <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Shift {shiftNo}</h4>
                </div>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full hover:bg-primary/10 hover:text-primary"
                    onClick={() => onAddItem(machineNo, shiftNo)}
                >
                    <Plus className="h-4 w-4" />
                </Button>
            </div>

            <SortableContext
                id={`container-${machineNo}-${shiftNo}`}
                items={items.map(i => i.id)}
                strategy={verticalListSortingStrategy}
            >
                <div className="space-y-2 flex-1">
                    {items.map((item) => (
                        <SortableRow
                            key={item.id}
                            item={item}
                            index={findItemIndex(item.id)}
                            removeItem={onRemoveItem}
                            updateItem={onUpdateItem}
                            products={allProducts}
                            isProductsLoading={isProductsLoading}
                            setSearch={onSearchChange}
                            canEditBO={canEditBO}
                        />
                    ))}
                    {items.length === 0 && (
                        <div className="flex-1 flex items-center justify-center p-4 border-2 border-dashed rounded-md bg-muted/5 text-muted-foreground/30 text-xs italic">
                            Empty shift
                        </div>
                    )}
                </div>
            </SortableContext>
        </div>
    );
}
