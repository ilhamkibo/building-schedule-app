"use client";

import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { PaginationMeta } from "@/types/pagination";

interface DataTablePaginationProps {
    pagination: PaginationMeta | undefined;
    setPage: (page: number | ((p: number) => number)) => void;
    setLimit: (limit: number) => void;
    isLoading?: boolean;
}

export function getPageNumbers(currentPage: number, totalPages: number) {
    const pages: number[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
    } else {
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage === totalPages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
    }

    return pages;
}

export default function DataTablePagination({
    pagination,
    setPage,
    setLimit,
    isLoading,
}: DataTablePaginationProps) {
    if (!pagination || isLoading) return null;

    return (
        <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
                <p className="text-sm font-medium">Rows per page</p>
                <Select
                    value={`${pagination.limit}`}
                    onValueChange={(value) => {
                        setLimit(Number(value));
                        setPage(1); // Reset to first page when limit changes
                    }}
                >
                    <SelectTrigger className="h-8 w-[70px]">
                        <SelectValue placeholder={pagination.limit} />
                    </SelectTrigger>
                    <SelectContent side="top">
                        {[10, 20, 30, 40, 50, 100].map((pageSize) => (
                            <SelectItem key={pageSize} value={`${pageSize}`}>
                                {pageSize}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <div className="text-sm text-muted-foreground ml-2">
                    Total {pagination.total} data
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    className="hidden h-8 w-8 p-0 lg:flex dark:bg-sidebar"
                    onClick={() => setPage(1)}
                    disabled={!pagination.hasPreviousPage}
                >
                    <span className="sr-only">Go to first page</span>
                    <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    className="h-8 w-8 p-0 dark:bg-sidebar"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={!pagination.hasPreviousPage}
                >
                    <span className="sr-only">Go to previous page</span>
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                {getPageNumbers(pagination.page, pagination.totalPages).map(
                    (pageNumber) => (
                        <Button
                            key={pageNumber}
                            variant={
                                pagination.page === pageNumber ? "default" : "outline"
                            }
                            className={`${pagination.page === pageNumber ? "bg-primary" : "dark:bg-sidebar"} h-8 w-8 p-0`}
                            onClick={() => setPage(pageNumber)}
                        >
                            {pageNumber}
                        </Button>
                    )
                )}

                <Button
                    variant="outline"
                    className="h-8 w-8 p-0 dark:bg-sidebar"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={!pagination.hasNextPage}
                >
                    <span className="sr-only">Go to next page</span>
                    <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    className="hidden h-8 w-8 p-0 lg:flex dark:bg-sidebar"
                    onClick={() => setPage(pagination.totalPages)}
                    disabled={!pagination.hasNextPage}
                >
                    <span className="sr-only">Go to last page</span>
                    <ChevronsRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
