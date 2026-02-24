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
import { CreateShiftRequest, Shift, UpdateShiftRequest } from "@/types/shift";
import { shiftService } from "@/services/shift-service";

/**
 * Hook to fetch all Shifts
 */
export function useShifts(
    options?: Omit<
        UseQueryOptions<Shift[], AxiosError<ApiError>>,
        "queryKey" | "queryFn"
    >
) {
    return useQuery<Shift[], AxiosError<ApiError>>({
        queryKey: ["shifts"],
        queryFn: () => shiftService.getAll(),
        ...options,
    });
}

/**
 * Hook to fetch a single Shift by ID
 */
export function useShift(
    id: number,
    options?: Omit<UseQueryOptions<Shift>, "queryKey" | "queryFn">
) {
    return useQuery({
        queryKey: ["shifts", id],
        queryFn: () => shiftService.getById(id),
        enabled: !!id,
        ...options,
    });
}

/**
 * Hook to create a new Shift
 */
export function useCreateShift(options?: {
    onSuccess?: (data: Shift) => void;
    onError?: (error: unknown) => void;
}) {
    const queryClient = useQueryClient();

    return useMutation<Shift, AxiosError<ApiError>, CreateShiftRequest>({
        mutationKey: ["shifts", "create"],
        mutationFn: (payload) => shiftService.create(payload),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["shifts"] });
            toast.success("Shift created successfully.");
            options?.onSuccess?.(data);
        },
        onError: (error) => {
            const errorMessage =
                error.response?.data?.message || "Failed to create Shift.";
            toast.error(errorMessage);
            options?.onError?.(error);
        },
    });
}

/**
 * Hook to update an existing Shift
 */
export function useUpdateShift(options?: {
    onSuccess?: (data: Shift) => void;
    onError?: (error: unknown) => void;
}) {
    const queryClient = useQueryClient();

    return useMutation<
        Shift,
        AxiosError<ApiError>,
        { id: number; data: UpdateShiftRequest }
    >({
        mutationKey: ["shifts", "update"],
        mutationFn: ({ id, data }) => shiftService.update(id, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["shifts"] });
            queryClient.invalidateQueries({ queryKey: ["shifts", variables.id] });
            toast.success("Shift updated successfully.");
            options?.onSuccess?.(data);
        },
        onError: (error) => {
            const errorMessage = error.message || "Failed to update Shift.";
            toast.error(errorMessage);
            options?.onError?.(error);
        },
    });
}

/**
 * Hook to delete a Shift
 */
export function useDeleteShift(options?: {
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
}) {
    const queryClient = useQueryClient();

    return useMutation<void, AxiosError<ApiError>, number>({
        mutationKey: ["shifts", "delete"],
        mutationFn: (id) => shiftService.delete(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ["shifts"] });
            queryClient.removeQueries({ queryKey: ["shifts", id] });
            toast.success("Shift deleted successfully.");
            options?.onSuccess?.();
        },
        onError: (error) => {
            const errorMessage =
                error.response?.data?.message || "Failed to delete Shift.";
            toast.error(errorMessage);
            options?.onError?.(error);
        },
    });
}
