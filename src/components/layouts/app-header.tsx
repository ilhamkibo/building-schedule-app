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
    <header className="bg-background sticky top-0 z-50 flex h-16 shrink-0 items-center gap-3 border-b px-4">
      {/* LEFT */}
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="mr-2 data-[orientation=vertical]:h-4"
      />

      {/* PAGE TITLE */}
      <h1 className="text-lg font-sans font-semibold tracking-tight">
        {title}
      </h1>

      {/* RIGHT */}
      <div className="ml-auto flex items-center gap-4">
        {/* REALTIME CLOCK */}
        <div className="flex items-center gap-4">
          {activeShift && (
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs animate-pulse font-semibold">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span>Shift {activeShift}</span>
            </div>
          )}
          <h1 className="m-0 p-0 flex flex-col items-start min-w-[100px]">
            <span className="text-md font-mono text-muted-foreground tabular-nums">
              {time}
            </span>
            <span className="text-sm font-semibold font-sans">{date}</span>
          </h1>
        </div>

        <ThemeToggleButton />
      </div>
    </header>
  );
}
