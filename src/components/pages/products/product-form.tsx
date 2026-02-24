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
    const [dandoryTimeSeconds, setDandoryTimeSeconds] = useState(product?.dandoryTimeSeconds?.toString() ?? "0");
    const [curingTimeSeconds, setCuringTimeSeconds] = useState(product?.curingTimeSeconds?.toString() ?? "0");
    const [machinesRaw, setMachinesRaw] = useState(product?.machinesRaw ?? "");
    const [manualStock, setManualStock] = useState(product?.manualStock?.toString() ?? "0");
    const [buildingAch, setBuildingAch] = useState(product?.buildingAch?.toString() ?? "0");
    const [curingAch, setCuringAch] = useState(product?.curingAch?.toString() ?? "0");
    const [qtyScrap, setQtyScrap] = useState(product?.qtyScrap?.toString() ?? "0");
    const [faStock, setFaStock] = useState(product?.faStock?.toString() ?? "0");
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
            machinesRaw: machinesRaw || null,
            cycleTimeSeconds: parseInt(cycleTimeSeconds) || 0,
            dandoryTimeSeconds: parseInt(dandoryTimeSeconds) || 0,
            curingTimeSeconds: parseInt(curingTimeSeconds) || 0,
            manualStock: parseInt(manualStock) || 0,
            buildingAch: parseInt(buildingAch) || 0,
            curingAch: parseInt(curingAch) || 0,
            qtyScrap: parseInt(qtyScrap) || 0,
            faStock: parseInt(faStock) || 0,
        });
    };

    return (
        <div className="space-y-4 max-h-[70vh] overflow-y-auto px-1 pr-3">
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

            <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                    <Label htmlFor="cycleTimeSeconds">Cycle (S)</Label>
                    <Input
                        id="cycleTimeSeconds"
                        type="number"
                        value={cycleTimeSeconds}
                        onChange={(e) => setCycleTimeSeconds(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="dandoryTimeSeconds">Dandory (S)</Label>
                    <Input
                        id="dandoryTimeSeconds"
                        type="number"
                        value={dandoryTimeSeconds}
                        onChange={(e) => setDandoryTimeSeconds(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="curingTimeSeconds">Curing (S)</Label>
                    <Input
                        id="curingTimeSeconds"
                        type="number"
                        value={curingTimeSeconds}
                        onChange={(e) => setCuringTimeSeconds(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t pt-2 mt-2">
                <div className="space-y-2">
                    <Label htmlFor="manualStock">Manual Stock</Label>
                    <Input
                        id="manualStock"
                        type="number"
                        value={manualStock}
                        onChange={(e) => setManualStock(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="faStock">FA Stock</Label>
                    <Input
                        id="faStock"
                        type="number"
                        value={faStock}
                        onChange={(e) => setFaStock(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                    <Label htmlFor="buildingAch">Build Ach</Label>
                    <Input
                        id="buildingAch"
                        type="number"
                        value={buildingAch}
                        onChange={(e) => setBuildingAch(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="curingAch">Curing Ach</Label>
                    <Input
                        id="curingAch"
                        type="number"
                        value={curingAch}
                        onChange={(e) => setCuringAch(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="qtyScrap">Qty Scrap</Label>
                    <Input
                        id="qtyScrap"
                        type="number"
                        value={qtyScrap}
                        onChange={(e) => setQtyScrap(e.target.value)}
                    />
                </div>
            </div>

            <div className="space-y-2 border-t pt-2">
                <Label htmlFor="machinesRaw">Machines String (Raw)</Label>
                <Input
                    id="machinesRaw"
                    placeholder="e.g. B-01, B-02"
                    value={machinesRaw}
                    onChange={(e) => setMachinesRaw(e.target.value)}
                />
            </div>

            <div className="space-y-2 border-t pt-2">
                <Label>Machine Assignments</Label>
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
                                <span>{machine.code}</span>
                            </label>
                        ))
                    )}
                </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 sticky bottom-0 bg-background pb-2">
                <Button variant="outline" onClick={onCancel} disabled={isLoading}>
                    Cancel
                </Button>
                <Button
                    onClick={handleFormSubmit}
                    disabled={isLoading || !codeNo || !sizeName}
                >
                    {isLoading ? "Saving..." : product ? "Update" : "Create"}
                </Button>
            </div>
        </div>
    );
}

