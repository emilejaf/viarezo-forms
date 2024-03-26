import { User } from "./session";

export const oauthConfig = {
  authorization: {
    url: "https://auth.viarezo.fr/oauth/authorize",
    scope: "default linkcs:read linkcs-user:read linkcs-asso:read",
  },
  callback: process.env.WEB_URL + "/auth/callback",
  token: "https://auth.viarezo.fr/oauth/token",
  userinfo: "https://auth.viarezo.fr/api/user/show/me",
  logout: "https://auth.viarezo.fr/logout",
  clientId: process.env.OAUTH_CLIENT,
  cleintSecret: process.env.OAUTH_SECRET,
};

export function getAuthorizationURI(state: string) {
  const params = new URLSearchParams({
    redirect_uri: oauthConfig.callback,
    client_id: process.env.OAUTH_CLIENT,
    response_type: "code",
    scope: oauthConfig.authorization.scope,
    state,
  });

  return oauthConfig.authorization.url + "?" + params.toString();
}

export async function getAccessToken(code: string) {
  const body = {
    grant_type: "authorization_code",
    code: code,
    redirect_uri: oauthConfig.callback,
    client_id: oauthConfig.clientId,
    client_secret: oauthConfig.cleintSecret,
  };

  const response = await fetch(oauthConfig.token, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(body),
  });

  const json = await response.json();

  return json.access_token;
}

export async function fetchUserData(token: string): Promise<User> {
  const response = await fetch(oauthConfig.userinfo, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await response.json();

  return {
    id: json.id,
    login: json.login,
    firstName: json.firstName,
    lastName: json.lastName,
    email: json.email,
    promo: json.promo,
    personType: json.personType,
    photo: getProfilePictureUrl(json.photo),
    accessToken: token,
  };
}

function getProfilePictureUrl(fileName: string) {
  return "https://auth.viarezo.fr/media/" + fileName;
}
