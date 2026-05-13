"use client";

import {
    useQuery,
    useMutation,
    useQueryClient,
    UseQueryOptions,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ApiError, ApiResponse } from "../types/api-response";
import { toast } from "sonner";
import { PaginatedResponse, PaginationParams } from "../types/pagination";
import { scheduleService } from "@/services/schedule-service";
import { Schedule, CreateScheduleRequest, UpdateScheduleRequest, ScheduleBoard, TodayLineSchedule } from "@/types/schedule";

/**
 * Hook to fetch all Schedules with pagination
 */
export function useSchedules(
    params?: PaginationParams,
    options?: Omit<
        UseQueryOptions<PaginatedResponse<Schedule>, AxiosError<ApiError>>,
        "queryKey" | "queryFn"
    >
) {
    const queryResult = useQuery<PaginatedResponse<Schedule>, AxiosError<ApiError>>({
        queryKey: ["schedules", params],
        queryFn: () => scheduleService.getAll(params),
        ...options,
    });

    return {
        ...queryResult,
        data: queryResult.data?.data,
        pagination: queryResult.data?.pagination,
    };
}

/**
 * Hook to fetch a single Schedule by ID
 */
export function useSchedule(
    id: number,
    options?: Omit<UseQueryOptions<ApiResponse<ScheduleBoard>>, "queryKey" | "queryFn">
) {
    return useQuery({
        queryKey: ["schedules", id],
        queryFn: () => scheduleService.getById(id),
        enabled: !!id,
        ...options,
    });
}

/**
 * Hook to create a new Schedule
 */
export function useCreateSchedule(options?: {
    onSuccess?: (data: Schedule) => void;
    onError?: (error: unknown) => void;
}) {
    const queryClient = useQueryClient();

    return useMutation<Schedule, AxiosError<ApiError>, CreateScheduleRequest>({
        mutationKey: ["schedules", "create"],
        mutationFn: (payload) => scheduleService.create(payload),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["schedules"] });
            toast.success("Schedule created successfully.");
            options?.onSuccess?.(data);
        },
        onError: (error) => {
            const errorMessage =
                error.response?.data?.message || "Failed to create schedule.";
            toast.error(errorMessage);
            options?.onError?.(error);
        },
    });
}

/**
 * Hook to update an existing Schedule
 */
export function useUpdateSchedule(options?: {
    onSuccess?: (data: Schedule) => void;
    onError?: (error: unknown) => void;
}) {
    const queryClient = useQueryClient();

    return useMutation<
        Schedule,
        AxiosError<ApiError>,
        { id: number; data: UpdateScheduleRequest }
    >({
        mutationKey: ["schedules", "update"],
        mutationFn: ({ id, data }) => scheduleService.update(id, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["schedules"] });
            queryClient.invalidateQueries({ queryKey: ["schedules", variables.id] });
            toast.success("Schedule updated successfully.");
            options?.onSuccess?.(data);
        },
        onError: (error) => {
            const errorMessage =
                error.response?.data?.message || "Failed to update schedule.";
            toast.error(errorMessage);
            options?.onError?.(error);
        },
    });
}

/**
 * Hook to update an existing Schedule by lineNo and date
 */
export function useUpdateScheduleByLineAndDate(options?: {
    onSuccess?: (data: any) => void;
    onError?: (error: unknown) => void;
}) {
    const queryClient = useQueryClient();

    return useMutation<
        any,
        AxiosError<ApiError>,
        { lineNo: number; date: string; data: CreateScheduleRequest }
    >({
        mutationKey: ["schedules", "update-by-line-date"],
        mutationFn: ({ lineNo, date, data }) => scheduleService.updateScheduleByLineAndDate(lineNo, date, data),
        onSuccess: (data, variables) => {

            queryClient.invalidateQueries({ queryKey: ["schedules"] });
            toast.success("Schedule updated successfully.");
            options?.onSuccess?.(data);
        },
        onError: (error) => {
            console.log("🚀 ~ useUpdateScheduleByLineAndDate ~ error:", error);
            const errorMessage =
                error.response?.data?.message || error.message || "Failed to update schedule.";
            toast.error(errorMessage);
            options?.onError?.(error);
        },
    });
}

/**
 * Hook to delete a Schedule
 */
export function useDeleteSchedule(options?: {
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
}) {
    const queryClient = useQueryClient();

    return useMutation<void, AxiosError<ApiError>, number>({
        mutationKey: ["schedules", "delete"],
        mutationFn: (id) => scheduleService.delete(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ["schedules"] });
            queryClient.removeQueries({ queryKey: ["schedules", id] });
            toast.success("Schedule deleted successfully.");
            options?.onSuccess?.();
        },
        onError: (error) => {
            const errorMessage =
                error.response?.data?.message || "Failed to delete schedule.";
            toast.error(errorMessage);
            options?.onError?.(error);
        },
    });
}

/**
 * Hook to fetch today's category schedule
 */
export function useTodayLineSchedule(
    lineNo: number,
    date: string,
    options?: Omit<UseQueryOptions<ApiResponse<TodayLineSchedule[]>, AxiosError<ApiError>>, "queryKey" | "queryFn">
) {
    const queryResult = useQuery<ApiResponse<TodayLineSchedule[]>, AxiosError<ApiError>>({
        queryKey: ["schedules", "today-line", lineNo, date],
        queryFn: () => scheduleService.getTodayLineSchedule(lineNo, date),
        enabled: !!lineNo && !!date,
        ...options,
    });

    return {
        ...queryResult,
        data: queryResult.data,
        pagination: queryResult.data?.pagination,
    };
}

/**
 * Hook to update schedule timeline (shift change)
 */
export function useUpdateTimeline(options?: {
    onSuccess?: (data: any) => void;
    onError?: (error: unknown) => void;
}) {
    const queryClient = useQueryClient();

    return useMutation<any, AxiosError<ApiError>, { scheduleId: number; shiftNo: number }>({
        mutationKey: ["schedules", "update-timeline"],
        mutationFn: ({ scheduleId, shiftNo }) => scheduleService.updateTimeline(scheduleId, shiftNo),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["schedules", "today-line"] });
            toast.success("Timeline updated successfully.");
            options?.onSuccess?.(data);
        },
        onError: (error) => {
            const errorMessage = error.response?.data?.message || error.message || "Failed to update timeline.";
            toast.error(errorMessage);
            options?.onError?.(error);
        },
    });
}
