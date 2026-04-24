"use client";

import { useEffect, useMemo, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useScheduleSizeTypes } from "@/hooks/use-schedule-size-type";
import { useScheduleSizeColors } from "@/hooks/use-schedule-size-color";
import DataTablePagination from "@/components/common/data-table-pagination";
import { Skeleton } from "@/components/ui/skeleton";

export default function ScheduleSizeTypeList() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    /* debounce search */
    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 500);
        return () => clearTimeout(t);
    }, [search]);

    const { data: sizeTypes = [], pagination, isLoading } = useScheduleSizeTypes({
        page,
        limit,
        search: debouncedSearch,
    });

    // Fetch all colors (unpaginated) to map typeCode → color info
    const { data: colors = [] } = useScheduleSizeColors({ paginate: false });

    const colorMap = useMemo(() => {
        const map = new Map<string, { typeName: string; textColorHex: string; backgroundColorHex: string }>();
        for (const c of colors) {
            map.set(c.typeCode, {
                typeName: c.typeName,
                textColorHex: c.textColorHex,
                backgroundColorHex: c.backgroundColorHex,
            });
        }
        return map;
    }, [colors]);

    return (
        <div className="space-y-4 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="relative w-72">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search size code..."
                        className="pl-9 dark:bg-sidebar"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="rounded-md border dark:bg-sidebar overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">No</TableHead>
                            <TableHead>Size Code</TableHead>
                            <TableHead>Type Code</TableHead>
                            <TableHead>Color</TableHead>
                            <TableHead>Created At</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {isLoading && (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-6 w-8" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-28" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                                </TableRow>
                            ))
                        )}

                        {!isLoading && sizeTypes.length === 0 && (
                            <TableRow>
                                <TableCell className="text-center" colSpan={5}>No size types found</TableCell>
                            </TableRow>
                        )}

                        {sizeTypes.map((item, index) => {
                            const color = colorMap.get(item.typeCode);
                            return (
                                <TableRow key={`${item.sizeCode}-${item.typeCode}`}>
                                    <TableCell className="text-center">
                                        {(page - 1) * limit + index + 1}
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs font-semibold">
                                            {item.sizeCode}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs">
                                            {item.typeCode}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {color ? (
                                            <span
                                                className="inline-block rounded px-3 py-1 text-xs font-semibold border"
                                                style={{
                                                    color: color.textColorHex,
                                                    backgroundColor: color.backgroundColorHex,
                                                }}
                                            >
                                                {color.typeName}
                                            </span>
                                        ) : (
                                            <span className="text-muted-foreground text-xs italic">
                                                No color assigned
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-muted-foreground text-sm">
                                            {new Date(item.createdAt).toLocaleDateString("id-ID", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>

            <DataTablePagination
                pagination={pagination}
                setPage={setPage}
                setLimit={setLimit}
                isLoading={isLoading}
            />
        </div>
    );
}
