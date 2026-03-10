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

  const dummyData = [
    {
      id: "M01",
      machine: "M01",
      shift: "All Shifts",
      rows: [
        // PRIORITY A → PRODUKSI DULU
        {
          code: "A1101",
          rim: "A1101",
          rcStock: 0,
          cureEst: "20:00",
          balanceOut: 40,
          buildTime1: "08:00 - 12:00",
          buildTime2: "20:00 - 23:20",
          buildTime3: "00:00 - 04:00",
          priority1: "A",
          priority2: "B",
          priority3: "A",
          shift1Qty: 60,
          shift2Qty: 0,
          shift3Qty: 30,
          remark: "First production, still need to produce more",
          phases: [
            { type: "shortage", start: 8, end: 9.2 },
            { type: "building", start: 0, end: 4 },
            { type: "building", start: 8, end: 12 },
            { type: "building", start: 20, end: 23.33 },
            { type: "curing", start: 9.2, end: 16 },
            { type: "achievment", start: 16, end: 20 }
          ]
        },

        // PRIORITY B → SETELAH A SELESAI
        {
          code: "E5501",
          rim: "E5501",
          rcStock: 90,
          cureEst: "24:00",
          balanceOut: 10,
          buildTime1: "12:00 - 16:00",
          buildTime2: "16:00 - 20:00",
          buildTime3: "04:00 - 08:00",
          priority1: "B",
          priority2: "A",
          priority3: "B",
          shift1Qty: 30,
          shift2Qty: 40,
          shift3Qty: 20,
          remark: "Second production",
          phases: [
            { type: "building", start: 4, end: 8 },
            { type: "building", start: 12, end: 16 },
            { type: "building", start: 16, end: 20 },
            { type: "curing", start: 8, end: 20 },
            { type: "achievment", start: 20, end: 24 }
          ]
        }
      ]
    },

    {
      id: "M02",
      machine: "M02",
      shift: "All Shifts",
      rows: [
        // PRIORITY A
        {
          code: "B2201",
          rim: "B2201",
          rcStock: 5,
          cureEst: "18:00",
          balanceOut: 20,
          buildTime1: "08:00 - 12:00",
          buildTime2: "-",
          buildTime3: "00:00 - 02:00",
          priority1: "A",
          priority2: "-",
          priority3: "A",
          shift1Qty: 40,
          shift2Qty: 0,
          shift3Qty: 20,
          remark: "",
          phases: [
            { type: "building", start: 8, end: 12 },
            { type: "curing", start: 8, end: 9 },
            { type: "building", start: 0, end: 2 },
            { type: "shortage", start: 9, end: 9.15 },
            { type: "achievment", start: 9.15, end: 19.5 }
          ]
        },

        // PRIORITY B
        {
          code: "D4401",
          rim: "D4401",
          rcStock: 100,
          cureEst: "22:00",
          balanceOut: 20,
          buildTime1: "12:00 - 16:00",
          buildTime2: "16:00 - 20:00",
          buildTime3: "-",
          priority1: "B",
          priority2: "A",
          priority3: "-",
          shift1Qty: 40,
          shift2Qty: 60,
          shift3Qty: 0,
          remark: "",
          phases: [
            { type: "building", start: 12, end: 16 },
            { type: "building", start: 16, end: 20 },
            { type: "curing", start: 8, end: 20 }
          ]
        },

        // PRIORITY C
        {
          code: "C3301",
          rim: "C3301",
          rcStock: 19,
          cureEst: "24:00",
          balanceOut: 60,
          buildTime2: "20:00 - 23:00",
          buildTime3: "-",
          buildTime1: "-",
          priority1: "-",
          priority2: "B",
          priority3: "-",
          shift1Qty: 0,
          shift2Qty: 30,
          shift3Qty: 0,
          remark: "Last production",
          phases: [
            { type: "building", start: 20, end: 23 },
            { type: "curing", start: 8, end: 11 },
            { type: "shortage", start: 11, end: 21.12 },
            { type: "achievment", start: 21.12, end: 2.7 }
          ]
        }
      ]
    }
  ];

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