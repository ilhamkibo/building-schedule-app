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
import { useUsers } from "@/hooks/use-user";
import { toast } from "sonner";
import { User } from "@/types/user";
import UserForm from "./user-form";
import DataTablePagination from "@/components/common/data-table-pagination";


export default function UserList() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const [deleteUser, setDeleteUser] = useState<User | null>(null);

    /* debounce search */
    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 500);
        return () => clearTimeout(t);
    }, [search]);

    const { data: users = [], pagination, isLoading } = useUsers({
        page,
        limit,
        search: debouncedSearch,
    });

    const openCreate = () => {
        setSelectedUser(null);
        setDrawerOpen(true);
    };

    const openEdit = (user: User) => {
        setSelectedUser(user);
        setDrawerOpen(true);
    };

    const handleDelete = async () => {
        try {
            // await deleteUserApi(deleteUser!.id)
            toast.success("User deleted");
            setDeleteUser(null);
        } catch {
            toast.error("Failed to delete user");
        }
    };

    return (
        <div className="space-y-4 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="relative w-72">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search users..."
                        className="pl-9 dark:bg-sidebar"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <Button onClick={openCreate} className="cursor-pointer">
                    <Plus className="mr-2 h-4 w-4 " />
                    Add User
                </Button>
            </div>

            {/* Table */}
            <div className="rounded-md border dark:bg-sidebar">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User Name</TableHead>
                            <TableHead>Username</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead className="w-[120px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {isLoading && (
                            <TableRow>
                                <TableCell className="text-center" colSpan={4}>Loading...</TableCell>
                            </TableRow>
                        )}

                        {!isLoading && users.length === 0 && (
                            <TableRow>
                                <TableCell className="text-center" colSpan={4}>No users found</TableCell>
                            </TableRow>
                        )}

                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium">{user.name}</TableCell>
                                <TableCell>{user.username ?? "-"}</TableCell>
                                <TableCell>{user.role?.name ?? "-"}</TableCell>
                                <TableCell className="flex gap-1">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => openEdit(user)}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => setDeleteUser(user)}
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
                            {selectedUser ? "Edit User" : "Create User"}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedUser
                                ? "Update user information"
                                : "Create a new user"}
                        </DialogDescription>
                    </DialogHeader>

                    <UserForm
                        user={selectedUser}
                        onCancel={() => setDrawerOpen(false)}
                        onSubmit={() => {
                            toast.success(
                                selectedUser ? "User updated" : "User created"
                            );
                            setDrawerOpen(false);
                        }}
                    />
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={!!deleteUser} onOpenChange={() => setDeleteUser(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete user?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. User{" "}
                            <b>{deleteUser?.name}</b> will be permanently deleted.
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
// import { useUsers } from "@/hooks/use-user";
// import { Plus, Search } from "lucide-react";
// import { useEffect, useState } from "react";
// import { UserDataTable } from "./user-table";
// import { columns } from "./user-columns";

// export default function UserList() {
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

//     const { data: users, pagination, isLoading, error } = useUsers({
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
//                         placeholder="Search users..."
//                         className="pl-9"
//                         value={search}
//                         onChange={(e) => setSearch(e.target.value)}
//                     />
//                 </div>
//                 <Drawer>
//                     <DrawerTrigger asChild>
//                         <Button>
//                             <Plus className="mr-2 h-4 w-4" />
//                             Add User
//                         </Button>
//                     </DrawerTrigger>
//                     <DrawerContent>
//                         <div className="p-4">
//                             <h2 className="text-lg font-semibold">Add New User</h2>
//                             <div className="mt-4 space-y-4">
//                                 <div>
//                                     <Label htmlFor="user-name">User Name</Label>
//                                     <Input id="user-name" placeholder="e.g., Admin" className="mt-1" />
//                                 </div>
//                                 <div>
//                                     <Label htmlFor="user-description">Description</Label>
//                                     <Input id="user-description" placeholder="e.g., Full access to all features" className="mt-1" />
//                                 </div>
//                                 <div className="flex justify-end gap-2">
//                                     <Button variant="outline">Cancel</Button>
//                                     <Button>Create User</Button>
//                                 </div>
//                             </div>
//                         </div>
//                     </DrawerContent>
//                 </Drawer>
//             </div>

//             {/* Table */}
//             <UserDataTable columns={columns} data={users} />
//         </div>
//     );
// }