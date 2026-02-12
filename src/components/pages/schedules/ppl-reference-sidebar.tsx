"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { PPL } from "@/types/ppl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FormCombobox } from "@/components/ui/form-combobox";

interface PPLReferenceSidebarProps {
    ppls: PPL[] | undefined;
}

export default function PPLReferenceSidebar({ ppls }: PPLReferenceSidebarProps) {
    const [filterMachine, setFilterMachine] = useState<string | undefined>();
    const [filterCode, setFilterCode] = useState<string | undefined>();
    const [filterRim, setFilterRim] = useState<string | undefined>();
    const [filterBuild, setFilterBuild] = useState<string | undefined>();

    const machineOptions = Array.from(
        new Set(ppls?.flatMap(p => p.typeMC) || [])
    ).sort().map(mc => ({
        id: mc,
        name: mc
    }));

    const codeOptions = Array.from(
        new Set(ppls?.map(p => p.tireCode) || [])
    ).sort().map(code => ({
        id: code,
        name: code
    }));

    const rimOptions = Array.from(
        new Set(ppls?.map(p => p.rim) || [])
    ).sort().map(rim => ({
        id: rim,
        name: rim
    }));

    const buildOptions = Array.from(
        new Set(ppls?.map(p => p.build) || [])
    ).sort().map(build => ({
        id: build,
        name: build
    }));

    const filteredPPLs = ppls?.filter(p => {
        if (filterMachine && !p.typeMC.includes(filterMachine)) return false;
        if (filterCode && p.tireCode !== filterCode) return false;
        if (filterRim && p.rim !== filterRim) return false;
        if (filterBuild && p.build !== filterBuild) return false;
        return true;
    });

    const resetFilters = () => {
        setFilterMachine(undefined);
        setFilterCode(undefined);
        setFilterRim(undefined);
        setFilterBuild(undefined);
    };

    return (
        <>
            <div className="px-3 py-2 border-b bg-background/80 sticky top-0 z-10">
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold flex items-center gap-2">
                        <Search className="h-3.5 w-3.5 text-primary" />
                        PPL Reference
                    </h2>
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0">
                        {filteredPPLs?.length || 0} Entries
                    </Badge>
                </div>
            </div>

            {/* Filters */}
            <div className="p-2 border-b bg-muted/20 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                    <FormCombobox
                        value={filterMachine}
                        onChange={setFilterMachine}
                        options={machineOptions}
                        placeholder="Machine"
                        searchPlaceholder="Search Machine..."
                        emptyText="No machine found"
                        className="h-8 text-[10px]"
                    />

                    <FormCombobox
                        value={filterCode}
                        onChange={setFilterCode}
                        options={codeOptions}
                        placeholder="Tire Code"
                        searchPlaceholder="Search Code..."
                        emptyText="No code found"
                        className="h-8 text-[10px]"
                    />

                    <FormCombobox
                        value={filterRim}
                        onChange={setFilterRim}
                        options={rimOptions}
                        placeholder="Rim"
                        searchPlaceholder="Search Rim..."
                        emptyText="No rim found"
                        className="h-8 text-[10px]"
                    />

                    <FormCombobox
                        value={filterBuild}
                        onChange={setFilterBuild}
                        options={buildOptions}
                        placeholder="Build"
                        searchPlaceholder="Search Build..."
                        emptyText="No build found"
                        className="h-8 text-[10px]"
                    />
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    className="w-full h-7 text-[10px]"
                    onClick={resetFilters}
                >
                    Reset Filter
                </Button>
            </div>

            {/* Content Table */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {!filteredPPLs || filteredPPLs.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground italic text-xs">
                        No PPL data matches filters.
                    </div>
                ) : (
                    <table className="w-full border-collapse">
                        <thead className="sticky top-0 bg-muted/50 text-[9px] uppercase text-muted-foreground border-b z-10">
                            <tr>
                                <th className="px-2 py-1.5 text-left font-semibold">Tire / Build</th>
                                <th className="px-2 py-1.5 text-center font-semibold">Rim</th>
                                <th className="px-2 py-1.5 text-center font-semibold">Qty</th>
                                <th className="px-2 py-1.5 text-center font-semibold">UPH</th>
                                <th className="px-2 py-1.5 text-left font-semibold">Mold/Stk</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y bg-background/30">
                            {filteredPPLs.map((ppl) => (
                                <tr
                                    key={ppl.id}
                                    className="hover:bg-primary/5 transition-colors cursor-default"
                                >
                                    <td className="px-2 py-2">
                                        <div className="font-bold text-primary truncate max-w-[120px]" title={ppl.tireCode}>
                                            {ppl.tireCode}
                                        </div>
                                        <div className="text-[9px] text-muted-foreground font-medium">
                                            {ppl.build}
                                        </div>
                                    </td>

                                    <td className="px-2 py-2 text-center text-muted-foreground font-medium">
                                        {ppl.rim}
                                    </td>

                                    <td className="px-2 py-2 text-center font-bold text-orange-600">
                                        {ppl.qty}
                                    </td>

                                    <td className="px-2 py-2 text-center text-muted-foreground">
                                        {ppl.uph}
                                    </td>

                                    <td className="px-2 py-2 text-[10px]">
                                        <div className="flex flex-col">
                                            <span>M: {ppl.mold}</span>
                                            <span>S: {ppl.moldStock}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
}
