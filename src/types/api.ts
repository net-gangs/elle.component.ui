/**
 * Generic API response wrapper
 * All API responses from the backend are wrapped in this structure
 */
export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

/**
 * Page meta information for paginated responses
 */
export interface PageMetaDto {
  page: number;
  limit: number;
  itemCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

/**
 * Paginated response structure from API
 */
export interface PageResponseDto<T> {
  data: T[];
  meta: PageMetaDto;
}

/**
 * Query parameters for paginated list endpoints
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  orderBy?: string;
  order?: "ASC" | "DESC";
}

/**
 * API Error response
 */
export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  error?: string;
  timestamp: string;
}
