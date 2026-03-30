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
import { TodayLineSchedule, ScheduleLineDetailToday, SchedulePhase } from "@/types/schedule";
import { DashboardFilterBar } from "@/components/pages/dashboard/components/DashboardFilterBar";
import { DashboardSkeleton } from "@/components/pages/dashboard/components/DashboardSkeleton";

const STORAGE_KEY = "selected-line-no";

export default function Page() {
  const [selectedLineNo, setSelectedLineNo] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toLocaleDateString('en-CA')
  );
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
    selectedDate,
    { enabled: !!selectedLineNo && !!selectedDate }
  );

  const scheduleData = scheduleResponse?.data;
  console.log("🚀 ~ Page ~ scheduleData:", scheduleData)

  const timeToDecimal = (dateStr: string | null) => {
    if (!dateStr) return 0;
    const timeMatch = dateStr.match(/T(\d{2}:\d{2}:\d{2})/);
    if (timeMatch) {
      const [h, m, s] = timeMatch[1].split(':').map(Number);
      return h + m / 60 + s / 3600;
    }
    const date = new Date(dateStr);
    return date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600;
  };

  // Removed unused and broken shiftTimeDecimal mapper that caused type errors

  const dashboardData = useMemo(() => {
    if (!scheduleData || !Array.isArray(scheduleData)) return [];

    const scheduleDate = new Date().toISOString();

    return (scheduleData as TodayLineSchedule[]).map((m: TodayLineSchedule) => ({
      id: m.machine || m.id?.toString(),
      machine: m.machine,
      shift: m.shift || "All Shifts",
      rows: (m.rows || []).map((row: ScheduleLineDetailToday) => ({
        ...row,
        totalQty: (row.shift1Qty || 0) + (row.shift2Qty || 0) + (row.shift3Qty || 0),
        phases: (row.phases || []).map((p: SchedulePhase) => ({
          ...p,
          start: typeof p.start === "string" ? timeToDecimal(p.start) : p.start,
          end: typeof p.end === "string" ? timeToDecimal(p.end) : p.end,
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
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
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
        )
      )}
    </div>
  );
}