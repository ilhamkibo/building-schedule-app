import AppHeader from "@/components/layouts/app-header";
import ScheduleList from "@/components/pages/schedules/schedule-list";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Schedule List",
};

export default function SchedulesPage() {
    return (
        <div>
            <AppHeader title="Schedule List" />
            <main className="p-4">
                <ScheduleList />
            </main>
        </div>
    );
}
