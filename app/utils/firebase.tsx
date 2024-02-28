import type { app } from "firebase-admin";
import admin from "firebase-admin";
import invariant from "tiny-invariant";

let firebaseApp: app.App;

declare global {
  var __firebase__: app.App;
}

// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
// in production we'll have a single connection to the DB.
if (process.env.NODE_ENV === "production") {
  firebaseApp = getApplication();
} else {
  if (!global.__firebase__) {
    global.__firebase__ = getApplication();
  }
  firebaseApp = global.__firebase__;
}

function getApplication() {
  const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } =
    process.env;

  invariant(
    typeof FIREBASE_PROJECT_ID === "string",
    "FIREBASE_PROJECT_ID env var not set"
  );

  invariant(
    typeof FIREBASE_CLIENT_EMAIL === "string",
    "FIREBASE_CLIENT_EMAIL env var not set"
  );

  invariant(
    typeof FIREBASE_PRIVATE_KEY === "string",
    "FIREBASE_PRIVATE_KEY env var not set"
  );

  console.log(`🔌 setting up firebase app for ${FIREBASE_PROJECT_ID}`);
  // NOTE: during development if you change anything in this function, remember
  // that this only runs once per server restart and won't automatically be
  // re-run per request like everything else is. So if you need to change
  // something in this file, you'll need to manually restart the server.
  const firebaseApp = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: FIREBASE_PROJECT_ID,
      clientEmail: FIREBASE_CLIENT_EMAIL,
      privateKey: repairInlinePem(FIREBASE_PRIVATE_KEY),
    }),
  });

  return firebaseApp;
}

function repairInlinePem(str?: string) {
  const x = str ? str.replace(/\\n/g, "\n") : "";
  return x;
}

export { firebaseApp };