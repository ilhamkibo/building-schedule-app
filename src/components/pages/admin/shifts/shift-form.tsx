"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shift, ShiftBreak } from "@/types/shift";
import { Plus, Trash2, Clock } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface ShiftFormProps {
    shift: Shift | null;
    onCancel: () => void;
    onSubmit: (payload: any) => void;
    isLoading?: boolean;
}

export default function ShiftForm({
    shift,
    onCancel,
    onSubmit,
    isLoading = false,
}: ShiftFormProps) {
    const [shiftNo, setShiftNo] = useState<number>(shift?.shiftNo ?? 1);
    const [shiftName, setShiftName] = useState(shift?.shiftName ?? "");
    const [startTime, setStartTime] = useState(shift?.startTime ?? "00:00:00");
    const [endTime, setEndTime] = useState(shift?.endTime ?? "00:00:00");
    const [workSeconds, setWorkSeconds] = useState<number>(shift?.workSeconds ?? 28800);
    const [isActive, setIsActive] = useState(shift?.isActive ?? true);
    const [colorCode, setColorCode] = useState(shift?.colorCode ?? "");
    const [colorBreak, setColorBreak] = useState(shift?.colorBreak ?? "");
    const [shiftBreaks, setShiftBreaks] = useState<ShiftBreak[]>(shift?.shiftBreaks ?? []);

    const addBreak = () => {
        setShiftBreaks([...shiftBreaks, { startTime: "00:00:00", endTime: "00:00:00", breakSeconds: 0 }]);
    };

    const removeBreak = (index: number) => {
        setShiftBreaks(shiftBreaks.filter((_, i) => i !== index));
    };

    const updateBreak = (index: number, field: keyof ShiftBreak, value: string | number) => {
        const newBreaks = [...shiftBreaks];
        newBreaks[index] = { ...newBreaks[index], [field]: value };
        setShiftBreaks(newBreaks);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            shiftNo,
            shiftName,
            startTime,
            endTime,
            workSeconds,
            isActive,
            colorCode: colorCode || null,
            colorBreak: colorBreak || null,
            shiftBreaks: shiftBreaks.map(b => ({
                startTime: b.startTime,
                endTime: b.endTime
            }))
        });
    };

    return (
        <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="shiftNo">Shift No</Label>
                    <Input
                        id="shiftNo"
                        type="number"
                        value={shiftNo}
                        onChange={(e) => setShiftNo(parseInt(e.target.value))}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="shiftName">Shift Name</Label>
                    <Input
                        id="shiftName"
                        placeholder="e.g. Shift 1"
                        value={shiftName}
                        onChange={(e) => setShiftName(e.target.value)}
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <div className="relative">
                        <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="startTime"
                            type="time"
                            step="1"
                            className="pl-9"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <div className="relative">
                        <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="endTime"
                            type="time"
                            step="1"
                            className="pl-9"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            required
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="workSeconds">Work Seconds</Label>
                    <Input
                        id="workSeconds"
                        type="number"
                        value={workSeconds}
                        onChange={(e) => setWorkSeconds(parseInt(e.target.value))}
                        required
                    />
                </div>
                <div className="flex items-center space-x-2 pt-8">
                    <Switch
                        id="isActive"
                        checked={isActive}
                        onCheckedChange={setIsActive}
                    />
                    <Label htmlFor="isActive">Is Active</Label>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="colorCode">Color Code (Hex)</Label>
                    <div className="flex gap-2">
                        <Input
                            id="colorCode"
                            placeholder="#FFFFFF"
                            value={colorCode}
                            onChange={(e) => setColorCode(e.target.value)}
                        />
                        <div
                            className="w-10 h-9 rounded border"
                            style={{ backgroundColor: colorCode || 'transparent' }}
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="colorBreak">Color Break (Hex)</Label>
                    <div className="flex gap-2">
                        <Input
                            id="colorBreak"
                            placeholder="#FF0000"
                            value={colorBreak}
                            onChange={(e) => setColorBreak(e.target.value)}
                        />
                        <div
                            className="w-10 h-9 rounded border"
                            style={{ backgroundColor: colorBreak || 'transparent' }}
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <Label>Shift Breaks</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addBreak}>
                        <Plus className="mr-2 h-3 w-3" />
                        Add Break
                    </Button>
                </div>

                <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
                    {shiftBreaks.length === 0 ? (
                        <p className="text-sm text-muted-foreground italic text-center py-2">No breaks defined</p>
                    ) : (
                        shiftBreaks.map((b, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 border rounded-md bg-muted/30">
                                <div className="flex-1 space-y-1">
                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Start</Label>
                                    <Input
                                        type="time"
                                        step="1"
                                        size={1}
                                        value={b.startTime}
                                        onChange={(e) => updateBreak(index, "startTime", e.target.value)}
                                        className="h-8 py-0 px-2"
                                    />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">End</Label>
                                    <Input
                                        type="time"
                                        step="1"
                                        size={1}
                                        value={b.endTime}
                                        onChange={(e) => updateBreak(index, "endTime", e.target.value)}
                                        className="h-8 py-0 px-2"
                                    />
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 mt-4"
                                    onClick={() => removeBreak(index)}
                                >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isLoading || !shiftName}>
                    {isLoading ? "Saving..." : shift ? "Update Shift" : "Create Shift"}
                </Button>
            </div>
        </form>
    );
}
