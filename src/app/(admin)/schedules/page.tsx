import AppHeader from "@/components/layouts/app-header";
import ScheduleList from "@/components/pages/schedules/schedule-list";

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
