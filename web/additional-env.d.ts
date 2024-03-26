declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SESSION_SECRET: string;

      OAUTH_CLIENT: string;
      OAUTH_SECRET: string;

      WEB_URL: string;
      API_URL: string;
    }
  }
}

export {};
