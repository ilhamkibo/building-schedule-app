import axios from "axios";
import { ApiError } from "@/types/api-response";

/**
 * Standardize error responses from Axios or generic errors
 * @param error Raw error object
 * @returns Formatted ApiError object
 */
export function handleApiError(error: unknown): ApiError & { statusCode?: number } {
    if (axios.isAxiosError(error)) {
        return {
            status: false,
            message: error.response?.data?.message || error.message || "Terjadi kesalahan pada server",
            errors: error.response?.data?.errors,
            statusCode: error.response?.status
        };
    } else if (error instanceof Error) {
        return {
            status: false,
            message: error.message
        };
    }
    
    return {
        status: false,
        message: "Terjadi kesalahan yang tidak diketahui"
    };
}

/**
 * Wrapper for API calls to safely handle 404 responses as empty data instead of an error.
 * Useful for scenarios where a "Not Found" resource should just display an empty state.
 * 
 * @param apiCall The pending promise of the API request
 * @param fallbackData The data to return if a 404 error is encountered
 * @returns The resolved data or the fallback data
 */
export async function fetchWithEmptyFallback<T>(apiCall: Promise<T>, fallbackData: T): Promise<T> {
    try {
        return await apiCall;
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            return fallbackData;
        }
        throw error;
    }
}
