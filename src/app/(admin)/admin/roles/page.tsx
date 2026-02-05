import AppHeader from "@/components/layouts/app-header";
import RoleList from "@/components/pages/roles/role-list";

export default function RolesPage() {
    return <div>
        <AppHeader title="Roles" />
        <main className="p-4">
            <RoleList />
        </main>
    </div>;
}