"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScheduleSizeColor } from "@/types/schedule-size-color";

interface ScheduleSizeColorFormProps {
    color: ScheduleSizeColor | null;
    onCancel: () => void;
    onSubmit: (payload: {
        typeCode: string;
        typeName: string;
        description: string;
        priority: number;
        textColorHex: string;
        backgroundColorHex: string;
    }) => void;
    isLoading?: boolean;
}

export default function ScheduleSizeColorForm({
    color,
    onCancel,
    onSubmit,
    isLoading,
}: ScheduleSizeColorFormProps) {
    const [typeCode, setTypeCode] = useState(color?.typeCode ?? "");
    const [typeName, setTypeName] = useState(color?.typeName ?? "");
    const [description, setDescription] = useState(color?.description ?? "");
    const [priority, setPriority] = useState(color?.priority?.toString() ?? "0");
    const [textColorHex, setTextColorHex] = useState(color?.textColorHex ?? "#000000");
    const [backgroundColorHex, setBackgroundColorHex] = useState(color?.backgroundColorHex ?? "#FFFFFF");

    const handleSubmit = () => {
        onSubmit({
            typeCode,
            typeName,
            description,
            priority: parseInt(priority) || 0,
            textColorHex,
            backgroundColorHex,
        });
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                    <Label>Type Code</Label>
                    <Input
                        placeholder="e.g. SM"
                        value={typeCode}
                        onChange={(e) => setTypeCode(e.target.value)}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <Label>Type Name</Label>
                    <Input
                        placeholder="e.g. Small"
                        value={typeName}
                        onChange={(e) => setTypeName(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <Label>Description</Label>
                <Textarea
                    placeholder="Enter description..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                />
            </div>

            <div className="flex flex-col gap-2">
                <Label>Priority</Label>
                <Input
                    type="number"
                    placeholder="e.g. 1"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                    <Label>Text Color</Label>
                    <div className="flex items-center gap-2">
                        <input
                            type="color"
                            value={textColorHex}
                            onChange={(e) => setTextColorHex(e.target.value)}
                            className="w-10 h-10 rounded border cursor-pointer p-0.5"
                        />
                        <Input
                            placeholder="#000000"
                            value={textColorHex}
                            onChange={(e) => setTextColorHex(e.target.value)}
                            className="flex-1"
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <Label>Background Color</Label>
                    <div className="flex items-center gap-2">
                        <input
                            type="color"
                            value={backgroundColorHex}
                            onChange={(e) => setBackgroundColorHex(e.target.value)}
                            className="w-10 h-10 rounded border cursor-pointer p-0.5"
                        />
                        <Input
                            placeholder="#FFFFFF"
                            value={backgroundColorHex}
                            onChange={(e) => setBackgroundColorHex(e.target.value)}
                            className="flex-1"
                        />
                    </div>
                </div>
            </div>

            {/* Preview */}
            <div className="flex flex-col gap-2">
                <Label>Preview</Label>
                <div
                    className="rounded-md px-4 py-2 text-center font-semibold border"
                    style={{
                        color: textColorHex,
                        backgroundColor: backgroundColorHex,
                    }}
                >
                    {typeName || "Preview Text"}
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
                    disabled={isLoading || !typeCode || !typeName}
                >
                    {isLoading ? "Saving..." : color ? "Update" : "Create"}
                </Button>
            </div>
        </div>
    );
}
