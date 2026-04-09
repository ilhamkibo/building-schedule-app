import AppHeader from "@/components/layouts/app-header";
import CuringEfficiencyList from "@/components/pages/curing-efficiencies/curing-efficiency-list";

export default function CuringEfficienciesPage() {
    return (
        <div>
            <AppHeader title="Curing Efficiencies" />
            <main className="p-4">
                <CuringEfficiencyList />
            </main>
        </div>
    );
}
