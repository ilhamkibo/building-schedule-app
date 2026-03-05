"use client";

import React from "react";

export function DashboardSkeleton() {
    return (
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
    );
}
