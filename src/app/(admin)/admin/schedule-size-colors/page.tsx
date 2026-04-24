import AppHeader from "@/components/layouts/app-header";
import ScheduleSizeColorList from "@/components/pages/schedule-size-colors/schedule-size-color-list";

export default function ScheduleSizeColorsPage() {
    return (
        <div>
            <AppHeader title="Schedule Size Colors" />
            <main className="p-4">
                <ScheduleSizeColorList />
            </main>
        </div>
    );
}
