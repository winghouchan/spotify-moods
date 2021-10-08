import { logger } from "firebase-functions";
import { performance } from "perf_hooks";
import spotify from "../spotify";

export default async function getRecentlyPlayedTracks(cursor?: number) {
  logger.info(
    `Requesting recently played tracks from Spotify after ${
      cursor ? new Date(cursor).toISOString() : ""
    }`
  );

  const startTime = performance.now();

  const {
    body: { items: recentlyPlayedTracks },
  } = await spotify.getMyRecentlyPlayedTracks({
    limit: 50,
    after: cursor,
  });

  const endTime = performance.now();

  logger.info(
    `Successfully requested ${
      recentlyPlayedTracks.length
    } recently played tracks from Spotify, took ${endTime - startTime} ms`
  );

  return recentlyPlayedTracks;
}
