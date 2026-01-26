export interface ApiResponse<T> {
  status: string;
  message: string;
  data?: T;
  pagination?: PaginatedData<T> | null;
  errors?: any;
}

interface PaginatedData<T> {
  current_page: number;
  total_page: number;
  limit: number;
  total: number;
}

export type ApiError = {
  status: boolean;
  message: string;
  errors?: Record<string, string[]>;
};
