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

export default function ScheduleForm({ onCancel, onSuccess }: { onCancel: () => void, onSuccess: () => void }) {
    const { user } = useAuth();
    const [selectedCategoryNo, setSelectedCategoryNo] = useState<string | undefined>(undefined);
    const [code, setCode] = useState(`SCH-${new Date().toISOString().slice(0, 10)}`);
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
    const [items, setItems] = useState<CreateScheduleItemRequest[]>([]);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

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

        const mapped: CreateScheduleItemRequest[] = ppcData.machines.flatMap((m: MachineScheduleDetail) =>
            m.details.map((d: MachineDetailItem) => ({
                prioritas: d.prioritas || "none",
                machineNo: String(m.machineNo),
                codeNo: String(d.size),
                shift1Qty: d.shift1Qty ?? 0,
                shift2Qty: d.shift2Qty ?? 0,
                shift3Qty: d.shift3Qty ?? 0,
                remark: "",
                stockRc: d.stockRc ?? 0,
                isManual: false,
            }))
        );

        setItems(mapped);
    }, [ppcData, selectedCategoryNo, date]);

    const createMutation = useCreateSchedule({
        onSuccess: () => {
            onSuccess();
        }
    });

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const updateItem = (index: number, updates: Partial<CreateScheduleItemRequest>) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], ...updates };
        setItems(newItems);
    };

    const getNextPriority = (machineNo: string) => {
        const priorities = ['A', 'B', 'C', 'D', 'E', 'F'];
        const taken = items
            .filter(i => i.machineNo === machineNo)
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
                shift1Qty: i.shift1Qty,
                shift2Qty: i.shift2Qty,
                shift3Qty: i.shift3Qty,
                remark: i.remark,
            }))
        };

        createMutation.mutate(payload);
    };

    return (
        <div className="flex flex-col h-full">
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
                                    codeNo: "",
                                    machineNo: "New MC",
                                    shift1Qty: 0,
                                    shift2Qty: 0,
                                    shift3Qty: 0,
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
                            const machineItems = items.filter(i => i.machineNo === machineNo);
                            return (
                                <div key={machineNo} className="space-y-4 border rounded-lg p-4 bg-background shadow-sm">
                                    <div className="flex items-center justify-between border-b pb-2">
                                        <h3 className="text-lg font-bold flex items-center gap-2">
                                            <div className="w-2 h-6 bg-primary rounded-full" />
                                            Machine: <span className="text-primary">{machineNo}</span>
                                        </h3>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary"
                                            onClick={() => {
                                                const nextPriority = getNextPriority(machineNo);
                                                setItems([...items, {
                                                    codeNo: "",
                                                    machineNo,
                                                    shift1Qty: 0,
                                                    shift2Qty: 0,
                                                    shift3Qty: 0,
                                                    remark: "",
                                                    stockRc: 0,
                                                    prioritas: nextPriority,
                                                    isManual: true,
                                                }]);
                                            }}
                                        >
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add Product
                                        </Button>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead className="bg-muted/30 text-muted-foreground">
                                                <tr>
                                                    <th className="px-3 text-center font-medium border-r" rowSpan={2}>Priority</th>
                                                    <th className="px-3 text-center font-medium border-r" rowSpan={2}>Product</th>
                                                    <th className="px-3 text-center font-medium border-r" colSpan={3}>Qty</th>
                                                    <th className="px-3 text-center font-medium border-r" rowSpan={2}>Stock RC</th>
                                                    <th className="px-3 text-center font-medium border-r" rowSpan={2}>Remark</th>
                                                    <th className="px-3 w-10 text-center "></th>
                                                </tr>
                                                <tr>
                                                    <th className="px-3 text-center font-medium border-r">Shift 1</th>
                                                    <th className="px-3 text-center font-medium border-r">Shift 2</th>
                                                    <th className="px-3 text-center font-medium border-r">Shift 3</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y">
                                                {items.map((item, index) => {
                                                    if (item.machineNo !== machineNo) return null;

                                                    // Calculate which priorities are taken for this machine
                                                    // const takenPriorities = items
                                                    //     .filter((i, idx) => i.machineCode === machineCode && idx !== index)
                                                    //     .map(i => i.prioritas)
                                                    //     .filter(p => p !== "" && p !== "none");

                                                    return (
                                                        <tr key={`${machineNo}-${index}`} className="group hover:bg-muted/10 transition-colors">
                                                            <td className="p-2">
                                                                <Select
                                                                    value={item.prioritas}
                                                                    onValueChange={(val) => updateItem(index, { prioritas: val })}
                                                                >
                                                                    <SelectTrigger size="sm" className="w-[120px] bg-white">
                                                                        <SelectValue placeholder="Priority" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="none" className="text-muted-foreground">Select Priority</SelectItem>
                                                                        {['A', 'B', 'C', 'D', 'E', 'F'].map(p => (
                                                                            <SelectItem
                                                                                key={p}
                                                                                value={p}
                                                                            // disabled={takenPriorities.includes(p)}
                                                                            >
                                                                                {p}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            </td>
                                                            <td className="p-2">
                                                                {!item.isManual ? (
                                                                    <Input
                                                                        disabled
                                                                        value={item.codeNo}
                                                                        className="h-10 bg-muted/50 cursor-not-allowed"
                                                                    />
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
                                                                                opts.unshift({
                                                                                    id: item.codeNo,
                                                                                    name: item.codeNo
                                                                                });
                                                                            }
                                                                            return opts;
                                                                        })()}
                                                                    />
                                                                )}
                                                            </td>
                                                            <td className="p-2">
                                                                <Input
                                                                    type="number"
                                                                    className="h-10 text-center font-medium"
                                                                    value={item.shift1Qty}
                                                                    onChange={(e) => updateItem(index, { shift1Qty: parseInt(e.target.value) || 0 })}
                                                                />
                                                            </td>
                                                            <td className="p-2">
                                                                <Input
                                                                    type="number"
                                                                    className="h-10 text-center font-medium"
                                                                    value={item.shift2Qty}
                                                                    onChange={(e) => updateItem(index, { shift2Qty: parseInt(e.target.value) || 0 })}
                                                                />
                                                            </td>
                                                            <td className="p-2">
                                                                <Input
                                                                    type="number"
                                                                    className="h-10 text-center font-medium"
                                                                    value={item.shift3Qty}
                                                                    onChange={(e) => updateItem(index, { shift3Qty: parseInt(e.target.value) || 0 })}
                                                                />
                                                            </td>
                                                            <td className="p-2">
                                                                <Input
                                                                    type="number"
                                                                    className="h-10 text-center font-medium"
                                                                    disabled
                                                                    value={item.stockRc}
                                                                />
                                                            </td>
                                                            <td className="p-2">
                                                                <Input
                                                                    className="h-10"
                                                                    placeholder="Remark..."
                                                                    value={item.remark}
                                                                    onChange={(e) => updateItem(index, { remark: e.target.value })}
                                                                />
                                                            </td>
                                                            <td className="p-2 text-center">
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="hover:bg-red-50 hover:text-red-600 transition-colors"
                                                                    onClick={() => removeItem(index)}
                                                                    disabled={machineItems.length === 1}
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* <div className="flex justify-end gap-2 p-4 border-t"> */}
            <div className="flex justify-end gap-2 p-4 border-t bg-background">
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
        </div >
    );
}
