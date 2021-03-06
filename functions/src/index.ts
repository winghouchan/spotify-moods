import admin from "firebase-admin";
import serviceAccount from "../../serviceAccountKey.json";

if (process.env.NODE_ENV === undefined) {
  throw new Error("NODE_ENV not defined");
}

admin.initializeApp({
  // @ts-ignore
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${process.env.GCLOUD_PROJECT}.firebaseio.com`,
});

export { default as authorize } from "./authorize";
export { default as deleteUser } from "./deleteUser";
export { default as refreshToken } from "./refreshToken";
export { default as token } from "./token";
export { default as playHistory } from "./playHistory";
export { default as stats } from "./stats";
