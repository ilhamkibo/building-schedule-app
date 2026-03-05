"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { useShifts } from "@/hooks/use-shift";
import { getCurrentShift } from "@/lib/shift-utils";
import { Shift } from "@/types/shift";

interface ShiftContextType {
    activeShift: number | null;
    shifts: Shift[];
    isLoading: boolean;
    refresh: () => void;
}

const ShiftContext = createContext<ShiftContextType | undefined>(undefined);

export function ShiftProvider({ children }: { children: React.ReactNode }) {
    const { data: shifts = [], isLoading, refetch } = useShifts();
    const [tick, setTick] = useState(0);

    // Recalculate shift every minute
    useEffect(() => {
        const timer = setInterval(() => {
            setTick((prev) => prev + 1);
        }, 60000);
        return () => clearInterval(timer);
    }, []);

    const activeShift = useMemo(() => {
        if (!shifts || shifts.length === 0) return null;
        return getCurrentShift(shifts);
    }, [shifts, tick]);

    const value = useMemo(() => ({
        activeShift,
        shifts,
        isLoading,
        refresh: () => refetch()
    }), [activeShift, shifts, isLoading, refetch]);

    return (
        <ShiftContext.Provider value={value}>
            {children}
        </ShiftContext.Provider>
    );
}

export function useShiftContext() {
    const context = useContext(ShiftContext);
    if (context === undefined) {
        throw new Error("useShiftContext must be used within a ShiftProvider");
    }
    return context;
}
