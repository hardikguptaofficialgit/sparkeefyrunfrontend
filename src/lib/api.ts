import type { ApiError } from "./types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/v1";

export class ApiRequestError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  userId: string;
  idempotencyKey?: string;
}

export async function apiRequest<T>(path: string, options: RequestOptions): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-user-id": options.userId,
  };

  if (options.idempotencyKey) {
    headers["Idempotency-Key"] = options.idempotencyKey;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = data as ApiError;
    throw new ApiRequestError(
      res.status,
      err.error?.code ?? "UNKNOWN",
      err.error?.message ?? "Request failed",
      err.error?.details,
    );
  }

  return data as T;
}
