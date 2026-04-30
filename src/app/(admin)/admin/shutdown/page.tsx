import AppHeader from "@/components/layouts/app-header";
import { ShutdownList } from "@/components/pages/shutdown/shutdown-list";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Shutdown Records",
};

export default function ShutdownPage() {
    return (
        <div className="flex flex-col h-full">
            <AppHeader title="Shutdown Management" />
            <main className="p-6 flex-1 bg-slate-50/50 dark:bg-background">
                <ShutdownList />
            </main>
        </div>
    );
}