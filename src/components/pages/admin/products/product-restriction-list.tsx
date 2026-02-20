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
import { Plus, Search, Trash2, Pencil, Info, Eye } from "lucide-react";
import {
    useProductRestrictions,
    useDeleteProductRestriction,
    useCreateProductRestriction,
    useUpdateProductRestriction
} from "@/hooks/use-product-restriction";
import { ProductRestriction } from "@/types/product-restriction";
import ProductRestrictionForm from "./product-restriction-form";
import DataTablePagination from "@/components/common/data-table-pagination";

export default function ProductRestrictionList() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedRestriction, setSelectedRestriction] = useState<ProductRestriction | null>(null);
    const [deleteRestriction, setDeleteRestriction] = useState<ProductRestriction | null>(null);
    const [detailRestriction, setDetailRestriction] = useState<ProductRestriction | null>(null);

    /* debounce search */
    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 500);
        return () => clearTimeout(t);
    }, [search]);

    const { data: restrictions = [], pagination, isLoading } = useProductRestrictions({
        page,
        limit,
        search: debouncedSearch,
    });

    const createMutation = useCreateProductRestriction({
        onSuccess: () => {
            setDialogOpen(false);
        },
    });

    const updateMutation = useUpdateProductRestriction({
        onSuccess: () => {
            setDialogOpen(false);
        },
    });

    const deleteMutation = useDeleteProductRestriction({
        onSuccess: () => {
            setDeleteRestriction(null);
        },
    });

    const openCreate = () => {
        setSelectedRestriction(null);
        setDialogOpen(true);
    };

    const openEdit = (restriction: ProductRestriction) => {
        setSelectedRestriction(restriction);
        setDialogOpen(true);
    };

    const handleDelete = async () => {
        if (deleteRestriction) {
            deleteMutation.mutate(deleteRestriction.id);
        }
    };

    const handleSubmit = (payload: any) => {
        if (selectedRestriction) {
            updateMutation.mutate({ id: selectedRestriction.id, data: payload });
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
                        placeholder="Search by product code..."
                        className="pl-9 dark:bg-sidebar"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <Button onClick={openCreate} className="cursor-pointer">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Restriction
                </Button>
            </div>

            {/* Table */}
            <div className="rounded-md border dark:bg-sidebar">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[60px]">No</TableHead>
                            <TableHead>Product Code</TableHead>
                            <TableHead>Restricted Machines</TableHead>
                            <TableHead className="w-[120px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {isLoading && (
                            <TableRow>
                                <TableCell className="text-center" colSpan={4}>Loading...</TableCell>
                            </TableRow>
                        )}

                        {!isLoading && restrictions.length === 0 && (
                            <TableRow>
                                <TableCell className="text-center" colSpan={4}>No restrictions found</TableCell>
                            </TableRow>
                        )}

                        {restrictions.map((item, index) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{(page - 1) * limit + index + 1}</TableCell>
                                <TableCell className="font-bold">{item.codeNo}</TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-1.5">
                                        {item.details.map((d) => (
                                            <div
                                                key={d.id}
                                                className="group relative flex items-center px-2 py-0.5 bg-red-50 text-red-700 border border-red-100 rounded text-xs"
                                            >
                                                <span className="font-semibold">{d.machineCode}</span>
                                                {d.reason && (
                                                    <span className="ml-1 opacity-60 italic">({d.reason})</span>
                                                )}
                                            </div>
                                        ))}
                                        {item.details.length === 0 && (
                                            <span className="text-xs text-muted-foreground">-</span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="flex gap-1">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => setDetailRestriction(item)}
                                    >
                                        <Eye className="h-4 w-4 text-blue-500" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => openEdit(item)}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => setDeleteRestriction(item)}
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

            {/* Detail Dialog */}
            <Dialog open={!!detailRestriction} onOpenChange={() => setDetailRestriction(null)}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Restriction Details</DialogTitle>
                        <DialogDescription>
                            Complete information about product restriction
                        </DialogDescription>
                    </DialogHeader>

                    {detailRestriction && (
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Product Code</p>
                                <p className="font-bold text-lg">{detailRestriction.codeNo}</p>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground mb-3">Restricted Machines</p>
                                <div className="space-y-2">
                                    {detailRestriction.details.length > 0 ? (
                                        detailRestriction.details.map((d) => (
                                            <div
                                                key={d.id}
                                                className="flex flex-col p-3 border rounded bg-red-50/50 border-red-100"
                                            >
                                                <span className="font-semibold text-red-700 text-sm">{d.machineCode} | {d.reason}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-muted-foreground italic">
                                            No machines restricted for this product.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Dialog Create / Update */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedRestriction ? "Edit Restriction" : "Add Restriction"}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedRestriction
                                ? `Update restrictions for product ${selectedRestriction.codeNo}`
                                : "Set machines that cannot process this product code"}
                        </DialogDescription>
                    </DialogHeader>

                    <ProductRestrictionForm
                        restriction={selectedRestriction}
                        onCancel={() => setDialogOpen(false)}
                        onSubmit={handleSubmit}
                        isLoading={createMutation.isPending || updateMutation.isPending}
                    />
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={!!deleteRestriction} onOpenChange={() => setDeleteRestriction(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete restriction?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. All machine restrictions for product{" "}
                            <b>{deleteRestriction?.codeNo}</b> will be removed.
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
