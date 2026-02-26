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

interface ScheduleBoardViewProps {
    board: ScheduleBoard;
}

export default function ScheduleBoardView({
    board,
}: ScheduleBoardViewProps) {
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
                    <Card key={machine.machineNo} className="shadow-sm">
                        <CardHeader >
                            <CardTitle className="text-lg font-semibold">
                                Machine {machine.machineNo}
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[80px]">Priority</TableHead>
                                        <TableHead>Product</TableHead>
                                        <TableHead className="w-[70px] text-center">
                                            Rim
                                        </TableHead>
                                        <TableHead className="w-[200px] text-center">
                                            Qty (S1/S2/S3)
                                        </TableHead>
                                        <TableHead>Timeline</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {machine.details.map(
                                        (item: ScheduleBoardDetailItem) => (
                                            <TableRow key={item.detailId}>
                                                {/* PRIORITY */}
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            item.prioritas ? "default" : "secondary"
                                                        }
                                                        className="font-mono"
                                                    >
                                                        {item.prioritas || "-"}
                                                    </Badge>
                                                </TableCell>

                                                {/* PRODUCT */}
                                                <TableCell>
                                                    <div className="flex flex-col gap-1">
                                                        <span className="font-medium">
                                                            {item.codeNo}
                                                        </span>

                                                        <div className="flex gap-2 text-xs">
                                                            {item.bo && item.bo > 0 && (
                                                                <Badge variant="destructive">
                                                                    BO {item.bo}
                                                                </Badge>
                                                            )}

                                                            {item.stockRc !== null && (
                                                                <Badge variant="outline">
                                                                    Stock {item.stockRc}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                </TableCell>

                                                {/* RIM */}
                                                <TableCell className="text-center">
                                                    {item.rim || "-"}
                                                </TableCell>

                                                {/* QUANTITY */}
                                                <TableCell>
                                                    <div className="flex justify-center gap-4 font-mono text-sm">
                                                        {/* <span>S1 {item.shift1Qty}</span>
                                                        <span>S2 {item.shift2Qty}</span>
                                                        <span>S3 {item.shift3Qty}</span> */}
                                                        <span>{item.shift1Qty}/{item.shift2Qty}/{item.shift3Qty}</span>
                                                    </div>
                                                </TableCell>

                                                {/* TIMELINE */}
                                                <TableCell>
                                                    {item.timelines.length > 0 ? (
                                                        <div className="space-y-2">
                                                            {item.timelines.map(
                                                                (tl: BoardTimelineItem, idx) => (
                                                                    <div
                                                                        key={idx}
                                                                        className="flex items-center gap-3 text-xs"
                                                                    >
                                                                        <Badge
                                                                            variant="outline"
                                                                            className="font-mono"
                                                                        >
                                                                            {tl.processType}
                                                                        </Badge>

                                                                        <span className="text-muted-foreground">
                                                                            Shift{" "}
                                                                            {tl.shift?.shiftNo ?? "-"}
                                                                        </span>

                                                                        <span className="font-mono">
                                                                            {tl.startTime
                                                                                ? new Date(
                                                                                    tl.startTime
                                                                                ).toLocaleTimeString([], {
                                                                                    hour: "2-digit",
                                                                                    minute: "2-digit",
                                                                                })
                                                                                : "-"}
                                                                            {" — "}
                                                                            {tl.endTime
                                                                                ? new Date(
                                                                                    tl.endTime
                                                                                ).toLocaleTimeString([], {
                                                                                    hour: "2-digit",
                                                                                    minute: "2-digit",
                                                                                })
                                                                                : "-"}
                                                                        </span>
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground italic">
                                                            No timeline
                                                        </span>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        )
                                    )}

                                    {machine.details.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={5}
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
                    <div className="py-20 text-center text-muted-foreground border rounded-lg">
                        No machine data in this board.
                    </div>
                )}
            </div>
        </div>
    );
}