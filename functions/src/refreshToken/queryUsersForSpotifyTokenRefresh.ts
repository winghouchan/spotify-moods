import admin from "firebase-admin";
import { logger } from "firebase-functions";
import { performance } from "perf_hooks";
import spotify from "../spotify";
import { Awaited } from "../utils";

export default async function queryUsersForSpotifyTokenRefresh() {
  logger.info("Querying Spotify token records that need refreshing");

  const startTime = performance.now();

  const tokenRecords = Object.entries<
    Awaited<ReturnType<typeof spotify.authorizationCodeGrant>>["body"]
  >(
    (
      await admin
        .database()
        .ref("tokens")
        .orderByChild("refresh_at")
        .endAt(Date.now())
        .once("value")
    ).val() || {}
  );

  const endTime = performance.now();

  logger.info(
    `Found ${
      tokenRecords.length
    } Spotify token records that need refreshing, took ${
      endTime - startTime
    } ms`
  );

  return tokenRecords;
}
