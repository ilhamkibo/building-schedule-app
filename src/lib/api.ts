import axios from "axios";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true, // cookie auth
});

// request interceptor
api.interceptors.request.use(
    (config) => {
        // contoh: inject header tambahan
        config.headers["Accept"] = "application/json";
        return config;
    },
    (error) => Promise.reject(error)
);

// response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // optional: global logout
            window.location.href = "/";
        }
        return Promise.reject(error);
    }
);
