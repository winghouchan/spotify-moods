import admin from "firebase-admin";
import { logger } from "firebase-functions";
import { UserPlayHistoryObject } from "../playHistory";

/**
 * The smallest possible time value in JavaScript. Used for defining the
 * beginning of the time boundary to search for records in.
 * @see https://262.ecma-international.org/5.1/#sec-15.9.1.1
 */
const minDate = -8640000000000000;

export default async function getPlayHistory({
  after,
  before,
  userId,
}: {
  after?: number;
  before?: number;
  userId: string;
}) {
  const startAt = `${typeof after === "number" ? after : minDate}`;
  const endAt = `${typeof before === "number" ? before : Date.now()}`;

  logger.log("Reading user's play history");

  const playHistory: UserPlayHistoryObject["history"] = (
    await admin
      .database()
      .ref(`playHistory/${userId}/history`)
      .orderByKey()
      .startAt(startAt)
      .endAt(endAt)
      .once("value")
  ).val();

  logger.log("Successfully read user's play history");

  return playHistory;
}
