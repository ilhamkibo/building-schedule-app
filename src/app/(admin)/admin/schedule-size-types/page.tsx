import AppHeader from "@/components/layouts/app-header";
import ScheduleSizeTypeList from "@/components/pages/schedule-size-types/schedule-size-type-list";

export default function ScheduleSizeTypesPage() {
    return (
        <div>
            <AppHeader title="Schedule Size Types" />
            <main className="p-4">
                <ScheduleSizeTypeList />
            </main>
        </div>
    );
}
