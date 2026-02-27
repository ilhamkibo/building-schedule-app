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
import { usePPLs, useDeletePPL, useCreatePPL, useUpdatePPL } from "@/hooks/use-ppl";
import { PPL } from "@/types/ppl";
import PPLForm from "./ppl-form";
import DataTablePagination from "@/components/common/data-table-pagination";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function PPLList() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedPPL, setSelectedPPL] = useState<PPL | null>(null);
    const [deletePPL, setDeletePPL] = useState<PPL | null>(null);

    const [month, setMonth] = useState<string | undefined>(undefined);
    const [year, setYear] = useState<string | undefined>(new Date().getFullYear().toString());
    const [paginate, setPaginate] = useState(true);
    const [isActive, setIsActive] = useState(true);


    const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - 2 + i).toString());
    const months = [
        { value: "1", label: "January" },
        { value: "2", label: "February" },
        { value: "3", label: "March" },
        { value: "4", label: "April" },
        { value: "5", label: "May" },
        { value: "6", label: "June" },
        { value: "7", label: "July" },
        { value: "8", label: "August" },
        { value: "9", label: "September" },
        { value: "10", label: "October" },
        { value: "11", label: "November" },
        { value: "12", label: "December" },
    ];

    /* debounce search */
    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 500);
        return () => clearTimeout(t);
    }, [search]);

    const { data: ppls = [], pagination, isLoading } = usePPLs({
        page,
        limit,
        search: debouncedSearch,
        month: month && month !== "0" ? parseInt(month) : undefined,
        year: year && year !== "0" ? parseInt(year) : undefined,
        paginate,
        isActive
    });


    const createMutation = useCreatePPL({
        onSuccess: () => {
            setDialogOpen(false);
        },
    });

    const updateMutation = useUpdatePPL({
        onSuccess: () => {
            setDialogOpen(false);
        },
    });

    const deleteMutation = useDeletePPL({
        onSuccess: () => {
            setDeletePPL(null);
        },
    });

    const openCreate = () => {
        setSelectedPPL(null);
        setDialogOpen(true);
    };

    const openEdit = (ppl: PPL) => {
        setSelectedPPL(ppl);
        setDialogOpen(true);
    };

    const handleDelete = async () => {
        if (deletePPL) {
            deleteMutation.mutate(deletePPL.id);
        }
    };

    const handleSubmit = (payload: any) => {
        if (selectedPPL) {
            updateMutation.mutate({ id: selectedPPL.id, data: payload });
        } else {
            createMutation.mutate(payload);
        }
    };

    return (
        <div className="space-y-4 mx-auto max-w-5xl">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground " />
                        <Input
                            placeholder="Search PPL..."
                            className="pl-9 dark:bg-sidebar"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center space-x-2 bg-muted/50 px-3 py-1.5 rounded-md border">
                        <Switch
                            id="active-mode"
                            checked={isActive}
                            onCheckedChange={(checked) => {
                                setIsActive(checked);
                                if (checked) {
                                    setMonth("0");
                                    setYear(undefined);
                                }
                            }}
                        />
                        <Label htmlFor="active-mode" className="text-xs font-medium cursor-pointer">
                            Active Only
                        </Label>
                    </div>

                    <Select
                        value={month}
                        onValueChange={(val) => {
                            setMonth(val);
                            if (val !== "0") setIsActive(false);
                        }}
                    >
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="All Months" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0">All Months</SelectItem>
                            {months.map((m) => (
                                <SelectItem key={m.value} value={m.value}>
                                    {m.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={year}
                        onValueChange={(val) => {
                            setYear(val);
                            if (val) setIsActive(false);
                        }}
                    >
                        <SelectTrigger className="w-[100px]">
                            <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0">All Years</SelectItem>
                            {years.map((y) => (
                                <SelectItem key={y} value={y}>
                                    {y}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <div className="flex items-center space-x-2 bg-muted/50 px-3 py-1.5 rounded-md border">
                        <Switch
                            id="paginate-mode"
                            checked={paginate}
                            onCheckedChange={setPaginate}
                        />
                        <Label htmlFor="paginate-mode" className="text-xs font-medium cursor-pointer">
                            Paginate
                        </Label>
                    </div>

                </div>

                {/* <Button onClick={openCreate}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add PPL Entry
                </Button> */}
            </div>

            {/* Table */}
            <div className="rounded-md border overflow-x-auto dark:bg-sidebar">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="whitespace-nowrap">Date Time</TableHead>
                            <TableHead>Build</TableHead>
                            <TableHead>Rim</TableHead>
                            <TableHead>Tire Code</TableHead>
                            <TableHead>Type MC</TableHead>
                            <TableHead>UPH</TableHead>
                            <TableHead>Qty</TableHead>
                            <TableHead>Mold/Stock</TableHead>
                            <TableHead className="w-[120px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {isLoading && (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-12" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-12" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                                    <TableCell>
                                        <div className="flex gap-1">
                                            <Skeleton className="h-5 w-10" />
                                            <Skeleton className="h-5 w-10" />
                                        </div>
                                    </TableCell>
                                    <TableCell><Skeleton className="h-6 w-12" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-12" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                                    <TableCell className="flex gap-1">
                                        <Skeleton className="h-8 w-8 rounded-md" />
                                        <Skeleton className="h-8 w-8 rounded-md" />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}

                        {!isLoading && ppls.length === 0 && (
                            <TableRow>
                                <TableCell className="text-center" colSpan={9}>No PPL entries found</TableCell>
                            </TableRow>
                        )}

                        {ppls.map((ppl) => (
                            <TableRow key={ppl.id}>
                                <TableCell className="whitespace-nowrap">
                                    {new Date(ppl.createDateTime).toLocaleString()}
                                </TableCell>
                                <TableCell>{ppl.build}</TableCell>
                                <TableCell>{ppl.rim}</TableCell>
                                <TableCell className="font-medium">{ppl.tireCode}</TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                        {ppl.typeMC.map((m) => (
                                            <span key={m} className="px-2 py-0.5 bg-muted rounded text-xs">
                                                {m}
                                            </span>
                                        ))}
                                    </div>
                                </TableCell>
                                <TableCell>{ppl.uph}</TableCell>
                                <TableCell>{ppl.qty}</TableCell>
                                <TableCell>{ppl.mold} / {ppl.moldStock}</TableCell>
                                <TableCell className="flex gap-1">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => openEdit(ppl)}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => setDeletePPL(ppl)}
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
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedPPL ? "Edit PPL Entry" : "Create PPL Entry"}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedPPL
                                ? "Update PPL entry information"
                                : "Create a new PPL entry"}
                        </DialogDescription>
                    </DialogHeader>

                    <PPLForm
                        ppl={selectedPPL}
                        onCancel={() => setDialogOpen(false)}
                        onSubmit={handleSubmit}
                        isLoading={createMutation.isPending || updateMutation.isPending}
                    />
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={!!deletePPL} onOpenChange={() => setDeletePPL(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete PPL entry?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. PPL entry for tire code{" "}
                            <b>{deletePPL?.tireCode}</b> will be permanently deleted.
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
