import AppHeader from "@/components/layouts/app-header";
import ConfigList from "@/components/pages/config/config-list";

export default function ConfigPage() {
    return (
        <div>
            <AppHeader title="Configurations" />
            <main className="p-4">
                <ConfigList />
            </main>
        </div>
    );
}
