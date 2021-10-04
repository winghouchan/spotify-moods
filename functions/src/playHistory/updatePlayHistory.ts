import admin from "firebase-admin";
import { logger } from "firebase-functions";
import { PlayHistoryWithAudioFeatures } from ".";

export default async function updatePlayHistory(
  user: string,
  lastPlayed: string,
  updateObject: { [key: string]: PlayHistoryWithAudioFeatures }
) {
  logger.log("Updating cursor, play history and next refresh timestamp");

  await admin
    .database()
    .ref(`playHistory/${user}`)
    .update({
      cursor: Date.parse(lastPlayed),
      refresh_at: Date.parse(lastPlayed) + 60000,
      ...updateObject,
    });

  logger.log(
    "Successfully updated cursor, play history and next refresh timestamp"
  );
}
