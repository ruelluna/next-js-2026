import {
  apiFetch,
  apiPost,
  getAuthMode,
  setToken,
  type ApiRequestInit,
} from "./api";

export type User = {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
};

export async function getCsrfCookie(init?: ApiRequestInit): Promise<void> {
  const res = await apiFetch("/sanctum/csrf-cookie", {
    ...init,
    method: "GET",
  });
  if (!res.ok) throw new Error("Failed to get CSRF cookie");
}

export async function login(
  email: string,
  password: string
): Promise<{ user: User; token?: string }> {
  const authMode = getAuthMode();

  if (authMode === "cookie") {
    await getCsrfCookie();
    const data = await apiPost<{ user: User }>("/api/v1/login", {
      email,
      password,
    });
    return { user: data.user };
  }

  const data = await apiPost<{ token: string; token_type: string }>(
    "/api/v1/tokens/issue",
    { email, password, device_name: "web" }
  );
  setToken(data.token);
  const userRes = await apiFetch("/api/v1/user", { method: "GET" });
  if (!userRes.ok) throw new Error("Failed to fetch user after login");
  const user = (await userRes.json()) as User;
  return { user, token: data.token };
}

export async function register(data: {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}): Promise<{ user: User }> {
  const authMode = getAuthMode();

  if (authMode === "cookie") {
    await getCsrfCookie();
    return apiPost<{ user: User }>("/api/v1/register", data);
  }

  await apiPost<{ user: User }>("/api/v1/register", data);
  const tokenData = await apiPost<{ token: string }>("/api/v1/tokens/issue", {
    email: data.email,
    password: data.password,
    device_name: "web",
  });
  setToken(tokenData.token);
  const userRes = await apiFetch("/api/v1/user", { method: "GET" });
  if (!userRes.ok) throw new Error("Failed to fetch user after register");
  const user = (await userRes.json()) as User;
  return { user };
}

export async function logout(): Promise<void> {
  const authMode = getAuthMode();

  if (authMode === "cookie") {
    await apiPost<{ message: string }>("/api/v1/logout");
  } else {
    setToken(null);
  }
}

export async function getCurrentUser(
  init?: ApiRequestInit
): Promise<User | null> {
  const res = await apiFetch("/api/v1/user", { ...init, method: "GET" });
  if (res.status === 401) return null;
  if (!res.ok) throw new Error("Failed to fetch user");
  const data = (await res.json()) as User;
  return data;
}
