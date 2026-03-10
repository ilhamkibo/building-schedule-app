import { Shift } from "@/types/shift";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getCurrentShift } from "@/lib/shift-utils";


export function MachineCard({ machine }: { machine: any }) {
    return (
        <div className="border rounded p-3 bg-sidebar dark:border-slate-800 shadow-sm flex flex-col gap-2 w-full hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center border-b dark:border-slate-800 pb-1 mb-1">
                <span className="font-bold text-lg text-slate-700 dark:text-slate-200">{machine.code}</span>
                <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500 dark:text-slate-400 font-medium">Size Code</span>
            </div>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-1">
                <div className="flex flex-col">
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 uppercase font-bold">Rem. Stock</span>
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-500 leading-tight">{machine.stock} <span className="text-[9px] font-normal text-slate-400 dark:text-slate-500">PCS</span></span>
                </div>
                <div className="flex flex-col">
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 uppercase font-bold">Total Qty</span>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-tight">{machine.totalQty} <span className="text-[9px] font-normal text-slate-400 dark:text-slate-500">PCS</span></span>
                </div>
            </div>

            <div className="flex items-center justify-between mt-2 pt-2 border-t dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400 font-medium bg-background/50 -mx-3 -mb-3 px-3 py-1.5 rounded-b">
                <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                    <span>Start: {machine.startTime}</span>
                </div>
                <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                    <span>End: {machine.endTime}</span>
                </div>
            </div>
        </div>
    );
}

