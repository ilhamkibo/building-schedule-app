import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ApiError } from "@/types/api-response";
import { ProductSchedule, ProductScheduleParams } from "@/types/product-schedule";
import { productScheduleService } from "@/services/product-schedule-service";
import { PaginatedResponse } from "@/types/pagination";
import { ScheduleByDateAndCategoryNo } from "@/types/schedule";
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

export function useProductScheduleByDateAndCategoryNo(
    date: string,
    categoryNo: string,
    options?: Omit<
        UseQueryOptions<ApiResponse<ScheduleByDateAndCategoryNo>, AxiosError<ApiError>, ApiResponse<ScheduleByDateAndCategoryNo>, any>,
        "queryKey" | "queryFn"
    >
) {
    const queryResult = useQuery<ApiResponse<ScheduleByDateAndCategoryNo>, AxiosError<ApiError>>({
        queryKey: ["product-schedule-by-date-category", date, categoryNo],
        queryFn: () => productScheduleService.getByDateAndCategoryNo(date, categoryNo),
        ...options,
    });

    return {
        ...queryResult,
        data: queryResult.data?.data || [],
    };
}

