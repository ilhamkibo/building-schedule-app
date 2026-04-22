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
import { CreateConfigRequest, Config, UpdateConfigRequest } from "../types/config";
import { configService } from "@/services/config-service";

/**
 * Hook to fetch all Configs with pagination
 */
export function useConfigs(
    params?: PaginationParams,
    options?: Omit<
        UseQueryOptions<PaginatedResponse<Config>, AxiosError<ApiError>>,
        "queryKey" | "queryFn"
    >
) {
    const queryResult = useQuery<PaginatedResponse<Config>, AxiosError<ApiError>>({
        queryKey: ["configs", params],
        queryFn: () => configService.getAll(params),
        ...options,
    });

    return {
        ...queryResult,
        data: queryResult.data?.data,
        pagination: queryResult.data?.pagination,
    };
}

/**
 * Hook to fetch a single Config by ID
 */
export function useConfig(
    id: number,
    options?: Omit<UseQueryOptions<Config>, "queryKey" | "queryFn">
) {
    return useQuery({
        queryKey: ["configs", id],
        queryFn: () => configService.getById(id),
        enabled: !!id,
        ...options,
    });
}

/**
 * Hook to create a new Config
 */
export function useCreateConfig(options?: {
    onSuccess?: (data: Config) => void;
    onError?: (error: unknown) => void;
}) {
    const queryClient = useQueryClient();

    return useMutation<Config, AxiosError<ApiError>, CreateConfigRequest>({
        mutationKey: ["configs", "create"],
        mutationFn: (payload) => configService.create(payload),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["configs"] });
            toast.success("Config created successfully.");
            options?.onSuccess?.(data);
        },
        onError: (error) => {
            const errorMessage =
                error.response?.data?.message || "Failed to create Config.";
            toast.error(errorMessage);
            options?.onError?.(error);
        },
    });
}

/**
 * Hook to update an existing Config
 */
export function useUpdateConfig(options?: {
    onSuccess?: (data: Config) => void;
    onError?: (error: unknown) => void;
}) {
    const queryClient = useQueryClient();

    return useMutation<
        Config,
        AxiosError<ApiError>,
        { id: number; data: UpdateConfigRequest }
    >({
        mutationKey: ["configs", "update"],
        mutationFn: ({ id, data }) => configService.update(id, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["configs"] });
            queryClient.invalidateQueries({ queryKey: ["configs", variables.id] });
            toast.success("Config updated successfully.");
            options?.onSuccess?.(data);
        },
        onError: (error) => {
            const errorMessage = error.message || "Failed to update Config.";
            toast.error(errorMessage);
            options?.onError?.(error);
        },
    });
}

/**
 * Hook to delete a Config
 */
export function useDeleteConfig(options?: {
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
}) {
    const queryClient = useQueryClient();

    return useMutation<void, AxiosError<ApiError>, number>({
        mutationKey: ["configs", "delete"],
        mutationFn: (id) => configService.delete(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ["configs"] });
            queryClient.removeQueries({ queryKey: ["configs", id] });
            toast.success("Config deleted successfully.");
            options?.onSuccess?.();
        },
        onError: (error) => {
            const errorMessage =
                error.response?.data?.message || "Failed to delete Config.";
            toast.error(errorMessage);
            options?.onError?.(error);
        },
    });
}
