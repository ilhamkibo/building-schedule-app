import AppHeader from "@/components/layouts/app-header";
import PPCList from "@/components/pages/ppc/ppc-list";

export default function PPCListPage() {
    return (
        <div>
            <AppHeader title="PPC List" />
            <main className="p-4">
                <PPCList />
            </main>
        </div>
    );
}
