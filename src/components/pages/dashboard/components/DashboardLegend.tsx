"use client";

import React from "react";

export function DashboardLegend() {
    return (
        <div className="flex flex-wrap items-center gap-4 text-xs font-normal">
            <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-blue-500 shadow-sm"></div>
                <span className="text-slate-600 dark:text-slate-300">Building</span>
            </div>
            <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-orange-400 shadow-sm"></div>
                <span className="text-slate-600 dark:text-slate-300">Curing</span>
            </div>
            <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-emerald-500 shadow-sm"></div>
                <span className="text-slate-600 dark:text-slate-300">Add R/C</span>
            </div>
            <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-red-600 shadow-sm"></div>
                <span className="text-slate-600 dark:text-slate-300">Shortage</span>
            </div>
            <div className="flex items-center gap-1.5">
                <div className="flex gap-0.5">
                    <div className="w-3 h-3 rounded-sm bg-red-200 shadow-sm"></div>
                    <div className="w-3 h-3 rounded-sm bg-yellow-200 shadow-sm"></div>
                </div>
                <span className="text-slate-600 dark:text-slate-300">Break Time</span>
            </div>
        </div>
    );
}
