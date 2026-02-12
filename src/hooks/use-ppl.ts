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
import { PaginatedResponse } from "../types/pagination";
import { pplService } from "@/services/ppl-service";
import { PPL, CreatePPLRequest, UpdatePPLRequest, PPLParams } from "@/types/ppl";

/**
 * Hook to fetch all PPLs with pagination
 */
export function usePPLs(
    params?: PPLParams,
    options?: Omit<
        UseQueryOptions<PaginatedResponse<PPL>, AxiosError<ApiError>>,
        "queryKey" | "queryFn"
    >
) {
    const queryResult = useQuery<PaginatedResponse<PPL>, AxiosError<ApiError>>({
        queryKey: ["ppls", params],
        queryFn: () => pplService.getAll(params),
        ...options,
    });

    return {
        ...queryResult,
        data: queryResult.data?.data,
        pagination: queryResult.data?.pagination,
    };
}

/**
 * Hook to fetch a single PPL by ID
 */
export function usePPL(
    id: number,
    options?: Omit<UseQueryOptions<PPL>, "queryKey" | "queryFn">
) {
    return useQuery({
        queryKey: ["ppls", id],
        queryFn: () => pplService.getById(id),
        enabled: !!id,
        ...options,
    });
}

/**
 * Hook to create a new PPL
 */
export function useCreatePPL(options?: {
    onSuccess?: (data: PPL) => void;
    onError?: (error: unknown) => void;
}) {
    const queryClient = useQueryClient();

    return useMutation<PPL, AxiosError<ApiError>, CreatePPLRequest>({
        mutationKey: ["ppls", "create"],
        mutationFn: (payload) => pplService.create(payload),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["ppls"] });
            toast.success("PPL entry created successfully.");
            options?.onSuccess?.(data);
        },
        onError: (error) => {
            const errorMessage =
                error.response?.data?.message || "Failed to create PPL entry.";
            toast.error(errorMessage);
            options?.onError?.(error);
        },
    });
}

/**
 * Hook to update an existing PPL
 */
export function useUpdatePPL(options?: {
    onSuccess?: (data: PPL) => void;
    onError?: (error: unknown) => void;
}) {
    const queryClient = useQueryClient();

    return useMutation<
        PPL,
        AxiosError<ApiError>,
        { id: number; data: UpdatePPLRequest }
    >({
        mutationKey: ["ppls", "update"],
        mutationFn: ({ id, data }) => pplService.update(id, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["ppls"] });
            queryClient.invalidateQueries({ queryKey: ["ppls", variables.id] });
            toast.success("PPL entry updated successfully.");
            options?.onSuccess?.(data);
        },
        onError: (error) => {
            const errorMessage =
                error.response?.data?.message || "Failed to update PPL entry.";
            toast.error(errorMessage);
            options?.onError?.(error);
        },
    });
}

/**
 * Hook to delete a PPL
 */
export function useDeletePPL(options?: {
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
}) {
    const queryClient = useQueryClient();

    return useMutation<void, AxiosError<ApiError>, number>({
        mutationKey: ["ppls", "delete"],
        mutationFn: (id) => pplService.delete(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ["ppls"] });
            queryClient.removeQueries({ queryKey: ["ppls", id] });
            toast.success("PPL entry deleted successfully.");
            options?.onSuccess?.();
        },
        onError: (error) => {
            const errorMessage =
                error.response?.data?.message || "Failed to delete PPL entry.";
            toast.error(errorMessage);
            options?.onError?.(error);
        },
    });
}
