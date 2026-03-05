"use client";

import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLines } from "@/hooks/use-line";
import { Category } from "@/types/category";
import { useAssignLines } from "@/hooks/use-category";
import { Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface AssignLineDialogProps {
    category: Category | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function AssignLineDialog({
    category,
    open,
    onOpenChange,
}: AssignLineDialogProps) {
    const { data: lines = [], isLoading: isLoadingLines } = useLines({ limit: 100 });
    const [selectedLineIds, setSelectedLineIds] = useState<number[]>([]);

    const assignMutation = useAssignLines({
        onSuccess: () => {
            onOpenChange(false);
        },
    });

    useEffect(() => {
        if (open && category) {
            setSelectedLineIds(category.lines?.map((l) => l.id) || []);
        }
    }, [open, category]);

    const toggleLine = (lineId: number) => {
        setSelectedLineIds((prev) =>
            prev.includes(lineId)
                ? prev.filter((id) => id !== lineId)
                : [...prev, lineId]
        );
    };

    const handleSave = () => {
        if (category) {
            assignMutation.mutate({
                categoryId: category.id,
                lineIds: selectedLineIds,
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Assign Lines to {category?.name}</DialogTitle>
                </DialogHeader>

                <div className="py-4">
                    {isLoadingLines ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-2">
                            {lines.map((line) => {
                                const isSelected = selectedLineIds.includes(line.id);
                                return (
                                    <div
                                        key={line.id}
                                        onClick={() => toggleLine(line.id)}
                                        className={cn(
                                            "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all duration-200",
                                            isSelected
                                                ? "bg-primary/10 border-primary text-primary shadow-sm"
                                                : "hover:bg-muted border-transparent bg-muted/40 text-muted-foreground"
                                        )}
                                    >
                                        <span className="text-sm font-semibold">{line.name}</span>
                                        {isSelected && <Check className="h-4 w-4 animate-in zoom-in duration-300" />}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={assignMutation.isPending || isLoadingLines}
                        className="bg-primary hover:bg-primary/90"
                    >
                        {assignMutation.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            "Save Changes"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
