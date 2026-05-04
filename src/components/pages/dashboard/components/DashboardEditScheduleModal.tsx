"use client";

import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
} from "@/components/ui/sheet";
import { useSchedules, useSchedule } from "@/hooks/use-schedule";
import EditScheduleForm from "@/components/pages/schedules/edit-schedule-form";
import { PencilLine, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

interface DashboardEditScheduleModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    lineNo: string;
    date: string;
}

export function DashboardEditScheduleModal({
    open,
    onOpenChange,
    lineNo,
    date,
}: DashboardEditScheduleModalProps) {
    const [scheduleId, setScheduleId] = useState<number | null>(null);

    const { data: schedulesList = [], isLoading: isLoadingList } = useSchedules({ page: 1, limit: 100 }, { enabled: open });

    // Find the schedule ID for the selected line and date when modal opens
    useEffect(() => {
        if (open && schedulesList.length > 0) {
            const found = schedulesList.find(s => String(s.lineNo) === lineNo && s.date === date);
            if (found) {
                setScheduleId(found.id);
            } else {
                setScheduleId(null);
            }
        }
    }, [open, schedulesList, lineNo, date]);

    console.log("🚀 ~ DashboardEditScheduleModal ~ scheduleId:", scheduleId)
    const { data: boardData, isLoading: isLoadingBoard } = useSchedule(scheduleId as number, {
        enabled: !!scheduleId && open
    });

    const isSearching = isLoadingList || isLoadingBoard;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="left" className="w-[85vw] sm:w-[75vw] sm:max-w-[75vw] p-0 overflow-hidden flex flex-col bg-slate-50/50 dark:bg-slate-900/50">
                {isSearching ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-4">
                        <Loader2 className="h-8 w-8 animate-spin" />
                        <p>Loading schedule data...</p>
                    </div>
                ) : !scheduleId ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                            <PencilLine className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">No Schedule Found</h3>
                        <p className="text-muted-foreground max-w-sm mb-6">
                            There is no saved schedule data for Line {lineNo} on {new Date(date).toLocaleDateString()}.
                            Please create a schedule first before trying to edit.
                        </p>
                        <Button onClick={() => onOpenChange(false)}>Close</Button>
                    </div>
                ) : boardData?.data ? (
                    <div className="flex-1 overflow-auto bg-transparent relative">
                        <EditScheduleForm
                            board={boardData.data}
                            lineNo={Number(lineNo)}
                            onCancel={() => onOpenChange(false)}
                            onSuccess={() => {
                                onOpenChange(false);
                            }}
                        />
                    </div>
                ) : null}
            </SheetContent>
        </Sheet>
    );
}
