import type {
  IssueTokenData,
  LoginData,
  MessageData,
  RegisterData,
  TokenData,
  UserData,
} from "@/types";
import {
  apiFetch,
  apiPost,
  getAuthMode,
  setToken,
  type ApiRequestInit,
} from "./api";

export type { UserData };

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
): Promise<{ user: UserData; token?: string }> {
  const authMode = getAuthMode();

  if (authMode === "cookie") {
    await getCsrfCookie();
    const data = await apiPost<{ user: UserData }>("/api/v1/login", {
      email,
      password,
    } satisfies LoginData);
    return { user: data.user };
  }

  const payload: IssueTokenData = { email, password, device_name: "web" };
  const data = await apiPost<TokenData>("/api/v1/tokens/issue", payload);
  setToken(data.token);
  const userRes = await apiFetch("/api/v1/user", { method: "GET" });
  if (!userRes.ok) throw new Error("Failed to fetch user after login");
  const user = (await userRes.json()) as UserData;
  return { user, token: data.token };
}

export type RegisterPayload = RegisterData & { password_confirmation: string };

export async function register(
  data: RegisterPayload
): Promise<{ user: UserData }> {
  const authMode = getAuthMode();

  if (authMode === "cookie") {
    await getCsrfCookie();
    return apiPost<{ user: UserData }>("/api/v1/register", data);
  }

  await apiPost<{ user: UserData }>("/api/v1/register", data);
  const payload: IssueTokenData = {
    email: data.email,
    password: data.password,
    device_name: "web",
  };
  const tokenData = await apiPost<TokenData>("/api/v1/tokens/issue", payload);
  setToken(tokenData.token);
  const userRes = await apiFetch("/api/v1/user", { method: "GET" });
  if (!userRes.ok) throw new Error("Failed to fetch user after register");
  const user = (await userRes.json()) as UserData;
  return { user };
}

export async function logout(): Promise<void> {
  const authMode = getAuthMode();

  if (authMode === "cookie") {
    await apiPost<MessageData>("/api/v1/logout");
  } else {
    setToken(null);
  }
}

export async function getCurrentUser(
  init?: ApiRequestInit
): Promise<UserData | null> {
  const res = await apiFetch("/api/v1/user", { ...init, method: "GET" });
  if (res.status === 401) return null;
  if (!res.ok) throw new Error("Failed to fetch user");
  const data = (await res.json()) as UserData;
  return data;
}
