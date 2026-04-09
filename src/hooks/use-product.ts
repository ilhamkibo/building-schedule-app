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
import { productService } from "@/services/product-service";
import { Product, CreateProductRequest, UpdateProductRequest, RealtimeBO } from "@/types/product";

/**
 * Hook to fetch all Products with pagination
 */
export function useProducts(
    params?: PaginationParams,
    options?: Omit<
        UseQueryOptions<PaginatedResponse<Product>, AxiosError<ApiError>>,
        "queryKey" | "queryFn"
    >
) {
    const queryResult = useQuery<PaginatedResponse<Product>, AxiosError<ApiError>>({
        queryKey: ["products", params],
        queryFn: () => productService.getAll(params),
        ...options,
    });

    return {
        ...queryResult,
        data: queryResult.data?.data,
        pagination: queryResult.data?.pagination,
    };
}

/**
 * Hook to fetch a single Product by ID
 */
export function useProduct(
    id: number,
    options?: Omit<UseQueryOptions<Product>, "queryKey" | "queryFn">
) {
    return useQuery({
        queryKey: ["products", id],
        queryFn: () => productService.getById(id),
        enabled: !!id,
        ...options,
    });
}

/**
 * Hook to create a new Product
 */
export function useCreateProduct(options?: {
    onSuccess?: (data: Product) => void;
    onError?: (error: unknown) => void;
}) {
    const queryClient = useQueryClient();

    return useMutation<Product, AxiosError<ApiError>, CreateProductRequest>({
        mutationKey: ["products", "create"],
        mutationFn: (payload) => productService.create(payload),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            toast.success("Product created successfully.");
            options?.onSuccess?.(data);
        },
        onError: (error) => {
            const errorMessage =
                error.response?.data?.message || "Failed to create Product.";
            toast.error(errorMessage);
            options?.onError?.(error);
        },
    });
}

/**
 * Hook to update an existing Product
 */
export function useUpdateProduct(options?: {
    onSuccess?: (data: Product) => void;
    onError?: (error: unknown) => void;
}) {
    const queryClient = useQueryClient();

    return useMutation<
        Product,
        AxiosError<ApiError>,
        { id: number; data: UpdateProductRequest }
    >({
        mutationKey: ["products", "update"],
        mutationFn: ({ id, data }) => productService.update(id, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["products", variables.id] });
            toast.success("Product updated successfully.");
            options?.onSuccess?.(data);
        },
        onError: (error) => {
            const errorMessage =
                error.response?.data?.message || "Failed to update Product.";
            toast.error(errorMessage);
            options?.onError?.(error);
        },
    });
}

/**
 * Hook to delete a Product
 */
export function useDeleteProduct(options?: {
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
}) {
    const queryClient = useQueryClient();

    return useMutation<void, AxiosError<ApiError>, number>({
        mutationKey: ["products", "delete"],
        mutationFn: (id) => productService.delete(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.removeQueries({ queryKey: ["products", id] });
            toast.success("Product deleted successfully.");
            options?.onSuccess?.();
        },
        onError: (error) => {
            const errorMessage =
                error.response?.data?.message || "Failed to delete Product.";
            toast.error(errorMessage);
            options?.onError?.(error);
        },
    });
}

/**
 * Hook to fetch realtime BO for a list of size codes
 */
export function useRealtimeBO(
    codes: string[],
    date: string,
    options?: Omit<UseQueryOptions<RealtimeBO[]>, "queryKey" | "queryFn">
) {
    return useQuery({
        queryKey: ["products", "bo-realtime", codes, date],
        queryFn: () => productService.getRealtimeBO(codes, date),
        enabled: codes.length > 0 && !!date,
        refetchInterval: 60000, // Refresh every minute
        ...options,
    });
}
