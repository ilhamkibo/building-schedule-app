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
import { Plus, Search, Trash2, Pencil, Eye, CheckCircle, XCircle } from "lucide-react";
import { useConfigs, useDeleteConfig, useCreateConfig, useUpdateConfig } from "@/hooks/use-config";
import { Config } from "@/types/config";
import ConfigForm from "./config-form";
import DataTablePagination from "@/components/common/data-table-pagination";
import { Skeleton } from "@/components/ui/skeleton";

export default function ConfigList() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedConfig, setSelectedConfig] = useState<Config | null>(null);
    const [deleteConfig, setDeleteConfig] = useState<Config | null>(null);
    const [detailConfig, setDetailConfig] = useState<Config | null>(null);

    /* debounce search */
    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 500);
        return () => clearTimeout(t);
    }, [search]);

    const { data: configs = [], pagination, isLoading } = useConfigs({
        page,
        limit,
        search: debouncedSearch,
    });

    const createMutation = useCreateConfig({
        onSuccess: () => {
            setDialogOpen(false);
        },
    });

    const updateMutation = useUpdateConfig({
        onSuccess: () => {
            setDialogOpen(false);
        },
    });

    const deleteMutation = useDeleteConfig({
        onSuccess: () => {
            setDeleteConfig(null);
        },
    });

    const openCreate = () => {
        setSelectedConfig(null);
        setDialogOpen(true);
    };

    const openEdit = (config: Config) => {
        setSelectedConfig(config);
        setDialogOpen(true);
    };

    const handleDelete = async () => {
        if (deleteConfig) {
            deleteMutation.mutate(deleteConfig.id);
        }
    };

    const handleSubmit = (payload: any) => {
        if (selectedConfig) {
            updateMutation.mutate({ id: selectedConfig.id, data: payload });
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
                        placeholder="Search configurations..."
                        className="pl-9 dark:bg-sidebar"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <Button onClick={openCreate} className="cursor-pointer">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Config
                </Button>
            </div>

            {/* Table */}
            <div className="rounded-md border dark:bg-sidebar">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>No</TableHead>
                            <TableHead>Key</TableHead>
                            <TableHead>Value</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-[120px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {isLoading && (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-6 w-8" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-48" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                                    <TableCell className="flex gap-1">
                                        <Skeleton className="h-8 w-8 rounded-md" />
                                        <Skeleton className="h-8 w-8 rounded-md" />
                                        <Skeleton className="h-8 w-8 rounded-md" />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}

                        {!isLoading && configs.length === 0 && (
                            <TableRow>
                                <TableCell className="text-center" colSpan={6}>No configurations found</TableCell>
                            </TableRow>
                        )}

                        {configs.map((config, index) => (
                            <TableRow key={config.id}>
                                <TableCell className="font-medium">{(page - 1) * limit + index + 1}</TableCell>
                                <TableCell>{config.configKey}</TableCell>
                                <TableCell>{config.configValue}</TableCell>
                                <TableCell>{config.description ?? "-"}</TableCell>
                                <TableCell>
                                    {config.isActive ? (
                                        <span className="flex items-center text-green-600 text-sm">
                                            <CheckCircle className="w-4 h-4 mr-1" /> Active
                                        </span>
                                    ) : (
                                        <span className="flex items-center text-red-600 text-sm">
                                            <XCircle className="w-4 h-4 mr-1" /> Inactive
                                        </span>
                                    )}
                                </TableCell>
                                <TableCell className="flex gap-1">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => setDetailConfig(config)}
                                        title="View Details"
                                    >
                                        <Eye className="h-4 w-4 text-blue-500" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => openEdit(config)}
                                        title="Edit Config"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => setDeleteConfig(config)}
                                        title="Delete Config"
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
            <Dialog open={!!detailConfig} onOpenChange={() => setDetailConfig(null)}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Configuration Details</DialogTitle>
                        <DialogDescription>
                            Complete information about selected configuration
                        </DialogDescription>
                    </DialogHeader>

                    {detailConfig && (
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Config Key</p>
                                <p className="font-medium">{detailConfig.configKey}</p>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">Config Value</p>
                                <p className="font-medium">{detailConfig.configValue}</p>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">Description</p>
                                <p className="font-medium">{detailConfig.description ?? "-"}</p>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">Status</p>
                                <p className="font-medium">
                                    {detailConfig.isActive ? (
                                        <span className="text-green-600 font-semibold">Active</span>
                                    ) : (
                                        <span className="text-red-600 font-semibold">Inactive</span>
                                    )}
                                </p>
                            </div>
                            
                            {detailConfig.updatedAt && (
                                <div>
                                    <p className="text-sm text-muted-foreground">Last Updated</p>
                                    <p className="font-medium">
                                        {new Date(detailConfig.updatedAt).toLocaleDateString("id-ID", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric"
                                        })}{" "}
                                        {new Date(detailConfig.updatedAt).toLocaleTimeString("id-ID", {
                                            hour: "2-digit",
                                            minute: "2-digit"
                                        })}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Dialog Create / Update */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedConfig ? "Edit Config" : "Create Config"}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedConfig
                                ? "Update configuration values"
                                : "Create a new configuration"}
                        </DialogDescription>
                    </DialogHeader>

                    <ConfigForm
                        config={selectedConfig}
                        onCancel={() => setDialogOpen(false)}
                        onSubmit={handleSubmit}
                        isLoading={createMutation.isPending || updateMutation.isPending}
                    />
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={!!deleteConfig} onOpenChange={() => setDeleteConfig(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete config?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. Configuration{" "}
                            <b>{deleteConfig?.configKey}</b> will be permanently deleted.
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
