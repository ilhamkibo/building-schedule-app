"use client";

import { Shift } from "@/types/shift";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2, XCircle, Timer } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface ShiftDetailsProps {
    shift: Shift;
}

export default function ShiftDetails({ shift }: ShiftDetailsProps) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs uppercase font-bold">Shift Name</Label>
                    <div className="text-lg font-semibold flex items-center gap-2">
                        {shift.shiftName}
                        <Badge variant="outline">#{shift.shiftNo}</Badge>
                    </div>
                </div>
                <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs uppercase font-bold">Status</Label>
                    <div>
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
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 p-3 border rounded-md bg-muted/20">
                    <Label className="text-muted-foreground text-xs uppercase font-bold flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Timing
                    </Label>
                    <div className="text-sm font-medium">
                        {shift.startTime} - {shift.endTime}
                    </div>
                </div>
                <div className="space-y-1 p-3 border rounded-md bg-muted/20">
                    <Label className="text-muted-foreground text-xs uppercase font-bold flex items-center gap-1">
                        <Timer className="h-3 w-3" /> Work Duration
                    </Label>
                    <div className="text-sm font-medium">
                        {shift.workSeconds} seconds ({(shift.workSeconds / 3600).toFixed(1)} hours)
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-muted-foreground text-xs uppercase font-bold">Main Color</Label>
                    <div className="flex items-center gap-2">
                        <div
                            className="w-8 h-8 rounded-md border shadow-sm"
                            style={{ backgroundColor: shift.colorCode || 'transparent' }}
                        />
                        <span className="text-xs font-mono">{shift.colorCode || 'N/A'}</span>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label className="text-muted-foreground text-xs uppercase font-bold">Break Color</Label>
                    <div className="flex items-center gap-2">
                        <div
                            className="w-8 h-8 rounded-md border shadow-sm"
                            style={{ backgroundColor: shift.colorBreak || 'transparent' }}
                        />
                        <span className="text-xs font-mono">{shift.colorBreak || 'N/A'}</span>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <Label className="text-muted-foreground text-xs uppercase font-bold">Shift Breaks</Label>
                <div className="rounded-md border overflow-hidden">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="h-8 text-[10px] uppercase">Start Time</TableHead>
                                <TableHead className="h-8 text-[10px] uppercase">End Time</TableHead>
                                <TableHead className="h-8 text-[10px] uppercase">Friday</TableHead>
                                <TableHead className="h-8 text-[10px] uppercase text-right">Duration</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {shift.shiftBreaks && shift.shiftBreaks.length > 0 ? (
                                shift.shiftBreaks.map((b, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="py-2 text-sm">{b.startTime}</TableCell>
                                        <TableCell className="py-2 text-sm">{b.endTime}</TableCell>
                                        <TableCell className="py-2 text-sm">
                                            {b.isFriday ? (
                                                <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200 text-[10px] h-5">
                                                    Friday Only
                                                </Badge>
                                            ) : (
                                                <span className="text-muted-foreground text-[10px]">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="py-2 text-sm text-right">
                                            {b.breakSeconds ? `${b.breakSeconds}s` : '-'}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center py-4 text-xs text-muted-foreground italic">
                                        No breaks defined for this shift.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
