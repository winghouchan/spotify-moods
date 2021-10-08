import admin from "firebase-admin";
import { logger } from "firebase-functions";
import { performance } from "perf_hooks";

export default async function queryUserSpotifyAccessToken(userId: string) {
  logger.info("Querying Spotify access token for user");

  const startTime = performance.now();

  const { access_token } = await (
    await admin.database().ref("tokens").child(userId).once("value")
  ).val();

  const endTime = performance.now();

  logger.info(
    `Successfully queried Spotify access token for user, took ${
      endTime - startTime
    } ms`
  );

  return access_token;
}
