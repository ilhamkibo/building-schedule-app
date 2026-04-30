import AppHeader from "@/components/layouts/app-header";
import PPLList from "@/components/pages/ppl/ppl-list";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PPL List",
};

export default function PPLPage() {
    return (
        <div>
            <AppHeader title="PPL List" />
            <main className="p-4">
                <PPLList />
            </main>
        </div>
    );
}
