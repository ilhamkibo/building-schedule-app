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
import { Category, CreateCategoryRequest, UpdateCategoryRequest } from "@/types/category";
import { categoryService } from "@/services/category-service";

/**
 * Hook to fetch all Categories with pagination
 */
export function useCategories(
    params?: PaginationParams,
    options?: Omit<
        UseQueryOptions<PaginatedResponse<Category>, AxiosError<ApiError>>,
        "queryKey" | "queryFn"
    >
) {
    const queryResult = useQuery<PaginatedResponse<Category>, AxiosError<ApiError>>({
        queryKey: ["categories", params],
        queryFn: () => categoryService.getAll(params),
        ...options,
    });

    return {
        ...queryResult,
        data: queryResult.data?.data,
        pagination: queryResult.data?.pagination,
    };
}

/**
 * Hook to fetch a single Category by ID
 */
export function useCategory(
    id: number,
    options?: Omit<UseQueryOptions<Category>, "queryKey" | "queryFn">
) {
    return useQuery({
        queryKey: ["categories", id],
        queryFn: () => categoryService.getById(id),
        enabled: !!id,
        ...options,
    });
}

/**
 * Hook to create a new Category
 */
export function useCreateCategory(options?: {
    onSuccess?: (data: Category) => void;
    onError?: (error: unknown) => void;
}) {
    const queryClient = useQueryClient();

    return useMutation<Category, AxiosError<ApiError>, CreateCategoryRequest>({
        mutationKey: ["categories", "create"],
        mutationFn: (payload) => categoryService.create(payload),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            toast.success("Category created successfully.");
            options?.onSuccess?.(data);
        },
        onError: (error) => {
            const errorMessage =
                error.response?.data?.message || "Failed to create category.";
            toast.error(errorMessage);
            options?.onError?.(error);
        },
    });
}

/**
 * Hook to update an existing Category
 */
export function useUpdateCategory(options?: {
    onSuccess?: (data: Category) => void;
    onError?: (error: unknown) => void;
}) {
    const queryClient = useQueryClient();

    return useMutation<
        Category,
        AxiosError<ApiError>,
        { id: number; data: UpdateCategoryRequest }
    >({
        mutationKey: ["categories", "update"],
        mutationFn: ({ id, data }) => categoryService.update(id, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            queryClient.invalidateQueries({ queryKey: ["categories", variables.id] });
            toast.success("Category updated successfully.");
            options?.onSuccess?.(data);
        },
        onError: (error) => {
            const errorMessage = error.message || "Failed to update category.";
            toast.error(errorMessage);
            options?.onError?.(error);
        },
    });
}

/**
 * Hook to delete a Category
 */
export function useDeleteCategory(options?: {
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
}) {
    const queryClient = useQueryClient();

    return useMutation<void, AxiosError<ApiError>, number>({
        mutationKey: ["categories", "delete"],
        mutationFn: (id) => categoryService.delete(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            queryClient.removeQueries({ queryKey: ["categories", id] });
            toast.success("Category deleted successfully.");
            options?.onSuccess?.();
        },
        onError: (error) => {
            const errorMessage =
                error.response?.data?.message || "Failed to delete category.";
            toast.error(errorMessage);
            options?.onError?.(error);
        },
    });
}

/**
 * Hook to assign lines to a Category
 */
export function useAssignLines(options?: {
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
}) {
    const queryClient = useQueryClient();

    return useMutation<void, AxiosError<ApiError>, { categoryId: number; lineIds: number[] }>({
        mutationKey: ["categories", "assign-lines"],
        mutationFn: (payload) => categoryService.assignLines(payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            queryClient.invalidateQueries({ queryKey: ["categories", variables.categoryId] });
            toast.success("Lines assigned to category successfully.");
            options?.onSuccess?.();
        },
        onError: (error) => {
            const errorMessage = (error as AxiosError<ApiError>)?.response?.data?.message || "Failed to assign lines.";
            toast.error(errorMessage);
            options?.onError?.(error);
        },
    });
}
