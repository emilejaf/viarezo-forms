import { SessionOptions, getIronSession } from "iron-session";
import { cookies } from "next/headers";

export const sessionConfig: {
  password: string;
  cookieOptions: SessionOptions["cookieOptions"];
  stateToken: string;
  sessionToken: string;
} = {
  password: process.env.SESSION_SECRET,
  cookieOptions: {
    maxAge: undefined, // Session token is valid until the browser is closed
    secure: process.env.NODE_ENV === "production",
  },
  stateToken: "state-token",
  sessionToken: "session-token",
};

export interface User {
  id: number;
  login: string;
  firstName: string;
  lastName: string;
  email: string;
  promo: number;
  personType: string;
  photo: string;
  accessToken: string;
}

export async function getSessionData<T extends object>(cookieName: string) {
  if (!sessionConfig.password) throw new Error("SESSION_SECRET is not defined");

  const session = await getIronSession<T>(cookies(), {
    password: sessionConfig.password,
    cookieName: cookieName,
    cookieOptions: sessionConfig.cookieOptions,
  });

  return session;
}

export async function getCurrentUser(): Promise<User | null> {
  const session = await getSessionData<{ user: User }>(
    sessionConfig.sessionToken
  );
  return session.user;
}
