"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSchedules, useCreateSchedule } from "@/hooks/use-schedule";
import { useProducts } from "@/hooks/use-product";
import { useMachines } from "@/hooks/use-machine";
import { useAuth } from "@/hooks/use-auth";
import { CreateScheduleRequest, CreateScheduleItemRequest } from "@/types/schedule";
import { useState, useEffect } from "react";
import { Trash2, Plus, Search } from "lucide-react";
import { toast } from "sonner";

export default function ScheduleForm({ onCancel, onSuccess }: { onCancel: () => void, onSuccess: () => void }) {
    const { user } = useAuth();
    const { data: products = [] } = useProducts({ limit: 100 });
    const { data: machines = [] } = useMachines({ limit: 100 });

    const [code, setCode] = useState(`SCH-${new Date().toISOString().slice(0, 10)}`);
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
    const [items, setItems] = useState<CreateScheduleItemRequest[]>([
        { codeNo: "", machineCode: "", quantity: 0, stdDandatory: 0 }
    ]);

    const createMutation = useCreateSchedule({
        onSuccess: () => {
            onSuccess();
        }
    });

    const addItem = () => {
        setItems([...items, { codeNo: "", machineCode: "", quantity: 0, stdDandatory: 0 }]);
    };

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
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg">
                <div className="space-y-2">
                    <Label htmlFor="code">Schedule Code</Label>
                    <Input id="code" value={code} onChange={(e) => setCode(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold px-1">Schedule Items</h3>
                    <Button type="button" variant="outline" size="sm" onClick={addItem}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Item
                    </Button>
                </div>

                <div className="border rounded-md divide-y overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="px-3 py-2 text-left">Product</th>
                                <th className="px-3 py-2 text-left">Machine</th>
                                <th className="px-3 py-2 text-left w-24">Qty</th>
                                <th className="px-3 py-2 text-left w-28">Std Mandat</th>
                                <th className="px-3 py-2 w-10"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => (
                                <tr key={index} className="group">
                                    <td className="p-2">
                                        <select
                                            className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                            value={item.codeNo}
                                            onChange={(e) => updateItem(index, 'codeNo', e.target.value)}
                                        >
                                            <option value="">Select Product</option>
                                            {products.map(p => (
                                                <option key={p.id} value={p.codeNo}>
                                                    {p.codeNo} - {p.sizeName}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="p-2">
                                        <select
                                            className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                            value={item.machineCode}
                                            onChange={(e) => updateItem(index, 'machineCode', e.target.value)}
                                        >
                                            <option value="">Select Machine</option>
                                            {machines.map(m => (
                                                <option key={m.id} value={m.code}>
                                                    {m.code}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="p-2">
                                        <Input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                                        />
                                    </td>
                                    <td className="p-2">
                                        <Input
                                            type="number"
                                            value={item.stdDandatory}
                                            onChange={(e) => updateItem(index, 'stdDandatory', parseInt(e.target.value) || 0)}
                                        />
                                    </td>
                                    <td className="p-2 text-center">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeItem(index)}
                                            disabled={items.length === 1}
                                        >
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex justify-end gap-2 p-4 border-t">
                <Button variant="outline" onClick={onCancel}>Cancel</Button>
                <Button
                    onClick={handleSubmit}
                    disabled={createMutation.isPending}
                >
                    {createMutation.isPending ? "Creating..." : "Create Schedule"}
                </Button>
            </div>
        </div>
    );
}
