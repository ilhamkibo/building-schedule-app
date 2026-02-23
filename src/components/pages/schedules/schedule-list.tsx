"use client";

import { useRouter } from "next/navigation";
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
import { Plus, Search, Trash2, Eye, LayoutGrid } from "lucide-react";
import { useSchedules, useDeleteSchedule } from "@/hooks/use-schedule";
import { Schedule } from "@/types/schedule";
import ScheduleForm from "./schedule-form";
import PPLReferenceSidebar from "./ppl-reference-sidebar";
import DataTablePagination from "@/components/common/data-table-pagination";
import { usePPLs } from "@/hooks/use-ppl";

export default function ScheduleList() {
    const router = useRouter();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [formOpen, setFormOpen] = useState(false);
    const [detailSchedule, setDetailSchedule] = useState<Schedule | null>(null);
    const [deleteSchedule, setDeleteSchedule] = useState<Schedule | null>(null);
    const { data: ppls } = usePPLs({ limit: 1000, isActive: true });

    /* debounce search */
    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 500);
        return () => clearTimeout(t);
    }, [search]);

    const { data: schedules = [], pagination, isLoading } = useSchedules({
        page,
        limit,
        search: debouncedSearch,
    });

    const deleteMutation = useDeleteSchedule({
        onSuccess: () => {
            setDeleteSchedule(null);
        },
    });

    const handleDelete = async () => {
        if (deleteSchedule) {
            deleteMutation.mutate(deleteSchedule.id);
        }
    };


    return (
        <div className="space-y-4 mx-auto max-w-5xl">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="relative w-72">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search schedules..."
                        className="pl-9 dark:bg-sidebar"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <Button onClick={() => setFormOpen(true)} className="cursor-pointer">
                    <Plus className="mr-2 h-4 w-4" />
                    New Schedule
                </Button>
            </div>

            {/* Table */}
            <div className="rounded-md border bg-sidebar">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Code</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Created By</TableHead>
                            <TableHead>Items Count</TableHead>
                            <TableHead className="w-[120px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {isLoading && (
                            <TableRow>
                                <TableCell className="text-center" colSpan={5}>Loading...</TableCell>
                            </TableRow>
                        )}

                        {!isLoading && schedules.length === 0 && (
                            <TableRow>
                                <TableCell className="text-center" colSpan={5}>No schedules found</TableCell>
                            </TableRow>
                        )}

                        {schedules.map((schedule) => (
                            <TableRow key={schedule.id}>
                                <TableCell className="font-medium">{schedule.code}</TableCell>
                                <TableCell>{new Date(schedule.date).toLocaleDateString()}</TableCell>
                                <TableCell>{schedule.createdBy}</TableCell>
                                <TableCell>{schedule.items?.length || 0} items</TableCell>
                                <TableCell className="flex gap-1">
                                    <Button
                                        size="icon"
                                        className="cursor-pointer"
                                        variant="ghost"
                                        onClick={() => router.push(`/schedules/${schedule.id}`)}
                                        title="Board View"
                                    >
                                        <LayoutGrid className="h-4 w-4 text-blue-600" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        className="cursor-pointer"
                                        variant="ghost"
                                        onClick={() => setDetailSchedule(schedule)}
                                        title="Detail View"
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        className="cursor-pointer"
                                        variant="ghost"
                                        onClick={() => setDeleteSchedule(schedule)}
                                        title="Delete"
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

            {/* Creation Form Dialog */}
            <Dialog open={formOpen} onOpenChange={setFormOpen}>
                {/* <DialogContent className="sm:max-w-[800px]"> */}
                {/* <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col"> */}
                <DialogContent className="sm:max-w-7xl h-[90vh] flex flex-col overflow-hidden">
                    <DialogHeader>
                        <DialogTitle>Create New Schedule</DialogTitle>
                        <DialogDescription>
                            Define the production schedule and its items.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex overflow-hidden">
                        <div className="w-[450px] border-r bg-muted/10 flex flex-col">
                            <PPLReferenceSidebar ppls={ppls} />
                        </div>

                        <div className="flex-1 overflow-hidden px-4">
                            <ScheduleForm
                                onCancel={() => setFormOpen(false)}
                                onSuccess={() => setFormOpen(false)}
                            />
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Detail View Dialog */}
            <Dialog open={!!detailSchedule} onOpenChange={() => setDetailSchedule(null)}>
                <DialogContent className="sm:max-w-[900px]">
                    <DialogHeader>
                        <DialogTitle>Schedule Detail: {detailSchedule?.code}</DialogTitle>
                        <DialogDescription>
                            Date: {detailSchedule?.date ? new Date(detailSchedule.date).toLocaleDateString() : ''} | Created by: {detailSchedule?.createdBy}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-4 border rounded-md overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Code No</TableHead>
                                    <TableHead>Machine</TableHead>
                                    <TableHead>Qty</TableHead>
                                    <TableHead>Std Mandat</TableHead>
                                    <TableHead>Cycle Time</TableHead>
                                    <TableHead>Cap/Shift</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {detailSchedule?.items?.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">{item.codeNo}</TableCell>
                                        <TableCell>{item.machineCode}</TableCell>
                                        <TableCell>{item.quantity}</TableCell>
                                        <TableCell>{item.stdDandatory}</TableCell>
                                        <TableCell>{item.cycleTime}s</TableCell>
                                        <TableCell>{item.capacityPerShift}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={!!deleteSchedule} onOpenChange={() => setDeleteSchedule(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete schedule?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. Schedule{" "}
                            <b>{deleteSchedule?.code}</b> will be permanently deleted.
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
