import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";


export function MachineCard({ machine }: { machine: any }) {
    return (
        <div className="border rounded p-3 bg-white shadow-sm flex flex-col gap-2 w-full hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center border-b pb-1 mb-1">
                <span className="font-bold text-lg text-slate-700">{machine.code}</span>
                <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-medium">Size Code</span>
            </div>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-1">
                <div className="flex flex-col">
                    <span className="text-[9px] text-slate-400 uppercase font-bold">Rem. Stock</span>
                    <span className="text-sm font-bold text-emerald-600 leading-tight">{machine.stock} <span className="text-[9px] font-normal text-slate-400">PCS</span></span>
                </div>
                <div className="flex flex-col">
                    <span className="text-[9px] text-slate-400 uppercase font-bold">Total Qty</span>
                    <span className="text-sm font-bold text-slate-700 leading-tight">{machine.totalQty} <span className="text-[9px] font-normal text-slate-400">PCS</span></span>
                </div>
            </div>

            <div className="flex items-center justify-between mt-2 pt-2 border-t text-[10px] text-slate-500 font-medium bg-slate-50 -mx-3 -mb-3 px-3 py-1.5 rounded-b">
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
            className="border rounded bg-slate-50 shadow-sm cursor-grab overflow-hidden"
        >
            <div className="px-4 py-2 font-bold bg-white border-b flex justify-between items-center text-slate-600">
                <span>{block.machine}</span>
                <span className="text-xs font-normal bg-slate-100 px-2 py-0.5 rounded text-slate-500">{block.shift}</span>
            </div>

            <div
                ref={setNodeRef}
                style={style}
                {...attributes}
                {...listeners}
                className="border rounded bg-white shadow cursor-grab"
            >
                <div className="grid grid-cols-[1fr_500px]">
                    <table className="w-full text-xs border-r">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="border p-1" rowSpan={2}>RIM</th>
                                <th className="border p-1" rowSpan={2}>Code</th>
                                <th className="border p-1" rowSpan={2}>Cure /shift</th>
                                <th className="border p-1" rowSpan={2}>R/C Stock</th>
                                <th className="border p-1" rowSpan={2}>Cure est.</th>
                                <th className="border p-1" rowSpan={2}>Building Start - Finish</th>
                                <th className="border p-1" colSpan={3}>Qty</th>
                                <th className="border p-1" rowSpan={2}>Remark</th>
                            </tr>
                            <tr>
                                <th className="border p-1">Shift 1</th>
                                <th className="border p-1">Shift 2</th>
                                <th className="border p-1">Shift 3</th>
                            </tr>
                        </thead>
                        <tbody>
                            {block.rows.map((r: any, i: number) => (
                                <tr key={i} className="text-center h-8">
                                    <td className="border p-1">14</td>
                                    <td className="border p-1 font-semibold">{r.code}</td>
                                    <td className="border p-1">39</td>
                                    <td className="border p-1">10</td>
                                    <td className="border p-1">08:10</td>
                                    <td className="border p-1">09:00 - 10:00</td>
                                    <td className="border p-1">-</td>
                                    <td className="border p-1">-</td>
                                    <td className="border p-1">{r.qty}</td>
                                    <td className="border p-1 text-red-600">{r.remark}</td>
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
    const hours = Array.from({ length: 24 }, (_, i) => i + 8);
    return (
        <div className="relative h-8 border-b">
            <div className="absolute inset-0 grid grid-cols-24">
                {hours.map((_, i) => (
                    <div key={i} className="border-r" />
                ))}
            </div>
            {phases.map((p, i) => (
                <div
                    key={i}
                    className={`absolute h-5 top-1 rounded ${PHASE_COLOR[p.type as string] || "bg-slate-300"}`}
                    style={{
                        left: `${((p.start - 8) / 24) * 100}%`,
                        width: `${((p.end - p.start) / 24) * 100}%`,
                    }}
                />
            ))}
        </div>
    );
}

function TimelineHeader() {
    const hours = Array.from({ length: 24 }, (_, i) => i + 8);
    return (
        <div className="grid grid-cols-24 text-[12px] text-center border-b">
            {hours.map((h) => (
                <div key={h} className="border-r py-3.75">
                    {h > 24 ? h - 24 : h}
                </div>
            ))}
        </div>
    );
}

export function ProductionGantt({ rows }: { rows: any[] }) {
    return (
        <div className="border">
            <TimelineHeader />
            {rows.map((row, i) => (
                <GanttRow key={i} phases={row.phases} />
            ))}
        </div>
    );
}
