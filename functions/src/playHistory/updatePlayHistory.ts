import admin from "firebase-admin";
import { logger } from "firebase-functions";
import { performance } from "perf_hooks";

export default async function updatePlayHistory(
  user: string,
  lastPlayed: string,
  playHistory: { [key: string]: SpotifyApi.PlayHistoryObject },
  audioFeaturesHistory: { [key: string]: SpotifyApi.AudioFeaturesObject },
  valenceHistory: { [key: string]: number }
) {
  logger.info("Updating cursor, play history and next refresh timestamp");

  const startTime = performance.now();

  await admin
    .database()
    .ref()
    .update({
      [`fetchHistory/${user}`]: {
        cursor: Date.parse(lastPlayed),
        refresh_at: Date.parse(lastPlayed) + 60000,
      },
      ...Object.entries(playHistory).reduce(
        (accumulator, [key, value]) => ({
          ...accumulator,
          [`playHistory/${user}/${key}`]: value,
        }),
        {}
      ),
      ...Object.entries(audioFeaturesHistory).reduce(
        (accumulator, [key, value]) => ({
          ...accumulator,
          [`audioFeatureHistory/${user}/${key}`]: value,
        }),
        {}
      ),
      ...Object.entries(valenceHistory).reduce(
        (accumulator, [key, value]) => ({
          ...accumulator,
          [`valenceHistory/${user}/${key}`]: value,
        }),
        {}
      ),
    });

  const endTime = performance.now();

  logger.info(
    `Successfully updated cursor, play history and next refresh timestamp, took ${
      endTime - startTime
    } ms`
  );
}
