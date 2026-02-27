"use client";

import AppHeader from "@/components/layouts/app-header";
import { usePPLs } from "@/hooks/use-ppl";
import PPLReferenceSidebar from "@/components/pages/schedules/ppl-reference-sidebar";
import ScheduleForm from "@/components/pages/schedules/schedule-form";
import { useRouter } from "next/navigation";

export default function CreateSchedulePage() {
    const router = useRouter();
    const { data: ppls } = usePPLs({ limit: 1000, isActive: true });

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <AppHeader title="Create New Schedule" />
            <main className="flex-1 flex overflow-hidden p-4">
                <div className="border rounded-lg flex flex-1 overflow-hidden">
                    {/* <div className="w-[400px]  bg-muted/10 flex flex-col overflow-hidden">
                        <PPLReferenceSidebar ppls={ppls} />
                    </div> */}
                    <div className="flex-1 overflow-hidden">
                        {/* <div className="max-w-5xl mx-auto h-full bg-sidebar shadow-sm overflow-hidden border-l"> */}
                        <div className=" mx-auto h-full bg-sidebar shadow-sm overflow-hidden border-l">
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
