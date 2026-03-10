"use client";

import AppHeader from "@/components/layouts/app-header";
import ScheduleDetails from "@/components/pages/schedules/schedule-details";
import { useSchedule } from "@/hooks/use-schedule";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function ScheduleBoardPage() {
    const params = useParams();
    const router = useRouter();
    const id = parseInt(params.id as string);

    const { data: boardData, isLoading, isError } = useSchedule(id);
    console.log("🚀 ~ ScheduleBoardPage ~ boardData:", boardData)

    return (
        <div>
            <AppHeader title="Schedule Board" />
            <main className="p-4 space-y-4">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                    >
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Back to List
                    </Button>
                </div>

                {isLoading ? (
                    <div className="py-20 text-center">Loading board data...</div>
                ) : isError ? (
                    <div className="py-20 text-center text-red-500">
                        Error loading schedule data. Please check the ID.
                    </div>
                ) : boardData && boardData.data ? (
                    <ScheduleDetails board={boardData.data} />
                ) : (
                    <div className="py-20 text-center text-muted-foreground">
                        No data found.
                    </div>
                )}
            </main>
        </div>
    );
}
