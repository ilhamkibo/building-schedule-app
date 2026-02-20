"use client";

import ProductRestrictionList from "@/components/pages/admin/products/product-restriction-list";

export default function ProductRestrictionPage() {
    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold tracking-tight">Product Restrictions</h1>
                <p className="text-muted-foreground">
                    Manage rules and restrictions for product codes on specific machines.
                </p>
            </div>

            <ProductRestrictionList />
        </div>
    );
}
