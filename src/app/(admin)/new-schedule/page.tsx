import ScheduleBoard from "@/components/pages/dashboard/ScheduleBoard";

export default function NewSchedulePage() {
  return <div className="p-4">
    {/* HEADER */}
    <div className="px-4 mb-4 rounded-md py-2 font-semibold bg-slate-100 border-b">
      PCR | Shift 1
    </div>

    {/* CONTENT */}
    <ScheduleBoard />
  </div>;
}
