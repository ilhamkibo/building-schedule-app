"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormCombobox } from "@/components/ui/form-combobox";

interface ScheduleFormFiltersProps {
    code: string;
    date: string;
    onDateChange: (date: string) => void;
    selectedCategoryNo: string | undefined;
    onCategoryChange: (categoryNo: string | undefined) => void;
    categories: any[];
}

export function ScheduleFormFilters({
    code,
    date,
    onDateChange,
    selectedCategoryNo,
    onCategoryChange,
    categories,
}: ScheduleFormFiltersProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-muted/20 border p-4 rounded-xl">
            <div className="space-y-2">
                <Label htmlFor="code">Schedule Code</Label>
                <Input id="code" className="bg-white" disabled value={code} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="category">Production Category</Label>
                <FormCombobox
                    value={selectedCategoryNo}
                    onChange={onCategoryChange}
                    options={categories?.map(l => ({ ...l, id: String(l.categoryNo || l.id), name: l.name }))}
                    placeholder="Select Category"
                    searchPlaceholder="Search Category"
                    emptyText="No categories found."
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                    id="date"
                    type="date"
                    className="bg-white"
                    value={date}
                    onChange={(e) => onDateChange(e.target.value)}
                />
            </div>
        </div>
    );
}
