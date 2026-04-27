"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { DashboardLegend } from "./DashboardLegend";
import { Line } from "@/types/line";
import { RefreshCw } from "lucide-react";
import { useAuthContext } from "@/context/auth-context";

interface DashboardFilterBarProps {
    selectedLineNo: string;
    onLineNoChange: (value: string) => void;
    selectedDate: string;
    onDateChange: (value: string) => void;
    lines: Line[];
    onEditClick?: () => void;
    onRefreshClick?: () => void;
    isRefreshing?: boolean;
    canRefresh?: boolean;
}

export function DashboardFilterBar({
    selectedLineNo,
    onLineNoChange,
    selectedDate,
    onDateChange,
    lines,
    onEditClick,
    onRefreshClick,
    isRefreshing,
    canRefresh,
}: DashboardFilterBarProps) {

    const { user } = useAuthContext();

    return (
        <div className="px-4 mb-4 rounded-md py-2 font-semibold bg-sidebar border-b dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                <Select value={selectedLineNo} onValueChange={onLineNoChange}>
                    <SelectTrigger className="md:w-[180px] w-full h-8 font-semibold bg-background dark:border-slate-700">
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
                <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => onDateChange(e.target.value)}
                    className="md:w-[160px] w-full h-9 font-semibold bg-background dark:border-slate-700"
                />

                {user?.role === "admin" || user?.role === "editor" && onEditClick && (
                    <Button
                        variant="outline"
                        onClick={onEditClick}
                        className="h-9 gap-2"
                    >
                        Edit Schedule
                    </Button>
                )}

                {onRefreshClick && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onRefreshClick}
                        disabled={!canRefresh || isRefreshing}
                        className="h-9 gap-2"
                    >
                        <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                )}


            </div>

            <DashboardLegend />
        </div>
    );
}
