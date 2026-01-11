import { API_BASE_URL } from "@/config/env.ts";
import type { LaravelValidationError } from "@/types/api";

export class HttpError extends Error {
  status: number;
  payload: unknown;
  constructor(status: number, message: string, payload: unknown) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}

export async function http<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {}),
    },
  });

  const text = await res.text();
  const json = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const message =
      (json && (json.message as string)) || `Request failed (${res.status})`;
    throw new HttpError(res.status, message, json);
  }

  return json as T;
}

export function isLaravelValidationError(x: unknown): x is LaravelValidationError {
  return !!x && typeof x === "object" && "errors" in (x as any);
}
