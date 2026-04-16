import {
    ScheduleBoard,
    CreateScheduleMachine,
    CreateScheduleShift,
    CreateScheduleDetail,
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

/** Group details by codeNo across shifts for horizontal table layout */
interface CodeRow {
    code: string;
    rim: string;
    mold: number;
    stockRc: number;
    boQty: string | null;
    shifts: { [shiftNo: number]: CreateScheduleDetail[] };
}

function buildCodeRows(machine: CreateScheduleMachine): CodeRow[] {
    const codeMap = new Map<string, CodeRow>();
    const codeOrder: string[] = [];

    (machine.shifts || []).forEach((shift: CreateScheduleShift) => {
        (shift.details || []).forEach((detail: CreateScheduleDetail) => {
            const key = detail.codeNo;

            if (!codeMap.has(key)) {
                codeMap.set(key, {
                    code: detail.codeNo,
                    rim: detail.rim || "",
                    mold: detail.mold || 0,
                    stockRc: detail.stockRc || 0,
                    boQty: detail.boQty || null,
                    shifts: {},
                });
                codeOrder.push(key);
            }

            const row = codeMap.get(key)!;
            if (!row.shifts[shift.shiftNo]) {
                row.shifts[shift.shiftNo] = [];
            }
            row.shifts[shift.shiftNo].push(detail);

            // Update boQty to latest non-null value
            if (detail.boQty) {
                row.boQty = detail.boQty;
            }
        });
    });

    return codeOrder.map((key) => codeMap.get(key)!);
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
                <h1 className="text-3xl font-semibold tracking-tight">
                    {board.date}
                </h1>

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
                        <span className="text-foreground font-medium mr-2">Line</span>
                        {board.lineNo}
                    </div>

                    <Separator orientation="vertical" className="h-4" />

                    <div>
                        <span className="text-foreground font-medium mr-2">Machine Count</span>
                        {board.machines?.length || 0}
                    </div>
                </div>
            </div>

            {/* ================= MACHINES ================= */}
            <div className="space-y-4">
                {(board.machines || []).map((machine: CreateScheduleMachine) => {
                    const codeRows = buildCodeRows(machine);

                    return (
                        <Card key={machine.machine} className="shadow-sm">
                            <CardHeader className="bg-muted/5 border-b py-3 px-6">
                                <CardTitle className="text-lg font-semibold flex items-center gap-3">
                                    <div className="w-1.5 h-5 bg-primary rounded-full" />
                                    Machine <span className="text-primary">{machine.machine}</span>
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="p-0 overflow-x-auto">
                                <Table className="min-w-[900px]">
                                    <TableHeader>
                                        <TableRow className="bg-muted/5 hover:bg-muted/5">
                                            <TableHead className="w-[60px] text-center font-bold" rowSpan={2}>RIM</TableHead>
                                            <TableHead className="font-bold" rowSpan={2}>Code</TableHead>
                                            <TableHead className="w-[60px] text-center font-bold" rowSpan={2}>Mold</TableHead>
                                            <TableHead className="w-[80px] text-center font-bold" rowSpan={2}>Stock RC</TableHead>
                                            <TableHead className="w-[80px] text-center font-bold" rowSpan={2}>B.O</TableHead>
                                            <TableHead className="text-center font-bold bg-blue-50/50" colSpan={2}>SHIFT 1</TableHead>
                                            <TableHead className="text-center font-bold bg-orange-50/50" colSpan={2}>SHIFT 2</TableHead>
                                            <TableHead className="text-center font-bold bg-emerald-50/50" colSpan={2}>SHIFT 3</TableHead>
                                            <TableHead className="font-bold min-w-[120px]" rowSpan={2}>Remark</TableHead>
                                        </TableRow>
                                        <TableRow className="bg-muted/5 hover:bg-muted/5 text-[10px]">
                                            <TableHead className="text-center bg-blue-50/30">Pri</TableHead>
                                            <TableHead className="text-center bg-blue-50/30">Qty</TableHead>
                                            <TableHead className="text-center bg-orange-50/30">Pri</TableHead>
                                            <TableHead className="text-center bg-orange-50/30">Qty</TableHead>
                                            <TableHead className="text-center bg-emerald-50/30">Pri</TableHead>
                                            <TableHead className="text-center bg-emerald-50/30">Qty</TableHead>
                                        </TableRow>
                                    </TableHeader>

                                    <TableBody>
                                        {codeRows.map((row, rowIdx) => {
                                            // Find max entries across all shifts for row spanning
                                            const maxEntries = Math.max(
                                                1,
                                                (row.shifts[1] || []).length,
                                                (row.shifts[2] || []).length,
                                                (row.shifts[3] || []).length,
                                            );

                                            // If only 1 entry per shift (normal case), render single row
                                            if (maxEntries === 1) {
                                                const s1 = row.shifts[1]?.[0];
                                                const s2 = row.shifts[2]?.[0];
                                                const s3 = row.shifts[3]?.[0];

                                                return (
                                                    <TableRow key={`${machine.machine}-${row.code}-${rowIdx}`}>
                                                        <TableCell className="text-center font-mono text-xs">{row.rim || "-"}</TableCell>
                                                        <TableCell className="font-bold">{row.code}</TableCell>
                                                        <TableCell className="text-center">{row.mold || 0}</TableCell>
                                                        <TableCell className="text-center">{row.stockRc || 0}</TableCell>
                                                        <TableCell className="text-center">{row.boQty || "-"}</TableCell>

                                                        {/* Shift 1 */}
                                                        <TableCell className="text-center bg-blue-50/10">
                                                            {s1?.priority && (
                                                                <Badge className="h-5 w-5 p-0 justify-center rounded-full bg-blue-600 text-[10px]">{s1.priority}</Badge>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-center font-bold bg-blue-50/10">{s1?.qty || 0}</TableCell>

                                                        {/* Shift 2 */}
                                                        <TableCell className="text-center bg-orange-50/10">
                                                            {s2?.priority && (
                                                                <Badge className="h-5 w-5 p-0 justify-center rounded-full bg-orange-500 text-[10px]">{s2.priority}</Badge>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-center font-bold bg-orange-50/10">{s2?.qty || 0}</TableCell>

                                                        {/* Shift 3 */}
                                                        <TableCell className="text-center bg-emerald-50/10">
                                                            {s3?.priority && (
                                                                <Badge className="h-5 w-5 p-0 justify-center rounded-full bg-emerald-600 text-[10px]">{s3.priority}</Badge>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-center font-bold bg-emerald-50/10">{s3?.qty || 0}</TableCell>

                                                        <TableCell className="text-xs text-muted-foreground italic">
                                                            {s1?.remark || s2?.remark || s3?.remark || "-"}
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            }

                                            // Multiple entries case: render stacked rows with merged left cells
                                            return Array.from({ length: maxEntries }).map((_, subIdx) => {
                                                const s1 = row.shifts[1]?.[subIdx];
                                                const s2 = row.shifts[2]?.[subIdx];
                                                const s3 = row.shifts[3]?.[subIdx];
                                                const isFirst = subIdx === 0;

                                                return (
                                                    <TableRow
                                                        key={`${machine.machine}-${row.code}-${rowIdx}-${subIdx}`}
                                                        className={!isFirst ? "border-t-0" : ""}
                                                    >
                                                        {isFirst && (
                                                            <>
                                                                <TableCell className="text-center font-mono text-xs" rowSpan={maxEntries}>{row.rim || "-"}</TableCell>
                                                                <TableCell className="font-bold" rowSpan={maxEntries}>{row.code}</TableCell>
                                                                <TableCell className="text-center" rowSpan={maxEntries}>{row.mold || 0}</TableCell>
                                                                <TableCell className="text-center" rowSpan={maxEntries}>{row.stockRc || 0}</TableCell>
                                                                <TableCell className="text-center" rowSpan={maxEntries}>{row.boQty || "-"}</TableCell>
                                                            </>
                                                        )}

                                                        {/* Shift 1 */}
                                                        <TableCell className="text-center bg-blue-50/10">
                                                            {s1?.priority && (
                                                                <Badge className="h-5 w-5 p-0 justify-center rounded-full bg-blue-600 text-[10px]">{s1.priority}</Badge>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-center font-bold bg-blue-50/10">{s1?.qty ?? ""}</TableCell>

                                                        {/* Shift 2 */}
                                                        <TableCell className="text-center bg-orange-50/10">
                                                            {s2?.priority && (
                                                                <Badge className="h-5 w-5 p-0 justify-center rounded-full bg-orange-500 text-[10px]">{s2.priority}</Badge>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-center font-bold bg-orange-50/10">{s2?.qty ?? ""}</TableCell>

                                                        {/* Shift 3 */}
                                                        <TableCell className="text-center bg-emerald-50/10">
                                                            {s3?.priority && (
                                                                <Badge className="h-5 w-5 p-0 justify-center rounded-full bg-emerald-600 text-[10px]">{s3.priority}</Badge>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-center font-bold bg-emerald-50/10">{s3?.qty ?? ""}</TableCell>

                                                        {isFirst && (
                                                            <TableCell className="text-xs text-muted-foreground italic" rowSpan={maxEntries}>
                                                                {s1?.remark || s2?.remark || s3?.remark || "-"}
                                                            </TableCell>
                                                        )}
                                                    </TableRow>
                                                );
                                            });
                                        })}

                                        {codeRows.length === 0 && (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={12}
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
                    );
                })}

                {(!board.machines || board.machines.length === 0) && (
                    <div className="py-20 text-center text-muted-foreground border rounded-lg bg-muted/5">
                        No machine data in this board.
                    </div>
                )}
            </div>
        </div>
    );
}