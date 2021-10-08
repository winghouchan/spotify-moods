import { logger } from "firebase-functions";
import { performance } from "perf_hooks";
import spotify from "../spotify";

export default async function getSpotifyTokens(code: string) {
  logger.info("Requesting Spotify tokens via authorization code grant flow");

  const startTime = performance.now();

  const { body: authorizationCodeGrantData } =
    await spotify.authorizationCodeGrant(code);

  const endTime = performance.now();

  logger.info(
    `Successfully requested Spotify tokens via authorization code grant flow, took ${
      endTime - startTime
    } ms`
  );

  return authorizationCodeGrantData;
}
