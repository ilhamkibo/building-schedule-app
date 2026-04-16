"use client";

import ThemeToggleButton from "../common/ThemeToggle";
import { useEffect, useState } from "react";
import { SidebarTrigger } from "../ui/sidebar";
import { Separator } from "../ui/separator";
import { useShiftContext } from "@/context/shift-context";
import { isManualRefreshWindow } from "@/lib/shift-utils";

function formatTime(date: Date) {
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");

  return `${hh}:${mm}:${ss}`;
}

export default function AppHeader({ title = "Dashboard" }: { title: string }) {
  const { activeShift, shifts } = useShiftContext();
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [showRefreshBadge, setShowRefreshBadge] = useState(false);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(formatTime(now));
      setShowRefreshBadge(isManualRefreshWindow(shifts));
    };

    const updateDate = () => {
      const now = new Date();
      setDate(
        now.toLocaleDateString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "numeric",
          year: "numeric",
        }),
      );
    };

    updateDate();
    tick();
    const interval = setInterval(() => {
      updateDate();
      tick();
    }, 1000);
    return () => clearInterval(interval);
  }, [shifts]);

  return (
    <header className="bg-background sticky top-0 z-50 flex h-14 md:h-16 shrink-0 items-center gap-2 md:gap-3 border-b px-3 md:px-4">
      {/* LEFT */}
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="hidden sm:block mr-2 data-[orientation=vertical]:h-4"
      />

      {/* PAGE TITLE */}
      <h1 className="text-base md:text-lg font-sans font-semibold tracking-tight truncate max-w-[140px] sm:max-w-none">
        {title}
      </h1>

      {/* RIGHT */}
      <div className="ml-auto flex items-center gap-2 md:gap-4">
        {/* REALTIME CLOCK */}
        <div className="flex items-center gap-2 md:gap-4">
          {showRefreshBadge && (
            <div className="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-[10px] md:text-xs animate-pulse font-semibold whitespace-nowrap border border-green-200 dark:border-green-800">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]"></div>
              <span>Cut Off Time</span>
            </div>
          )}
          {activeShift && (
            <div className="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-[10px] md:text-xs animate-pulse font-semibold whitespace-nowrap">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-blue-500"></div>
              <span className="hidden sm:inline">Shift {activeShift}</span>
              <span className="sm:hidden">S{activeShift}</span>
            </div>
          )}
          <h1 className="hidden sm:flex m-0 p-0 flex-col items-end min-w-[80px] md:min-w-[100px]">
            <span className="text-sm md:text-md font-mono text-muted-foreground tabular-nums">
              {time}
            </span>
            <span className="text-xs md:text-sm font-semibold font-sans">{date}</span>
          </h1>
        </div>

        <ThemeToggleButton />
      </div>
    </header>
  );
}
