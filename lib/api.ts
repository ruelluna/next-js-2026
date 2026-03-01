const getApiUrl = () =>
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export type AuthMode = "cookie" | "token";

export function getAuthMode(): AuthMode {
  const mode = process.env.NEXT_PUBLIC_AUTH_MODE as AuthMode | undefined;
  return mode === "token" ? "token" : "cookie";
}

let tokenStore: string | null = null;

export function setToken(token: string | null): void {
  tokenStore = token;
  if (typeof window !== "undefined") {
    if (token) {
      sessionStorage.setItem("auth_token", token);
    } else {
      sessionStorage.removeItem("auth_token");
    }
  }
}

export function getToken(): string | null {
  if (typeof window !== "undefined" && !tokenStore) {
    tokenStore = sessionStorage.getItem("auth_token");
  }
  return tokenStore;
}

function getCsrfToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  if (!match) return null;
  return decodeURIComponent(match[1]);
}

export type ApiRequestInit = RequestInit & {
  cookies?: string;
  token?: string | null;
};

export async function apiFetch(
  path: string,
  init: ApiRequestInit = {}
): Promise<Response> {
  const { cookies, token: tokenOverride, ...fetchInit } = init;
  const baseUrl = getApiUrl();
  const url = path.startsWith("http")
    ? path
    : `${baseUrl.replace(/\/$/, "")}${path.startsWith("/") ? "" : "/"}${path}`;

  const headers = new Headers(fetchInit.headers);
  headers.set("Accept", "application/json");
  headers.set("Content-Type", headers.get("Content-Type") ?? "application/json");

  const authMode = getAuthMode();

  if (authMode === "token") {
    const token = tokenOverride ?? getToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  } else {
    if (typeof document !== "undefined") {
      const csrf = getCsrfToken();
      if (csrf) headers.set("X-XSRF-TOKEN", csrf);
    } else if (cookies?.includes("XSRF-TOKEN")) {
      const match = cookies.match(/XSRF-TOKEN=([^;]+)/);
      if (match) {
        headers.set("X-XSRF-TOKEN", decodeURIComponent(match[1]));
      }
    }
    if (cookies) headers.set("Cookie", cookies);
  }

  return fetch(url, {
    ...fetchInit,
    credentials: authMode === "cookie" ? "include" : "omit",
    headers,
  });
}

export async function apiGet<T>(path: string, init?: ApiRequestInit): Promise<T> {
  const res = await apiFetch(path, { ...init, method: "GET" });
  if (!res.ok) throw new ApiError(res);
  return res.json() as Promise<T>;
}

export async function apiPost<T>(
  path: string,
  body?: unknown,
  init?: ApiRequestInit
): Promise<T> {
  const res = await apiFetch(path, {
    ...init,
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new ApiError(res);
  return res.json() as Promise<T>;
}

export async function apiPatch<T>(
  path: string,
  body?: unknown,
  init?: ApiRequestInit
): Promise<T> {
  const res = await apiFetch(path, {
    ...init,
    method: "PATCH",
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new ApiError(res);
  return res.json() as Promise<T>;
}

export async function apiDelete<T>(
  path: string,
  init?: ApiRequestInit
): Promise<T> {
  const res = await apiFetch(path, { ...init, method: "DELETE" });
  if (!res.ok) throw new ApiError(res);
  return res.json() as Promise<T>;
}

export class ApiError extends Error {
  constructor(
    public response: Response,
    message?: string
  ) {
    super(message ?? `API error: ${response.status} ${response.statusText}`);
    this.name = "ApiError";
  }

  async getErrors(): Promise<Record<string, string[]>> {
    try {
      const data = (await this.response.json()) as {
        errors?: Record<string, string[]>;
      };
      return data.errors ?? {};
    } catch {
      return {};
    }
  }
}
