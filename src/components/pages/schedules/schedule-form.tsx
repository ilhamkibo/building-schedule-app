"use client";

import { Button } from "@/components/ui/button";
import { useCreateSchedule } from "@/hooks/use-schedule";
import { useProducts } from "@/hooks/use-product";
import { CreateScheduleRequest, CreateScheduleMachine, PpcMachine, PpcShift, PpcDetailItem, FormItem } from "@/types/schedule";
import { useState, useEffect } from "react";
import { Plus, Search, AlertCircle, Database, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useProductScheduleByDateAndLineNo } from "@/hooks/use-product-schedule";
import { useAuthContext } from "@/context/auth-context";
import { Skeleton } from "@/components/ui/skeleton";
import {
    DndContext,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    DragOverlay,
} from "@dnd-kit/core";
import {
    arrayMove,
    sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";

import { ScheduleFormFilters } from "./components/schedule-form-filters";
import { MachineCard } from "./components/machine-card";
import { StaticRow } from "./components/sortable-row";
import { useLines } from "@/hooks/use-line";

export default function ScheduleForm({ onCancel, onSuccess }: { onCancel: () => void, onSuccess: () => void }) {
    const [selectedLineId, setSelectedLineId] = useState<string | undefined>(undefined);
    const [code] = useState(`SCH-${new Date().toISOString().slice(0, 10)}`);
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
    const [items, setItems] = useState<FormItem[]>([]);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [activeId, setActiveId] = useState<string | null>(null);

    const { user } = useAuthContext();
    const canEditBO = user?.role?.toLowerCase() !== "editor";

    // Sensors for DND
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const { data: lines = [] } = useLines();
    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const { data: products = [], isLoading: isProductsLoading } = useProducts({
        search: debouncedSearch,
        limit: 10,
    });

    const selectedLine = lines.find(l => String(l.id) === selectedLineId);
    const lineNoForFetching = selectedLine?.lineNo ? String(selectedLine.lineNo) : "";

    const { data: ppcData, isLoading: isPpcLoading, isError } = useProductScheduleByDateAndLineNo(
        date,
        lineNoForFetching,
        { enabled: !!selectedLineId && !!date && !!lineNoForFetching }
    );

    useEffect(() => {
        if (!ppcData || !("details" in ppcData) || !selectedLineId || !date) {
            return;
        }

        const mapped: FormItem[] = ppcData.details.flatMap((m: PpcMachine) =>
            m.shifts.flatMap((s: PpcShift) =>
                s.details.map((d: PpcDetailItem, idx: number) => ({
                    id: `ppc-${m.machine}-s${s.shiftNo}-${idx}-${Math.random().toString(36).substr(2, 4)}`,
                    priority: d.priority || "none",
                    machineNo: String(m.machine),
                    shiftNo: s.shiftNo,
                    qty: d.qty || 0,
                    remark: d.remark || "",
                    stockRc: d.stockRc || 0,
                    isManual: false,
                    size: d.size,
                    rim: d.rim,
                    qtyPpl: d.qtyPpl || 0,
                    boQty: d.boQty ?? null,
                    remainingBoQty: d.remainingBoQty || 0,
                    buildAchQty: d.buildAchQty || 0,
                    isBuildAch: d.isBuildAch || false,
                    mold: d.mold || 0,
                    rcStockDuration: d.rcStockDuration || "",
                    rcStockDurationType: d.rcStockDurationType || "",
                }))
            )
        );

        setItems(updatePriorities(mapped));
    }, [ppcData, selectedLineId, date]);

    const createMutation = useCreateSchedule({
        onSuccess: () => {
            onSuccess();
        }
    });

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const updateItem = (index: number, updates: Partial<FormItem>) => {
        const newItems = [...items];
        const oldItem = newItems[index];

        const oldIdentifier = String(oldItem.codeNo || oldItem.size || "").trim();

        const isQtyChanged = updates.qty !== undefined && updates.qty !== oldItem.qty;
        const isBoQtyChanged = updates.boQty !== undefined && updates.boQty !== oldItem.boQty;

        // Auto-calculate subsequent shifts qty if qty changes
        if (isQtyChanged && oldIdentifier) {
            const diff = updates.qty! - oldItem.qty;
            const distributionTotal = -diff;

            const subsequentTargetIndices = newItems
                .map((item, idx) => ({ item, idx }))
                .filter(({ item }) => {
                    const itemIdentifier = String(item.codeNo || item.size || "").trim();
                    return String(item.machineNo) === String(oldItem.machineNo)
                        && itemIdentifier === oldIdentifier
                        && Number(item.shiftNo) > Number(oldItem.shiftNo);
                })
                .map(({ idx }) => idx);

            if (subsequentTargetIndices.length > 0) {
                const baseDist = Math.trunc(distributionTotal / subsequentTargetIndices.length);
                const isNegative = distributionTotal < 0;
                let absRemainder = Math.abs(distributionTotal) % subsequentTargetIndices.length;

                subsequentTargetIndices.forEach((targetIdx) => {
                    let amountToAdd = baseDist;
                    if (absRemainder > 0) {
                        amountToAdd += isNegative ? -1 : 1;
                        absRemainder--;
                    }
                    newItems[targetIdx] = {
                        ...newItems[targetIdx],
                        qty: Math.max(0, newItems[targetIdx].qty + amountToAdd)
                    };
                });
            }
        }

        newItems[index] = { ...newItems[index], ...updates };

        const isQtyAffectsBo = isQtyChanged && !oldItem.isBuildAch && oldItem.boQty !== null;

        // Cascade recalculate boQty for the whole sequence if qty or boQty changed
        if ((isQtyAffectsBo || isBoQtyChanged) && oldIdentifier) {
            const allItemsForCode = newItems
                .map((item, idx) => ({ item, idx }))
                .filter(({ item }) => {
                    const itemIdentifier = String(item.codeNo || item.size || "").trim();
                    return itemIdentifier === oldIdentifier;
                });

            if (isBoQtyChanged && updates.boQty !== undefined) {
                const changedShift = Number(oldItem.shiftNo);
                const changedBO = updates.boQty;
                allItemsForCode.forEach(x => {
                    if (Number(x.item.shiftNo) === changedShift) {
                        newItems[x.idx] = { ...newItems[x.idx], boQty: changedBO };
                    }
                });
            }

            const shifts = Array.from(new Set(allItemsForCode.map(x => Number(x.item.shiftNo)))).sort((a, b) => a - b);
            let currentBO = 0;

            for (let i = 0; i < shifts.length; i++) {
                const shift = shifts[i];
                const shiftItems = allItemsForCode.filter(x => Number(x.item.shiftNo) === shift);

                if (i === 0 || (shift === Number(oldItem.shiftNo) && isBoQtyChanged)) {
                    currentBO = Number(newItems[shiftItems[0].idx].boQty) || 0;
                }

                shiftItems.forEach(x => {
                    newItems[x.idx] = { ...newItems[x.idx], boQty: currentBO };
                });

                let shiftDeduction = 0;
                let hasAppliedBuildAchForShift = false;
                shiftItems.forEach(x => {
                    const item = newItems[x.idx];
                    if (item.isBuildAch) {
                        if (!hasAppliedBuildAchForShift) {
                            shiftDeduction += (Number(item.buildAchQty) || 0);
                            hasAppliedBuildAchForShift = true;
                        }
                    } else {
                        shiftDeduction += (Number(item.qty) || 0);
                    }
                });

                currentBO -= shiftDeduction;
            }
        }

        setItems(newItems);
    };

    const updatePriorities = (itemList: FormItem[]) => {
        const priorities = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        const groups: Record<string, FormItem[]> = {};

        itemList.forEach(item => {
            const key = `${item.machineNo}-s${item.shiftNo}`;
            if (!groups[key]) {
                groups[key] = [];
            }
            groups[key].push(item);
        });

        Object.values(groups).forEach(group => {
            group.forEach((item, idx) => {
                item.priority = priorities[idx] || "none";
            });
        });

        return [...itemList];
    };

    const handleDragStart = (event: any) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over || active.id === over.id) return;

        setItems((prev) => {
            const oldIndex = prev.findIndex((item) => item.id === active.id);
            const newIndex = prev.findIndex((item) => item.id === over.id);

            if (oldIndex === -1) return prev;

            const activeItem = { ...prev[oldIndex] };
            let updatedItems = [...prev];

            if (newIndex !== -1) {
                const overItem = prev[newIndex];
                activeItem.machineNo = overItem.machineNo;
                activeItem.shiftNo = overItem.shiftNo;
                updatedItems[oldIndex] = activeItem;
                updatedItems = arrayMove(updatedItems, oldIndex, newIndex);
            }
            else if (String(over.id).includes("container-")) {
                const parts = String(over.id).split("-");
                activeItem.machineNo = parts[1];
                activeItem.shiftNo = parseInt(parts[2]);
                updatedItems[oldIndex] = activeItem;
            }

            return updatePriorities(updatedItems);
        });
    };

    const getNextPriority = (machineNo: string, shiftNo: number) => {
        const priorities = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        const taken = items
            .filter(i => i.machineNo === machineNo && i.shiftNo === shiftNo)
            .map(i => i.priority);
        return priorities.find(p => !taken.includes(p)) || "none";
    };

    const handleAddItem = (mNo: string, sNo: number) => {
        const nextPriority = getNextPriority(mNo, sNo);
        setItems([...items, {
            id: `manual-${mNo}-s${sNo}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            size: "",
            machineNo: mNo,
            codeNo: "",
            shiftNo: sNo,
            qty: 0,
            remark: "",
            stockRc: 0,
            priority: nextPriority,
            isManual: true,
            isBuildAch: false,
            buildAchQty: 0,
            boQty: null,
        }]);
    };

    const handleBulkAddItem = (mNo: string) => {
        const newItems = [1, 2, 3].map(sNo => ({
            id: `manual-${mNo}-s${sNo}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            size: "",
            machineNo: mNo,
            shiftNo: sNo,
            qty: 0,
            remark: "",
            stockRc: 0,
            priority: getNextPriority(mNo, sNo),
            isManual: true,
        }));
        setItems([...items, ...newItems]);
    };

    const handleReset = () => {
        setSelectedLineId(undefined);
        setItems([]);
        toast.success("Form has been reset.");
    };

    const handleSubmit = () => {
        if (!date || items.length === 0) {
            toast.error("Please fill in date and at least one item.");
            return;
        }

        const machinesMap = new Map<string, CreateScheduleMachine>();

        items.forEach(item => {
            if (!machinesMap.has(item.machineNo)) {
                machinesMap.set(item.machineNo, {
                    machine: item.machineNo,
                    shifts: []
                });
            }
            const machine = machinesMap.get(item.machineNo)!;

            let shift = machine.shifts.find(s => s.shiftNo === item.shiftNo);
            if (!shift) {
                shift = {
                    shiftNo: item.shiftNo,
                    details: []
                };
                machine.shifts.push(shift);
            }

            shift.details.push({
                priority: item.priority === "none" ? "" : item.priority,
                codeNo: String(item.codeNo || item.size || "").replace(" ", ""),
                size: String(item.codeNo || item.size || "").replace(" ", ""),
                qty: item.qty || 0,
                mold: item.mold || 0,
                stockRc: item.stockRc || 0,
                rim: item.rim || "",
                boQty: (item.boQty === null || item.boQty === undefined || item.boQty === "") ? null : (item.boQty === "F" || (!isNaN(Number(item.boQty)) && Number(item.boQty) <= 10) ? "F" : String(item.boQty)),
                remainingBoQty: item.remainingBoQty !== null && item.remainingBoQty !== undefined ? String(item.remainingBoQty) : "0",
                buildAchQty: item.buildAchQty || 0,
                isBuildAch: item.isBuildAch || false,
                totalBoQty: "0",
                qtyPpl: item.qtyPpl || 0,
                rcStockDuration: item.rcStockDuration || "",
                rcStockDurationType: item.rcStockDurationType || "",
                remark: item.remark || ""
            });
        });

        const payload: CreateScheduleRequest = {
            date,
            lineNo: Number(lineNoForFetching),
            machines: Array.from(machinesMap.values())
        };
        // console.log("🚀 ~ handleSubmit ~ payload:", payload)
        // toast.success("Schedule has been created.");

        createMutation.mutate(payload);
    };

    const machineNumbers = ppcData && "details" in ppcData
        ? ppcData.details.map(m => m.machine)
        : Array.from(new Set(items.map(i => i.machineNo)));

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="flex flex-col h-full relative">
                <div className="flex-1 overflow-y-auto space-y-6 px-2">
                    <ScheduleFormFilters
                        code={code}
                        date={date}
                        onDateChange={setDate}
                        onLineIdChange={setSelectedLineId}
                        selectedLineId={selectedLineId}
                        lines={lines}
                    />

                    <div className="space-y-6">
                        {!selectedLineId ? (
                            <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg bg-muted/20 text-muted-foreground">
                                <Search className="h-12 w-12 mb-4 opacity-20" />
                                <p className="text-lg font-medium">Please select a Line first</p>
                                <p className="text-sm">Machines will be automatically displayed based on your selection</p>
                            </div>
                        ) : isPpcLoading ? (
                            <div className="space-y-4">
                                {Array.from({ length: 2 }).map((_, i) => (
                                    <div key={i} className="border rounded-lg p-6 bg-background shadow-sm space-y-4">
                                        <div className="flex items-center justify-between border-b pb-2">
                                            <Skeleton className="h-7 w-48" />
                                            <Skeleton className="h-8 w-32" />
                                        </div>
                                        <div className="space-y-2">
                                            <Skeleton className="h-10 w-full" />
                                            <Skeleton className="h-10 w-full" />
                                        </div>
                                    </div>
                                ))}
                                <div className="flex items-center justify-center py-4 text-muted-foreground gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <p className="text-sm">Fetching PPC data...</p>
                                </div>
                            </div>
                        ) : isError ? (
                            <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-red-200 rounded-lg bg-red-50 text-red-600">
                                <AlertCircle className="h-12 w-12 mb-4 opacity-50" />
                                <p className="text-lg font-medium">Failed to fetch PPC data</p>
                                <p className="text-sm">There was an error connecting to the server. Please try again.</p>
                            </div>
                        ) : items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg bg-muted/20 text-muted-foreground">
                                <Database className="h-12 w-12 mb-4 opacity-20" />
                                <p className="text-lg font-medium">No schedule items found</p>
                                <p className="text-sm">No production data available for this category and date.</p>
                            </div>
                        ) : (
                            machineNumbers.map((mNo) => (
                                <MachineCard
                                    key={mNo}
                                    machineNo={mNo}
                                    items={items}
                                    allProducts={products}
                                    isProductsLoading={isProductsLoading}
                                    onAddItem={handleAddItem}
                                    onAddMachineItem={handleBulkAddItem}
                                    onRemoveItem={removeItem}
                                    onUpdateItem={updateItem}
                                    onSearchChange={setSearch}
                                    findItemIndex={(id) => items.findIndex(i => i.id === id)}
                                    canEditBO={canEditBO}
                                />
                            ))
                        )}
                    </div>
                </div>

                <div className="sticky bottom-0 z-20 flex justify-end gap-2 p-4 border-t bg-background shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                    <Button variant="outline" onClick={handleReset}>
                        Reset
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={createMutation.isPending}
                    >
                        {createMutation.isPending ? "Adjusting..." : "Adjust Schedule"}
                    </Button>
                </div>
            </div>

            <DragOverlay dropAnimation={null}>
                {activeId ? (
                    <div className="bg-white border-2 border-primary shadow-2xl rounded-lg overflow-hidden opacity-90 scale-105 transition-transform w-[250px]">
                        <StaticRow
                            item={items.find(i => i.id === activeId)!}
                        />
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
