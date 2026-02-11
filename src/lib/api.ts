import { ApiError } from "@/types/api-response";
import axios from "axios";
import Cookies from "js-cookie";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true, // cookie auth
    headers: {
        Accept: "application/json",
    },
});

// request interceptor
api.interceptors.request.use(
    (config) => {
        const token = Cookies.get("access_token");

        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        // contoh: inject header tambahan
        config.headers["Accept"] = "application/json";
        return config;
    },
    (error) => Promise.reject(error)
);

// response interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // optional: global logout
            Cookies.remove("access_token");
            if (typeof window !== "undefined") {
                window.location.href = "/login";
            }
        }
        return Promise.reject(error.response?.data as ApiError);
    }
);
