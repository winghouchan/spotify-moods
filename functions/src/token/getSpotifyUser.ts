import { logger } from "firebase-functions";
import { performance } from "perf_hooks";
import spotify from "../spotify";

export default async function getSpotifyUser() {
  logger.info("Requesting Spotify user information");

  const startTime = performance.now();

  const { body: user } = await spotify.getMe();

  const endTime = performance.now();

  logger.info(
    `Successfully requested Spotify user information, took ${
      endTime - startTime
    } ms`
  );

  return user;
}
