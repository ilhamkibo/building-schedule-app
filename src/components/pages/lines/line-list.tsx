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
import { Plus, Search, Trash2, Pencil } from "lucide-react";
import { useLines, useDeleteLine, useCreateLine, useUpdateLine } from "@/hooks/use-line";
import { Line } from "@/types/line";
import LineForm from "./line-form";
import DataTablePagination from "@/components/common/data-table-pagination";

export default function LineList() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedLine, setSelectedLine] = useState<Line | null>(null);
    const [deleteLine, setDeleteLine] = useState<Line | null>(null);

    /* debounce search */
    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 500);
        return () => clearTimeout(t);
    }, [search]);

    const { data: lines = [], pagination, isLoading } = useLines({
        page,
        limit,
        search: debouncedSearch,
    });

    const createMutation = useCreateLine({
        onSuccess: () => {
            setDialogOpen(false);
        },
    });

    const updateMutation = useUpdateLine({
        onSuccess: () => {
            setDialogOpen(false);
        },
    });

    const deleteMutation = useDeleteLine({
        onSuccess: () => {
            setDeleteLine(null);
        },
    });

    const openCreate = () => {
        setSelectedLine(null);
        setDialogOpen(true);
    };

    const openEdit = (line: Line) => {
        setSelectedLine(line);
        setDialogOpen(true);
    };

    const handleDelete = async () => {
        if (deleteLine) {
            deleteMutation.mutate(deleteLine.id);
        }
    };

    const handleSubmit = (payload: any) => {
        if (selectedLine) {
            updateMutation.mutate({ id: selectedLine.id, data: payload });
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
                        placeholder="Search lines..."
                        className="pl-9 dark:bg-sidebar"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <Button onClick={openCreate} className="cursor-pointer">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Line
                </Button>
            </div>

            {/* Table */}
            <div className="rounded-md border dark:bg-sidebar">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Code</TableHead>
                            <TableHead>Line Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="w-[120px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {isLoading && (
                            <TableRow>
                                <TableCell className="text-center" colSpan={4}>Loading...</TableCell>
                            </TableRow>
                        )}

                        {!isLoading && lines.length === 0 && (
                            <TableRow>
                                <TableCell className="text-center" colSpan={4}>No lines found</TableCell>
                            </TableRow>
                        )}

                        {lines.map((line) => (
                            <TableRow key={line.id}>
                                <TableCell className="font-medium">{line.code}</TableCell>
                                <TableCell>{line.name ?? "-"}</TableCell>
                                <TableCell>{line.description ?? "-"}</TableCell>
                                <TableCell className="flex gap-1">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => openEdit(line)}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => setDeleteLine(line)}
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
                            {selectedLine ? "Edit Line" : "Create Line"}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedLine
                                ? "Update line information"
                                : "Create a new line"}
                        </DialogDescription>
                    </DialogHeader>

                    <LineForm
                        line={selectedLine}
                        onCancel={() => setDialogOpen(false)}
                        onSubmit={handleSubmit}
                        isLoading={createMutation.isPending || updateMutation.isPending}
                    />
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={!!deleteLine} onOpenChange={() => setDeleteLine(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete line?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. Line{" "}
                            <b>{deleteLine?.code}</b> will be permanently deleted.
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
