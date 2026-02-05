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
import { CreateLineRequest, Line, UpdateLineRequest } from "../types/line";
import { lineService } from "@/services/line-service";

/**
 * Hook to fetch all Lines with pagination
 */
export function useLines(
    params?: PaginationParams,
    options?: Omit<
        UseQueryOptions<PaginatedResponse<Line>, AxiosError<ApiError>>,
        "queryKey" | "queryFn"
    >
) {
    const queryResult = useQuery<PaginatedResponse<Line>, AxiosError<ApiError>>({
        queryKey: ["lines", params],
        queryFn: () => lineService.getAll(params),
        ...options,
    });

    return {
        ...queryResult,
        data: queryResult.data?.data,
        pagination: queryResult.data?.pagination,
    };
}

/**
 * Hook to fetch a single Line by ID
 */
export function useLine(
    id: number,
    options?: Omit<UseQueryOptions<Line>, "queryKey" | "queryFn">
) {
    return useQuery({
        queryKey: ["lines", id],
        queryFn: () => lineService.getById(id),
        enabled: !!id,
        ...options,
    });
}

/**
 * Hook to create a new Line
 */
export function useCreateLine(options?: {
    onSuccess?: (data: Line) => void;
    onError?: (error: unknown) => void;
}) {
    const queryClient = useQueryClient();

    return useMutation<Line, AxiosError<ApiError>, CreateLineRequest>({
        mutationKey: ["lines", "create"],
        mutationFn: (payload) => lineService.create(payload),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["lines"] });
            toast.success("Line created successfully.");
            options?.onSuccess?.(data);
        },
        onError: (error) => {
            const errorMessage =
                error.response?.data?.message || "Failed to create Line.";
            toast.error(errorMessage);
            options?.onError?.(error);
        },
    });
}

/**
 * Hook to update an existing Line
 */
export function useUpdateLine(options?: {
    onSuccess?: (data: Line) => void;
    onError?: (error: unknown) => void;
}) {
    const queryClient = useQueryClient();

    return useMutation<
        Line,
        AxiosError<ApiError>,
        { id: number; data: UpdateLineRequest }
    >({
        mutationKey: ["lines", "update"],
        mutationFn: ({ id, data }) => lineService.update(id, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["lines"] });
            queryClient.invalidateQueries({ queryKey: ["lines", variables.id] });
            toast.success("Line updated successfully.");
            options?.onSuccess?.(data);
        },
        onError: (error) => {
            const errorMessage = error.message || "Failed to update Line.";
            toast.error(errorMessage);
            options?.onError?.(error);
        },
    });
}

/**
 * Hook to delete a Line
 */
export function useDeleteLine(options?: {
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
}) {
    const queryClient = useQueryClient();

    return useMutation<void, AxiosError<ApiError>, number>({
        mutationKey: ["lines", "delete"],
        mutationFn: (id) => lineService.delete(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ["lines"] });
            queryClient.removeQueries({ queryKey: ["lines", id] });
            toast.success("Line deleted successfully.");
            options?.onSuccess?.();
        },
        onError: (error) => {
            const errorMessage =
                error.response?.data?.message || "Failed to delete Line.";
            toast.error(errorMessage);
            options?.onError?.(error);
        },
    });
}
