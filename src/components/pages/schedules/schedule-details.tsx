import {
    ScheduleBoard,
    TodayLineSchedule,
    ScheduleLineDetailToday,
} from "@/types/schedule";

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
import { Separator } from "@/components/ui/separator";

interface ScheduleDetailsProps {
    board: ScheduleBoard;
}

export default function ScheduleDetails({
    board,
}: ScheduleDetailsProps) {
    if (!board) {
        return (
            <div className="text-center py-20 text-muted-foreground">
                No board data available.
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-16">
            {/* ================= HEADER ================= */}
            <div className="space-y-3">
                <div className="flex items-center gap-3">
                    <Badge variant="outline" className="font-mono text-xs">
                        ID {board.scheduleId}
                    </Badge>
                    <h1 className="text-3xl font-semibold tracking-tight">
                        {board.date}
                    </h1>
                </div>

                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                    <div>
                        <span className="text-foreground font-medium mr-2">Date</span>
                        {new Date(board.date).toLocaleDateString(undefined, {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </div>

                    <Separator orientation="vertical" className="h-4" />

                    <div>
                        <span className="text-foreground font-medium mr-2">Machine Count</span>
                        {board.machineCount}
                    </div>
                </div>
            </div>

            {/* ================= MACHINES ================= */}
            <div className="space-y-4">
                {board.machines.map((machine: TodayLineSchedule) => (
                    <Card key={machine.machine} className="shadow-sm">
                        <CardHeader className="bg-muted/5 border-b py-3 px-6">
                            <CardTitle className="text-lg font-semibold flex items-center gap-3">
                                <div className="w-1.5 h-5 bg-primary rounded-full" />
                                Machine <span className="text-primary">{machine.machine}</span>
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="p-0 overflow-x-auto">
                            <Table className="min-w-[1000px]">
                                <TableHeader>
                                    <TableRow className="bg-muted/5 hover:bg-muted/5">
                                        <TableHead className="w-[60px] text-center font-bold" rowSpan={2}>RIM</TableHead>
                                        <TableHead className="font-bold" rowSpan={2}>Code</TableHead>
                                        <TableHead className="w-[80px] text-center font-bold" rowSpan={2}>Stock RC</TableHead>
                                        <TableHead className="w-[80px] text-center font-bold" rowSpan={2}>Cure Est</TableHead>
                                        <TableHead className="w-[80px] text-center font-bold" rowSpan={2}>B.O</TableHead>
                                        <TableHead className="text-center font-bold bg-blue-50/50" colSpan={3}>SHIFT 1</TableHead>
                                        <TableHead className="text-center font-bold bg-orange-50/50" colSpan={3}>SHIFT 2</TableHead>
                                        <TableHead className="text-center font-bold bg-emerald-50/50" colSpan={3}>SHIFT 3</TableHead>
                                        <TableHead className="font-bold min-w-[150px]" rowSpan={2}>Remark</TableHead>
                                    </TableRow>
                                    <TableRow className="bg-muted/5 hover:bg-muted/5 text-[10px]">
                                        <TableHead className="text-center bg-blue-50/30">Time</TableHead>
                                        <TableHead className="text-center bg-blue-50/30">Pri</TableHead>
                                        <TableHead className="text-center bg-blue-50/30">Qty</TableHead>
                                        <TableHead className="text-center bg-orange-50/30">Time</TableHead>
                                        <TableHead className="text-center bg-orange-50/30">Pri</TableHead>
                                        <TableHead className="text-center bg-orange-50/30">Qty</TableHead>
                                        <TableHead className="text-center bg-emerald-50/30">Time</TableHead>
                                        <TableHead className="text-center bg-emerald-50/30">Pri</TableHead>
                                        <TableHead className="text-center bg-emerald-50/30">Qty</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {machine.rows.map((row: ScheduleLineDetailToday, rowIdx: number) => (
                                        <TableRow key={`${machine.machine}-${row.code}-${rowIdx}`}>
                                            <TableCell className="text-center font-mono text-xs">
                                                {row.rim || "-"}
                                            </TableCell>
                                            <TableCell className="font-bold">{row.code}</TableCell>
                                            <TableCell className="text-center">{row.rcStock || 0}</TableCell>
                                            <TableCell className="text-center">{row.cureEst || "-"}</TableCell>
                                            <TableCell className="text-center">{row.balanceOut || 0}</TableCell>

                                            {/* Shift 1 */}
                                            <TableCell className="text-center text-[11px] bg-blue-50/10 font-mono">
                                                {row.buildTimes?.shift1?.length ? (
                                                    <div className="flex flex-col gap-0.5">
                                                        {row.buildTimes.shift1.map((t, i) => (
                                                            <span key={i} className="whitespace-nowrap">{t}</span>
                                                        ))}
                                                    </div>
                                                ) : "-"}
                                            </TableCell>
                                            <TableCell className="text-center bg-blue-50/10">
                                                {row.priority1 && (
                                                    <Badge className="h-5 w-5 p-0 justify-center rounded-full bg-blue-600 text-[10px]">{row.priority1}</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center font-bold bg-blue-50/10">{row.shift1Qty || 0}</TableCell>

                                            {/* Shift 2 */}
                                            <TableCell className="text-center text-[11px] bg-orange-50/10 font-mono">
                                                {row.buildTimes?.shift2?.length ? (
                                                    <div className="flex flex-col gap-0.5">
                                                        {row.buildTimes.shift2.map((t, i) => (
                                                            <span key={i} className="whitespace-nowrap">{t}</span>
                                                        ))}
                                                    </div>
                                                ) : "-"}
                                            </TableCell>
                                            <TableCell className="text-center bg-orange-50/10">
                                                {row.priority2 && (
                                                    <Badge className="h-5 w-5 p-0 justify-center rounded-full bg-orange-500 text-[10px]">{row.priority2}</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center font-bold bg-orange-50/10">{row.shift2Qty || 0}</TableCell>

                                            {/* Shift 3 */}
                                            <TableCell className="text-center text-[11px] bg-emerald-50/10 font-mono">
                                                {row.buildTimes?.shift3?.length ? (
                                                    <div className="flex flex-col gap-0.5">
                                                        {row.buildTimes.shift3.map((t, i) => (
                                                            <span key={i} className="whitespace-nowrap">{t}</span>
                                                        ))}
                                                    </div>
                                                ) : "-"}
                                            </TableCell>
                                            <TableCell className="text-center bg-emerald-50/10">
                                                {row.priority3 && (
                                                    <Badge className="h-5 w-5 p-0 justify-center rounded-full bg-emerald-600 text-[10px]">{row.priority3}</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center font-bold bg-emerald-50/10">{row.shift3Qty || 0}</TableCell>

                                            <TableCell className="text-xs text-muted-foreground italic">
                                                {row.remark || "-"}
                                            </TableCell>
                                        </TableRow>
                                    ))}

                                    {machine.rows.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={15}
                                                className="text-center py-10 text-muted-foreground italic"
                                            >
                                                No products assigned.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                ))}

                {board.machines.length === 0 && (
                    <div className="py-20 text-center text-muted-foreground border rounded-lg bg-muted/5">
                        No machine data in this board.
                    </div>
                )}
            </div>
        </div>
    );
}