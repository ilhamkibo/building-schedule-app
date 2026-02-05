"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMachines } from "@/hooks/use-machine";
import { Product } from "@/types/product";
import { useEffect, useState } from "react";

interface ProductFormProps {
    product: Product | null;
    onCancel: () => void;
    onSubmit: (payload: any) => void;
    isLoading?: boolean;
}

export default function ProductForm({
    product,
    onCancel,
    onSubmit,
    isLoading = false,
}: ProductFormProps) {
    const { data: machines = [], isLoading: isLoadingMachines } = useMachines({ limit: 100 });

    const [codeNo, setCodeNo] = useState(product?.codeNo ?? "");
    const [sizeName, setSizeName] = useState(product?.sizeName ?? "");
    const [source, setSource] = useState(product?.source ?? "");
    const [cycleTimeSeconds, setCycleTimeSeconds] = useState(product?.cycleTimeSeconds?.toString() ?? "0");
    const [selectedMachines, setSelectedMachines] = useState<string[]>(product?.machines ?? []);

    const toggleMachine = (machineCode: string) => {
        setSelectedMachines((prev) =>
            prev.includes(machineCode)
                ? prev.filter((code) => code !== machineCode)
                : [...prev, machineCode]
        );
    };

    const handleFormSubmit = () => {
        onSubmit({
            codeNo,
            sizeName,
            source,
            machines: selectedMachines,
            cycleTimeSeconds: parseInt(cycleTimeSeconds),
        });
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="codeNo">Code No</Label>
                    <Input
                        id="codeNo"
                        placeholder="e.g. 6110"
                        value={codeNo}
                        onChange={(e) => setCodeNo(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="source">Source</Label>
                    <Input
                        id="source"
                        placeholder="e.g. PC"
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="sizeName">Size Name</Label>
                <Input
                    id="sizeName"
                    placeholder="e.g. PCR 175 / 70 R12 80S HIMAX70 TL PE"
                    value={sizeName}
                    onChange={(e) => setSizeName(e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="cycleTimeSeconds">Cycle Time (Seconds)</Label>
                <Input
                    id="cycleTimeSeconds"
                    type="number"
                    value={cycleTimeSeconds}
                    onChange={(e) => setCycleTimeSeconds(e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <Label>Machines</Label>
                <div className="border rounded-md p-3 max-h-40 overflow-y-auto grid grid-cols-2 gap-2">
                    {isLoadingMachines ? (
                        <p className="text-sm text-muted-foreground">Loading machines...</p>
                    ) : machines.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No machines found</p>
                    ) : (
                        machines.map((machine) => (
                            <label
                                key={machine.id}
                                className="flex items-center space-x-2 text-sm cursor-pointer hover:bg-muted p-1 rounded"
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedMachines.includes(machine.code)}
                                    onChange={() => toggleMachine(machine.code)}
                                    className="rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <span>{machine.code} {machine.name ? `- ${machine.name}` : ""}</span>
                            </label>
                        ))
                    )}
                </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={onCancel} disabled={isLoading}>
                    Cancel
                </Button>
                <Button
                    onClick={handleFormSubmit}
                    disabled={isLoading || !codeNo || !sizeName || selectedMachines.length === 0}
                >
                    {isLoading ? "Saving..." : product ? "Update" : "Create"}
                </Button>
            </div>
        </div>
    );
}
