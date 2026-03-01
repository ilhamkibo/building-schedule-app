"use client";

import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search, Package, Calendar as CalendarIcon, FilterX } from "lucide-react";
import { useProductSchedules } from "@/hooks/use-product-schedule";
import { useCategories } from "@/hooks/use-category";
import DataTablePagination from "@/components/common/data-table-pagination";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function PPCList() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [dateFilter, setDateFilter] = useState("");
    const [categoryNoFilter, setLineIdFilter] = useState<string>("0");

    const { data: categories = [] } = useCategories({ paginate: false });

    /* debounce search */
    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 500);
        return () => clearTimeout(t);
    }, [search]);

    const handleReset = () => {
        setSearch("");
        setDateFilter("");
        setLineIdFilter("0");
        setPage(1);
    };

    const { data: productSchedules = [], pagination, isLoading } = useProductSchedules({
        page,
        limit,
        search: debouncedSearch || undefined,
        date: dateFilter ? dateFilter : undefined,
        categoryNo: categoryNoFilter !== "0" ? parseInt(categoryNoFilter) : undefined,
    });

    const formatDateString = (dateStr: string) => {
        if (!dateStr || dateStr.length !== 8) return dateStr;
        const year = dateStr.substring(0, 4);
        const month = dateStr.substring(4, 6);
        const day = dateStr.substring(6, 8);
        return `${day}/${month}/${year}`;
    };

    const formatDateTime = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            return new Intl.DateTimeFormat("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }).format(date);
        } catch (e) {
            return dateStr;
        }
    };

    return (
        <div className="space-y-4 mx-auto max-w-5xl animate-in fade-in duration-500">
            {/* Header / Filters */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative w-48">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground " />
                        <Input
                            placeholder="Search PPC..."
                            className="pl-9 dark:bg-sidebar"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="relative w-40">
                        <CalendarIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="date"
                            className="pl-9 dark:bg-sidebar"
                            value={dateFilter}
                            onChange={(e) => {
                                setDateFilter(e.target.value);
                                setPage(1);
                            }}
                        />
                    </div>

                    <Select
                        value={categoryNoFilter}
                        onValueChange={(val) => {
                            setLineIdFilter(val);
                            setPage(1);
                        }}
                    >
                        <SelectTrigger className="w-40 dark:bg-sidebar">
                            <SelectValue placeholder="All Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0">All Category</SelectItem>
                            {categories.map((category) => (
                                <SelectItem key={category.id} value={category.categoryNo.toString()}>
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {(search || dateFilter || categoryNoFilter !== "0") && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleReset}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        <FilterX className="h-4 w-4 mr-2" />
                        Reset
                    </Button>
                )}
            </div>

            {/* Table */}
            <div className="rounded-md border overflow-x-auto dark:bg-sidebar shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="whitespace-nowrap">Cat</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>MC</TableHead>
                            <TableHead>Size Code</TableHead>
                            <TableHead>Qty</TableHead>
                            <TableHead>Mold</TableHead>
                            {/* <TableHead>Updated At</TableHead> */}
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {isLoading && (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell className="px-4 py-4"><Skeleton className="h-6 w-12" /></TableCell>
                                    <TableCell className="py-4"><Skeleton className="h-6 w-24 mx-auto" /></TableCell>
                                    <TableCell className="py-4"><Skeleton className="h-6 w-8 mx-auto" /></TableCell>
                                    <TableCell className="py-4"><Skeleton className="h-6 w-20" /></TableCell>
                                    <TableCell className="py-4"><Skeleton className="h-6 w-16 mx-auto" /></TableCell>
                                    <TableCell className="py-4"><Skeleton className="h-6 w-8 mx-auto" /></TableCell>
                                    {/* <TableCell className="px-4 py-4"><Skeleton className="h-5 w-32 ml-auto" /></TableCell> */}
                                </TableRow>
                            ))
                        )}

                        {!isLoading && productSchedules.length === 0 && (
                            <TableRow>
                                <TableCell className="text-center py-10 text-muted-foreground" colSpan={7}>
                                    No product schedules found
                                </TableCell>
                            </TableRow>
                        )}

                        {productSchedules.map((schedule, index) => (
                            <TableRow key={`${schedule.sizeCode}-${index}`} className="hover:bg-muted/50 transition-colors">
                                <TableCell className="px-4 py-4">
                                    <Badge variant="secondary" className="font-bold">
                                        {schedule.cat}
                                    </Badge>
                                </TableCell>
                                <TableCell className="">
                                    {formatDateString(schedule.date)}
                                </TableCell>
                                <TableCell className="">
                                    <span className="px-2 py-0.5 bg-muted rounded text-xs">
                                        {schedule.mc}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <span className="font-mono font-bold">
                                        {schedule.sizeCode}
                                    </span>
                                </TableCell>
                                <TableCell className="">
                                    {schedule.qty.toLocaleString()}
                                </TableCell>
                                <TableCell className="">
                                    {schedule.mold}
                                </TableCell>
                                {/* <TableCell className="">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-medium">
                                            {formatDateTime(schedule.updatedAt).split(" ")[0]}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground uppercase">
                                            {formatDateTime(schedule.updatedAt).split(" ")[1]}
                                        </span>
                                    </div>
                                </TableCell> */}
                            </TableRow>
                        ))}
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
