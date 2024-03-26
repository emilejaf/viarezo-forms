import { redirect } from "next/navigation";
import { User, getSessionData, sessionConfig } from "../session";
import { fetchUserData, getAccessToken } from "../oauth";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const params = new URLSearchParams(request.url.split("?")[1]);

  const code = params.get("code");
  const state = params.get("state");

  const stateSession = await getSessionData<{ state: string }>(
    sessionConfig.stateToken,
  );

  if (stateSession.state !== state || !code) {
    redirect("/auth/login");
  }

  stateSession.destroy();

  const token = await getAccessToken(code);

  const user = await fetchUserData(token);

  const session = await getSessionData<{ user: User }>(
    sessionConfig.sessionToken,
  );
  session.user = user;
  await session.save();

  // check for a redirect url in a cookie
  const redirectCookie = cookies().get("redirect");

  const redirectUrl = redirectCookie ? redirectCookie.value : "/";

  // remove the redirect cookie
  cookies().delete("redirect");

  redirect(redirectUrl);
}
