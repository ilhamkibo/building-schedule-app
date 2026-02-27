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
import { useMachines, useDeleteMachine, useCreateMachine, useUpdateMachine } from "@/hooks/use-machine";
import { toast } from "sonner";
import { Machine } from "@/types/machine";
import MachineForm from "./machine-form";
import DataTablePagination from "@/components/common/data-table-pagination";
import { Skeleton } from "@/components/ui/skeleton";

export default function MachineList() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
    const [deleteMachine, setDeleteMachine] = useState<Machine | null>(null);

    /* debounce search */
    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 500);
        return () => clearTimeout(t);
    }, [search]);

    const { data: machines = [], pagination, isLoading } = useMachines({
        page,
        limit,
        search: debouncedSearch,
    });

    const createMutation = useCreateMachine({
        onSuccess: () => {
            setDialogOpen(false);
        },
    });

    const updateMutation = useUpdateMachine({
        onSuccess: () => {
            setDialogOpen(false);
        },
    });

    const deleteMutation = useDeleteMachine({
        onSuccess: () => {
            setDeleteMachine(null);
        },
    });

    const openCreate = () => {
        setSelectedMachine(null);
        setDialogOpen(true);
    };

    const openEdit = (machine: Machine) => {
        setSelectedMachine(machine);
        setDialogOpen(true);
    };

    const handleDelete = async () => {
        if (deleteMachine) {
            deleteMutation.mutate(deleteMachine.id);
        }
    };

    const handleSubmit = (payload: any) => {
        if (selectedMachine) {
            updateMutation.mutate({ id: selectedMachine.id, data: payload });
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
                        placeholder="Search machines..."
                        className="pl-9 dark:bg-sidebar"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <Button onClick={openCreate} className="cursor-pointer">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Machine
                </Button>
            </div>

            {/* Table */}
            <div className="rounded-md border dark:bg-sidebar">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Code</TableHead>
                            <TableHead>Machine Name</TableHead>
                            <TableHead>Line</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="w-[120px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {isLoading && (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-48" /></TableCell>
                                    <TableCell className="flex gap-1">
                                        <Skeleton className="h-8 w-8 rounded-md" />
                                        <Skeleton className="h-8 w-8 rounded-md" />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}

                        {!isLoading && machines.length === 0 && (
                            <TableRow>
                                <TableCell className="text-center" colSpan={4}>No machines found</TableCell>
                            </TableRow>
                        )}

                        {machines.map((machine) => (
                            <TableRow key={machine.id}>
                                <TableCell className="font-medium">{machine.code}</TableCell>
                                <TableCell>{machine.name ?? "-"}</TableCell>
                                <TableCell>{machine.line?.name ?? "-"}</TableCell>
                                <TableCell>{machine.description ?? "-"}</TableCell>
                                <TableCell className="flex gap-1">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => openEdit(machine)}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => setDeleteMachine(machine)}
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
                            {selectedMachine ? "Edit Machine" : "Create Machine"}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedMachine
                                ? "Update machine information"
                                : "Create a new machine"}
                        </DialogDescription>
                    </DialogHeader>

                    <MachineForm
                        machine={selectedMachine}
                        onCancel={() => setDialogOpen(false)}
                        onSubmit={handleSubmit}
                        isLoading={createMutation.isPending || updateMutation.isPending}
                    />
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={!!deleteMachine} onOpenChange={() => setDeleteMachine(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete machine?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. Machine{" "}
                            <b>{deleteMachine?.code}</b> will be permanently deleted.
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
