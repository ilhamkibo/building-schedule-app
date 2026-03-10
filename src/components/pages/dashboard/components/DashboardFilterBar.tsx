"use client";

import React from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { DashboardLegend } from "./DashboardLegend";
import { Line } from "@/types/line";

interface DashboardFilterBarProps {
    selectedLineNo: string;
    onLineNoChange: (value: string) => void;
    lines: Line[];
}

export function DashboardFilterBar({
    selectedLineNo,
    onLineNoChange,
    lines,
}: DashboardFilterBarProps) {
    return (
        <div className="px-4 mb-4 rounded-md py-2 font-semibold bg-sidebar border-b dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                <Select value={selectedLineNo} onValueChange={onLineNoChange}>
                    <SelectTrigger className="w-[180px] h-8 font-semibold bg-background dark:border-slate-700">
                        <SelectValue placeholder="Select Line" />
                    </SelectTrigger>
                    <SelectContent>
                        {lines.map((line) => (
                            <SelectItem key={line.id} value={line.lineNo.toString()}>
                                {line.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <DashboardLegend />
        </div>
    );
}
