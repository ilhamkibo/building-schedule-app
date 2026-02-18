"use client";

import { useState } from "react";
import ScheduleBoard from "@/components/pages/dashboard/ScheduleBoard";
import { PRODUCTION_LINES } from "@/components/pages/dashboard/dummy";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";

const STORAGE_KEY = "selected-production-line";

export default function Page() {
  const [selectedLineId, setSelectedLineId] = useState<string>("");

  useEffect(() => {
    const savedLineId = localStorage.getItem(STORAGE_KEY);
    if (savedLineId) {
      setSelectedLineId(savedLineId);
    } else {
      setSelectedLineId(PRODUCTION_LINES[0].id);
    }
  }, []);

  // simpan ke localStorage setiap berubah
  useEffect(() => {
    if (selectedLineId) {
      localStorage.setItem(STORAGE_KEY, selectedLineId);
    }
  }, [selectedLineId]);

  const selectedLine =
    PRODUCTION_LINES.find((l) => l.id === selectedLineId) ||
    PRODUCTION_LINES[0];

  return (
    <div className="p-4">
      <div className="px-4 mb-4 rounded-md py-2 font-semibold bg-sidebar border-b dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Select value={selectedLineId} onValueChange={setSelectedLineId}>
            <SelectTrigger className="w-[180px] h-8 font-semibold bg-background dark:border-slate-700">
              <SelectValue placeholder="Select Line" />
            </SelectTrigger>
            <SelectContent>
              {PRODUCTION_LINES.map((line) => (
                <SelectItem key={line.id} value={line.id}>
                  {line.name}
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
      <ScheduleBoard data={selectedLine.data} />
    </div>
  );
}
