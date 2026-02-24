import AppHeader from "@/components/layouts/app-header";
import ShiftList from "@/components/pages/admin/shifts/shift-list";

export default function ShiftsPage() {
    return (
        <div className="flex flex-col h-full">
            <AppHeader title="Shift Time Management" />
            <main className="p-6 flex-1 overflow-auto">
                <ShiftList />
            </main>
        </div>
    );
}
