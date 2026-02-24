"use client";

import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Plus, Search, Trash2, Pencil, Eye } from "lucide-react";
import { useProducts, useDeleteProduct, useCreateProduct, useUpdateProduct } from "@/hooks/use-product";
import { Product } from "@/types/product";
import ProductForm from "./product-form";
import ProductDetails from "./product-details";
import DataTablePagination from "@/components/common/data-table-pagination";

export default function ProductList() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [dialogOpen, setDialogOpen] = useState(false);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);

    /* debounce search */
    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 500);
        return () => clearTimeout(t);
    }, [search]);

    const { data: products = [], pagination, isLoading } = useProducts({
        page,
        limit,
        search: debouncedSearch,
    });

    const createMutation = useCreateProduct({
        onSuccess: () => {
            setDialogOpen(false);
        },
    });

    const updateMutation = useUpdateProduct({
        onSuccess: () => {
            setDialogOpen(false);
        },
    });

    const deleteMutation = useDeleteProduct({
        onSuccess: () => {
            setDeleteProduct(null);
        },
    });

    const openCreate = () => {
        setSelectedProduct(null);
        setDialogOpen(true);
    };

    const openEdit = (product: Product) => {
        setSelectedProduct(product);
        setDialogOpen(true);
    };

    const openDetails = (product: Product) => {
        setSelectedProduct(product);
        setDetailsOpen(true);
    };

    const handleDelete = async () => {
        if (deleteProduct) {
            deleteMutation.mutate(deleteProduct.id);
        }
    };

    const handleSubmit = (payload: any) => {
        if (selectedProduct) {
            updateMutation.mutate({ id: selectedProduct.id, data: payload });
        } else {
            createMutation.mutate(payload);
        }
    };

    return (
        <div className="space-y-4 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="relative w-72">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search products..."
                        className="pl-9 dark:bg-sidebar"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <Button onClick={openCreate} className="cursor-pointer">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
                </Button>
            </div>

            {/* Table */}
            <div className="rounded-md border dark:bg-sidebar">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Code No</TableHead>
                            <TableHead>Size Name</TableHead>
                            <TableHead>Source</TableHead>
                            <TableHead>Machines</TableHead>
                            <TableHead>Cycle Time</TableHead>
                            <TableHead className="w-[140px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {isLoading && (
                            <TableRow>
                                <TableCell className="text-center" colSpan={6}>Loading...</TableCell>
                            </TableRow>
                        )}

                        {!isLoading && products.length === 0 && (
                            <TableRow>
                                <TableCell className="text-center" colSpan={6}>No products found</TableCell>
                            </TableRow>
                        )}

                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell className="font-medium">{product.codeNo}</TableCell>
                                <TableCell>{product.sizeName}</TableCell>
                                <TableCell>{product.source}</TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                        {product.machines.map((m) => (
                                            <span key={m} className="px-2 py-0.5 bg-muted rounded text-xs">
                                                {m}
                                            </span>
                                        ))}
                                    </div>
                                </TableCell>
                                <TableCell>{product.cycleTimeSeconds}s</TableCell>
                                <TableCell className="flex gap-1">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => openDetails(product)}
                                        title="View Details"
                                    >
                                        <Eye className="h-4 w-4 text-blue-500" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => openEdit(product)}
                                        title="Edit Product"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => setDeleteProduct(product)}
                                        title="Delete Product"
                                    >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <DataTablePagination
                pagination={pagination}
                setPage={setPage}
                setLimit={setLimit}
                isLoading={isLoading}
            />

            {/* Dialog Create / Update */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedProduct ? "Edit Product" : "Create Product"}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedProduct
                                ? "Update product information"
                                : "Create a new product"}
                        </DialogDescription>
                    </DialogHeader>

                    <ProductForm
                        product={selectedProduct}
                        onCancel={() => setDialogOpen(false)}
                        onSubmit={handleSubmit}
                        isLoading={createMutation.isPending || updateMutation.isPending}
                    />
                </DialogContent>
            </Dialog>

            {/* Dialog Details */}
            <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Product Details</DialogTitle>
                        <DialogDescription>
                            Full information for {selectedProduct?.codeNo}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedProduct && <ProductDetails product={selectedProduct} />}

                    <div className="flex justify-end pt-4">
                        <Button variant="outline" onClick={() => setDetailsOpen(false)}>
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>


            {/* Delete Confirmation */}
            <AlertDialog open={!!deleteProduct} onOpenChange={() => setDeleteProduct(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete product?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. Product{" "}
                            <b>{deleteProduct?.codeNo}</b> will be permanently deleted.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700"
                            onClick={handleDelete}
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
