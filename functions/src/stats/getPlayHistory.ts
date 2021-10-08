import admin from "firebase-admin";
import { logger } from "firebase-functions";
import { performance } from "perf_hooks";
import { UserPlayHistoryObject } from "../playHistory";

export default async function getPlayHistory({
  start,
  end,
  userId,
}: {
  start: number;
  end: number;
  userId: string;
}) {
  logger.info(
    `Querying user's play history from ${new Date(
      start
    ).toISOString()} to ${new Date(end).toISOString()}`
  );

  const perfStartTime = performance.now();

  const playHistory: UserPlayHistoryObject["history"] = (
    await admin
      .database()
      .ref(`playHistory/${userId}/history`)
      .orderByKey()
      .startAt(`${start}`)
      .endAt(`${end}`)
      .once("value")
  ).val();

  const perfEndTime = performance.now();

  logger.info(
    `Successfully queried user's play history, found ${
      playHistory ? Object.values(playHistory).length : 0
    } records from ${new Date(start).toISOString()} to ${new Date(
      end
    ).toISOString()}, took ${perfEndTime - perfStartTime} ms`
  );

  return playHistory;
}
