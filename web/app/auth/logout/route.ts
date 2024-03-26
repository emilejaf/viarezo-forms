import { redirect } from "next/navigation";
import { oauthConfig } from "../oauth";
import { getSessionData, sessionConfig } from "../session";

export const dynamic = "force-dynamic";

export async function GET() {
  // delete the session
  const session = await getSessionData(sessionConfig.sessionToken);
  session.destroy();

  // logout from viarezo
  redirect(
    oauthConfig.logout +
      "?redirect_logout=" +
      process.env.WEB_URL +
      "/auth/login"
  );
}
