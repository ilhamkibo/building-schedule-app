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
import { useCategories } from "@/hooks/use-category";
import { useTodayCategorySchedule } from "@/hooks/use-schedule";
import Link from "next/link";
import { useShiftContext } from "@/context/shift-context";
import { DashboardFilterBar } from "@/components/pages/dashboard/components/DashboardFilterBar";
import { DashboardSkeleton } from "@/components/pages/dashboard/components/DashboardSkeleton";

const STORAGE_KEY = "selected-category-no";

export default function Page() {
  const [selectedCategoryNo, setSelectedCategoryNo] = useState<string>("");
  const { open } = useSidebar();
  const { activeShift, shifts: shiftTime, isLoading: isLoadingShiftTime } = useShiftContext();

  const { data: categoriesData = [], isLoading: isLoadingCategories } = useCategories({ limit: 100 });
  // Removed local shift fetching as it's now handled by useShiftContext

  useEffect(() => {
    const savedCategoryNo = localStorage.getItem(STORAGE_KEY);
    if (savedCategoryNo) {
      setSelectedCategoryNo(savedCategoryNo);
    } else if (categoriesData.length > 0) {
      setSelectedCategoryNo(categoriesData[0].categoryNo.toString());
    }
  }, [categoriesData]);

  // simpan ke localStorage setiap berubah
  useEffect(() => {
    if (selectedCategoryNo) {
      localStorage.setItem(STORAGE_KEY, selectedCategoryNo);
    }
  }, [selectedCategoryNo]);

  const { data: scheduleResponse, isLoading: isLoadingSchedules } = useTodayCategorySchedule(
    parseInt(selectedCategoryNo),
    { enabled: !!selectedCategoryNo }
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
    if (!scheduleData) return [];
    const scheduleDate = (scheduleData && !Array.isArray(scheduleData) ? (scheduleData as any).date : null) || scheduleResponse?.data?.date || new Date().toISOString();

    // If it's already in the dashboard format (array of machines with rows)
    if (Array.isArray(scheduleData) && scheduleData.length > 0 && scheduleData[0].rows) {
      return scheduleData.map((m: any) => ({
        ...m,
        rows: m.rows.map((row: any) => ({
          ...row,
          phases: row.phases?.map((p: any) => ({
            ...p,
            start: typeof p.start === 'string' ? timeToDecimal(p.start, scheduleDate) : p.start,
            end: typeof p.end === 'string' ? timeToDecimal(p.end, scheduleDate) : p.end
          })) || []
        }))
      }));
    }

    if (!scheduleData.details) return [];

    return (scheduleData as any).details.map((m: any) => {
      // Group details by product code within the machine to match the dashboard's table row format (aggregating shifts)
      const rowsMap = new Map<string, any>();

      m.shifts.forEach((shift: any) => {
        shift.details.forEach((detail: any) => {
          if (!rowsMap.has(detail.codeNo)) {
            rowsMap.set(detail.codeNo, {
              code: detail.codeNo,
              rim: detail.rim,
              rcStock: detail.stockRc,
              cureEst: detail.cureEst,
              balanceOut: detail.bo,
              buildTime: detail.buildingStart && detail.buildingFinish
                ? `${new Date(detail.buildingStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(detail.buildingFinish).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                : "-",
              shift1Qty: 0,
              shift2Qty: 0,
              shift3Qty: 0,
              remark: detail.remark,
              phases: []
            });
          }

          const row = rowsMap.get(detail.codeNo)!;

          // Accumulate shift quantities
          if (shift.shiftNo === 1) row.shift1Qty += detail.qty;
          if (shift.shiftNo === 2) row.shift2Qty += detail.qty;
          if (shift.shiftNo === 3) row.shift3Qty += detail.qty;

          // Add timelines to phases
          if (detail.timelines) {
            detail.timelines.forEach((t: any) => {
              row.phases.push({
                type: t.processType.toLowerCase(),
                start: timeToDecimal(t.startTime, scheduleDate),
                end: timeToDecimal(t.endTime, scheduleDate)
              });
            });
          }
        });
      });

      return {
        id: m.machine,
        machine: m.machine,
        shift: "All Shifts",
        rows: Array.from(rowsMap.values())
      };
    });
  }, [scheduleData]);

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
        selectedCategoryNo={selectedCategoryNo}
        onCategoryChange={setSelectedCategoryNo}
        categories={categoriesData}
      />

      {/* CONTENT */}
      {(isLoadingCategories || isLoadingSchedules) ? (
        <DashboardSkeleton />
      ) : dashboardData.length > 0 ? (
        <ScheduleBoard data={dashboardData} shiftTime={shiftTime} />
      ) : (
        selectedCategoryNo && (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground bg-sidebar/50 rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-800">
            <p className="text-lg font-medium">Tidak ada schedule untuk category ini</p>
            <p className="text-sm">Silahkan pilih category lain atau buat schedule baru.</p>
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