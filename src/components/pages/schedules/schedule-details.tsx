import {
    ScheduleBoard,
    MachineBoardDetail,
    ScheduleBoardDetailItem,
    BoardTimelineItem,
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
                        ID {board.id}
                    </Badge>
                    <h1 className="text-3xl font-semibold tracking-tight">
                        {board.code}
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
                        <span className="text-foreground font-medium mr-2">Category</span>
                        {board.categoryNo}
                    </div>
                </div>
            </div>

            {/* ================= MACHINES ================= */}
            <div className="space-y-4">
                {board.details.map((machine: MachineBoardDetail) => (
                    <Card key={machine.machine} className="shadow-sm">
                        <CardHeader className="bg-muted/5 border-b py-3 px-6">
                            <CardTitle className="text-lg font-semibold flex items-center gap-3">
                                <div className="w-1.5 h-5 bg-primary rounded-full" />
                                Machine <span className="text-primary">{machine.machine}</span>
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/5 hover:bg-muted/5">
                                        <TableHead className="w-[60px] text-center font-bold">Shift</TableHead>
                                        <TableHead className="w-[80px] font-bold">Priority</TableHead>
                                        <TableHead className="font-bold">Product Code</TableHead>
                                        <TableHead className="w-[80px] text-center font-bold">Rim</TableHead>
                                        <TableHead className="w-[100px] text-center font-bold">Qty</TableHead>
                                        <TableHead className="font-bold min-w-[250px]">Timeline & Logistics</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {machine.shifts.flatMap((shift) =>
                                        shift.details.map((item: ScheduleBoardDetailItem, itemIdx: number) => (
                                            <TableRow key={`${machine.machine}-${shift.shiftNo}-${item.codeNo}-${itemIdx}`}>
                                                {/* SHIFT */}
                                                <TableCell className="text-center">
                                                    <Badge
                                                        variant="outline"
                                                        className={`font-mono text-[10px] w-6 h-6 rounded-full p-0 flex items-center justify-center ${shift.shiftNo === 1 ? 'border-blue-500 text-blue-600 bg-blue-50' :
                                                            shift.shiftNo === 2 ? 'border-orange-500 text-orange-600 bg-orange-50' :
                                                                'border-purple-500 text-purple-600 bg-purple-50'
                                                            }`}
                                                    >
                                                        {shift.shiftNo}
                                                    </Badge>
                                                </TableCell>

                                                {/* PRIORITY */}
                                                <TableCell>
                                                    <Badge
                                                        variant={item.priority ? "default" : "secondary"}
                                                        className={`font-mono w-7 h-7 flex items-center justify-center p-0 rounded-full ${item.priority === 'A' ? 'bg-red-600' :
                                                            item.priority === 'B' ? 'bg-orange-500' :
                                                                item.priority === 'C' ? 'bg-blue-600' : ''
                                                            }`}
                                                    >
                                                        {item.priority || "-"}
                                                    </Badge>
                                                </TableCell>

                                                {/* PRODUCT */}
                                                <TableCell>
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="font-bold text-sm tracking-tight">
                                                            {item.codeNo}
                                                        </span>
                                                        <div className="flex gap-1.5 text-[10px]">
                                                            {item.bo && item.bo > 0 && (
                                                                <Badge variant="destructive" className="h-4 px-1 leading-none text-[9px]">
                                                                    BO {item.bo}
                                                                </Badge>
                                                            )}
                                                            {item.stockRc !== null && (
                                                                <Badge variant="outline" className="h-4 px-1 leading-none text-[9px] border-muted-foreground/30 text-muted-foreground">
                                                                    Stock {item.stockRc}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                </TableCell>

                                                {/* RIM */}
                                                <TableCell className="text-center font-mono text-xs">
                                                    {item.rim || "-"}
                                                </TableCell>

                                                {/* QUANTITY */}
                                                <TableCell className="text-center font-bold text-sm">
                                                    {item.qty}
                                                </TableCell>

                                                {/* TIMELINE */}
                                                <TableCell>
                                                    <div className="space-y-2">
                                                        {/* Building Times if available in shift */}
                                                        {(shift.buildingStart || shift.buildingFinish) && (
                                                            <div className="flex items-center gap-2 text-[11px] text-muted-foreground bg-muted/30 p-1.5 rounded border border-dashed">
                                                                <span className="font-semibold uppercase text-[9px] bg-background px-1 rounded border shadow-sm">Shift</span>
                                                                <span className="font-mono">
                                                                    {shift.buildingStart ? new Date(shift.buildingStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                                                                    {" — "}
                                                                    {shift.buildingFinish ? new Date(shift.buildingFinish).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                                                                </span>
                                                            </div>
                                                        )}

                                                        {item.timelines && item.timelines.length > 0 ? (
                                                            <div className="flex flex-wrap gap-2">
                                                                {item.timelines.map((tl: BoardTimelineItem, idx) => (
                                                                    <div
                                                                        key={idx}
                                                                        className="flex items-center gap-1.5 text-[11px] bg-background border rounded px-1.5 py-0.5 shadow-sm"
                                                                    >
                                                                        <span className="font-bold text-primary uppercase text-[9px]">{tl.processType}</span>
                                                                        <span className="text-muted-foreground scale-90">S{tl.shift?.shiftNo ?? "-"}</span>
                                                                        <span className="font-mono font-medium">
                                                                            {tl.startTime ? new Date(tl.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "-"}
                                                                            {"-"}
                                                                            {tl.endTime ? new Date(tl.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "-"}
                                                                        </span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <span className="text-[10px] text-muted-foreground italic pl-1">
                                                                No logistics info
                                                            </span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}

                                    {machine.shifts.every(s => s.details.length === 0) && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={6}
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

                {board.details.length === 0 && (
                    <div className="py-20 text-center text-muted-foreground border rounded-lg bg-muted/5">
                        No machine data in this board.
                    </div>
                )}
            </div>
        </div>
    );
}