import { sessionConfig } from "@/app/auth/session";
import { cookies } from "next/headers";
import { APIError } from "./exceptions";

const apiURL = process.env.API_URL;

export async function queryAPI<T>(
  url: string,
  init?: RequestInit | undefined
): Promise<T | APIError> {
  const sessionToken = getSessionToken();

  const res = await fetch(`${apiURL}${url}`, {
    headers: sessionToken
      ? {
          Authorization: `Bearer ${sessionToken}`,
        }
      : undefined,
    ...init,
  });

  if (!res.ok) {
    const error: { statusCode: number; message: string } = await res.json();
    return new APIError(error.message, error.statusCode);
  }

  const data = await res.json();
  return data;
}

export async function mutateAPI(
  url: string,
  method: "POST" | "PATCH" | "DELETE",
  payload?: Record<string, any>
): Promise<{ ok: boolean; payload: any }> {
  const sessionToken = getSessionToken();

  const res = await fetch(`${apiURL}${url}`, {
    headers: {
      Authorization: `Bearer ${sessionToken}`,
      "Content-Type": payload ? "application/json" : "text/plain",
    },
    method: method,
    body: JSON.stringify(payload),
  });

  const text = await res.text();

  return { ok: res.ok, payload: res.ok ? text : JSON.parse(text) };
}

function getSessionToken() {
  return cookies().get(sessionConfig.sessionToken)?.value;
}
