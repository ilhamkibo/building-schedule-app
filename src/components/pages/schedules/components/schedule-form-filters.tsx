"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormCombobox } from "@/components/ui/form-combobox";
import { Category } from "@/types/category";

interface ScheduleFormFiltersProps {
    code: string;
    date: string;
    onDateChange: (date: string) => void;
    selectedCategoryNo: string | undefined;
    onCategoryChange: (categoryNo: string | undefined) => void;
    selectedLineId: string | undefined;
    onLineIdChange: (lineId: string | undefined) => void;
    categories: Category[];
}

export function ScheduleFormFilters({
    code,
    date,
    onDateChange,
    selectedCategoryNo,
    onCategoryChange,
    selectedLineId,
    onLineIdChange,
    categories,
}: ScheduleFormFiltersProps) {
    console.log("🚀 ~ ScheduleFormFilters ~ selectedLineId:", selectedLineId, selectedCategoryNo)
    const selectedCategory = categories.find(c => Number(c.categoryNo) === Number(selectedCategoryNo));

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-muted/20 border p-4 rounded-xl">
            <div className="space-y-2">
                <Label htmlFor="code">Schedule Code</Label>
                <Input id="code" className="bg-white" disabled value={code} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="category">Production Category</Label>
                <FormCombobox
                    value={selectedCategoryNo}
                    onChange={onCategoryChange}
                    options={categories?.map(l => ({
                        ...l,
                        id: String(l.categoryNo || l.id),
                        name: l.name ?? "Unnamed Category"
                    }))}
                    placeholder="Select Category"
                    searchPlaceholder="Search Category"
                    emptyText="No categories found."
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="line">Line</Label>
                {selectedCategory?.lines?.length !== undefined && selectedCategory?.lines?.length !== null && selectedCategory?.lines?.length > 0 ? (
                    <FormCombobox
                        value={selectedLineId}
                        onChange={onLineIdChange}
                        options={selectedCategory?.lines?.map(l => ({
                            ...l,
                            id: String(l.id),
                            name: l.name ?? "Unnamed Line"
                        })) || []}
                        placeholder="Select Line"
                        searchPlaceholder="Search Line"
                        emptyText="No lines found."
                    />
                ) : (
                    <Input
                        id="line"
                        className="bg-white"
                        disabled
                        value="No lines available"
                    />
                )}
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
