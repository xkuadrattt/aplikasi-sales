import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import type { LaravelPaginator } from "@/types/api";
import type { Product } from "@/types/product";
import { listProducts, type ProductsQuery } from "./api";
import { HttpError } from "@/lib/http";


export function useDebouncedValue<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return debounced;
}
export function useProducts(query: ProductsQuery) {
  const [data, setData] = useState<LaravelPaginator<Product> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // nonce internal untuk paksa fetch ulang (tanpa refreshKey di luar)
  const [nonce, setNonce] = useState(0);
  const refetch = useCallback(() => setNonce((n) => n + 1), []);

  const controller = new AbortController()

  const { q, active, page, per_page, sort, dir } = query;

  const queryKey = useMemo(() => {
    return JSON.stringify({
      q: q ?? "",
      active: active ?? null,
      page: page ?? 1,
      per_page: per_page ?? 10,
      sort: sort ?? "name",
      dir: dir ?? "asc",
    });
  }, [q, active, page, per_page, sort, dir]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      setError(null);

      try {
        const res = await listProducts({ q, active, page, per_page, sort, dir }, controller.signal);
        if (!cancelled) setData(res);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [queryKey, nonce]); // ✅ fetch ulang kalau query berubah atau refetch dipanggil

  return { data, rows: data?.data ?? [], loading, error, refetch };
}