"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ApiError } from "../types/api-response";
import { PaginatedResponse, PaginationParams } from "../types/pagination";
import { CuringEfficiency } from "@/types/curing-efficiency";
import { curingEfficiencyService } from "@/services/curing-efficiency-service";

export function useCuringEfficiencies(
    params?: PaginationParams,
    options?: Omit<
        UseQueryOptions<PaginatedResponse<CuringEfficiency>, AxiosError<ApiError>>,
        "queryKey" | "queryFn"
    >
) {
    const queryResult = useQuery<PaginatedResponse<CuringEfficiency>, AxiosError<ApiError>>({
        queryKey: ["curing-efficiencies", params],
        queryFn: () => curingEfficiencyService.getAll(params),
        ...options,
    });

    return {
        ...queryResult,
        data: queryResult.data?.data,
        pagination: queryResult.data?.pagination,
    };
}
