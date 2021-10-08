import admin from "firebase-admin";
import { logger } from "firebase-functions";
import { performance } from "perf_hooks";

export default async function queryUsersForHistoryRefresh() {
  logger.info("Querying users scheduled for a play history update");

  const startTime = performance.now();

  const data = await admin
    .database()
    .ref("playHistory")
    .orderByChild("refresh_at")
    .endAt(Date.now())
    .once("value");

  const endTime = performance.now();

  logger.info(
    `Successfully queried users scheduled for a play history update, took ${
      endTime - startTime
    } ms`
  );

  return data;
}
