// "use client";

// import { useState } from "react";
// import { Plus, Edit, Trash2 } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { toast } from "sonner";
// import { Shutdown, mockShutdowns } from "@/types/shutdown";
// import { ShutdownForm } from "./shutdown-form";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";

// export function ShutdownList() {
//     const [data, setData] = useState<Shutdown[]>(mockShutdowns);
//     const [isFormOpen, setIsFormOpen] = useState(false);
//     const [selectedShutdown, setSelectedShutdown] = useState<Shutdown | null>(null);
    
//     // Delete Confirmation State
//     const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
//     const [shutdownToDelete, setShutdownToDelete] = useState<number | null>(null);

//     const handleCreateNew = () => {
//         setSelectedShutdown(null);
//         setIsFormOpen(true);
//     };

//     const handleEdit = (shutdown: Shutdown) => {
//         setSelectedShutdown(shutdown);
//         setIsFormOpen(true);
//     };

//     const handleDeleteClick = (id: number) => {
//         setShutdownToDelete(id);
//         setIsDeleteDialogOpen(true);
//     };

//     const confirmDelete = () => {
//         if (shutdownToDelete) {
//             setData(prev => prev.filter(item => item.id !== shutdownToDelete));
//             toast.success("Shutdown record deleted successfully.");
//         }
//         setIsDeleteDialogOpen(false);
//         setShutdownToDelete(null);
//     };

//     const handleFormSubmit = (formData: Omit<Shutdown, "id">) => {
//         if (selectedShutdown) {
//             // Edit
//             setData(prev => prev.map(item => 
//                 item.id === selectedShutdown.id 
//                     ? { ...formData, id: item.id } 
//                     : item
//             ));
//             toast.success("Shutdown record updated successfully.");
//         } else {
//             // Create
//             const newId = data.length > 0 ? Math.max(...data.map(d => d.id)) + 1 : 1;
//             setData(prev => [...prev, { ...formData, id: newId }]);
//             toast.success("New shutdown record created.");
//         }
//     };

//     return (
//         <div className="space-y-4">
//             <Card>
//                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
//                     <CardTitle className="text-xl font-bold">Shutdown Records</CardTitle>
//                     <Button onClick={handleCreateNew} size="sm">
//                         <Plus className="w-4 h-4 mr-2" />
//                         Add New Shutdown
//                     </Button>
//                 </CardHeader>
//                 <CardContent>
//                     <div className="rounded-md border dark:border-slate-800">
//                         <Table>
//                             <TableHeader>
//                                 <TableRow>
//                                     <TableHead className="w-[80px]">ID</TableHead>
//                                     <TableHead>Line No</TableHead>
//                                     <TableHead>Machine No</TableHead>
//                                     <TableHead>Start Time</TableHead>
//                                     <TableHead>Stop Time</TableHead>
//                                     <TableHead>Remarks</TableHead>
//                                     <TableHead className="text-right">Actions</TableHead>
//                                 </TableRow>
//                             </TableHeader>
//                             <TableBody>
//                                 {data.length === 0 ? (
//                                     <TableRow>
//                                         <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
//                                             No shutdown records found.
//                                         </TableCell>
//                                     </TableRow>
//                                 ) : (
//                                     data.map((item) => (
//                                         <TableRow key={item.id}>
//                                             <TableCell className="font-medium">#{item.id}</TableCell>
//                                             <TableCell>Line {item.lineNo}</TableCell>
//                                             <TableCell>{item.machineNo}</TableCell>
//                                             <TableCell>{new Date(item.startTime).toLocaleString()}</TableCell>
//                                             <TableCell>{new Date(item.stopTime).toLocaleString()}</TableCell>
//                                             <TableCell className="max-w-[200px] truncate">
//                                                 {item.remarks || "-"}
//                                             </TableCell>
//                                             <TableCell className="text-right">
//                                                 <div className="flex justify-end gap-2">
//                                                     <Button 
//                                                         variant="ghost" 
//                                                         size="icon" 
//                                                         onClick={() => handleEdit(item)}
//                                                         className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
//                                                     >
//                                                         <Edit className="w-4 h-4" />
//                                                     </Button>
//                                                     <Button 
//                                                         variant="ghost" 
//                                                         size="icon" 
//                                                         onClick={() => handleDeleteClick(item.id)}
//                                                         className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
//                                                     >
//                                                         <Trash2 className="w-4 h-4" />
//                                                     </Button>
//                                                 </div>
//                                             </TableCell>
//                                         </TableRow>
//                                     ))
//                                 )}
//                             </TableBody>
//                         </Table>
//                     </div>
//                 </CardContent>
//             </Card>

//             <ShutdownForm 
//                 open={isFormOpen} 
//                 onOpenChange={setIsFormOpen} 
//                 initialData={selectedShutdown}
//                 onSubmit={handleFormSubmit}
//             />

//             <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
//                 <AlertDialogContent>
//                     <AlertDialogHeader>
//                         <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
//                         <AlertDialogDescription>
//                             This action cannot be undone. This will permanently delete this shutdown record from the system.
//                         </AlertDialogDescription>
//                     </AlertDialogHeader>
//                     <AlertDialogFooter>
//                         <AlertDialogCancel>Cancel</AlertDialogCancel>
//                         <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600 text-white">
//                             Delete
//                         </AlertDialogAction>
//                     </AlertDialogFooter>
//                 </AlertDialogContent>
//             </AlertDialog>
//         </div>
//     );
// }
