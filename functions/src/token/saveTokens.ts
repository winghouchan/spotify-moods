import admin from "firebase-admin";
import { logger } from "firebase-functions";
import spotify from "../spotify";
import { Awaited } from "../utils";

export default async function saveTokens(
  userId: string,
  data: Awaited<ReturnType<typeof spotify.authorizationCodeGrant>>["body"]
) {
  logger.log("Saving Spotify tokens");

  await admin
    .database()
    .ref(`/tokens/${userId}`)
    .set({
      ...data,
      refresh_at: Date.now() + data.expires_in * 1000,
    });

  logger.log("Successfully saved Spotify tokens");
}
