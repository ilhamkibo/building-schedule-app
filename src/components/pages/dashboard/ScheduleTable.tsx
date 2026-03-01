import { Shift } from "@/types/shift";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";


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
    const { setNodeRef, attributes, listeners, transform, transition } =
        useSortable({ id: block.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="border dark:border-slate-800 rounded bg-sidebar shadow-sm cursor-grab overflow-hidden"
        >
            <div className="px-4 py-2 font-bold bg-background/30 dark:bg-background/10 border-b dark:border-slate-800 flex justify-between items-center text-slate-600 dark:text-slate-300">
                <span>MC {block.machine}</span>
                <span className="text-xs font-normal bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500 dark:text-slate-400">{block.shift}</span>
            </div>

            <div className="w-full max-w-full overflow-x-auto">
                <div className="grid grid-cols-[1fr_700px] min-w-[1350px]">
                    <table className="w-full text-xs border-r dark:border-slate-800">
                        <thead className="bg-background/50 dark:bg-background/10 text-slate-600 dark:text-slate-300">
                            <tr>
                                <th className="border dark:border-slate-800 p-1" rowSpan={2}>RIM</th>
                                <th className="border dark:border-slate-800 p-1" rowSpan={2}>Code</th>
                                <th className="border dark:border-slate-800 p-1" rowSpan={2}>Cure /shift</th>
                                <th className="border dark:border-slate-800 p-1" rowSpan={2}>R/C Stock</th>
                                <th className="border dark:border-slate-800 p-1" rowSpan={2}>Cure est.</th>
                                <th className="border dark:border-slate-800 p-1" rowSpan={2}>B.O</th>
                                <th className="border dark:border-slate-800 p-1" rowSpan={2}>Building Start - Finish</th>
                                <th className="border dark:border-slate-800 p-1" colSpan={3}>Qty</th>
                                <th className="border dark:border-slate-800 p-1" rowSpan={2}>Remark</th>
                            </tr>
                            <tr>
                                <th className="border dark:border-slate-800 p-1">Shift 1</th>
                                <th className="border dark:border-slate-800 p-1">Shift 2</th>
                                <th className="border dark:border-slate-800 p-1">Shift 3</th>
                            </tr>
                        </thead>
                        <tbody className="bg-sidebar text-slate-700 dark:text-slate-300">
                            {block.rows.map((r: any, i: number) => (
                                <tr key={i} className="text-center h-8 hover:bg-slate-50 dark:hover:bg-slate-800/30">
                                    <td className="border dark:border-slate-800 p-1">{r.rim || "-"}</td>
                                    <td className="border dark:border-slate-800 p-1 font-semibold">{r.code}</td>
                                    <td className="border dark:border-slate-800 p-1">{r.cureShift || "-"}</td>
                                    <td className="border dark:border-slate-800 p-1">{r.rcStock || "-"}</td>
                                    <td className="border dark:border-slate-800 p-1">{r.cureEst || "-"}</td>
                                    <td className="border dark:border-slate-800 p-1">{r.balanceOut || "-"}</td>
                                    <td className="border dark:border-slate-800 p-1">{r.buildTime || "-"}</td>
                                    <td className="border dark:border-slate-800 p-1">{r.shift1Qty ?? "-"}</td>
                                    <td className="border dark:border-slate-800 p-1">{r.shift2Qty ?? "-"}</td>
                                    <td className="border dark:border-slate-800 p-1">{r.shift3Qty ?? "-"}</td>
                                    <td className="border dark:border-slate-800 p-1 text-red-600 dark:text-red-400">{r.remark}</td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                    <ProductionGantt rows={block.rows} shiftTime={shiftTime} />
                </div>
            </div>
        </div>
    );
}

const PHASE_COLOR: Record<string, string> = {
    building: "bg-blue-500",
    curing: "bg-orange-400",
    shortage: "bg-red-600",
};


function GanttRow({ phases, shiftTime }: { phases: any[]; shiftTime: Shift[] }) {
    const hours = Array.from({ length: 24 }, (_, i) => i + 8);

    // Filter breaktimes from shiftTime
    const breaktimes = shiftTime.flatMap(s => s.shiftBreaks);

    // Helper to convert time string (HH:mm:ss) to decimal hours relative to 00:00
    const timeToDec = (timeStr: string) => {
        const [h, m, s] = timeStr.split(':').map(Number);
        let hour = h + (m || 0) / 60 + (s || 0) / 3600;
        // If hour is before 7 AM, assume it's the next day (h + 24)
        if (hour < 8) hour += 24;
        return hour;
    };

    return (
        <div className="relative h-8 border-b dark:border-slate-800">
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
                        className={`absolute h-7.5 bottom-0.25 rounded opacity-90  ${endDec - startDec > 0.5 ? "bg-red-200" : "bg-yellow-200"}`}
                        title="Break Time"
                        style={{
                            left: `${left}%`,
                            width: `${width}%`,
                        }}
                    />
                );
            })}


            {/* Production Phases (Building & Curing) */}
            {phases.map((p, i) => {
                const isBuilding = p.type === 'building';
                const isCuring = p.type === 'curing';

                // Use separate vertical strips as in user example
                // Building uses top-1 (h-2.5), Curing uses top-4 (h-2.5)
                const topClass = isCuring ? "top-1" : (isBuilding ? "top-4" : "top-1");
                const heightClass = (isBuilding || isCuring) ? "h-2.5" : "h-5";

                // Map colors
                let bgColor = "bg-slate-300 dark:bg-slate-600";
                if (isBuilding) bgColor = "bg-blue-500";
                else if (isCuring) bgColor = "bg-orange-400";
                else if (PHASE_COLOR[p.type]) bgColor = PHASE_COLOR[p.type];

                return (
                    <div
                        key={i}
                        className={`absolute ${heightClass} ${topClass} rounded opacity-90 ${bgColor}`}
                        title={`${p.type}: ${p.start.toFixed(2)} - ${p.end.toFixed(2)}`}
                        style={{
                            left: `${((p.start - 8) / 24) * 100}%`,
                            width: `${((p.end - p.start) / 24) * 100}%`,
                        }}
                    />
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
                    const left = ((startDec - (st.shiftNo === 1 ? 8 : 9)) / 24) * 100;

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
                <GanttRow key={i} phases={row.phases} shiftTime={shiftTime} />
            ))}
        </div>
    );
}
