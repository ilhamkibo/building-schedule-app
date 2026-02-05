"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Machine } from "@/types/machine";

interface MachineFormProps {
    machine: Machine | null;
    onCancel: () => void;
    onSubmit: (payload: {
        code: string;
        name: string | null;
        description: string | null;
    }) => void;
    isLoading?: boolean;
}

export default function MachineForm({
    machine,
    onCancel,
    onSubmit,
    isLoading,
}: MachineFormProps) {
    const [code, setCode] = useState(machine?.code ?? "");
    const [name, setName] = useState(machine?.name ?? "");
    const [description, setDescription] = useState(machine?.description ?? "");

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-2">
                <Label>Machine Code</Label>
                <Input
                    placeholder="e.g. NRM 59"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                />
            </div>

            <div className="flex flex-col gap-2">
                <Label>Machine Name</Label>
                <Input
                    placeholder="e.g. Machine 1"
                    value={name ?? ""}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            <div className="flex flex-col gap-2">
                <Label>Description</Label>
                <textarea
                    placeholder="Enter machine description"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={description ?? ""}
                    onChange={(e) => setDescription(e.target.value)}
                />
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
                    onClick={() => onSubmit({ code, name, description })}
                    disabled={isLoading || !code}
                >
                    {isLoading ? "Saving..." : machine ? "Update" : "Create"}
                </Button>
            </div>
        </div>
    );
}
