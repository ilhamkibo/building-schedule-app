import AppHeader from "@/components/layouts/app-header";
import UserList from "@/components/pages/users/user-list";

export default function UsersPage() {
    return <div>
        <AppHeader title="Users" />
        <main className="p-4">
            <UserList />
        </main>
    </div>;
}