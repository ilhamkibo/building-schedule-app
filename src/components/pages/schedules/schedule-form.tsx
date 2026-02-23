"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateSchedule } from "@/hooks/use-schedule";
import { useProducts } from "@/hooks/use-product";
import { useAuth } from "@/hooks/use-auth";
import { CreateScheduleRequest, CreateScheduleItemRequest } from "@/types/schedule";
import { useState, useEffect } from "react";
import { Trash2, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { FormCombobox } from "@/components/ui/form-combobox";
import { useLines } from "@/hooks/use-line";

export default function ScheduleForm({ onCancel, onSuccess }: { onCancel: () => void, onSuccess: () => void }) {
    const { user } = useAuth();
    const { data: lines } = useLines();
    const { data: products = [] } = useProducts();

    const [selectedLineId, setSelectedLineId] = useState<number | undefined>(undefined);
    const [code, setCode] = useState(`SCH-${new Date().toISOString().slice(0, 10)}`);
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
    const [items, setItems] = useState<CreateScheduleItemRequest[]>([]);

    useEffect(() => {
        if (selectedLineId) {
            const selectedLine = lines?.find(l => l.id === selectedLineId);
            if (selectedLine && selectedLine.machines) {
                const initialItems: CreateScheduleItemRequest[] = selectedLine.machines.map(m => ({
                    codeNo: "",
                    machineCode: m.code,
                    quantity: 0,
                    stdDandatory: 0
                }));
                setItems(initialItems);
            }
        } else {
            setItems([]);
        }
    }, [selectedLineId, lines]);

    const createMutation = useCreateSchedule({
        onSuccess: () => {
            onSuccess();
        }
    });

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const updateItem = (index: number, field: keyof CreateScheduleItemRequest, value: any) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    };

    const handleSubmit = () => {
        if (!code || !date || items.length === 0) {
            toast.error("Please fill in code, date and at least one item.");
            return;
        }

        const payload: CreateScheduleRequest = {
            code,
            date,
            createdBy: user?.name || "System",
            items
        };

        createMutation.mutate(payload);
    };

    return (
        // <div className="space-y-6">
        <div className="flex flex-col h-full">

            <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                {/* semua form content di sini */}

                <div className="grid grid-cols-3 gap-4 bg-muted/30 p-4 rounded-lg">
                    <div className="space-y-2">
                        <Label htmlFor="code">Schedule Code</Label>
                        <Input id="code" value={code} onChange={(e) => setCode(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="line">Production Line</Label>
                        <FormCombobox
                            value={selectedLineId}
                            onChange={setSelectedLineId}
                            options={lines?.map(l => ({ ...l, name: l.name || `Line ${l.id}` }))}
                            placeholder="Select Line"
                            searchPlaceholder="Search Line"
                            emptyText="No lines found."
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                    </div>
                </div>

                <div className="space-y-6">
                    {selectedLineId ? (
                        // Group items by machineCode
                        Array.from(new Set(items.map(i => i.machineCode))).map((machineCode) => {
                            const machineItems = items.filter(i => i.machineCode === machineCode);
                            return (
                                <div key={machineCode} className="space-y-4 border rounded-lg p-4 bg-background shadow-sm">
                                    <div className="flex items-center justify-between border-b pb-2">
                                        <h3 className="text-lg font-bold flex items-center gap-2">
                                            <div className="w-2 h-6 bg-primary rounded-full" />
                                            Machine: <span className="text-primary">{machineCode}</span>
                                        </h3>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary"
                                            onClick={() => {
                                                // Find the last index of this machine's item to insert after it, 
                                                // or just append to keep the flat structure simple
                                                setItems([...items, { codeNo: "", machineCode, quantity: 0, stdDandatory: 0 }]);
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
                                                    <th className="px-3 py-2 text-left font-medium">Product</th>
                                                    <th className="px-3 py-2 text-left font-medium w-32">Qty</th>
                                                    <th className="px-3 py-2 text-left font-medium w-40">Std Dandatory</th>
                                                    <th className="px-3 py-2 w-10"></th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y">
                                                {items.map((item, index) => {
                                                    if (item.machineCode !== machineCode) return null;
                                                    return (
                                                        <tr key={`${machineCode}-${index}`} className="group hover:bg-muted/10 transition-colors">
                                                            {/* <td className="p-2">
                                                                <select
                                                                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 hover:border-primary/50"
                                                                    value={item.codeNo}
                                                                    onChange={(e) => updateItem(index, 'codeNo', e.target.value)}
                                                                >
                                                                    <option value="">Select Product ...</option>
                                                                    {products.map(p => (
                                                                        <option key={p.id} value={p.codeNo}>
                                                                            {p.codeNo} - {p.sizeName}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </td>  */}
                                                            <td className="p-2">
                                                                <FormCombobox
                                                                    value={item.codeNo}
                                                                    onChange={(codeNo) => updateItem(index, 'codeNo', codeNo)}
                                                                    options={products.map(p => ({
                                                                        id: p.codeNo,
                                                                        name: `${p.codeNo} - ${p.sizeName}`,
                                                                        code: p.codeNo
                                                                    }))}
                                                                    placeholder="Select Product..."
                                                                    searchPlaceholder="Search Product..."
                                                                    emptyText="No products found."
                                                                    className="h-10"
                                                                />
                                                            </td>

                                                            <td className="p-2">
                                                                <Input
                                                                    type="number"
                                                                    className="h-10 text-center font-medium"
                                                                    value={item.quantity}
                                                                    onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                                                                />
                                                            </td>
                                                            <td className="p-2">
                                                                <Input
                                                                    type="number"
                                                                    className="h-10 text-center font-medium"
                                                                    value={item.stdDandatory}
                                                                    onChange={(e) => updateItem(index, 'stdDandatory', parseInt(e.target.value) || 0)}
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
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg bg-muted/20 text-muted-foreground">
                            <Search className="h-12 w-12 mb-4 opacity-20" />
                            <p className="text-lg font-medium">Please select a Production Line first</p>
                            <p className="text-sm">Machines will be automatically displayed based on your selection</p>
                        </div>
                    )}
                </div>
            </div>

            {/* <div className="flex justify-end gap-2 p-4 border-t"> */}
            <div className="flex justify-end gap-2 p-4 border-t bg-background">
                <Button variant="outline" onClick={onCancel}>
                    Cancel
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
