import AppHeader from "@/components/layouts/app-header";
import MachineList from "@/components/pages/machines/machine-list";

export default function MachinesPage() {
    return <div>
        <AppHeader title="Machines" />
        <main className="p-4">
            <MachineList />
        </main>
    </div>;
}
