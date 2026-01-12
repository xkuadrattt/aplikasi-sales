import { http } from "@/lib/http";
import type { LaravelPaginator } from "@/types/api";
import type { Product, ProductCreateInput, ProductUpdateInput } from "@/types/product";

export type ProductsQuery = {
  q?: string;
  active?: boolean | null; // null = no filter
  page?: number;
  per_page?: number;
  sort?: "name" | "sku" | "price_default" | "is_active" | "created_at" | "updated_at";
  dir?: "asc" | "desc";
  refreshKey?: number;
};

function toQueryString(q: ProductsQuery) {
  const qs = new URLSearchParams();

  if (q.q) qs.set("q", q.q);
  if (q.active !== null && q.active !== undefined) qs.set("active", q.active ? "1" : "0");

  if (q.page) qs.set("page", String(q.page));
  if (q.per_page) qs.set("per_page", String(q.per_page));

  if (q.sort) qs.set("sort", q.sort);
  if (q.dir) qs.set("dir", q.dir);

  const s = qs.toString();
  return s ? `?${s}` : "";
}

export function listProducts(query: ProductsQuery, signal: AbortSignal) {
  return http<LaravelPaginator<Product>>(`/api/products${toQueryString(query)}`);
}

export function createProduct(input: ProductCreateInput) {
  return http<{ message: string; data: Product }>(`/api/products`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateProduct(id: number, input: ProductUpdateInput) {
  return http<{ message: string; data: Product }>(`/api/products/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function deleteProduct(id: number) {
  return http<{ message: string }>(`/api/products/${id}`, {
    method: "DELETE",
  });
}
