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
import { Plus, Search, Trash2, Pencil, Tags } from "lucide-react";
import { useCategories, useDeleteCategory, useCreateCategory, useUpdateCategory } from "@/hooks/use-category";
import { Category } from "@/types/category";
import CategoryForm from "./category-form";
import DataTablePagination from "@/components/common/data-table-pagination";

export default function CategoryList() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);

    /* debounce search */
    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 500);
        return () => clearTimeout(t);
    }, [search]);

    const { data: categories = [], pagination, isLoading } = useCategories({
        page,
        limit,
        search: debouncedSearch,
    });

    const createMutation = useCreateCategory({
        onSuccess: () => {
            setDialogOpen(false);
        },
    });

    const updateMutation = useUpdateCategory({
        onSuccess: () => {
            setDialogOpen(false);
        },
    });

    const deleteMutation = useDeleteCategory({
        onSuccess: () => {
            setDeleteCategory(null);
        },
    });

    const openCreate = () => {
        setSelectedCategory(null);
        setDialogOpen(true);
    };

    const openEdit = (category: Category) => {
        setSelectedCategory(category);
        setDialogOpen(true);
    };

    const handleDelete = async () => {
        if (deleteCategory) {
            deleteMutation.mutate(deleteCategory.id);
        }
    };

    const handleSubmit = (payload: any) => {
        if (selectedCategory) {
            updateMutation.mutate({ id: selectedCategory.id, data: payload });
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
                        placeholder="Search categories..."
                        className="pl-9 dark:bg-sidebar"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <Button onClick={openCreate} className="cursor-pointer">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Category
                </Button>
            </div>

            {/* Table */}
            <div className="rounded-md border dark:bg-sidebar overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">Category No</TableHead>
                            <TableHead>Category Name</TableHead>
                            <TableHead>Start Code</TableHead>
                            <TableHead>End Code</TableHead>
                            <TableHead className="w-[120px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {isLoading && (
                            <TableRow>
                                <TableCell className="text-center" colSpan={5}>Loading...</TableCell>
                            </TableRow>
                        )}

                        {!isLoading && categories.length === 0 && (
                            <TableRow>
                                <TableCell className="text-center" colSpan={5}>No categories found</TableCell>
                            </TableRow>
                        )}

                        {categories.map((category) => (
                            <TableRow key={category.id}>
                                <TableCell>{category.categoryNo}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Tags className="h-3 w-3" />
                                        <span className="font-semibold">{category.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs">
                                        {category.startCode}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs">
                                        {category.endCode}
                                    </span>
                                </TableCell>
                                <TableCell className="flex gap-1">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => openEdit(category)}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => setDeleteCategory(category)}
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
                            {selectedCategory ? "Edit Category" : "Create Category"}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedCategory
                                ? "Update category information"
                                : "Create a new product category"}
                        </DialogDescription>
                    </DialogHeader>

                    <CategoryForm
                        category={selectedCategory}
                        onCancel={() => setDialogOpen(false)}
                        onSubmit={handleSubmit}
                        isLoading={createMutation.isPending || updateMutation.isPending}
                    />
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={!!deleteCategory} onOpenChange={() => setDeleteCategory(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete category?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. Category{" "}
                            <b>{deleteCategory?.name}</b> will be permanently deleted.
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
