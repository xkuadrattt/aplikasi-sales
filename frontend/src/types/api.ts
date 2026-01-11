export interface LaravelPaginator<T> {
  current_page: number;
  data: T[];
  last_page: number;
  per_page: number;
  total: number;
}

export interface LaravelValidationError {
  message: string;
  errors: Record<string, string[]>;
}
