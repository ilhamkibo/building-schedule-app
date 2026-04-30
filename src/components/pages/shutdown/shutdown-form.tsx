// "use client";

// import { useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Shutdown } from "@/types/shutdown";

// const shutdownSchema = z.object({
//     lineNo: z.number().min(1, "Line number is required"),
//     machineNo: z.string().min(1, "Machine number is required"),
//     startTime: z.string().min(1, "Start time is required"),
//     stopTime: z.string().min(1, "Stop time is required"),
//     remarks: z.string().optional(),
// });

// type ShutdownFormValues = z.infer<typeof shutdownSchema>;

// interface ShutdownFormProps {
//     open: boolean;
//     onOpenChange: (open: boolean) => void;
//     initialData?: Shutdown | null;
//     onSubmit: (data: Omit<Shutdown, "id">) => void;
// }

// export function ShutdownForm({ open, onOpenChange, initialData, onSubmit }: ShutdownFormProps) {
//     const {
//         register,
//         handleSubmit,
//         reset,
//         formState: { errors },
//     } = useForm<ShutdownFormValues>({
//         resolver: zodResolver(shutdownSchema),
//         defaultValues: {
//             lineNo: 1,
//             machineNo: "",
//             startTime: "",
//             stopTime: "",
//             remarks: "",
//         },
//     });

//     useEffect(() => {
//         if (open) {
//             if (initialData) {
//                 reset({
//                     lineNo: initialData.lineNo,
//                     machineNo: initialData.machineNo,
//                     startTime: initialData.startTime,
//                     stopTime: initialData.stopTime,
//                     remarks: initialData.remarks || "",
//                 });
//             } else {
//                 reset({
//                     lineNo: 1,
//                     machineNo: "",
//                     startTime: "",
//                     stopTime: "",
//                     remarks: "",
//                 });
//             }
//         }
//     }, [open, initialData, reset]);

//     const submitHandler = (data: ShutdownFormValues) => {
//         onSubmit({
//             lineNo: data.lineNo,
//             machineNo: data.machineNo,
//             startTime: data.startTime,
//             stopTime: data.stopTime,
//             remarks: data.remarks || "",
//         });
//         onOpenChange(false);
//     };

//     return (
//         <Dialog open={open} onOpenChange={onOpenChange}>
//             <DialogContent className="sm:max-w-[425px]">
//                 <DialogHeader>
//                     <DialogTitle>{initialData ? "Edit Shutdown" : "Create New Shutdown"}</DialogTitle>
//                     <DialogDescription>
//                         Fill in the details below to {initialData ? "update" : "record"} a machine shutdown.
//                     </DialogDescription>
//                 </DialogHeader>

//                 <form onSubmit={handleSubmit(submitHandler)} className="space-y-4 py-4">
//                     <div className="grid grid-cols-2 gap-4">
//                         <div className="space-y-2">
//                             <Label htmlFor="lineNo">Line No</Label>
//                             <Input
//                                 id="lineNo"
//                                 type="number"
//                                 {...register("lineNo", { valueAsNumber: true })}
//                                 className={errors.lineNo ? "border-red-500" : ""}
//                             />
//                             {errors.lineNo && <p className="text-xs text-red-500">{errors.lineNo.message}</p>}
//                         </div>
//                         <div className="space-y-2">
//                             <Label htmlFor="machineNo">Machine No</Label>
//                             <Input
//                                 id="machineNo"
//                                 {...register("machineNo")}
//                                 placeholder="e.g. M-101"
//                                 className={errors.machineNo ? "border-red-500" : ""}
//                             />
//                             {errors.machineNo && <p className="text-xs text-red-500">{errors.machineNo.message}</p>}
//                         </div>
//                     </div>

//                     <div className="space-y-2">
//                         <Label htmlFor="startTime">Start Time</Label>
//                         <Input
//                             id="startTime"
//                             type="datetime-local"
//                             {...register("startTime")}
//                             className={errors.startTime ? "border-red-500" : ""}
//                         />
//                         {errors.startTime && <p className="text-xs text-red-500">{errors.startTime.message}</p>}
//                     </div>

//                     <div className="space-y-2">
//                         <Label htmlFor="stopTime">Stop Time</Label>
//                         <Input
//                             id="stopTime"
//                             type="datetime-local"
//                             {...register("stopTime")}
//                             className={errors.stopTime ? "border-red-500" : ""}
//                         />
//                         {errors.stopTime && <p className="text-xs text-red-500">{errors.stopTime.message}</p>}
//                     </div>

//                     <div className="space-y-2">
//                         <Label htmlFor="remarks">Remarks (Optional)</Label>
//                         <Textarea
//                             id="remarks"
//                             {...register("remarks")}
//                             placeholder="Reason for shutdown..."
//                         />
//                     </div>

//                     <DialogFooter className="pt-4">
//                         <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
//                             Cancel
//                         </Button>
//                         <Button type="submit">
//                             {initialData ? "Save Changes" : "Create"}
//                         </Button>
//                     </DialogFooter>
//                 </form>
//             </DialogContent>
//         </Dialog>
//     );
// }
