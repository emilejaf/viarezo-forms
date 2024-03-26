import { redirect } from "next/navigation";
import { nanoid } from "nanoid";
import { getSessionData, sessionConfig } from "../session";
import { getAuthorizationURI } from "../oauth";

export const dynamic = "force-dynamic";

// the user will be redirected to this route to login with viarezo oauth
export async function GET() {
  // generate a random state to prevent csrf
  const state = nanoid();

  // save the state in the session
  const stateSession = await getSessionData<{ state: string }>(
    sessionConfig.stateToken,
  );
  stateSession.state = state;
  await stateSession.save();

  // redirect the user to the oauth login page
  redirect(getAuthorizationURI(state));
}
