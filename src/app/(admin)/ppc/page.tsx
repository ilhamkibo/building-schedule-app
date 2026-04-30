import AppHeader from "@/components/layouts/app-header";
import PPCList from "@/components/pages/ppc/ppc-list";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PPC List",
};

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
