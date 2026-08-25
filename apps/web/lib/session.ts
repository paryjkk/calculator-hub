"use client";

import type { Locale } from "@calc/shared";

export interface PublicUser {
  id: string;
  email: string;
  displayName: string;
  role: "USER" | "ADMIN";
}

export interface SavedCalculation {
  id: string;
  slug: string;
  name: string;
  inputs: Record<string, unknown>;
  result: Record<string, unknown>;
  createdAt: string;
}

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api/v1${path}`, {
    credentials: "include",
    ...init,
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });
  const payload = (await res.json().catch(() => null)) as
    | (T & { message?: unknown })
    | null;
  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    if (typeof payload?.message === "string") msg = payload.message;
    else if (Array.isArray(payload?.message))
      msg = (payload.message as unknown[]).map(String).join("، ");
    throw new Error(msg);
  }
  return payload as T;
}

export function getMe(): Promise<PublicUser> {
  return api<PublicUser>("/auth/me");
}

export function login(email: string, password: string) {
  return api<{ user: PublicUser }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function register(displayName: string, email: string, password: string) {
  return api<{ user: PublicUser }>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ displayName, email, password }),
  });
}

export function logout() {
  return api<{ ok: true }>("/auth/logout", { method: "POST" });
}

export function listSaved(): Promise<SavedCalculation[]> {
  return api<SavedCalculation[]>("/me/calculations");
}

export function saveCalculation(p: {
  slug: string;
  name: string;
  inputs: Record<string, unknown>;
  result: Record<string, unknown>;
}) {
  return api<SavedCalculation>("/me/calculations", {
    method: "POST",
    body: JSON.stringify(p),
  });
}

export function deleteSaved(id: string) {
  return api<{ ok: true }>(`/me/calculations/${id}`, { method: "DELETE" });
}
