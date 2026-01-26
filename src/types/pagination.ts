export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedResponse<T> {
  status: boolean;
  message: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    total: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalPages: number;
  total: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export type ErrorResponse = {
  status: boolean;
  message: string;
  errors?: Record<string, string[]>;
};
