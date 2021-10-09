import { logger, pubsub } from "firebase-functions";
import spotify from "../spotify";
import queryUserSpotifyAccessToken from "../utils/queryUserSpotifyAccessToken";
import buildAudioFeatureHistoryUpdateObject from "./buildAudioFeatureHistoryUpdateObject";
import buildPlayHistoryUpdateObject from "./buildPlayHistoryWithAudioFeaturesUpdateObject";
import buildValenceHistoryUpdateObject from "./buildValenceHistoryUpdateObject";
import deduplicateRecentlyPlayedTrackIds from "./deduplicateRecentlyPlayedTrackIds";
import getAudioFeatures from "./getAudioFeatures";
import getMyRecentlyPlayedTracks from "./getRecentlyPlayedTracks";
import queryUsersForHistoryRefresh from "./queryUsersForHistoryRefresh";
import updatePlayHistory from "./updatePlayHistory";

interface UserFetchHistoryObject {
  cursor?: number;
  refresh_at?: number;
}

/**
 * Gets and stores user play history from Spotify along with audio features for each track
 *
 * @see https://developer.spotify.com/documentation/web-api/reference/#endpoint-get-recently-played
 * @see https://developer.spotify.com/documentation/web-api/reference/#endpoint-get-several-audio-features
 */
const playHistory = pubsub.schedule("every 1 minutes").onRun(async () => {
  const data = await queryUsersForHistoryRefresh();

  const records = Object.entries<UserFetchHistoryObject>(data.val() || {});

  if (records.length > 0) {
    logger.info(`Updating play history for ${records.length} users`);

    await Promise.all(
      records.map(async ([user, { cursor }]) => {
        const access_token = await queryUserSpotifyAccessToken(user);

        spotify.setAccessToken(access_token);

        const recentlyPlayedTracks = await getMyRecentlyPlayedTracks(cursor);

        if (recentlyPlayedTracks.length > 0) {
          const deduplicatedRecentlyPlayedTrackIds =
            deduplicateRecentlyPlayedTrackIds(recentlyPlayedTracks);

          const deduplicatedRecentlyPlayedTrackFeatures =
            await getAudioFeatures(deduplicatedRecentlyPlayedTrackIds);

          const audioFeaturesHistoryUpdateObject =
            buildAudioFeatureHistoryUpdateObject(
              recentlyPlayedTracks,
              deduplicatedRecentlyPlayedTrackFeatures
            );

          const playHistoryUpdateObject =
            buildPlayHistoryUpdateObject(recentlyPlayedTracks);

          const valenceHistoryUpdateObject = buildValenceHistoryUpdateObject(
            audioFeaturesHistoryUpdateObject
          );

          const lastPlayed =
            recentlyPlayedTracks[recentlyPlayedTracks.length - 1].played_at;

          await updatePlayHistory(
            user,
            lastPlayed,
            playHistoryUpdateObject,
            audioFeaturesHistoryUpdateObject,
            valenceHistoryUpdateObject
          );
        }
      })
    );
  } else {
    logger.info("No users require play history updates");
  }
});

export default playHistory;
