"use client";
import { useState, useEffect, useMemo } from "react";

import ScheduleBoard from "@/components/pages/dashboard/ScheduleBoard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSidebar } from "@/components/ui/sidebar";
import { useLines } from "@/hooks/use-line";
import { useTodayLineSchedule } from "@/hooks/use-schedule";
import Link from "next/link";
import { useShiftContext } from "@/context/shift-context";
import { TodayLineSchedule } from "@/types/schedule";
import { DashboardFilterBar } from "@/components/pages/dashboard/components/DashboardFilterBar";
import { DashboardSkeleton } from "@/components/pages/dashboard/components/DashboardSkeleton";

const STORAGE_KEY = "selected-line-no";

export default function Page() {
  const [selectedLineNo, setSelectedLineNo] = useState<string>("");
  const { open } = useSidebar();
  const { activeShift, shifts: shiftTime, isLoading: isLoadingShiftTime } = useShiftContext();

  const { data: linesData = [], isLoading: isLoadingLines } = useLines({ limit: 100 });
  // Removed local shift fetching as it's now handled by useShiftContext

  useEffect(() => {
    const savedLineNo = localStorage.getItem(STORAGE_KEY);
    if (savedLineNo) {
      setSelectedLineNo(savedLineNo);
    } else if (linesData.length > 0) {
      setSelectedLineNo(linesData[0].lineNo.toString());
    }
  }, [linesData]);

  // simpan ke localStorage setiap berubah
  useEffect(() => {
    if (selectedLineNo) {
      localStorage.setItem(STORAGE_KEY, selectedLineNo);
    }
  }, [selectedLineNo]);

  const { data: scheduleResponse, isLoading: isLoadingSchedules } = useTodayLineSchedule(
    parseInt(selectedLineNo),
    { enabled: !!selectedLineNo }
  );

  const scheduleData = scheduleResponse?.data;

  const timeToDecimal = (dateStr: string | null, baseDateStr: string) => {
    if (!dateStr) return 0;
    const date = new Date(dateStr);
    const baseDate = new Date(baseDateStr);
    baseDate.setHours(0, 0, 0, 0);

    // Difference in hours relative to the start of the base date
    const diffMs = date.getTime() - baseDate.getTime();
    return diffMs / (1000 * 60 * 60);
  };

  // Removed unused and broken shiftTimeDecimal mapper that caused type errors

  const dashboardData = useMemo(() => {
    if (!scheduleData || !Array.isArray(scheduleData)) return [];

    const scheduleDate =
      (scheduleResponse?.data as any)?.date || new Date().toISOString();

    return scheduleData.map((m: TodayLineSchedule) => ({
      id: m.machine || m.id?.toString(),
      machine: m.machine,
      shift: m.shifts || "All Shifts",
      rows: (m.rows || []).map((row: any) => ({
        ...row,
        totalQty: (row.shift1Qty || 0) + (row.shift2Qty || 0) + (row.shift3Qty || 0),
        phases: (row.phases || []).map((p: any) => ({
          ...p,
          start: typeof p.start === "string" ? timeToDecimal(p.start, scheduleDate) : p.start,
          end: typeof p.end === "string" ? timeToDecimal(p.end, scheduleDate) : p.end,
        })),
      })),
    }));
  }, [scheduleData, scheduleResponse]);

  return (
    <div
      className={`p-4 ${open
        ? "max-w-[calc(100vw-20rem)]"
        : "max-w-full"
        }`}
    >
      <DashboardFilterBar
        selectedLineNo={selectedLineNo}
        onLineNoChange={setSelectedLineNo}
        lines={linesData}
      />

      {/* CONTENT */}
      {(isLoadingShiftTime || isLoadingLines || isLoadingSchedules) ? (
        <DashboardSkeleton />
      ) : dashboardData.length > 0 ? (
        <ScheduleBoard data={dashboardData} shiftTime={shiftTime} />
      ) : (
        selectedLineNo && (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground bg-sidebar/50 rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-800">
            <p className="text-lg font-medium">Tidak ada schedule untuk line ini</p>
            <p className="text-sm">Silahkan pilih line lain atau buat schedule baru.</p>
            <Link href="/schedules/adjust" className="mt-2 text-md px-4 py-2 bg-primary text-white rounded-md cursor-pointer">
              Buat Schedule
            </Link>
          </div>
          // <ScheduleBoard data={dummyData} shiftTime={shiftTime} />
        )
      )}
    </div>
  );
}