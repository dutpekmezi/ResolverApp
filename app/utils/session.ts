// app/sessions.ts
import { createCookieSessionStorage } from "@remix-run/node"; // or cloudflare/deno

type SessionData = {
    scene:string;
    accessToken:string;
    userId:string;
};

type SessionFlashData = {
  error: string;
};

export const { getSession, commitSession, destroySession } =
    createCookieSessionStorage<SessionData, SessionFlashData>(
    {
      // a Cookie from `createCookie` or the CookieOptions to create one
      cookie: {
        name: "resolve_session",
        maxAge: 1200,
        secrets: ["s3cret1"]
      },
    }
  );