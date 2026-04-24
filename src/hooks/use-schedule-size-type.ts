"use client";

import {
    useQuery,
    UseQueryOptions,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ApiError } from "../types/api-response";
import { PaginatedResponse, PaginationParams } from "../types/pagination";
import { ScheduleSizeType } from "@/types/schedule-size-type";
import { scheduleSizeTypeService } from "@/services/schedule-size-type-service";

const QUERY_KEY = "schedule-size-types";

/**
 * Hook to fetch all ScheduleSizeTypes with pagination
 */
export function useScheduleSizeTypes(
    params?: PaginationParams,
    options?: Omit<
        UseQueryOptions<PaginatedResponse<ScheduleSizeType>, AxiosError<ApiError>>,
        "queryKey" | "queryFn"
    >
) {
    const queryResult = useQuery<PaginatedResponse<ScheduleSizeType>, AxiosError<ApiError>>({
        queryKey: [QUERY_KEY, params],
        queryFn: () => scheduleSizeTypeService.getAll(params),
        ...options,
    });

    return {
        ...queryResult,
        data: queryResult.data?.data,
        pagination: queryResult.data?.pagination,
    };
}
