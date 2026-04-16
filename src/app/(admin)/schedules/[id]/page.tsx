"use client";

import { useState } from "react";
import AppHeader from "@/components/layouts/app-header";
import ScheduleDetails from "@/components/pages/schedules/schedule-details";
import EditScheduleForm from "@/components/pages/schedules/edit-schedule-form";
import { useSchedule, useSchedules } from "@/hooks/use-schedule";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Pencil } from "lucide-react";

export default function ScheduleBoardPage() {
    const params = useParams();
    const router = useRouter();
    const id = parseInt(params.id as string);

    const [isEditing, setIsEditing] = useState(false);

    const { data: boardData, isLoading, isError } = useSchedule(id);

    // Also fetch the schedule summary to get lineNo (which might not be in ScheduleBoard response)
    const { data: schedulesList = [] } = useSchedules({ page: 1, limit: 100 });
    const scheduleInfo = schedulesList.find((s) => s.id === id);
    const lineNo = boardData?.data?.lineNo ?? scheduleInfo?.lineNo ?? 0;

    return (
        <div>
            <AppHeader title="Schedule Board" />
            <main className="p-4 space-y-4">
                <div className="flex items-center justify-between gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                        disabled={isEditing}
                    >
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Back to List
                    </Button>
                    {!isEditing && boardData?.data && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEditing(true)}
                        >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit Schedule
                        </Button>
                    )}
                </div>

                {isLoading ? (
                    <div className="py-20 text-center">Loading board data...</div>
                ) : isError ? (
                    <div className="py-20 text-center text-red-500">
                        Error loading schedule data. Please check the ID.
                    </div>
                ) : boardData && boardData.data ? (
                    isEditing ? (
                        <EditScheduleForm
                            board={boardData.data}
                            lineNo={lineNo}
                            onCancel={() => setIsEditing(false)}
                            onSuccess={() => {
                                setIsEditing(false);
                                router.push(`/schedules`);
                            }}
                        />
                    ) : (
                        <ScheduleDetails board={boardData.data} />
                    )
                ) : (
                    <div className="py-20 text-center text-muted-foreground">
                        No data found.
                    </div>
                )}
            </main>
        </div>
    );
}
