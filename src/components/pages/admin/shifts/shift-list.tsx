"use client";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
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
import { Plus, Trash2, Pencil, CheckCircle2, XCircle, Eye } from "lucide-react";
import { useShifts, useDeleteShift, useCreateShift, useUpdateShift } from "@/hooks/use-shift";
import { Shift } from "@/types/shift";
import ShiftForm from "./shift-form";
import ShiftDetails from "./shift-details";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function ShiftList() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
    const [deleteShift, setDeleteShift] = useState<Shift | null>(null);

    const { data: shifts = [], isLoading } = useShifts();

    const createMutation = useCreateShift({
        onSuccess: () => {
            setDialogOpen(false);
        },
    });

    const updateMutation = useUpdateShift({
        onSuccess: () => {
            setDialogOpen(false);
        },
    });

    const deleteMutation = useDeleteShift({
        onSuccess: () => {
            setDeleteShift(null);
        },
    });

    const openCreate = () => {
        setSelectedShift(null);
        setDialogOpen(true);
    };

    const openEdit = (shift: Shift) => {
        setSelectedShift(shift);
        setDialogOpen(true);
    };

    const openDetails = (shift: Shift) => {
        setSelectedShift(shift);
        setDetailsOpen(true);
    };

    const handleDelete = async () => {
        if (deleteShift) {
            deleteMutation.mutate(deleteShift.id);
        }
    };

    const handleSubmit = (payload: any) => {
        if (selectedShift) {
            updateMutation.mutate({ id: selectedShift.id, data: payload });
        } else {
            createMutation.mutate(payload);
        }
    };

    return (
        <div className="space-y-4 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Shift Management</h2>
                <Button onClick={openCreate} className="cursor-pointer">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Shift
                </Button>
            </div>

            {/* Table */}
            <div className="rounded-md border dark:bg-sidebar">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">No</TableHead>
                            <TableHead>Shift Name</TableHead>
                            <TableHead>Start Time</TableHead>
                            <TableHead>End Time</TableHead>
                            <TableHead>Work Sec</TableHead>
                            <TableHead>Breaks</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Colors</TableHead>
                            <TableHead className="w-[140px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {isLoading && (
                            Array.from({ length: 3 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-6 w-8" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                                    <TableCell>
                                        <div className="flex gap-1">
                                            <Skeleton className="h-4 w-4 rounded-full" />
                                            <Skeleton className="h-4 w-4 rounded-full" />
                                        </div>
                                    </TableCell>
                                    <TableCell className="flex gap-1">
                                        <Skeleton className="h-8 w-8 rounded-md" />
                                        <Skeleton className="h-8 w-8 rounded-md" />
                                        <Skeleton className="h-8 w-8 rounded-md" />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}

                        {!isLoading && shifts.length === 0 && (
                            <TableRow>
                                <TableCell className="text-center" colSpan={9}>No shifts found</TableCell>
                            </TableRow>
                        )}

                        {shifts.sort((a, b) => a.startTime.localeCompare(b.startTime)).map((shift) => (
                            <TableRow key={shift.id}>
                                <TableCell className="font-medium">{shift.shiftNo}</TableCell>
                                <TableCell>{shift.shiftName}</TableCell>
                                <TableCell>{shift.startTime}</TableCell>
                                <TableCell>{shift.endTime}</TableCell>
                                <TableCell>{shift.workSeconds}s</TableCell>
                                <TableCell>
                                    <Badge variant="outline">
                                        {shift.shiftBreaks?.length || 0} breaks
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {shift.isActive ? (
                                        <Badge className="bg-green-500/10 text-green-500 border-green-500/20 gap-1">
                                            <CheckCircle2 className="h-3 w-3" />
                                            Active
                                        </Badge>
                                    ) : (
                                        <Badge variant="secondary" className="gap-1">
                                            <XCircle className="h-3 w-3" />
                                            Inactive
                                        </Badge>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-1">
                                        {shift.colorCode && (
                                            <div
                                                className="w-4 h-4 rounded-full border shadow-sm"
                                                style={{ backgroundColor: shift.colorCode }}
                                                title={`Main: ${shift.colorCode}`}
                                            />
                                        )}
                                        {shift.colorBreak && (
                                            <div
                                                className="w-4 h-4 rounded-full border shadow-sm"
                                                style={{ backgroundColor: shift.colorBreak }}
                                                title={`Break: ${shift.colorBreak}`}
                                            />
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="flex gap-1">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => openDetails(shift)}
                                        title="View Details"
                                    >
                                        <Eye className="h-4 w-4 text-blue-500" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => openEdit(shift)}
                                        title="Edit Shift"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => setDeleteShift(shift)}
                                        title="Delete Shift"
                                    >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Dialog Create / Update */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedShift ? "Edit Shift" : "Create Shift"}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedShift
                                ? "Update shift timing and break information"
                                : "Create a new shift schedule"}
                        </DialogDescription>
                    </DialogHeader>

                    <ShiftForm
                        shift={selectedShift}
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
                        <DialogTitle>Shift Details</DialogTitle>
                        <DialogDescription>
                            Full information for {selectedShift?.shiftName}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedShift && <ShiftDetails shift={selectedShift} />}

                    <div className="flex justify-end pt-4">
                        <Button variant="outline" onClick={() => setDetailsOpen(false)}>
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>


            {/* Delete Confirmation */}
            <AlertDialog open={!!deleteShift} onOpenChange={() => setDeleteShift(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete shift?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. Shift{" "}
                            <b>{deleteShift?.shiftName}</b> will be permanently deleted.
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
