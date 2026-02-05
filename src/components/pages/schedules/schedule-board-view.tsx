"use client";

import { ScheduleBoard, Shift, MachineSchedule, ScheduleBoardItem } from "@/types/schedule";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ScheduleBoardViewProps {
    board: ScheduleBoard;
}

export default function ScheduleBoardView({ board }: ScheduleBoardViewProps) {
    if (!board || !board.shifts) {
        return <div className="text-center py-10 text-muted-foreground">No board data available.</div>;
    }

    const shiftsByDate = board.shifts.reduce<Record<string, Shift[]>>(
        (acc, shift) => {
            if (!acc[shift.shiftDate]) {
                acc[shift.shiftDate] = [];
            }
            acc[shift.shiftDate].push(shift);
            return acc;
        },
        {}
    );

    const orderedDates = Object.keys(shiftsByDate).sort(
        (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );

    orderedDates.forEach((date) => {
        shiftsByDate[date].sort((a, b) => a.shiftNo - b.shiftNo);
    });


    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between border-b pb-4">
                <div>
                    <h2 className="text-2xl font-bold">{board.scheduleCode}</h2>
                    <p className="text-sm text-muted-foreground">
                        Date: {new Date(board.date).toLocaleDateString()}
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                {/* {board.shifts.map((shift) => (
                    <Card key={`${shift.shiftNo}-${shift.shiftDate}`} className="border-2">
                        <CardHeader className="bg-muted/50 pb-3">
                            <CardTitle className="flex items-center justify-between">
                                <span>{shift.shiftName}</span>
                                <Badge variant="outline">{shift.shiftDate}</Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-6">
                            {shift.machines.map((machine) => (
                                <div key={machine.machineCode} className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-primary" />
                                        <h3 className="font-semibold text-lg">{machine.machineCode}</h3>
                                    </div>

                                    <div className="rounded-md border overflow-hidden">
                                        <Table>
                                            <TableHeader className="bg-muted/30">
                                                <TableRow>
                                                    <TableHead className="h-8 py-1">Code No</TableHead>
                                                    <TableHead className="h-8 py-1 text-right">Assign</TableHead>
                                                    <TableHead className="h-8 py-1 text-right">Rem</TableHead>
                                                    <TableHead className="h-8 py-1 text-right">Time</TableHead>
                                                    <TableHead className="h-8 py-1 text-right">Total</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {machine.items.map((item, idx) => (
                                                    <TableRow key={`${item.codeNo}-${idx}`}>
                                                        <TableCell className="py-2 font-medium">{item.codeNo}</TableCell>
                                                        <TableCell className="py-2 text-right">{item.qtyAssign}</TableCell>
                                                        <TableCell className="py-2 text-right">
                                                            <span className={item.remaining > 0 ? "text-amber-600 font-medium" : "text-muted-foreground"}>
                                                                {item.remaining}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="py-2 text-right">{item.cycleTimeSeconds}s</TableCell>
                                                        <TableCell className="py-2 text-right font-mono text-xs">
                                                            {item.totalSeconds}s
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                                {machine.items.length === 0 && (
                                                    <TableRow>
                                                        <TableCell colSpan={5} className="text-center py-4 text-muted-foreground italic">
                                                            No items assigned
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                ))} */}

                {orderedDates.map((date) => (
                    <div key={date} className="space-y-4">
                        <h3 className="text-xl font-semibold">{date}</h3>
                        <div className="flex flex-col gap-4">
                            {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"> */}
                            {shiftsByDate[date].map((shift) => (
                                <Card key={`${shift.shiftNo}-${shift.shiftDate}`} className="border-2">
                                    <CardHeader className="bg-muted/50 flex items-center justify-between leading-none py-2">
                                        <CardTitle>
                                            <span>{shift.shiftName}</span>
                                        </CardTitle>
                                        <CardTitle>
                                            <Badge variant="outline">{shift.shiftNo}</Badge>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-4 space-y-6">
                                        {shift.machines.map((machine) => (
                                            <div key={machine.machineCode} className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2 w-2 rounded-full bg-primary" />
                                                    <h3 className="font-semibold text-lg">{machine.machineCode}</h3>
                                                </div>

                                                <div className="rounded-md border overflow-hidden">
                                                    <Table>
                                                        <TableHeader className="bg-muted/30">
                                                            <TableRow>
                                                                <TableHead className="h-8 py-1">Code No</TableHead>
                                                                <TableHead className="h-8 py-1 text-right">Assign</TableHead>
                                                                <TableHead className="h-8 py-1 text-right">Rem</TableHead>
                                                                <TableHead className="h-8 py-1 text-right">Time</TableHead>
                                                                <TableHead className="h-8 py-1 text-right">Total</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {machine.items.map((item, idx) => (
                                                                <TableRow key={`${item.codeNo}-${idx}`}>
                                                                    <TableCell className="py-2 font-medium">{item.codeNo}</TableCell>
                                                                    <TableCell className="py-2 text-right">{item.qtyAssign}</TableCell>
                                                                    <TableCell className="py-2 text-right">
                                                                        <span className={item.remaining > 0 ? "text-amber-600 font-medium" : "text-muted-foreground"}>
                                                                            {item.remaining}
                                                                        </span>
                                                                    </TableCell>
                                                                    <TableCell className="py-2 text-right">{item.cycleTimeSeconds}s</TableCell>
                                                                    <TableCell className="py-2 text-right font-mono text-xs">
                                                                        {item.totalSeconds}s
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                            {machine.items.length === 0 && (
                                                                <TableRow>
                                                                    <TableCell colSpan={5} className="text-center py-4 text-muted-foreground italic">
                                                                        No items assigned
                                                                    </TableCell>
                                                                </TableRow>
                                                            )}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                ))}

            </div>
        </div>
    );
}
