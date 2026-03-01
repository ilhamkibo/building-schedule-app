"use client";

import AppHeader from "@/components/layouts/app-header";
import { usePPLs } from "@/hooks/use-ppl";
import { ResponsivePPLReference } from "@/components/pages/schedules/components/responsive-ppl-reference";
import ScheduleForm from "@/components/pages/schedules/schedule-form";
import { useRouter } from "next/navigation";

export default function CreateSchedulePage() {
    const router = useRouter();
    const { data: ppls } = usePPLs({ limit: 1000, isActive: true });

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <AppHeader title="Create New Schedule" />
            <main className="flex-1 flex overflow-hidden p-4">
                <div className="flex flex-1 overflow-hidden">
                    <ResponsivePPLReference ppls={ppls} />
                    <div className="flex-1 overflow-hidden">
                        <div className=" mx-auto h-full bg-sidebar pt-2 shadow-sm overflow-hidden border-r border-t border-b rounded-r-xl">
                            <ScheduleForm
                                onCancel={() => router.push("/schedules")}
                                onSuccess={() => router.push("/schedules")}
                            />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
