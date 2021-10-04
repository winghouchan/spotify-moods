import { logger } from "firebase-functions";
import spotify from "../spotify";

export default async function getRecentlyPlayedTracks(cursor?: number) {
  logger.log(`Requesting recently played tracks from Spotify after ${cursor}`);

  const {
    body: { items: recentlyPlayedTracks },
  } = await spotify.getMyRecentlyPlayedTracks({
    limit: 50,
    after: cursor,
  });

  logger.log(
    `Successfully requested ${recentlyPlayedTracks.length} recently played tracks from Spotify`
  );

  return recentlyPlayedTracks;
}
