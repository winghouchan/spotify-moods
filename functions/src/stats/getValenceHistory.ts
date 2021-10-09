import admin from "firebase-admin";
import { logger } from "firebase-functions";
import { performance } from "perf_hooks";

interface UserFetchHistoryObject {
  [key: string]: number;
}

export default async function getValenceHistory({
  start,
  end,
  userId,
}: {
  start: number;
  end: number;
  userId: string;
}) {
  logger.info(
    `Querying user's valence history from ${new Date(
      start
    ).toISOString()} to ${new Date(end).toISOString()}`
  );

  const perfStartTime = performance.now();

  const valenceHistory: UserFetchHistoryObject = (
    await admin
      .database()
      .ref(`valenceHistory/${userId}`)
      .orderByKey()
      .startAt(`${start}`)
      .endAt(`${end}`)
      .once("value")
  ).val();

  const perfEndTime = performance.now();

  logger.info(
    `Successfully queried user's valence history, found ${
      valenceHistory ? Object.values(valenceHistory).length : 0
    } records from ${new Date(start).toISOString()} to ${new Date(
      end
    ).toISOString()}, took ${perfEndTime - perfStartTime} ms`
  );

  return valenceHistory;
}
