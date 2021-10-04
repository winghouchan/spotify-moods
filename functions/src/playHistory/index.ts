import admin from "firebase-admin";
import * as functions from "firebase-functions";
import spotify from "../spotify";
import addAudioFeaturesToRecentlyPlayedTracks from "./addAudioFeaturesToRecentlyPlayedTracks";
import buildPlayHistoryWithAudioFeaturesUpdateObject from "./buildPlayHistoryWithAudioFeaturesUpdateObject";
import deduplicateRecentlyPlayedTrackIds from "./deduplicateRecentlyPlayedTrackIds";
import getAudioFeatures from "./getAudioFeatures";
import getMyRecentlyPlayedTracks from "./getRecentlyPlayedTracks";
import updatePlayHistory from "./updatePlayHistory";

export type PlayHistoryWithAudioFeatures = SpotifyApi.PlayHistoryObject & {
  audio_features?: SpotifyApi.AudioFeaturesObject;
};

export interface UserPlayHistoryObject {
  cursor?: number;
  history?: {
    [key: string]: PlayHistoryWithAudioFeatures;
  };
  refresh_at?: number;
}

/**
 * Gets and stores user play history from Spotify along with audio features for each track
 *
 * @see https://developer.spotify.com/documentation/web-api/reference/#endpoint-get-recently-played
 * @see https://developer.spotify.com/documentation/web-api/reference/#endpoint-get-several-audio-features
 */
const playHistory = functions.pubsub
  .schedule("every 1 minutes")
  .onRun(async () => {
    const data = await admin
      .database()
      .ref("playHistory")
      .orderByChild("refresh_at")
      .endAt(Date.now())
      .once("value");

    const records = Object.entries<UserPlayHistoryObject>(data.val() || {});

    if (records.length > 0) {
      functions.logger.log(`Updating play history for ${records.length} users`);

      await Promise.all(
        records.map(async ([user, { cursor }]) => {
          const { access_token } = await (
            await admin.database().ref("tokens").child(user).once("value")
          ).val();

          spotify.setAccessToken(access_token);

          const recentlyPlayedTracks = await getMyRecentlyPlayedTracks(cursor);

          if (recentlyPlayedTracks.length > 0) {
            const deduplicatedRecentlyPlayedTrackIds =
              deduplicateRecentlyPlayedTrackIds(recentlyPlayedTracks);

            const deduplicatedRecentlyPlayedTrackFeatures =
              await getAudioFeatures(deduplicatedRecentlyPlayedTrackIds);

            const recentlyPlayedTracksWithAudioFeaturesArray =
              addAudioFeaturesToRecentlyPlayedTracks(
                recentlyPlayedTracks,
                deduplicatedRecentlyPlayedTrackFeatures
              ).sort(
                (a, b) => Date.parse(a.played_at) - Date.parse(b.played_at)
              );

            const playHistoryWithAudioFeaturesUpdateObject =
              buildPlayHistoryWithAudioFeaturesUpdateObject(
                recentlyPlayedTracksWithAudioFeaturesArray
              );

            const lastPlayed =
              recentlyPlayedTracksWithAudioFeaturesArray[
                recentlyPlayedTracksWithAudioFeaturesArray.length - 1
              ].played_at;

            updatePlayHistory(
              user,
              lastPlayed,
              playHistoryWithAudioFeaturesUpdateObject
            );
          }
        })
      );
    } else {
      functions.logger.log("No users require play history updates");
    }
  });

export default playHistory;
