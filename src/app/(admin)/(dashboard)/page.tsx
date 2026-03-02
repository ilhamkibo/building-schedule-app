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
import { useShifts } from "@/hooks/use-shift";
import { Shift } from "@/types/shift";

const STORAGE_KEY = "selected-category-no";

export default function Page() {
  const [selectedCategoryNo, setSelectedCategoryNo] = useState<string>("");
  const { open } = useSidebar();

  const { data: categoriesData = [], isLoading: isLoadingCategories } = useCategories({ limit: 100 });
  const { data: shiftTime = [], isLoading: isLoadingShiftTime } = useShifts()

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

    const scheduleDate = scheduleData.date;

    return scheduleData.details.map(m => {
      // Group details by product code within the machine to match the dashboard's table row format (aggregating shifts)
      const rowsMap = new Map<string, any>();

      m.shifts.forEach(shift => {
        shift.details.forEach(detail => {
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
            detail.timelines.forEach(t => {
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
          rcStock: 140,
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
          remark: "Produced first",
          phases: [
            { type: "building", start: 0, end: 4 },
            { type: "building", start: 8, end: 12 },
            { type: "building", start: 20, end: 23.33 },
            { type: "curing", start: 8, end: 16 }
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
            { type: "shortage", start: 20, end: 24 }
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
          rcStock: 60,
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
          remark: "Produced first",
          phases: [
            { type: "building", start: 8, end: 12 },
            { type: "curing", start: 8, end: 14 },
            { type: "building", start: 0, end: 2 },
            { type: "shortage", start: 14, end: 18 }
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
          priority2: "B",
          priority3: "-",
          shift1Qty: 40,
          shift2Qty: 60,
          shift3Qty: 0,
          remark: "Second production",
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
          rcStock: 40,
          cureEst: "24:00",
          balanceOut: 60,
          buildTime1: "20:00 - 23:00",
          buildTime2: "-",
          buildTime3: "-",
          priority1: "C",
          priority2: "-",
          priority3: "-",
          shift1Qty: 0,
          shift2Qty: 30,
          shift3Qty: 0,
          remark: "Last production",
          phases: [
            { type: "building", start: 20, end: 23 },
            { type: "curing", start: 8, end: 11 },
            { type: "shortage", start: 11, end: 24 }
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
      <div className="px-4 mb-4 rounded-md py-2 font-semibold bg-sidebar border-b dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Select value={selectedCategoryNo} onValueChange={setSelectedCategoryNo}>
            <SelectTrigger className="w-[180px] h-8 font-semibold bg-background dark:border-slate-700">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {categoriesData.map((category) => (
                <SelectItem key={category.id} value={category.categoryNo.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-4 text-xs font-normal">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-blue-500"></div>
            <span className="dark:text-slate-300">Building</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-orange-400"></div>
            <span className="dark:text-slate-300">Curing</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-red-600"></div>
            <span className="dark:text-slate-300">Shortage</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-red-200"></div>
            <div className="w-3 h-3 rounded-sm bg-yellow-200"></div>
            <span className="dark:text-slate-300">Break Time</span>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      {(isLoadingCategories || isLoadingSchedules) ? (
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border dark:border-slate-800 rounded bg-sidebar shadow-sm overflow-hidden animate-pulse">
              <div className="px-4 py-2 bg-background/30 dark:bg-background/10 border-b dark:border-slate-800 flex justify-between items-center">
                <div className="h-5 w-32 bg-slate-200 dark:bg-slate-800 rounded"></div>
                <div className="h-5 w-20 bg-slate-200 dark:bg-slate-800 rounded"></div>
              </div>
              <div className="p-4 flex gap-4">
                <div className="w-1/2 space-y-2">
                  <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                  <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                  <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                </div>
                <div className="w-1/2 bg-slate-100 dark:bg-slate-900/50 rounded flex items-center justify-center">
                  <div className="w-full h-full p-4 space-y-4">
                    <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                    <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
                    <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : dashboardData.length > 0 ? (
        <ScheduleBoard data={dashboardData} shiftTime={shiftTime} />
      ) : (
        selectedCategoryNo && (
          // <div className="flex flex-col items-center justify-center py-20 text-muted-foreground bg-sidebar/50 rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-800">
          //   <p className="text-lg font-medium">Tidak ada schedule untuk category ini</p>
          //   <p className="text-sm">Silahkan pilih category lain atau buat schedule baru.</p>
          //   <Link href="/schedules/create" className="mt-2 text-md px-4 py-2 bg-primary text-white rounded-md cursor-pointer">
          //     Buat Schedule
          //   </Link>
          // </div>
          <ScheduleBoard data={dummyData} shiftTime={shiftTime} />
        )
      )}
    </div>
  );
}