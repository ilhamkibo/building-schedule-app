import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";


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
            className="border rounded bg-white shadow cursor-grab"
        >
            {/* HEADER */}
            {/* <div className="px-4 py-2 font-semibold bg-slate-100 border-b">
                {block.title} | Shift {block.shift}
            </div> */}

            {/* CONTENT */}
            <div className="grid grid-cols-[1fr_420px]">
                {/* TABLE */}
                <table className="w-full text-xs border-r">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="border p-1">MC</th>
                            <th className="border p-1">Code</th>
                            <th className="border p-1">Qty</th>
                            <th className="border p-1">Remark</th>
                        </tr>
                    </thead>
                    <tbody>
                        {block.rows.map((r: any, i: number) => (
                            <tr key={i} className="text-center h-8">
                                <td className="border p-1">{r.mc}</td>
                                <td className="border p-1 font-semibold">{r.code}</td>
                                <td className="border p-1">{r.qty}</td>
                                <td className="border p-1 text-red-600">{r.remark}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* GANTT */}
                <ProductionGantt rows={block.rows} />

            </div>
        </div>
    );
}


const PHASE_COLOR = {
    building: "bg-blue-500",
    curing: "bg-orange-400",
    idle: "bg-yellow-300",
    buffer: "bg-pink-400",
};


function GanttRow({ phases }: { phases: any[] }) {
    const hours = Array.from({ length: 24 }, (_, i) => i + 8);

    return (
        <div className="relative h-8 border-b">
            {/* grid background */}
            <div className="absolute inset-0 grid grid-cols-24">
                {hours.map((_, i) => (
                    <div key={i} className="border-r" />
                ))}
            </div>

            {/* bars */}
            {phases.map((p, i) => (
                <div
                    key={i}
                    className={`absolute h-5 top-1 rounded ${PHASE_COLOR[p.type]}`}
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
        <div className="grid grid-cols-24 text-[10px] text-center border-b">
            {hours.map((h) => (
                <div key={h} className="border-r py-1">
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
