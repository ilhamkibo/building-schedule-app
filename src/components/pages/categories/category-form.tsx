"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Category } from "@/types/category";

interface CategoryFormProps {
    category: Category | null;
    onCancel: () => void;
    onSubmit: (payload: {
        name: string;
        startCode: number;
        endCode: number;
        categoryNo: number;
    }) => void;
    isLoading?: boolean;
}

export default function CategoryForm({
    category,
    onCancel,
    onSubmit,
    isLoading,
}: CategoryFormProps) {
    const [name, setName] = useState(category?.name ?? "");
    const [startCode, setStartCode] = useState(category?.startCode.toString() ?? "");
    const [endCode, setEndCode] = useState(category?.endCode.toString() ?? "");
    const [categoryNo, setCategoryNo] = useState(category?.categoryNo.toString() ?? "");

    const handleSubmit = () => {
        onSubmit({
            name,
            startCode: parseInt(startCode),
            endCode: parseInt(endCode),
            categoryNo: parseInt(categoryNo),
        });
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
                <div className="flex col-span-2 flex-col gap-2">
                    <Label>Category Name</Label>
                    <Input
                        placeholder="e.g. TB"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Label>Category No</Label>
                    <Input
                        type="number"
                        placeholder="e.g. 1"
                        value={categoryNo}
                        onChange={(e) => setCategoryNo(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                    <Label>Start Code</Label>
                    <Input
                        type="number"
                        placeholder="e.g. 1100"
                        value={startCode}
                        onChange={(e) => setStartCode(e.target.value)}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <Label>End Code</Label>
                    <Input
                        type="number"
                        placeholder="e.g. 1900"
                        value={endCode}
                        onChange={(e) => setEndCode(e.target.value)}
                    />
                </div>
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
                    onClick={handleSubmit}
                    disabled={isLoading || !name || !startCode || !endCode}
                >
                    {isLoading ? "Saving..." : category ? "Update" : "Create"}
                </Button>
            </div>
        </div>
    );
}
