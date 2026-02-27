"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateSchedule } from "@/hooks/use-schedule";
import { useProducts } from "@/hooks/use-product";
import { useAuth } from "@/hooks/use-auth";
import { CreateScheduleRequest, CreateScheduleItemRequest, MachineScheduleDetail, MachineDetailItem } from "@/types/schedule";
import { useState, useEffect } from "react";
import { Trash2, Plus, Search, AlertCircle, Database, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { FormCombobox } from "@/components/ui/form-combobox";
import { useCategories } from "@/hooks/use-category";
import { useProductScheduleByDateAndCategoryNo } from "@/hooks/use-product-schedule";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    DragOverlay,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

interface FormItem {
    id: string;
    prioritas: string;
    machineNo: string;
    codeNo: string;
    shiftNo: number;
    qty: number;
    remark: string;
    stockRc?: number;
    isManual?: boolean;
}

export default function ScheduleForm({ onCancel, onSuccess }: { onCancel: () => void, onSuccess: () => void }) {
    const { user } = useAuth();
    const [selectedCategoryNo, setSelectedCategoryNo] = useState<string | undefined>(undefined);
    const [code, setCode] = useState(`SCH-${new Date().toISOString().slice(0, 10)}`);
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
    const [items, setItems] = useState<FormItem[]>([]);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [activeId, setActiveId] = useState<string | null>(null);

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

    const { data: categories = [] } = useCategories();
    const { data: ppcData, isLoading: isPpcLoading, isError } = useProductScheduleByDateAndCategoryNo(
        date,
        selectedCategoryNo ?? "",
        { enabled: !!selectedCategoryNo && !!date }
    );

    useEffect(() => {
        if (!ppcData || !("machines" in ppcData) || !selectedCategoryNo || !date) {
            return;
        }

        const mapped: FormItem[] = ppcData.machines.flatMap((m: MachineScheduleDetail) =>
            m.details.flatMap((d: MachineDetailItem, idx: number) => {
                const shiftItems: FormItem[] = [];
                const baseId = `ppc-${m.machineNo}-${idx}`;

                if (d.shift1Qty > 0 || d.prioritas === "A") { // Include if has qty or was already prioritas A (initial load)
                    shiftItems.push({
                        id: `${baseId}-s1-${Math.random().toString(36).substr(2, 4)}`,
                        prioritas: "none",
                        machineNo: String(m.machineNo),
                        codeNo: String(d.size),
                        shiftNo: 1,
                        qty: d.shift1Qty ?? 0,
                        remark: "",
                        stockRc: d.stockRc ?? 0,
                        isManual: false,
                    });
                }
                if (d.shift2Qty > 0) {
                    shiftItems.push({
                        id: `${baseId}-s2-${Math.random().toString(36).substr(2, 4)}`,
                        prioritas: "none",
                        machineNo: String(m.machineNo),
                        codeNo: String(d.size),
                        shiftNo: 2,
                        qty: d.shift2Qty ?? 0,
                        remark: "",
                        stockRc: d.stockRc ?? 0,
                        isManual: false,
                    });
                }
                if (d.shift3Qty > 0) {
                    shiftItems.push({
                        id: `${baseId}-s3-${Math.random().toString(36).substr(2, 4)}`,
                        prioritas: "none",
                        machineNo: String(m.machineNo),
                        codeNo: String(d.size),
                        shiftNo: 3,
                        qty: d.shift3Qty ?? 0,
                        remark: "",
                        stockRc: d.stockRc ?? 0,
                        isManual: false,
                    });
                }
                return shiftItems;
            })
        );

        setItems(updatePriorities(mapped));
    }, [ppcData, selectedCategoryNo, date]);

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
        newItems[index] = { ...newItems[index], ...updates };
        setItems(newItems);
    };

    const updatePriorities = (itemList: FormItem[]) => {
        const priorities = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        const groups: Record<string, FormItem[]> = {};

        // Group by machine AND shift
        itemList.forEach(item => {
            const key = `${item.machineNo}-s${item.shiftNo}`;
            if (!groups[key]) {
                groups[key] = [];
            }
            groups[key].push(item);
        });

        // Update priorities within each group
        Object.values(groups).forEach(group => {
            group.forEach((item, idx) => {
                item.prioritas = priorities[idx] || "none";
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

            // If dropped over another item
            if (newIndex !== -1) {
                const overItem = prev[newIndex];
                // Update machine and shift if moving
                activeItem.machineNo = overItem.machineNo;
                activeItem.shiftNo = overItem.shiftNo;
                updatedItems[oldIndex] = activeItem;
                updatedItems = arrayMove(updatedItems, oldIndex, newIndex);
            }
            // Handle if dropped over a container (needs unique container IDs like `shift-machine-shiftNo`)
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
            .map(i => i.prioritas);
        return priorities.find(p => !taken.includes(p)) || "none";
    };

    const handleReset = () => {
        setSelectedCategoryNo(undefined);
        setItems([]);
        toast.success("Form has been reset.");
    };

    const handleSubmit = () => {
        if (!date || items.length === 0) {
            toast.error("Please fill in date and at least one item.");
            return;
        }

        const payload: CreateScheduleRequest = {
            date,
            categoryNo: Number(selectedCategoryNo),
            items: items.map(i => ({
                prioritas: i.prioritas === "none" ? "" : i.prioritas,
                machineNo: i.machineNo,
                codeNo: i.codeNo,
                shift1Qty: i.shiftNo === 1 ? i.qty : 0,
                shift2Qty: i.shiftNo === 2 ? i.qty : 0,
                shift3Qty: i.shiftNo === 3 ? i.qty : 0,
                remark: i.remark,
            }))
        };

        createMutation.mutate(payload);
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="flex flex-col h-full relative">
                <div className="flex-1 overflow-y-auto space-y-6 px-2">
                    <div className="grid grid-cols-3 gap-4 bg-muted/30 p-4 rounded-lg">
                        <div className="space-y-2">
                            <Label htmlFor="code">Schedule Code</Label>
                            <Input id="code" className="bg-white" disabled value={code} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category">Production Category</Label>
                            <FormCombobox
                                value={selectedCategoryNo}
                                onChange={setSelectedCategoryNo}
                                options={categories?.map(l => ({ ...l, id: String(l.categoryNo || l.id), name: l.name }))}
                                placeholder="Select Category"
                                searchPlaceholder="Search Category"
                                emptyText="No categories found."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="date">Date</Label>
                            <Input id="date" type="date" className="bg-white" value={date} onChange={(e) => setDate(e.target.value)} />
                        </div>
                    </div>

                    <div className="space-y-6">
                        {!selectedCategoryNo ? (
                            <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg bg-muted/20 text-muted-foreground">
                                <Search className="h-12 w-12 mb-4 opacity-20" />
                                <p className="text-lg font-medium">Please select a Production Category first</p>
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
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-4"
                                    onClick={() => setItems([{
                                        id: `manual-${Date.now()}`,
                                        codeNo: "",
                                        machineNo: "New MC",
                                        shiftNo: 1,
                                        qty: 0,
                                        remark: "",
                                        stockRc: 0,
                                        prioritas: "A",
                                        isManual: true,
                                    }])}
                                >
                                    <Plus className="mr-2 h-4 w-4" /> Add Manually
                                </Button>
                            </div>
                        ) : (
                            Array.from(new Set(items.map(i => i.machineNo))).map((machineNo) => {
                                return (
                                    <div key={machineNo} className="space-y-4 border rounded-lg p-3 bg-muted/5 shadow-sm">
                                        <div className="flex items-center justify-between border-b pb-2 px-1">
                                            <h3 className="text-lg font-bold flex items-center gap-2">
                                                <div className="w-2 h-6 bg-primary rounded-full" />
                                                Machine: <span className="text-primary">{machineNo}</span>
                                            </h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            {[1, 2, 3].map((sNo) => {
                                                const shiftItems = items.filter(i => i.machineNo === machineNo && i.shiftNo === sNo);
                                                return (
                                                    <div key={sNo} className="flex flex-col bg-background rounded-md border border-dashed border-muted-foreground/20 p-2 min-h-[150px]">
                                                        <div className="flex items-center justify-between mb-3 px-1">
                                                            <div className="flex items-center gap-2">
                                                                <span className={`w-2 h-2 rounded-full ${sNo === 1 ? 'bg-blue-500' : sNo === 2 ? 'bg-orange-500' : 'bg-purple-500'}`} />
                                                                <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Shift {sNo}</h4>
                                                            </div>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-6 w-6 rounded-full hover:bg-primary/10 hover:text-primary"
                                                                onClick={() => {
                                                                    const nextPriority = getNextPriority(machineNo, sNo);
                                                                    setItems([...items, {
                                                                        id: `manual-${machineNo}-s${sNo}-${Date.now()}`,
                                                                        codeNo: "",
                                                                        machineNo,
                                                                        shiftNo: sNo,
                                                                        qty: 0,
                                                                        remark: "",
                                                                        stockRc: 0,
                                                                        prioritas: nextPriority,
                                                                        isManual: true,
                                                                    }]);
                                                                }}
                                                            >
                                                                <Plus className="h-4 w-4" />
                                                            </Button>
                                                        </div>

                                                        <SortableContext
                                                            id={`container-${machineNo}-${sNo}`}
                                                            items={shiftItems.map(i => i.id)}
                                                            strategy={verticalListSortingStrategy}
                                                        >
                                                            <div className="space-y-2 flex-1">
                                                                {shiftItems.map((item) => {
                                                                    const overallIndex = items.findIndex(i => i.id === item.id);
                                                                    return (
                                                                        <SortableRow
                                                                            key={item.id}
                                                                            item={item}
                                                                            index={overallIndex}
                                                                            removeItem={removeItem}
                                                                            updateItem={updateItem}
                                                                            products={products}
                                                                            isProductsLoading={isProductsLoading}
                                                                            setSearch={setSearch}
                                                                        />
                                                                    );
                                                                })}
                                                                {shiftItems.length === 0 && (
                                                                    <div className="flex-1 flex items-center justify-center p-4 border-2 border-dashed rounded-md bg-muted/5 text-muted-foreground/30 text-xs italic">
                                                                        Empty shift
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </SortableContext>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })
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
                        {createMutation.isPending ? "Creating..." : "Create Schedule"}
                    </Button>
                </div>
            </div>

            <DragOverlay dropAnimation={null}>
                {activeId ? (
                    <div className="bg-white border-2 border-primary shadow-2xl rounded-lg overflow-hidden opacity-90 scale-105 transition-transform w-[250px]">
                        <StaticRow
                            item={items.find(i => i.id === activeId)!}
                            products={products}
                        />
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}

function StaticRow({ item, products }: { item: FormItem, products: any[] }) {
    return (
        <div className="flex items-center gap-2 p-2 bg-white border rounded shadow-sm">
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs border border-primary/20 shrink-0">
                {item.prioritas}
            </div>
            <div className="flex-1 min-w-0">
                <div className="font-bold text-sm truncate">{item.codeNo || "New Product"}</div>
                <div className="text-xs text-muted-foreground">Qty: {item.qty}</div>
            </div>
        </div>
    );
}

function SortableRow({
    item,
    index,
    removeItem,
    updateItem,
    products,
    isProductsLoading,
    setSearch,
}: {
    item: FormItem;
    index: number;
    removeItem: (index: number) => void;
    updateItem: (index: number, updates: Partial<FormItem>) => void;
    products: any[];
    isProductsLoading: boolean;
    setSearch: (search: string) => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : undefined,
        opacity: isDragging ? 0.3 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`group bg-background border rounded-lg p-2 shadow-sm transition-all hover:border-primary/30 ${isDragging ? 'ring-2 ring-primary border-primary' : ''}`}
        >
            <div className="flex items-start gap-2 mb-2">
                <div
                    {...attributes}
                    {...listeners}
                    className="mt-2 cursor-grab hover:text-primary transition-colors shrink-0"
                >
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="w-8 h-8 mt-1 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 border border-primary/20">
                    {item.prioritas}
                </div>
                <div className="flex-1 min-w-0">
                    {!item.isManual ? (
                        <div className="font-bold text-sm truncate py-2 px-1 bg-muted/20 rounded border border-transparent">
                            {item.codeNo}
                        </div>
                    ) : (
                        <FormCombobox
                            value={item.codeNo}
                            onChange={(val: string) => {
                                const product = products.find(p => p.codeNo === val);
                                updateItem(index, {
                                    codeNo: val,
                                    stockRc: product?.faStock || 0
                                });
                            }}
                            onSearch={setSearch}
                            isLoading={isProductsLoading}
                            options={(() => {
                                const opts = products.map(p => ({
                                    id: String(p.codeNo),
                                    name: String(p.codeNo)
                                }));
                                if (item.codeNo && !opts.find(o => o.id === item.codeNo)) {
                                    opts.unshift({ id: item.codeNo, name: item.codeNo });
                                }
                                return opts;
                            })()}
                        />
                    )}
                </div>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-50 shrink-0"
                    onClick={() => removeItem(index)}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>

            <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                    <Label className="text-[10px] uppercase text-muted-foreground">Quantity</Label>
                    <Input
                        type="number"
                        className="h-8 text-center bg-white"
                        value={item.qty}
                        onChange={(e) => updateItem(index, { qty: parseInt(e.target.value) || 0 })}
                    />
                </div>
                <div className="space-y-1">
                    <Label className="text-[10px] uppercase text-muted-foreground">Stock RC</Label>
                    <div className="h-8 flex items-center justify-center bg-muted/30 rounded text-xs font-medium border">
                        {item.stockRc || 0}
                    </div>
                </div>
            </div>

            <div className="mt-2">
                <Input
                    className="h-8 text-xs bg-white"
                    placeholder="Add remark..."
                    value={item.remark}
                    onChange={(e) => updateItem(index, { remark: e.target.value })}
                />
            </div>
        </div>
    );
}
