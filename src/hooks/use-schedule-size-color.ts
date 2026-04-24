"use client";

import {
    useQuery,
    useMutation,
    useQueryClient,
    UseQueryOptions,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ApiError } from "../types/api-response";
import { toast } from "sonner";
import { PaginatedResponse, PaginationParams } from "../types/pagination";
import {
    ScheduleSizeColor,
    CreateScheduleSizeColorRequest,
    UpdateScheduleSizeColorRequest,
} from "@/types/schedule-size-color";
import { scheduleSizeColorService } from "@/services/schedule-size-color-service";

const QUERY_KEY = "schedule-size-colors";

/**
 * Hook to fetch all ScheduleSizeColors with pagination
 */
export function useScheduleSizeColors(
    params?: PaginationParams,
    options?: Omit<
        UseQueryOptions<PaginatedResponse<ScheduleSizeColor>, AxiosError<ApiError>>,
        "queryKey" | "queryFn"
    >
) {
    const queryResult = useQuery<PaginatedResponse<ScheduleSizeColor>, AxiosError<ApiError>>({
        queryKey: [QUERY_KEY, params],
        queryFn: () => scheduleSizeColorService.getAll(params),
        ...options,
    });

    return {
        ...queryResult,
        data: queryResult.data?.data,
        pagination: queryResult.data?.pagination,
    };
}

/**
 * Hook to fetch a single ScheduleSizeColor by ID
 */
export function useScheduleSizeColor(
    id: number,
    options?: Omit<UseQueryOptions<ScheduleSizeColor>, "queryKey" | "queryFn">
) {
    return useQuery({
        queryKey: [QUERY_KEY, id],
        queryFn: () => scheduleSizeColorService.getById(id),
        enabled: !!id,
        ...options,
    });
}

/**
 * Hook to create a new ScheduleSizeColor
 */
export function useCreateScheduleSizeColor(options?: {
    onSuccess?: (data: ScheduleSizeColor) => void;
    onError?: (error: unknown) => void;
}) {
    const queryClient = useQueryClient();

    return useMutation<ScheduleSizeColor, AxiosError<ApiError>, CreateScheduleSizeColorRequest>({
        mutationKey: [QUERY_KEY, "create"],
        mutationFn: (payload) => scheduleSizeColorService.create(payload),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
            toast.success("Color created successfully.");
            options?.onSuccess?.(data);
        },
        onError: (error) => {
            const errorMessage =
                error.response?.data?.message || "Failed to create color.";
            toast.error(errorMessage);
            options?.onError?.(error);
        },
    });
}

/**
 * Hook to update an existing ScheduleSizeColor
 */
export function useUpdateScheduleSizeColor(options?: {
    onSuccess?: (data: ScheduleSizeColor) => void;
    onError?: (error: unknown) => void;
}) {
    const queryClient = useQueryClient();

    return useMutation<
        ScheduleSizeColor,
        AxiosError<ApiError>,
        { id: number; data: UpdateScheduleSizeColorRequest }
    >({
        mutationKey: [QUERY_KEY, "update"],
        mutationFn: ({ id, data }) => scheduleSizeColorService.update(id, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY, variables.id] });
            toast.success("Color updated successfully.");
            options?.onSuccess?.(data);
        },
        onError: (error) => {
            const errorMessage = error.message || "Failed to update color.";
            toast.error(errorMessage);
            options?.onError?.(error);
        },
    });
}

/**
 * Hook to delete a ScheduleSizeColor
 */
export function useDeleteScheduleSizeColor(options?: {
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
}) {
    const queryClient = useQueryClient();

    return useMutation<void, AxiosError<ApiError>, number>({
        mutationKey: [QUERY_KEY, "delete"],
        mutationFn: (id) => scheduleSizeColorService.delete(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
            queryClient.removeQueries({ queryKey: [QUERY_KEY, id] });
            toast.success("Color deleted successfully.");
            options?.onSuccess?.();
        },
        onError: (error) => {
            const errorMessage =
                error.response?.data?.message || "Failed to delete color.";
            toast.error(errorMessage);
            options?.onError?.(error);
        },
    });
}
