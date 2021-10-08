import admin from "firebase-admin";
import { auth, logger } from "firebase-functions";
import { performance } from "perf_hooks";

/**
 * Deletes user data
 */
const deleteUser = auth.user().onDelete(async (user) => {
  logger.info("Deleting user data");

  const startTime = performance.now();

  Promise.all([
    await admin.database().ref(`tokens/${user.uid}`).remove(),
    await admin.database().ref(`playHistory/${user.uid}`).remove(),
  ]);

  const endTime = performance.now();

  logger.info(`Successfully deleted user data, took ${endTime - startTime} ms`);
});

export default deleteUser;
