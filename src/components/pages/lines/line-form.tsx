"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Line } from "@/types/line";

interface LineFormProps {
    line: Line | null;
    onCancel: () => void;
    onSubmit: (payload: {
        name: string | null;
        lineNo: number;
        description: string | null;
    }) => void;
    isLoading?: boolean;
}

export default function LineForm({
    line,
    onCancel,
    onSubmit,
    isLoading,
}: LineFormProps) {
    const [name, setName] = useState(line?.name ?? "");
    const [lineNo, setLineNo] = useState(line?.lineNo ?? 0);
    const [description, setDescription] = useState(line?.description ?? "");

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-2">
                <Label>Line Name</Label>
                <Input
                    placeholder="e.g. Line Assembly 1"
                    value={name ?? ""}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            <div className="flex flex-col gap-2">
                <Label>Line Number</Label>
                <Input
                    type="number"
                    placeholder="e.g. 1"
                    value={lineNo}
                    onChange={(e) => setLineNo(Number(e.target.value))}
                />
            </div>

            <div className="flex flex-col gap-2">
                <Label>Description</Label>
                <textarea
                    placeholder="Enter line description"
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
                    onClick={() => onSubmit({ name, lineNo, description })}
                    disabled={isLoading || !name}
                >
                    {isLoading ? "Saving..." : line ? "Update" : "Create"}
                </Button>
            </div>
        </div>
    );
}
