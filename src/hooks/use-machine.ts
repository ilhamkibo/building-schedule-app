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
import { CreateMachineRequest, Machine, UpdateMachineRequest } from "../types/machine";
import { machineService } from "@/services/machine-service";

/**
 * Hook to fetch all Machines with pagination
 */
export function useMachines(
    params?: PaginationParams,
    options?: Omit<
        UseQueryOptions<PaginatedResponse<Machine>, AxiosError<ApiError>>,
        "queryKey" | "queryFn"
    >
) {
    const queryResult = useQuery<PaginatedResponse<Machine>, AxiosError<ApiError>>({
        queryKey: ["machines", params],
        queryFn: () => machineService.getAll(params),
        ...options,
    });

    return {
        ...queryResult,
        data: queryResult.data?.data,
        pagination: queryResult.data?.pagination,
    };
}

/**
 * Hook to fetch a single Machine by ID
 */
export function useMachine(
    id: number,
    options?: Omit<UseQueryOptions<Machine>, "queryKey" | "queryFn">
) {
    return useQuery({
        queryKey: ["machines", id],
        queryFn: () => machineService.getById(id),
        enabled: !!id,
        ...options,
    });
}

/**
 * Hook to create a new Machine
 */
export function useCreateMachine(options?: {
    onSuccess?: (data: Machine) => void;
    onError?: (error: unknown) => void;
}) {
    const queryClient = useQueryClient();

    return useMutation<Machine, AxiosError<ApiError>, CreateMachineRequest>({
        mutationKey: ["machines", "create"],
        mutationFn: (payload) => machineService.create(payload),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["machines"] });
            toast.success("Machine created successfully.");
            options?.onSuccess?.(data);
        },
        onError: (error) => {
            const errorMessage =
                error.response?.data?.message || "Failed to create Machine.";
            toast.error(errorMessage);
            options?.onError?.(error);
        },
    });
}

/**
 * Hook to update an existing Machine
 */
export function useUpdateMachine(options?: {
    onSuccess?: (data: Machine) => void;
    onError?: (error: unknown) => void;
}) {
    const queryClient = useQueryClient();

    return useMutation<
        Machine,
        AxiosError<ApiError>,
        { id: number; data: UpdateMachineRequest }
    >({
        mutationKey: ["machines", "update"],
        mutationFn: ({ id, data }) => machineService.update(id, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["machines"] });
            queryClient.invalidateQueries({ queryKey: ["machines", variables.id] });
            toast.success("Machine updated successfully.");
            options?.onSuccess?.(data);
        },
        onError: (error) => {
            const errorMessage = error.message || "Failed to update Machine.";
            toast.error(errorMessage);
            options?.onError?.(error);
        },
    });
}

/**
 * Hook to delete a Machine
 */
export function useDeleteMachine(options?: {
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
}) {
    const queryClient = useQueryClient();

    return useMutation<void, AxiosError<ApiError>, number>({
        mutationKey: ["machines", "delete"],
        mutationFn: (id) => machineService.delete(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ["machines"] });
            queryClient.removeQueries({ queryKey: ["machines", id] });
            toast.success("Machine deleted successfully.");
            options?.onSuccess?.();
        },
        onError: (error) => {
            const errorMessage =
                error.response?.data?.message || "Failed to delete Machine.";
            toast.error(errorMessage);
            options?.onError?.(error);
        },
    });
}
