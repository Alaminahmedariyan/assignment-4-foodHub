export type IPaginationOptions = {
  page?: number | string;
  limit?: number | string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export type IPaginationOptionsResult = {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
};

/**
 * Normalize pagination and sorting values from query params
 */
const paginationSortingHelper = (options: IPaginationOptions): IPaginationOptionsResult => {
  // Page validation: set to 1 if less than 1
  const page = Math.max(1, Number(options.page) || 1);
  
  // Limit validation: keep between 1-100
  const limit = Math.min(100, Math.max(1, Number(options.limit) || 10));
  
  // Skip calculation: based on page and limit
  const skip = (page - 1) * limit;
  
  // Sort by field: default to createdAt
  const sortBy = options.sortBy || "createdAt";
  
  // Sort order validation: only asc/desc allowed
  const sortOrder = options.sortOrder === "asc" ? "asc" : "desc";
  
  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };
};

export default paginationSortingHelper;