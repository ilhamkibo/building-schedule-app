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
import { CreateRoleRequest, Role, UpdateRoleRequest } from "../types/role";
import { roleService } from "@/services/role-service";

/**
 * Hook to fetch all Roles with pagination
 */
export function useRoles(
    params?: PaginationParams,
    options?: Omit<
        UseQueryOptions<PaginatedResponse<Role>, AxiosError<ApiError>>,
        "queryKey" | "queryFn"
    >
) {
    const queryResult = useQuery<PaginatedResponse<Role>, AxiosError<ApiError>>({
        queryKey: ["roles", params],
        queryFn: () => roleService.getAll(params),
        ...options,
    });

    return {
        ...queryResult,
        data: queryResult.data?.data,
        pagination: queryResult.data?.pagination,
    };
}

/**
 * Hook to fetch a single Role by ID
 */
export function useRole(
    id: number,
    options?: Omit<UseQueryOptions<Role>, "queryKey" | "queryFn">
) {
    return useQuery({
        queryKey: ["roles", id],
        queryFn: () => roleService.getById(id),
        enabled: !!id,
        ...options,
    });
}

/**
 * Hook to create a new Role
 */
export function useCreateRole(options?: {
    onSuccess?: (data: Role) => void;
    onError?: (error: unknown) => void;
}) {
    const queryClient = useQueryClient();

    return useMutation<Role, AxiosError<ApiError>, CreateRoleRequest>({
        mutationKey: ["roles", "create"],
        mutationFn: (payload) => roleService.create(payload),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["roles"] });
            toast.success("Role created successfully.");
            options?.onSuccess?.(data);
        },
        onError: (error) => {
            const errorMessage =
                error.response?.data?.message || "Failed to create Role.";
            toast.error(errorMessage);
            options?.onError?.(error);
        },
    });
}

/**
 * Hook to update an existing Role
 */
export function useUpdateRole(options?: {
    onSuccess?: (data: Role) => void;
    onError?: (error: unknown) => void;
}) {
    const queryClient = useQueryClient();

    return useMutation<
        Role,
        AxiosError<ApiError>,
        { id: number; data: UpdateRoleRequest }
    >({
        mutationKey: ["roles", "update"],
        mutationFn: ({ id, data }) => roleService.update(id, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["roles"] });
            queryClient.invalidateQueries({ queryKey: ["roles", variables.id] });
            toast.success("Role updated successfully.");
            options?.onSuccess?.(data);
        },
        onError: (error) => {
            const errorMessage = error.message || "Failed to update Role.";
            toast.error(errorMessage);
            options?.onError?.(error);
        },
    });
}

/**
 * Hook to delete a Role
 */
export function useDeleteRole(options?: {
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
}) {
    const queryClient = useQueryClient();

    return useMutation<void, AxiosError<ApiError>, number>({
        mutationKey: ["roles", "delete"],
        mutationFn: (id) => roleService.delete(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ["roles"] });
            queryClient.removeQueries({ queryKey: ["roles", id] });
            toast.success("Role deleted successfully.");
            options?.onSuccess?.();
        },
        onError: (error) => {
            const errorMessage =
                error.response?.data?.message || "Failed to delete Role.";
            toast.error(errorMessage);
            options?.onError?.(error);
        },
    });
}
