import admin from "firebase-admin";
import { logger } from "firebase-functions";
import { performance } from "perf_hooks";
import spotify from "../spotify";
import { Awaited } from "../utils";

export default async function saveTokens(
  userId: string,
  data: Awaited<ReturnType<typeof spotify.authorizationCodeGrant>>["body"]
) {
  logger.info("Saving Spotify tokens");

  const startTime = performance.now();

  await admin
    .database()
    .ref(`/tokens/${userId}`)
    .set({
      ...data,
      refresh_at: Date.now() + data.expires_in * 1000,
    });

  const endTime = performance.now();

  logger.info(`Successfully saved Spotify tokens, ${endTime - startTime} ms`);
}
