import admin from "firebase-admin";
import { logger } from "firebase-functions";
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
  logger.log("Reading user's play history");

  const playHistory: UserPlayHistoryObject["history"] = (
    await admin
      .database()
      .ref(`playHistory/${userId}/history`)
      .orderByKey()
      .startAt(`${start}`)
      .endAt(`${end}`)
      .once("value")
  ).val();

  logger.log("Successfully read user's play history");

  return playHistory;
}
