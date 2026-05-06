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
import { userService } from "@/services/user-service";
import { CreateUserRequest, UpdateUserRequest, User } from "@/types/user";

/**
 * Hook to fetch all Users with pagination
 */
export function useUsers(
    params?: PaginationParams,
    options?: Omit<
        UseQueryOptions<PaginatedResponse<User>, AxiosError<ApiError>>,
        "queryKey" | "queryFn"
    >
) {
    const queryResult = useQuery<PaginatedResponse<User>, AxiosError<ApiError>>({
        queryKey: ["users", params],
        queryFn: () => userService.getAll(params),
        ...options,
    });

    return {
        ...queryResult,
        data: queryResult.data?.data,
        pagination: queryResult.data?.pagination,
    };
}

/**
 * Hook to fetch a single User by ID
 */
export function useUser(
    id: number,
    options?: Omit<UseQueryOptions<User>, "queryKey" | "queryFn">
) {
    return useQuery({
        queryKey: ["users", id],
        queryFn: () => userService.getById(id),
        enabled: !!id,
        ...options,
    });
}

/**
 * Hook to create a new User
 */
export function useCreateUser(options?: {
    onSuccess?: (data: User) => void;
    onError?: (error: unknown) => void;
}) {
    const queryClient = useQueryClient();

    return useMutation<User, AxiosError<ApiError>, CreateUserRequest>({
        mutationKey: ["users", "create"],
        mutationFn: (payload) => userService.create(payload),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            toast.success("User created successfully.");
            options?.onSuccess?.(data);
        },
        onError: (error) => {
            const responseData = error.response?.data;
            if (responseData?.errors) {
                Object.entries(responseData.errors).forEach(([field, messages]) => {
                    messages.forEach((msg) => toast.error(`${field}: ${msg}`));
                });
            } else {
                toast.error(responseData?.message || "Failed to create User.");
            }
            options?.onError?.(error);
        },
    });
}

/**
 * Hook to update an existing User
 */
export function useUpdateUser(options?: {
    onSuccess?: (data: User) => void;
    onError?: (error: unknown) => void;
}) {
    const queryClient = useQueryClient();

    return useMutation<
        User,
        AxiosError<ApiError>,
        { id: number; data: UpdateUserRequest }
    >({
        mutationKey: ["users", "update"],
        mutationFn: ({ id, data }) => userService.update(id, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            queryClient.invalidateQueries({ queryKey: ["users", variables.id] });
            toast.success("User updated successfully.");
            options?.onSuccess?.(data);
        },
        onError: (error) => {
            const errorMessage = error.message || "Failed to update User.";
            toast.error(errorMessage);
            options?.onError?.(error);
        },
    });
}

/**
 * Hook to delete a User
 */
export function useDeleteUser(options?: {
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
}) {
    const queryClient = useQueryClient();

    return useMutation<void, AxiosError<ApiError>, number>({
        mutationKey: ["users", "delete"],
        mutationFn: (id) => userService.delete(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            queryClient.removeQueries({ queryKey: ["users", id] });
            toast.success("User deleted successfully.");
            options?.onSuccess?.();
        },
        onError: (error) => {
            const errorMessage =
                error.response?.data?.message || "Failed to delete User.";
            toast.error(errorMessage);
            options?.onError?.(error);
        },
    });
}
