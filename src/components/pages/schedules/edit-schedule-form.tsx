"use client";

import { Button } from "@/components/ui/button";
import { useUpdateScheduleByLineAndDate } from "@/hooks/use-schedule";
import { useProducts } from "@/hooks/use-product";
import { CreateScheduleRequest, CreateScheduleMachine, CreateScheduleShift, CreateScheduleDetail, FormItem, ScheduleBoard } from "@/types/schedule";
import { useState, useEffect } from "react";
import { Database, Loader2, PencilLine, X } from "lucide-react";
import { toast } from "sonner";
import { useAuthContext } from "@/context/auth-context";
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

import { MachineCard } from "./components/machine-card";
import { StaticRow } from "./components/sortable-row";

/**
 * Convert ScheduleBoard (from GET /api/schedules/{id}) into FormItem[] for editing.
 * API response format: machines[].shifts[].details[]
 */
function boardToFormItems(board: ScheduleBoard): FormItem[] {
    const items: FormItem[] = [];
    const machines = board.machines || [];

    machines.forEach((machine: CreateScheduleMachine) => {
        const machineNo = String(machine.machine);

        (machine.shifts || []).forEach((shift: CreateScheduleShift) => {
            (shift.details || []).forEach((detail: CreateScheduleDetail, detailIdx: number) => {
                items.push({
                    id: `edit-${machineNo}-s${shift.shiftNo}-${detailIdx}-${Math.random().toString(36).substr(2, 4)}`,
                    priority: detail.priority || "none",
                    codeNo: detail.codeNo,
                    size: detail.size || detail.codeNo,
                    qty: detail.qty || 0,
                    mold: detail.mold || 0,
                    stockRc: detail.stockRc || 0,
                    rim: detail.rim || "",
                    boQty: detail.boQty || 0,
                    remainingBoQty: detail.remainingBoQty || 0,
                    buildAchQty: detail.buildAchQty || 0,
                    isBuildAch: detail.isBuildAch || false,
                    qtyPpl: detail.qtyPpl || 0,
                    rcStockDuration: detail.rcStockDuration || "",
                    rcStockDurationType: detail.rcStockDurationType || "",
                    remark: detail.remark || "",
                    machineNo,
                    shiftNo: shift.shiftNo,
                    isManual: false,
                });
            });
        });
    });

    return items;
}

interface EditScheduleFormProps {
    board: ScheduleBoard;
    lineNo: number;
    onCancel: () => void;
    onSuccess: () => void;
}

export default function EditScheduleForm({ board, lineNo, onCancel, onSuccess }: EditScheduleFormProps) {
    const [date] = useState(board.date);

    const [items, setItems] = useState<FormItem[]>([]);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [activeId, setActiveId] = useState<string | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

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

    // Initialize items from board data directly
    useEffect(() => {
        if (board && board.machines && !isInitialized) {
            const mapped = boardToFormItems(board);
            setItems(updatePriorities(mapped));
            setIsInitialized(true);
        }
    }, [board, isInitialized]);

    const updateMutation = useUpdateScheduleByLineAndDate({
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

        // Auto-calculate subsequent shifts qty if qty changes (within same machine only)
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

        const isQtyAffectsBo = isQtyChanged && !oldItem.isBuildAch;

        // Cascade recalculate boQty for the whole sequence if qty or boQty changed (global across machines)
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
            shiftNo: sNo,
            qty: 0,
            remark: "",
            stockRc: 0,
            priority: nextPriority,
            isManual: true,
            isBuildAch: false,
            buildAchQty: 0,
            boQty: 0,
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
            isBuildAch: false,
            buildAchQty: 0,
            boQty: 0,
        }));
        setItems([...items, ...newItems]);
    };

    const handleSubmit = () => {
        if (!date || items.length === 0) {
            toast.error("Please ensure you have items.");
            return;
        }

        if (!lineNo) {
            toast.error("Line number is missing. Cannot update.");
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
                codeNo: String(item.codeNo || item.size || ""),
                size: String(item.size || item.codeNo || ""),
                qty: item.qty || 0,
                mold: item.mold || 0,
                stockRc: item.stockRc || 0,
                rim: item.rim || "",
                boQty: item.boQty !== null && item.boQty !== undefined ? String(item.boQty) : "0",
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
            lineNo: Number(lineNo),
            machines: Array.from(machinesMap.values())
        };

        updateMutation.mutate({ lineNo: Number(lineNo), date, data: payload });
    };

    // Get machine numbers from board data directly
    const machineNumbers = (board.machines || []).map(m => m.machine);

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="flex flex-col h-full relative border rounded-xl shadow-sm bg-background/50 backdrop-blur">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between p-4 border-b bg-muted/20">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <PencilLine className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Edit Schedule</h2>
                            <p className="text-sm text-muted-foreground">
                                {new Date(date).toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                                {" · "}Line {lineNo}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={onCancel}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto space-y-6 p-4">
                    <div className="space-y-6">
                        {!isInitialized ? (
                            <div className="flex items-center justify-center py-12 text-muted-foreground gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <p className="text-sm">Initializing schedule data...</p>
                            </div>
                        ) : items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg bg-muted/20 text-muted-foreground">
                                <Database className="h-12 w-12 mb-4 opacity-20" />
                                <p className="text-lg font-medium">No schedule items found</p>
                                <p className="text-sm">This schedule has no data to edit.</p>
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
                    <Button variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={updateMutation.isPending}
                    >
                        {updateMutation.isPending ? "Updating..." : "Save Changes"}
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
