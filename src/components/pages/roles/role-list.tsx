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
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
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

import { Label } from "@/components/ui/label";
import { Plus, Search, Trash2, Pencil } from "lucide-react";
import { useRoles } from "@/hooks/use-role";
import { toast } from "sonner";
import { Role } from "@/types/role";
import RoleForm from "./role-form";
import DataTablePagination from "@/components/common/data-table-pagination";
import { Skeleton } from "@/components/ui/skeleton";


export default function RoleList() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);

    const [deleteRole, setDeleteRole] = useState<Role | null>(null);

    /* debounce search */
    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 500);
        return () => clearTimeout(t);
    }, [search]);

    const { data: roles = [], pagination, isLoading } = useRoles({
        page,
        limit,
        search: debouncedSearch,
    });

    const openCreate = () => {
        setSelectedRole(null);
        setDrawerOpen(true);
    };

    const openEdit = (role: Role) => {
        setSelectedRole(role);
        setDrawerOpen(true);
    };

    const handleDelete = async () => {
        try {
            // await deleteRoleApi(deleteRole!.id)
            toast.success("Role deleted");
            setDeleteRole(null);
        } catch {
            toast.error("Failed to delete role");
        }
    };

    return (
        <div className="space-y-4 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="relative w-72">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search roles..."
                        className="pl-9 dark:bg-sidebar"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <Button onClick={openCreate} className="cursor-pointer">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Role
                </Button>
            </div>

            {/* Table */}
            <div className="rounded-md border dark:bg-sidebar">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Role Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="w-[120px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {isLoading && (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-64" /></TableCell>
                                    <TableCell className="flex gap-1">
                                        <Skeleton className="h-8 w-8 rounded-md" />
                                        <Skeleton className="h-8 w-8 rounded-md" />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}

                        {!isLoading && roles.length === 0 && (
                            <TableRow>
                                <TableCell className="text-center" colSpan={4}>No roles found</TableCell>
                            </TableRow>
                        )}

                        {roles.map((role) => (
                            <TableRow key={role.id}>
                                <TableCell className="font-medium">{role.name}</TableCell>
                                <TableCell>{role.description ?? "-"}</TableCell>
                                <TableCell className="flex gap-1">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => openEdit(role)}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => setDeleteRole(role)}
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

            {/* Drawer Create / Update */}
            <Dialog open={drawerOpen} onOpenChange={setDrawerOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedRole ? "Edit Role" : "Create Role"}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedRole
                                ? "Update role information"
                                : "Create a new role"}
                        </DialogDescription>
                    </DialogHeader>

                    <RoleForm
                        role={selectedRole}
                        onCancel={() => setDrawerOpen(false)}
                        onSubmit={() => {
                            toast.success(
                                selectedRole ? "Role updated" : "Role created"
                            );
                            setDrawerOpen(false);
                        }}
                    />
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={!!deleteRole} onOpenChange={() => setDeleteRole(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete role?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. Role{" "}
                            <b>{deleteRole?.name}</b> will be permanently deleted.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700"
                            onClick={handleDelete}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

// "use client";

// import { Button } from "@/components/ui/button";
// import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useRoles } from "@/hooks/use-role";
// import { Plus, Search } from "lucide-react";
// import { useEffect, useState } from "react";
// import { RoleDataTable } from "./role-table";
// import { columns } from "./role-columns";

// export default function RoleList() {
//     const [page, setPage] = useState(1);
//     const [limit, setLimit] = useState(10);
//     const [search, setSearch] = useState("");
//     const [debouncedSearch, setDebouncedSearch] = useState(search);

//     useEffect(() => {
//         const timer = setTimeout(() => {
//             setDebouncedSearch(search);
//             setPage(1);
//         }, 500);
//         return () => clearTimeout(timer);
//     }, [search]);

//     const { data: roles, pagination, isLoading, error } = useRoles({
//         page,
//         limit,
//         search: debouncedSearch,
//     });

//     if (isLoading) return <div>Loading...</div>;
//     if (error) return <div>Error: {error.message}</div>;

//     return (
//         <div className="space-y-4">
//             {/* Header */}
//             <div className="flex items-center justify-between">
//                 <div className="relative flex-1 max-w-sm">
//                     <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//                     <Input
//                         placeholder="Search roles..."
//                         className="pl-9"
//                         value={search}
//                         onChange={(e) => setSearch(e.target.value)}
//                     />
//                 </div>
//                 <Drawer>
//                     <DrawerTrigger asChild>
//                         <Button>
//                             <Plus className="mr-2 h-4 w-4" />
//                             Add Role
//                         </Button>
//                     </DrawerTrigger>
//                     <DrawerContent>
//                         <div className="p-4">
//                             <h2 className="text-lg font-semibold">Add New Role</h2>
//                             <div className="mt-4 space-y-4">
//                                 <div>
//                                     <Label htmlFor="role-name">Role Name</Label>
//                                     <Input id="role-name" placeholder="e.g., Admin" className="mt-1" />
//                                 </div>
//                                 <div>
//                                     <Label htmlFor="role-description">Description</Label>
//                                     <Input id="role-description" placeholder="e.g., Full access to all features" className="mt-1" />
//                                 </div>
//                                 <div className="flex justify-end gap-2">
//                                     <Button variant="outline">Cancel</Button>
//                                     <Button>Create Role</Button>
//                                 </div>
//                             </div>
//                         </div>
//                     </DrawerContent>
//                 </Drawer>
//             </div>

//             {/* Table */}
//             <RoleDataTable columns={columns} data={roles} />
//         </div>
//     );
// }