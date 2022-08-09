export interface PaginatedResult<T> {
  data: T[];
  totalRecords: number;
  page: number;
  totalPages: number;
}
