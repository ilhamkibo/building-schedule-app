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

export function ScheduleBlock({ block }: { block: any }) {
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
                    <ProductionGantt rows={block.rows} />
                </div>
            </div>
        </div>
    );
}

const PHASE_COLOR: Record<string, string> = {
    building: "bg-blue-500",
    curing: "bg-orange-400",
    idle: "bg-yellow-300",
    buffer: "bg-pink-400",
};


function GanttRow({ phases }: { phases: any[] }) {
    const hours = Array.from({ length: 24 }, (_, i) => i + 7);
    return (
        <div className="relative h-8 border-b dark:border-slate-800">
            <div className="absolute inset-0 grid grid-cols-24">
                {hours.map((_, i) => (
                    <div key={i} className="border-r dark:border-slate-800" />
                ))}
            </div>
            {phases.map((p, i) => (
                <div
                    key={i}
                    className={`absolute h-5 top-1 rounded opacity-90 ${PHASE_COLOR[p.type as string] || "bg-slate-300 dark:bg-slate-600"}`}
                    style={{
                        left: `${((p.start - 7) / 24) * 100}%`,
                        width: `${((p.end - p.start) / 24) * 100}%`,
                    }}
                />
            ))}
        </div>
    );
}

function TimelineHeader() {
    const hours = Array.from({ length: 24 }, (_, i) => i + 7);
    return (
        <div className="grid grid-cols-24 text-sm h-12.75 text-center border-b dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400">
            {hours.map((h) => (
                <div key={h} className="border-r dark:border-slate-800 py-3.75">
                    {h > 24 ? h - 24 : h}
                </div>
            ))}
        </div>
    );
}

export function ProductionGantt({ rows }: { rows: any[] }) {
    return (
        <div className="border-l dark:border-slate-800">
            <TimelineHeader />
            {rows.map((row, i) => (
                <GanttRow key={i} phases={row.phases} />
            ))}
        </div>
    );
}