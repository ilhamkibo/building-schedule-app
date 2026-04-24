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
// import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import {
//     AlertDialog,
//     AlertDialogAction,
//     AlertDialogCancel,
//     AlertDialogContent,
//     AlertDialogDescription,
//     AlertDialogFooter,
//     AlertDialogHeader,
//     AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import {
//     Dialog,
//     DialogContent,
//     DialogHeader,
//     DialogTitle,
//     DialogDescription,
// } from "@/components/ui/dialog";
import {
    Search,
    // Plus, Trash2, Pencil
} from "lucide-react";
import {
    useScheduleSizeColors,
    // useDeleteScheduleSizeColor,
    // useCreateScheduleSizeColor,
    // useUpdateScheduleSizeColor,
} from "@/hooks/use-schedule-size-color";
// import { ScheduleSizeColor } from "@/types/schedule-size-color";
// import ScheduleSizeColorForm from "./schedule-size-color-form";
import DataTablePagination from "@/components/common/data-table-pagination";
import { Skeleton } from "@/components/ui/skeleton";

export default function ScheduleSizeColorList() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    // const [dialogOpen, setDialogOpen] = useState(false);
    // const [selectedColor, setSelectedColor] = useState<ScheduleSizeColor | null>(null);
    // const [deleteColor, setDeleteColor] = useState<ScheduleSizeColor | null>(null);

    /* debounce search */
    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 500);
        return () => clearTimeout(t);
    }, [search]);

    const { data: colors = [], pagination, isLoading } = useScheduleSizeColors({
        page,
        limit,
        search: debouncedSearch,
    });

    // const createMutation = useCreateScheduleSizeColor({
    //     onSuccess: () => {
    //         setDialogOpen(false);
    //     },
    // });

    // const updateMutation = useUpdateScheduleSizeColor({
    //     onSuccess: () => {
    //         setDialogOpen(false);
    //     },
    // });

    // const deleteMutation = useDeleteScheduleSizeColor({
    //     onSuccess: () => {
    //         setDeleteColor(null);
    //     },
    // });

    // const openCreate = () => {
    //     setSelectedColor(null);
    //     setDialogOpen(true);
    // };

    // const openEdit = (color: ScheduleSizeColor) => {
    //     setSelectedColor(color);
    //     setDialogOpen(true);
    // };

    // const handleDelete = async () => {
    //     if (deleteColor) {
    //         deleteMutation.mutate(deleteColor.id);
    //     }
    // };

    // const handleSubmit = (payload: any) => {
    //     if (selectedColor) {
    //         updateMutation.mutate({ id: selectedColor.id, data: payload });
    //     } else {
    //         createMutation.mutate(payload);
    //     }
    // };

    return (
        <div className="space-y-4 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="relative w-72">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search colors..."
                        className="pl-9 dark:bg-sidebar"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* <Button onClick={openCreate} className="cursor-pointer">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Color
                </Button> */}
            </div>

            {/* Table */}
            <div className="rounded-md border dark:bg-sidebar overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[60px]">Priority</TableHead>
                            <TableHead>Type Code</TableHead>
                            <TableHead>Type Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Color Preview</TableHead>
                            {/* <TableHead className="w-[100px]">Actions</TableHead> */}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading && (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-6 w-8" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-28" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-40" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                                    <TableCell className="flex gap-1">
                                        <Skeleton className="h-8 w-8 rounded-md" />
                                        <Skeleton className="h-8 w-8 rounded-md" />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}

                        {!isLoading && colors.length === 0 && (
                            <TableRow>
                                <TableCell className="text-center" colSpan={6}>No colors found</TableCell>
                            </TableRow>
                        )}

                        {colors.sort((a, b) => a.priority - b.priority).map((color, i) => (
                            <TableRow key={i}>
                                <TableCell className="text-center">{color.priority}</TableCell>
                                <TableCell>
                                    <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs">
                                        {color.typeCode}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <span className="font-semibold">{color.typeName}</span>
                                </TableCell>
                                <TableCell>
                                    <span className="text-muted-foreground text-sm">
                                        {color.description || "-"}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="inline-block rounded px-3 py-1 text-xs font-semibold border"
                                            style={{
                                                color: color.textColorHex,
                                                backgroundColor: color.backgroundColorHex,
                                            }}
                                        >
                                            {color.typeName}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground font-mono">
                                            {color.backgroundColorHex}
                                        </span>
                                    </div>
                                </TableCell>
                                {/* <TableCell className="flex gap-1">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => openEdit(color)}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => setDeleteColor(color)}
                                    >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </TableCell> */}
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
            {/* <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedColor ? "Edit Color" : "Create Color"}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedColor
                                ? "Update schedule size color information"
                                : "Create a new schedule size color"}
                        </DialogDescription>
                    </DialogHeader>

                    <ScheduleSizeColorForm
                        color={selectedColor}
                        onCancel={() => setDialogOpen(false)}
                        onSubmit={handleSubmit}
                        isLoading={createMutation.isPending || updateMutation.isPending}
                    />
                </DialogContent>
            </Dialog> */}

            {/* Delete Confirmation */}
            {/* <AlertDialog open={!!deleteColor} onOpenChange={() => setDeleteColor(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete color?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. Color{" "}
                            <b>{deleteColor?.typeName}</b> will be permanently deleted.
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
            </AlertDialog> */}
        </div>
    );
}
