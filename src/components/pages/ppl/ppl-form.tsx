"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMachines } from "@/hooks/use-machine";
import { PPL } from "@/types/ppl";
import { useState } from "react";

interface PPLFormProps {
    ppl: PPL | null;
    onCancel: () => void;
    onSubmit: (payload: any) => void;
    isLoading?: boolean;
}

export default function PPLForm({
    ppl,
    onCancel,
    onSubmit,
    isLoading = false,
}: PPLFormProps) {
    const { data: machines = [], isLoading: isLoadingMachines } = useMachines({ limit: 100 });

    const [createDateTime, setCreateDateTime] = useState(
        ppl?.createDateTime ? new Date(ppl.createDateTime).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16)
    );
    const [build, setBuild] = useState(ppl?.build ?? "");
    const [rim, setRim] = useState(ppl?.rim ?? "");
    const [typeMC, setTypeMC] = useState<string[]>(ppl?.typeMC ?? []);
    const [uph, setUph] = useState(ppl?.uph?.toString() ?? "0");
    const [tireCode, setTireCode] = useState(ppl?.tireCode ?? "");
    const [mold, setMold] = useState(ppl?.mold?.toString() ?? "0");
    const [moldStock, setMoldStock] = useState(ppl?.moldStock?.toString() ?? "0");
    const [qty, setQty] = useState(ppl?.qty?.toString() ?? "0");
    const [note, setNote] = useState(ppl?.note ?? "");

    const toggleMachine = (machineCode: string) => {
        setTypeMC((prev) =>
            prev.includes(machineCode)
                ? prev.filter((code) => code !== machineCode)
                : [...prev, machineCode]
        );
    };

    const handleFormSubmit = () => {
        onSubmit({
            createDateTime,
            build,
            rim,
            typeMC,
            uph: parseFloat(uph),
            tireCode,
            mold: parseInt(mold),
            moldStock: parseInt(moldStock),
            qty: parseInt(qty),
            note,
        });
    };

    return (
        <div className="space-y-4 max-h-[80vh] overflow-y-auto px-1">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="createDateTime">Create Date Time</Label>
                    <Input
                        id="createDateTime"
                        type="datetime-local"
                        value={createDateTime}
                        onChange={(e) => setCreateDateTime(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="tireCode">Tire Code</Label>
                    <Input
                        id="tireCode"
                        placeholder="e.g. 4281"
                        value={tireCode}
                        onChange={(e) => setTireCode(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="build">Build</Label>
                    <Input
                        id="build"
                        placeholder="e.g. PC1"
                        value={build}
                        onChange={(e) => setBuild(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="rim">Rim</Label>
                    <Input
                        id="rim"
                        placeholder="e.g. 13"
                        value={rim}
                        onChange={(e) => setRim(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="uph">UPH</Label>
                    <Input
                        id="uph"
                        type="number"
                        step="0.01"
                        value={uph}
                        onChange={(e) => setUph(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="qty">Qty</Label>
                    <Input
                        id="qty"
                        type="number"
                        value={qty}
                        onChange={(e) => setQty(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="mold">Mold</Label>
                    <Input
                        id="mold"
                        type="number"
                        value={mold}
                        onChange={(e) => setMold(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="moldStock">Mold Stock</Label>
                    <Input
                        id="moldStock"
                        type="number"
                        value={moldStock}
                        onChange={(e) => setMoldStock(e.target.value)}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="note">Note</Label>
                <Input
                    id="note"
                    placeholder="Optional note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <Label>Type MC (Machines)</Label>
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
                                    checked={typeMC.includes(machine.code)}
                                    onChange={() => toggleMachine(machine.code)}
                                    className="rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <span>{machine.code}</span>
                            </label>
                        ))
                    )}
                </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={onCancel} disabled={isLoading}>
                    Cancel
                </Button>
                <Button
                    onClick={handleFormSubmit}
                    disabled={isLoading || !build || !tireCode || typeMC.length === 0}
                >
                    {isLoading ? "Saving..." : ppl ? "Update" : "Create"}
                </Button>
            </div>
        </div>
    );
}
