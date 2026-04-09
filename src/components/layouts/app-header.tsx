"use client";

import ThemeToggleButton from "../common/ThemeToggle";
import { useEffect, useState } from "react";
import { SidebarTrigger } from "../ui/sidebar";
import { Separator } from "../ui/separator";
import { useShiftContext } from "@/context/shift-context";

function formatTime(date: Date) {
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");

  return `${hh}:${mm}:${ss}`;
}

export default function AppHeader({ title = "Dashboard" }: { title: string }) {
  const { activeShift } = useShiftContext();
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const tick = () => setTime(formatTime(new Date()));

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
  }, []);

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
