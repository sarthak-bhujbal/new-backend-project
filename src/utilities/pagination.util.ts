export interface PaginationOptions {
  page?: number | string;
  limit?: number | string;
  defaultPage?: number;
  defaultLimit?: number;
  maxLimit?: number;
}

export interface PaginationResult {
  page: number;
  limit: number;
  offset: number;
}

export function getPagination(options: PaginationOptions): PaginationResult {
  const {
    page: rawPage,
    limit: rawLimit,
    defaultPage = 1,
    defaultLimit = 10,
    maxLimit = 100
  } = options;

  // Parse and validate page
  const page = Math.max(
    parseInt(String(rawPage || defaultPage), 10) || defaultPage,
    1
  );

  // Parse and validate limit, ensuring it doesn't exceed maxLimit
  const limit = Math.min(
    Math.max(parseInt(String(rawLimit || defaultLimit), 10) || defaultLimit, 1),
    maxLimit
  );

  // Calculate offset for SQL queries
  const offset = (page - 1) * limit;

  return { page, limit, offset };
}

export function addPaginationMetadata<T>(
  data: T[],
  totalCount: number,
  page: number,
  limit: number
) {
  return {
    data,
    pagination: {
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      limit,
      hasMore: page * limit < totalCount,
    }
  };
}