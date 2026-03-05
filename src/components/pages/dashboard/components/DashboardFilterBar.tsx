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

interface Category {
    id: string | number;
    categoryNo: number;
    name: string;
}

interface DashboardFilterBarProps {
    selectedCategoryNo: string;
    onCategoryChange: (value: string) => void;
    categories: Category[];
}

export function DashboardFilterBar({
    selectedCategoryNo,
    onCategoryChange,
    categories,
}: DashboardFilterBarProps) {
    return (
        <div className="px-4 mb-4 rounded-md py-2 font-semibold bg-sidebar border-b dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                <Select value={selectedCategoryNo} onValueChange={onCategoryChange}>
                    <SelectTrigger className="w-[180px] h-8 font-semibold bg-background dark:border-slate-700">
                        <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map((category) => (
                            <SelectItem key={category.id} value={category.categoryNo.toString()}>
                                {category.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <DashboardLegend />
        </div>
    );
}
