import { NextRequest, NextResponse } from "next/server";
import { unsealData } from "iron-session";
import { sessionConfig } from "./app/auth/session";

export const config = {
  matcher: "/((?!auth|_next/static|_next/image|favicon.ico|health).*)",
};

export async function middleware(request: NextRequest) {
  // we must enable the access on form answer pages for public access
  const pathname = new URL(request.url).pathname;

  const basePath = pathname.split("/")[1];

  if (["forms", "paps", "votes"].includes(basePath)) {
    const splitPath = pathname.split("/");

    // /forms/:id/ or /paps/:id/ or /votes/:id/  => 3 / in url path
    if (
      splitPath.length == 3 ||
      (splitPath.length == 4 && splitPath[3] == "success")
    ) {
      return NextResponse.next();
    }
  }

  // chekc auth for other pages
  const sessionCookie = request.cookies.get(sessionConfig.sessionToken);

  if (!sessionCookie) {
    return redirectToLogin(request);
  }

  const user = await unsealData(sessionCookie.value, {
    password: sessionConfig.password,
  });

  if (!user) {
    return redirectToLogin(request);
  }

  return NextResponse.next();
}

function redirectToLogin(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/auth/login", request.url));

  // we need to save the current url to redirect the user after login
  response.cookies.set("redirect", new URL(request.url).pathname);

  return response;
}
