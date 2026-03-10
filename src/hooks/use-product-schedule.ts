import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ApiError } from "@/types/api-response";
import { ProductSchedule, ProductScheduleParams } from "@/types/product-schedule";
import { productScheduleService } from "@/services/product-schedule-service";
import { PaginatedResponse } from "@/types/pagination";
import { ScheduleByDateAndLineNo } from "@/types/schedule";
import { ApiResponse } from "@/types/api-response";

export function useProductSchedules(
    params?: ProductScheduleParams,
    options?: Omit<
        UseQueryOptions<PaginatedResponse<ProductSchedule>, AxiosError<ApiError>, PaginatedResponse<ProductSchedule>, any>,
        "queryKey" | "queryFn"
    >
) {
    const queryResult = useQuery({
        queryKey: ["product-schedules", params],
        queryFn: () => productScheduleService.getAll(params),
        ...options,
    });

    return {
        ...queryResult,
        data: queryResult.data?.data || [],
        pagination: queryResult.data?.pagination,
    };
}

export function useProductScheduleByDateAndLineNo(
    date: string,
    lineNo: string,
    options?: Omit<
        UseQueryOptions<ApiResponse<ScheduleByDateAndLineNo>, AxiosError<ApiError>, ApiResponse<ScheduleByDateAndLineNo>, any>,
        "queryKey" | "queryFn"
    >
) {
    const queryResult = useQuery<ApiResponse<ScheduleByDateAndLineNo>, AxiosError<ApiError>>({
        queryKey: ["product-schedule-by-line-date", date, lineNo],
        queryFn: () => productScheduleService.getByDateAndLineNo(date, lineNo),
        ...options,
    });

    return {
        ...queryResult,
        data: queryResult.data?.data || [],
    };
}

