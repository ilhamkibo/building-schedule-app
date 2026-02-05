import AppHeader from "@/components/layouts/app-header";
import LineList from "@/components/pages/lines/line-list";

export default function LinesPage() {
    return <div>
        <AppHeader title="Lines" />
        <main className="p-4">
            <LineList />
        </main>
    </div>;
}
