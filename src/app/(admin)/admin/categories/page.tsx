import AppHeader from "@/components/layouts/app-header";
import CategoryList from "@/components/pages/categories/category-list";

export default function CategoriesPage() {
    return (
        <div>
            <AppHeader title="Categories" />
            <main className="p-4">
                <CategoryList />
            </main>
        </div>
    );
}
