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
    ProductRestriction,
    CreateProductRestrictionRequest,
    UpdateProductRestrictionRequest
} from "../types/product-restriction";
import { productRestrictionService } from "@/services/product-restriction-service";

/**
 * Hook to fetch all Product Restrictions with pagination
 */
export function useProductRestrictions(
    params?: PaginationParams,
    options?: Omit<
        UseQueryOptions<PaginatedResponse<ProductRestriction>, AxiosError<ApiError>>,
        "queryKey" | "queryFn"
    >
) {
    const queryResult = useQuery<PaginatedResponse<ProductRestriction>, AxiosError<ApiError>>({
        queryKey: ["product-restrictions", params],
        queryFn: () => productRestrictionService.getAll(params),
        ...options,
    });

    return {
        ...queryResult,
        data: queryResult.data?.data,
        pagination: queryResult.data?.pagination,
    };
}

/**
 * Hook to fetch a single Product Restriction by ID
 */
export function useProductRestriction(
    id: number,
    options?: Omit<UseQueryOptions<ProductRestriction>, "queryKey" | "queryFn">
) {
    return useQuery({
        queryKey: ["product-restrictions", id],
        queryFn: () => productRestrictionService.getById(id),
        enabled: !!id,
        ...options,
    });
}

/**
 * Hook to create a new Product Restriction
 */
export function useCreateProductRestriction(options?: {
    onSuccess?: (data: ProductRestriction) => void;
    onError?: (error: unknown) => void;
}) {
    const queryClient = useQueryClient();

    return useMutation<ProductRestriction, AxiosError<ApiError>, CreateProductRestrictionRequest>({
        mutationKey: ["product-restrictions", "create"],
        mutationFn: (payload) => productRestrictionService.create(payload),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["product-restrictions"] });
            toast.success("Product Restriction created successfully.");
            options?.onSuccess?.(data);
        },
        onError: (error) => {
            const errorMessage =
                error.response?.data?.message || "Failed to create Product Restriction.";
            toast.error(errorMessage);
            options?.onError?.(error);
        },
    });
}

/**
 * Hook to update an existing Product Restriction
 */
export function useUpdateProductRestriction(options?: {
    onSuccess?: (data: ProductRestriction) => void;
    onError?: (error: unknown) => void;
}) {
    const queryClient = useQueryClient();

    return useMutation<
        ProductRestriction,
        AxiosError<ApiError>,
        { id: number; data: UpdateProductRestrictionRequest }
    >({
        mutationKey: ["product-restrictions", "update"],
        mutationFn: ({ id, data }) => productRestrictionService.update(id, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["product-restrictions"] });
            queryClient.invalidateQueries({ queryKey: ["product-restrictions", variables.id] });
            toast.success("Product Restriction updated successfully.");
            options?.onSuccess?.(data);
        },
        onError: (error) => {
            const errorMessage = error.message || "Failed to update Product Restriction.";
            toast.error(errorMessage);
            options?.onError?.(error);
        },
    });
}

/**
 * Hook to delete a Product Restriction
 */
export function useDeleteProductRestriction(options?: {
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
}) {
    const queryClient = useQueryClient();

    return useMutation<void, AxiosError<ApiError>, number>({
        mutationKey: ["product-restrictions", "delete"],
        mutationFn: (id) => productRestrictionService.delete(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ["product-restrictions"] });
            queryClient.removeQueries({ queryKey: ["product-restrictions", id] });
            toast.success("Product Restriction deleted successfully.");
            options?.onSuccess?.();
        },
        onError: (error) => {
            const errorMessage =
                error.response?.data?.message || "Failed to delete Product Restriction.";
            toast.error(errorMessage);
            options?.onError?.(error);
        },
    });
}
