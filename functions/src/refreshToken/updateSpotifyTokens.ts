import admin from "firebase-admin";
import { logger } from "firebase-functions";
import { performance } from "perf_hooks";
import spotify from "../spotify";
import { Awaited } from "../utils";

export default async function updateSpotifyAccessTokens(
  userId: string,
  refreshAccessTokenData: Awaited<
    ReturnType<typeof spotify.refreshAccessToken>
  >["body"]
) {
  logger.info("Updating Spotify token record");

  const startTime = performance.now();

  await admin
    .database()
    .ref(`/tokens/${userId}`)
    .update({
      ...refreshAccessTokenData,
      refresh_at: Date.now() + refreshAccessTokenData.expires_in * 1000,
    });

  const endTime = performance.now();

  logger.info(
    `Successfully updated token record, took ${endTime - startTime} ms`
  );
}
