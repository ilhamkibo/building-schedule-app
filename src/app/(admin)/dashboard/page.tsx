import ScheduleBoard from "@/components/pages/dashboard/ScheduleBoard";

export default function Page() {
  return (
    <div className="p-4">
      {/* HEADER */}
      <div className="px-4 mb-4 rounded-md py-2 font-semibold bg-slate-100 border-b flex items-center justify-between">
        <div>PCR | Shift 1</div>
        <div className="flex items-center gap-4 text-xs font-normal">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-blue-500"></div>
            <span>Building</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-orange-400"></div>
            <span>Curing</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-yellow-300"></div>
            <span>Idle</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-pink-400"></div>
            <span>Buffer</span>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <ScheduleBoard />
    </div>
  );
}
