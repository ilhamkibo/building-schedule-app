"use client";
import { useState, useEffect, useMemo, useCallback } from "react";

import ScheduleBoard from "@/components/pages/dashboard/ScheduleBoard";
import { useSidebar } from "@/components/ui/sidebar";
import { useLines } from "@/hooks/use-line";
import { useTodayLineSchedule, useUpdateTimeline } from "@/hooks/use-schedule";
import { useRealtimeBO, useRealtimeRCStock, useSizeColors } from "@/hooks/use-product";
import { useShiftContext } from "@/context/shift-context";
import { TodayLineSchedule, ScheduleLineDetailToday, SchedulePhase } from "@/types/schedule";
import { DashboardFilterBar } from "@/components/pages/dashboard/components/DashboardFilterBar";
import { DashboardSkeleton } from "@/components/pages/dashboard/components/DashboardSkeleton";
import { DashboardEditScheduleModal } from "@/components/pages/dashboard/components/DashboardEditScheduleModal";
import Link from "next/link";
import { getNextShiftInfo, isManualRefreshWindow } from "@/lib/shift-utils";
import { useAuthContext } from "@/context/auth-context";

const STORAGE_KEY = "selected-line-no";

export default function Page() {
  const [selectedLineNo, setSelectedLineNo] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toLocaleDateString('en-CA')
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [lastAutoRefresh, setLastAutoRefresh] = useState<string | null>(null);

  const { user } = useAuthContext();
  const isGuest = !user || user.role?.toLowerCase() === "viewer";

  const { open } = useSidebar();
  const { shifts: shiftTime, isLoading: isLoadingShiftTime } = useShiftContext();
  const { data: linesData = [], isLoading: isLoadingLines } = useLines({ limit: 100 });
  const { mutate: updateTimeline, isPending: isUpdatingTimeline } = useUpdateTimeline();

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

  const { data: scheduleResponse, isLoading: isLoadingSchedules, refetch: refetchSchedules } = useTodayLineSchedule(
    parseInt(selectedLineNo),
    selectedDate,
    { enabled: !!selectedLineNo && !!selectedDate }
  );

  const scheduleData = scheduleResponse?.data;

  // Refresh Logic
  const handleRefresh = useCallback((targetShiftNo?: number) => {
    if (!scheduleData || scheduleData.length === 0) return;

    let shiftNo = targetShiftNo;
    if (!shiftNo) {
      const nextInfo = getNextShiftInfo(shiftTime);
      if (nextInfo) shiftNo = nextInfo.nextShift.shiftNo;
    }

    if (!shiftNo) return;

    const scheduleId = scheduleData[0].scheduleId;

    updateTimeline(
      { scheduleId, shiftNo },
      {
        onSuccess: () => {
          refetchSchedules();
        }
      }
    );
  }, [scheduleData, shiftTime, updateTimeline, refetchSchedules]);

  // Only allow auto-refresh when selectedDate is today
  const isSelectedDateToday = useMemo(() => {
    const today = new Date().toLocaleDateString('en-CA');
    return selectedDate === today;
  }, [selectedDate]);

  useEffect(() => {
    if (!isSelectedDateToday) return; // Only auto-refresh for today's schedule
    if (!shiftTime || shiftTime.length === 0 || !scheduleData || scheduleData.length === 0) return;

    const interval = setInterval(() => {
      const now = new Date();
      const nextInfo = getNextShiftInfo(shiftTime);
      if (!nextInfo) return;

      const { nextShift, startTime } = nextInfo;
      const diffMinutes = (startTime.getTime() - now.getTime()) / (1000 * 60);

      // Auto Refresh Trigger: 15, 30, 45, 60 minutes before shift starts
      const triggerPoints = [15, 30, 45, 60];
      const matchingPoint = triggerPoints.find(p => Math.abs(diffMinutes - p) < 0.25); // 15 seconds tolerance

      if (matchingPoint) {
        const triggerId = `${nextShift.shiftNo}-${matchingPoint}-${now.getHours()}:${now.getMinutes()}`;
        if (lastAutoRefresh !== triggerId) {
          console.log(`Auto Refresh Triggered at ${matchingPoint} minutes before Shift ${nextShift.shiftNo}`);
          handleRefresh(nextShift.shiftNo);
          setLastAutoRefresh(triggerId);
        }
      }
    }, 15000); // Check every 15 seconds for more precision

    return () => clearInterval(interval);
  }, [shiftTime, scheduleData, lastAutoRefresh, handleRefresh, isSelectedDateToday]);

  const canManualRefresh = useMemo(() => {
    if (!isSelectedDateToday) return false; // Only allow manual refresh for today's schedule
    return isManualRefreshWindow(shiftTime);
  }, [shiftTime, isSelectedDateToday]);

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
  const baseDashboardData = useMemo(() => {
    if (!scheduleData || !Array.isArray(scheduleData)) return [];

    const shift1 = shiftTime?.find((s) => s.shiftNo === 1);
    const shift1StartStr = shift1?.startTime || "08:00:00";
    const validStart = new Date(`${selectedDate}T${shift1StartStr}`);
    const validEnd = new Date(validStart.getTime() + 24 * 60 * 60 * 1000);

    return (scheduleData as TodayLineSchedule[]).map((m: TodayLineSchedule) => ({
      id: m.machine || m.id?.toString(),
      machine: m.machine,
      scheduleId: m.scheduleId,
      scheduleCode: m.scheduleCode,
      shift: m.shift || "All Shifts",
      rows: (m.rows || []).map((row: ScheduleLineDetailToday) => {
        const validPhases = (row.phases || []).filter((p: SchedulePhase) => {
          if (!p.start || typeof p.start !== "string") return true;

          const phaseDate = new Date(p.start);
          if (isNaN(phaseDate.getTime())) return true;

          return phaseDate.getTime() >= validStart.getTime() && phaseDate.getTime() <= validEnd.getTime();
        });

        return {
          ...row,
          totalQty: (row.shift1Qty.reduce((a, b) => a + b, 0) || 0) + (row.shift2Qty.reduce((a, b) => a + b, 0) || 0) + (row.shift3Qty.reduce((a, b) => a + b, 0) || 0),
          phases: validPhases.map((p: SchedulePhase) => ({
            ...p,
            start: typeof p.start === "string" ? timeToDecimal(p.start) : p.start,
            end: typeof p.end === "string" ? timeToDecimal(p.end) : p.end,
          })),
        };
      }),
    }));
  }, [scheduleData, scheduleResponse, selectedDate, shiftTime]);

  const uniqueCodes = useMemo(() => {
    const codes = new Set<string>();
    baseDashboardData.forEach(m => {
      m.rows.forEach(r => {
        if (r.code) codes.add(r.code);
      });
    });
    return Array.from(codes);
  }, [baseDashboardData]);

  const { data: realtimeBOData } = useRealtimeBO(uniqueCodes, selectedDate);
  const { data: realtimeRCStockData } = useRealtimeRCStock(uniqueCodes);
  const { data: sizeColorsData } = useSizeColors(uniqueCodes);

  const dashboardData = useMemo(() => {
    if ((!realtimeBOData || realtimeBOData.length === 0) && (!realtimeRCStockData || realtimeRCStockData.length === 0) && (!sizeColorsData || sizeColorsData.length === 0)) {
      return baseDashboardData;
    }

    return baseDashboardData.map(m => ({
      ...m,
      rows: m.rows.map(r => {
        const boData = realtimeBOData?.find(bo => bo.sizeCode === r.code);
        const rcStockData = realtimeRCStockData?.find(rc => rc.sizeCode === r.code);
        const colorData = sizeColorsData?.find(c => c.sizeCode === r.code);
        return {
          ...r,
          balanceOut: boData?.realtimeBo !== null && boData?.realtimeBo !== undefined ? boData.realtimeBo : r.balanceOut,
          rcStock: rcStockData?.stockRcQty ?? r.rcStock,
          colors: colorData
            ? { textColor: colorData.textColorHex, bgColor: colorData.backgroundColorHex }
            : { textColor: "#000", bgColor: "#fff" },
        };
      })
    }));
  }, [baseDashboardData, realtimeBOData, realtimeRCStockData, sizeColorsData]);

  return (
    <div
      className={`p-4 ${open
        ? "md:max-w-[calc(100vw-19rem)] max-w-full"
        : "max-w-full"
        }`}
    >
      <DashboardFilterBar
        selectedLineNo={selectedLineNo}
        onLineNoChange={setSelectedLineNo}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        lines={linesData}
        onEditClick={!isGuest && dashboardData.length > 0 ? () => setIsEditModalOpen(true) : undefined}
        onRefreshClick={isSelectedDateToday ? () => handleRefresh() : undefined}
        isRefreshing={isUpdatingTimeline}
        canRefresh={canManualRefresh && dashboardData.length > 0}
      />

      <DashboardEditScheduleModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        lineNo={selectedLineNo}
        date={selectedDate}
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
            <Link href="/schedules/adjust" className="mt-2 text-md px-4 py-2 bg-primary text-white dark:text-black rounded-md cursor-pointer">
              Buat Schedule
            </Link>
          </div>
        )
      )}
    </div>
  );
}
