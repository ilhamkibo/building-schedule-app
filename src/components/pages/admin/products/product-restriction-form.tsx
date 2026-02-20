"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Trash2, Plus } from "lucide-react";
import { ProductRestriction } from "@/types/product-restriction";
import { useMachines } from "@/hooks/use-machine";
import { useProducts } from "@/hooks/use-product";
import { FormCombobox } from "@/components/ui/form-combobox";

interface ProductRestrictionFormProps {
    restriction: ProductRestriction | null;
    onCancel: () => void;
    onSubmit: (payload: {
        codeNo: string;
        details: { machineCode: string; reason: string }[];
    }) => void;
    isLoading?: boolean;
}

export default function ProductRestrictionForm({
    restriction,
    onCancel,
    onSubmit,
    isLoading,
}: ProductRestrictionFormProps) {
    const [codeNo, setCodeNo] = useState(restriction?.codeNo ?? "");
    const [details, setDetails] = useState<{ machineCode: string; reason: string }[]>(
        restriction?.details.map(d => ({ machineCode: d.machineCode, reason: d.reason })) ?? []
    );

    const { data: machines = [], isLoading: isLoadingMachines } = useMachines({ limit: 100 });
    const { data: products = [], isLoading: isLoadingProducts } = useProducts({ limit: 100 });

    const addDetail = () => {
        setDetails([...details, { machineCode: "", reason: "" }]);
    };

    const removeDetail = (index: number) => {
        setDetails(details.filter((_, i) => i !== index));
    };

    const updateDetail = (index: number, field: "machineCode" | "reason", value: string) => {
        const newDetails = [...details];
        newDetails[index][field] = value;
        setDetails(newDetails);
    };

    return (
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <div className="flex flex-col gap-2">
                <Label>Product Code (Code No)</Label>
                <FormCombobox
                    options={products.map((p) => ({
                        id: p.codeNo,
                        name: `${p.codeNo} - ${p.sizeName}`,
                    }))}
                    value={codeNo}
                    onChange={(val) => setCodeNo(val as string)}
                    placeholder="Select product..."
                />
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold">Restriction Details (Machines)</Label>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addDetail}
                        className="h-8 px-2"
                    >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Machine
                    </Button>
                </div>

                {details.length === 0 && (
                    <p className="text-xs text-muted-foreground italic text-center py-4 border rounded-md border-dashed">
                        No machines added yet. Click "Add Machine" to start.
                    </p>
                )}

                {details.map((detail, index) => (
                    <div key={index} className="p-3 border rounded-md bg-muted/30 space-y-3 relative">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1 h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => removeDetail(index)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>

                        <div className="grid grid-cols-1 gap-3">
                            <div className="flex flex-col gap-1.5">
                                <Label className="text-xs">Machine</Label>
                                <FormCombobox
                                    options={machines.map((m) => ({
                                        id: m.code,
                                        name: `${m.code} - ${m.name}`,
                                    }))}
                                    value={detail.machineCode}
                                    onChange={(val) => updateDetail(index, "machineCode", val as string)}
                                    placeholder="Select machine..."
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Label className="text-xs">Reason / Note</Label>
                                <input
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Enter reason e.g. Too large"
                                    value={detail.reason}
                                    onChange={(e) => updateDetail(index, "reason", e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-end gap-2 pt-4">
                <Button
                    variant="outline"
                    onClick={onCancel}
                    disabled={isLoading}
                >
                    Cancel
                </Button>
                <Button
                    onClick={() => onSubmit({ codeNo, details })}
                    disabled={isLoading || !codeNo || details.some(d => !d.machineCode)}
                >
                    {isLoading ? "Saving..." : restriction ? "Update" : "Create"}
                </Button>
            </div>
        </div>
    );
}
