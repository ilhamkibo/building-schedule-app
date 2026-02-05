import AppHeader from "@/components/layouts/app-header";
import ProductList from "@/components/pages/products/product-list";

export default function ProductsPage() {
    return (
        <div>
            <AppHeader title="Products" />
            <main className="p-4">
                <ProductList />
            </main>
        </div>
    );
}
