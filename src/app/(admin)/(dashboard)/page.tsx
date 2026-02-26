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

const STORAGE_KEY = "selected-category-no";

export default function Page() {
  const [selectedCategoryNo, setSelectedCategoryNo] = useState<string>("");
  const { open } = useSidebar();

  const { data: categoriesData, isLoading: isLoadingCategories } = useCategories({ limit: 100 });
  const categories = categoriesData || [];

  useEffect(() => {
    const savedCategoryNo = localStorage.getItem(STORAGE_KEY);
    if (savedCategoryNo) {
      setSelectedCategoryNo(savedCategoryNo);
    } else if (categories.length > 0) {
      setSelectedCategoryNo(categories[0].categoryNo.toString());
    }
  }, [categories]);

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
  console.log("🚀 ~ Page ~ scheduleData:", scheduleData)

  const timeToDecimal = (dateStr: string | null, baseDateStr: string) => {
    if (!dateStr) return 0;
    const date = new Date(dateStr);
    const baseDate = new Date(baseDateStr);
    baseDate.setHours(0, 0, 0, 0);

    // Difference in hours relative to the start of the base date
    const diffMs = date.getTime() - baseDate.getTime();
    return diffMs / (1000 * 60 * 60);
  };

  const dashboardData = useMemo(() => {
    if (!scheduleData) return [];

    const scheduleDate = scheduleData.date;

    return scheduleData.details.map(m => ({
      id: m.machineNo,
      machine: m.machineNo,
      shift: "All Shifts",
      rows: m.details.map(d => ({
        code: d.codeNo,
        rim: d.rim,
        rcStock: d.stockRc,
        cureEst: d.cureEst,
        balanceOut: d.bo,
        buildTime: d.buildingStart && d.buildingFinish
          ? `${new Date(d.buildingStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(d.buildingFinish).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
          : "-",
        shift1Qty: d.shift1Qty,
        shift2Qty: d.shift2Qty,
        shift3Qty: d.shift3Qty,
        phases: d.timelines.map(t => ({
          type: t.processType.toLowerCase(),
          start: timeToDecimal(t.startTime, scheduleDate),
          end: timeToDecimal(t.endTime, scheduleDate)
        }))
      }))
    }));
  }, [scheduleData]);

  return (
    <div
      className={`p-4 ${open
        ? "max-w-[calc(100vw-20rem)]"
        : "max-w-full"
        }`}
    >      <div className="px-4 mb-4 rounded-md py-2 font-semibold bg-sidebar border-b dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Select value={selectedCategoryNo} onValueChange={setSelectedCategoryNo}>
            <SelectTrigger className="w-[180px] h-8 font-semibold bg-background dark:border-slate-700">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.categoryNo.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {(isLoadingCategories || isLoadingSchedules) && <span className="text-xs text-muted-foreground animate-pulse">Loading...</span>}
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
            <div className="w-3 h-3 rounded-sm bg-yellow-300"></div>
            <span className="dark:text-slate-300">Idle</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-pink-400"></div>
            <span className="dark:text-slate-300">Buffer</span>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      {dashboardData.length > 0 ? (
        <ScheduleBoard data={dashboardData} />
      ) : (
        !isLoadingSchedules && selectedCategoryNo && (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground bg-sidebar/50 rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-800">
            <p className="text-lg font-medium">Tidak ada schedule untuk category ini</p>
            <p className="text-sm">Silahkan pilih category lain atau buat schedule baru.</p>
          </div>
        )
      )}
    </div>
  );
}