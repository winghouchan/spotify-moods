import admin from "firebase-admin";
import { logger } from "firebase-functions";
import { performance } from "perf_hooks";
import { PlayHistoryWithAudioFeatures } from ".";

export default async function updatePlayHistory(
  user: string,
  lastPlayed: string,
  updateObject: { [key: string]: PlayHistoryWithAudioFeatures }
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
      ...Object.entries(updateObject).reduce(
        (accumulator, [key, value]) => ({
          ...accumulator,
          [`playHistory/${user}/${key}`]: value,
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