export function ScheduleBlock({ block, shiftTime }: { block: any; shiftTime: Shift[] }) {
    /* const { setNodeRef, attributes, listeners, transform, transition } =
        useSortable({ id: block.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }; */

    return (
        <div
            /* ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners} */
            // className="border dark:border-slate-800 rounded bg-sidebar shadow-sm cursor-grab overflow-hidden"
            className="border dark:border-slate-800 rounded bg-sidebar shadow-sm overflow-hidden"
        >
            <div className="px-5 py-3 font-bold bg-muted/30 dark:bg-muted/10 border-b dark:border-slate-800 flex justify-between items-center text-slate-700 dark:text-slate-200">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <span className="text-sm">MC</span>
                    </div>
                    <span className="text-lg">Machine {block.machine}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-800">{block.shifts || "All Shifts"}</span>
                </div>
            </div>

            <div className="w-full max-w-full overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
                <div className="grid grid-cols-[1fr_900px] min-w-[1750px]">
                    <table className="w-full text-xs border-r dark:border-slate-800 border-collapse">
                        <thead className="bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10 text-slate-600 dark:text-slate-400">
                            <tr>
                                <th className="border dark:border-slate-800 p-2 font-bold" rowSpan={2}>RIM</th>
                                <th className="border dark:border-slate-800 p-2 font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider" rowSpan={2}>Code</th>
                                <th className="border dark:border-slate-800 p-1 font-medium" rowSpan={2}>Cure /shift</th>
                                <th className="border dark:border-slate-800 p-1 font-medium" rowSpan={2}>Stock R/C</th>
                                <th className="border dark:border-slate-800 p-1 font-medium" rowSpan={2}>Cure est.</th>
                                <th className="border dark:border-slate-800 p-1 font-medium" rowSpan={2}>B.O</th>
                                <th className={`border dark:border-slate-800 border-l-2 border-l-blue-200 dark:border-l-blue-900 p-1.5 ${getCurrentShift(shiftTime) === 1 ? 'bg-blue-50/50 dark:bg-blue-950/20 font-bold text-blue-700 dark:text-blue-400' : ''}`} colSpan={3}>SHIFT 1</th>
                                <th className={`border dark:border-slate-800 border-l-2 border-l-orange-200 dark:border-l-orange-900 p-1.5 ${getCurrentShift(shiftTime) === 2 ? 'bg-orange-50/50 dark:bg-orange-950/20 font-bold text-orange-700 dark:text-orange-400' : ''}`} colSpan={3}>SHIFT 2</th>
                                <th className={`border dark:border-slate-800 border-l-2 border-l-emerald-200 dark:border-l-emerald-900 border-r-2 border-r-slate-200 dark:border-r-slate-800 p-1.5 ${getCurrentShift(shiftTime) === 3 ? 'bg-emerald-50/50 dark:bg-emerald-950/20 font-bold text-emerald-700 dark:text-emerald-400' : ''}`} colSpan={3}>SHIFT 3</th>
                                <th className="border dark:border-slate-800 p-2 font-bold" rowSpan={2}>Remark</th>
                            </tr>
                            <tr className="bg-slate-50/30 dark:bg-slate-900/30 text-[10px] uppercase font-bold tracking-tight">
                                <th className={`border dark:border-slate-800 border-l-2 border-l-blue-200 dark:border-l-blue-900 p-1 ${getCurrentShift(shiftTime) === 1 ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''}`}>Time</th>
                                <th className={`border dark:border-slate-800 p-1 ${getCurrentShift(shiftTime) === 1 ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''}`}>Pri</th>
                                <th className={`border dark:border-slate-800 p-1 ${getCurrentShift(shiftTime) === 1 ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''}`}>Qty</th>
                                <th className={`border dark:border-slate-800 border-l-2 border-l-orange-200 dark:border-l-orange-900 p-1 ${getCurrentShift(shiftTime) === 2 ? 'bg-orange-50/50 dark:bg-orange-950/20' : ''}`}>Time</th>
                                <th className={`border dark:border-slate-800 p-1 ${getCurrentShift(shiftTime) === 2 ? 'bg-orange-50/50 dark:bg-orange-950/20' : ''}`}>Pri</th>
                                <th className={`border dark:border-slate-800 p-1 ${getCurrentShift(shiftTime) === 2 ? 'bg-orange-50/50 dark:bg-orange-950/20' : ''}`}>Qty</th>
                                <th className={`border dark:border-slate-800 border-l-2 border-l-emerald-200 dark:border-l-emerald-900 p-1 ${getCurrentShift(shiftTime) === 3 ? 'bg-emerald-50/50 dark:bg-emerald-950/20' : ''}`}>Time</th>
                                <th className={`border dark:border-slate-800 p-1 ${getCurrentShift(shiftTime) === 3 ? 'bg-emerald-50/50 dark:bg-emerald-950/20' : ''}`}>Pri</th>
                                <th className={`border dark:border-slate-800 p-1 border-r-2 border-r-slate-200 dark:border-r-slate-800 ${getCurrentShift(shiftTime) === 3 ? 'bg-emerald-50/50 dark:bg-emerald-950/20' : ''}`}>Qty</th>
                            </tr>
                        </thead>
                        <tbody className="bg-sidebar text-slate-700 dark:text-slate-300">
                            {block.rows.map((r: any, i: number) => {
                                const currentShift = getCurrentShift(shiftTime);
                                return (
                                    <tr key={i} className="text-center h-8 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors border-b dark:border-slate-800 last:border-0">
                                        <td className="border dark:border-slate-800 p-1 font-mono text-slate-500">{r.rim ? (parseInt(r.rim) / 10) : "-"}</td>
                                        <td className="border dark:border-slate-800 p-1 font-bold text-slate-900 dark:text-slate-100">{r.code}</td>
                                        <td className="border dark:border-slate-800 p-1">{r.cureShift || "-"}</td>
                                        <td className="border dark:border-slate-800 p-1">{r.rcStock || 0}</td>
                                        <td className="border dark:border-slate-800 p-1 font-medium">{r.cureEst || "-"}</td>
                                        <td className="border dark:border-slate-800 p-1">{r.balanceOut || 0}</td>
                                        <td className={`border dark:border-slate-800 p-1 border-l-2 border-l-blue-200 dark:border-l-blue-900 ${currentShift === 1 ? 'bg-blue-50/40 dark:bg-blue-950/10 font-bold text-blue-700 dark:text-blue-400' : ''}`}>
                                            {r.shift1Qty == 17 ? (
                                                <div className="flex flex-col">
                                                    <span className="text-[8.5px]">{"16:00 - 18:31"}</span>
                                                    <span className="text-[8.5px]">{r.buildTime1 || "-"}</span>
                                                </div>
                                            ) : (
                                                <span>{r.buildTime1 || "-"}</span>
                                            )}
                                        </td>
                                        <td className={`border dark:border-slate-800 p-1 ${currentShift === 1 ? 'bg-blue-50/40 dark:bg-blue-950/10 font-bold text-blue-700 dark:text-blue-400' : ''}`}>{r.priority1 || "-"}</td>
                                        <td className={`border dark:border-slate-800 p-1 ${currentShift === 1 ? 'bg-blue-50/40 dark:bg-blue-950/10 font-bold text-blue-700 dark:text-blue-400' : ''}`}>{r.shift1Qty ?? 0}</td>

                                        <td className={`border dark:border-slate-800 border-l-2 border-l-orange-200 dark:border-l-orange-900 p-1 ${currentShift === 2 ? 'bg-orange-50/40 dark:bg-orange-950/10 font-bold text-orange-700 dark:text-orange-400' : ''}`}>{r.buildTime2 || "-"}</td>
                                        <td className={`border dark:border-slate-800 p-1 ${currentShift === 2 ? 'bg-orange-50/40 dark:bg-orange-950/10 font-bold text-orange-700 dark:text-orange-400' : ''}`}>{r.priority2 || "-"}</td>
                                        <td className={`border dark:border-slate-800 p-1 ${currentShift === 2 ? 'bg-orange-50/40 dark:bg-orange-950/10 font-bold text-orange-700 dark:text-orange-400' : ''}`}>{r.shift2Qty ?? 0}</td>

                                        <td className={`border dark:border-slate-800 border-l-2 border-l-emerald-200 dark:border-l-emerald-900 p-1 ${currentShift === 3 ? 'bg-emerald-50/40 dark:bg-emerald-950/10 font-bold text-emerald-700 dark:text-emerald-400' : ''}`}>{r.buildTime3 || "-"}</td>
                                        <td className={`border dark:border-slate-800 p-1 ${currentShift === 3 ? 'bg-emerald-50/40 dark:bg-emerald-950/10 font-bold text-emerald-700 dark:text-emerald-400' : ''}`}>{r.priority3 || "-"}</td>
                                        <td className={`border dark:border-slate-800 p-1 border-r-2 border-r-slate-200 dark:border-r-slate-800 ${currentShift === 3 ? 'bg-emerald-50/40 dark:bg-emerald-950/10 font-bold text-emerald-700 dark:text-emerald-400' : ''}`}>{r.shift3Qty ?? 0}</td>

                                        <td className="border dark:border-slate-800 p-1">
                                            {r.remark && r.remark !== "-" ? (
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div className="whitespace-nowrap w-[100px] mx-auto overflow-hidden text-ellipsis text-red-600 dark:text-red-400 font-medium">
                                                            {r.remark}
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="left" className="bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900 shadow-xl p-3">
                                                        <p className="font-semibold mb-1 border-b border-red-200 pb-1">Remark</p>
                                                        <p className="font-medium max-w-[300px] wrap-break-word">{r.remark}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            ) : (
                                                <span className="text-slate-400">-</span>
                                            )}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    <ProductionGantt rows={block.rows} shiftTime={shiftTime} />
                </div>
            </div>
        </div>
    );
}


function formatDecToTime(dec: number) {
    const hours = Math.floor(dec);
    const minutes = Math.round((dec - hours) * 60);
    const h = (hours % 24).toString().padStart(2, '0');
    const m = minutes.toString().padStart(2, '0');
    return `${h}:${m}`;
}

const PHASE_CONFIG: Record<string, {
    priority: number
    color: string
    height: string
    top: string
}> = {
    building: {
        priority: 0,
        color: "bg-blue-500",
        height: "h-8.5",
        top: ""
    },
    curing: {
        priority: 1,
        color: "bg-orange-400",
        height: "h-2",
        top: "top-3"
    },
    shortage: {
        priority: 2,
        color: "bg-red-600",
        height: "h-2",
        top: "top-3"
    },
    achievement: {
        priority: 3,
        color: "bg-emerald-300",
        height: "h-2",
        top: "top-3"
    }
};

function GanttRow({ row, shiftTime }: { row: any; shiftTime: Shift[] }) {
    const hours = Array.from({ length: 24 }, (_, i) => i + 8);
    const phases = row.phases || [];

    const isTodayFriday = new Date().getDay() === 5;

    // Filter breaktimes from shiftTime
    const breaktimes = shiftTime.flatMap(s => {
        if (s.shiftNo === 1) {
            // Specific for shift 1: filter by Friday status
            return (s.shiftBreaks || []).filter(b => b.isFriday === isTodayFriday);
        }
        // For other shifts, take all (or we could apply similar logic if needed)
        return s.shiftBreaks || [];
    });

    // Helper to convert time string (HH:mm:ss) to decimal hours relative to 00:00
    const timeToDec = (timeStr: string) => {
        const [h, m, s] = timeStr.split(':').map(Number);
        let hour = h + (m || 0) / 60 + (s || 0) / 3600;
        // If hour is before 7 AM, assume it's the next day (h + 24)
        if (hour < 8) hour += 24;
        return hour;
    };

    return (
        <div className="relative h-8 border-b dark:border-slate-800 overflow-hidden">
            {/* Grid Background */}
            <div className="absolute inset-0 grid grid-cols-24">
                {hours.map((_, i) => (
                    <div key={i} className="border-r dark:border-slate-800" />
                ))}
            </div>

            {/* Dynamic Breaktimes */}
            {breaktimes.map((bt, i) => {
                const startDec = timeToDec(bt.startTime);
                const endDec = timeToDec(bt.endTime);

                // Calculate position relative to timeline start (07:00)
                const left = ((startDec - 8) / 24) * 100;
                const right = ((endDec - 8) / 24) * 100;
                const width = right - left;

                return (
                    <div
                        key={`break-${i}`}
                        className={`absolute h-full bottom-0 opacity-80  ${endDec - startDec > 0.5 ? "bg-red-200" : "bg-yellow-200"}`}
                        title="Break Time"
                        style={{
                            left: `${left}%`,
                            width: `${width}%`,
                        }}
                    />
                );
            })}


            {/* Production Phases (Building & Curing) */}
            {[...phases].sort((a, b) => PHASE_CONFIG[a.type].priority - PHASE_CONFIG[b.type].priority).map((p: any, i: number) => {

                const config = PHASE_CONFIG[p.type] || {
                    color: "bg-slate-300 dark:bg-slate-600",
                    height: "h-2",
                    top: "top-3"
                };

                let startNormal = p.start < 8 ? p.start + 24 : p.start;
                let endNormal = p.end < 8 ? p.end + 24 : p.end;

                // Ensure positive duration for spans crossing the boundary
                if (endNormal <= startNormal && p.end !== p.start) {
                    endNormal += 24;
                }

                return (
                    <Tooltip key={i}>
                        <TooltipTrigger asChild>
                            <div
                                className={`absolute ${config.height} ${config.top} opacity-90 ${config.color} cursor-pointer hover:brightness-110 transition-all`}
                                style={{
                                    left: `${((startNormal - 8) / 24) * 100}%`,
                                    width: `${Math.max(0, endNormal - startNormal) / 24 * 100}%`,
                                }}
                            />
                        </TooltipTrigger>
                        <TooltipContent className="p-2 text-xs flex flex-col gap-1 min-w-[150px]">
                            <div className="flex items-center justify-between border-b pb-1 mb-1 gap-2">
                                <span className="font-bold uppercase">{p.type}</span>
                                <span className="text-slate-500 font-mono">
                                    {formatDecToTime(startNormal)} - {formatDecToTime(endNormal)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Code:</span>
                                <span className="font-semibold">{row.code}</span>
                            </div>
                            {row.totalQty > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Total Qty:</span>
                                    <span className="font-semibold text-blue-600">{row.totalQty} PCS</span>
                                </div>
                            )}
                        </TooltipContent>
                    </Tooltip>
                );
            })}
        </div>
    );
}

function TimelineHeader() {
    const hours = Array.from({ length: 24 }, (_, i) => i + 8);

    return (
        <div className="relative border-b dark:border-slate-800 bg-slate-50 dark:bg-slate-900 overflow-hidden">

            {/* Hourly Grid */}
            <div className="grid grid-cols-24 text-sm h-12.75 text-center text-slate-500 dark:text-slate-400">
                {hours.map((h) => (
                    <div key={h} className="border-r dark:border-slate-800 py-3.75 z-10">
                        {h > 24 ? h - 24 : h}
                    </div>
                ))}
            </div>
        </div>
    );
}

export function ProductionGantt({ rows, shiftTime }: { rows: any[]; shiftTime: Shift[] }) {
    const timeToDec = (timeStr: string) => {
        const [h, m, s] = timeStr.split(':').map(Number);
        let hour = h + (m || 0) / 60 + (s || 0) / 3600;
        if (hour < 8) hour += 24;
        return hour;
    };

    return (
        <div className="relative flex flex-col">
            {/* Continuous Vertical Separators */}
            <div className="absolute inset-0 pointer-events-none z-30">
                {shiftTime.map((st, i) => {
                    const startDec = timeToDec(st.startTime);
                    const left = ((startDec - 8) / 24) * 100;

                    return (
                        <div
                            key={`shift-sep-${i}`}
                            className="absolute top-0 bottom-0 w-[2px] bg-slate-400/50 dark:bg-slate-500/50"
                            style={{ left: `${left}%` }}
                        />
                    );
                })}
            </div>

            <TimelineHeader />
            {rows.map((row, i) => (
                <GanttRow key={i} row={row} shiftTime={shiftTime} />
            ))}
        </div>
    );
}
