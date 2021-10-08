import admin, { auth } from "firebase-admin";
import { logger } from "firebase-functions";
import { performance } from "perf_hooks";

export default async function updateOrCreateUser(
  userId: string,
  data: Omit<auth.UpdateRequest, "multiFactor">
) {
  const startTime = performance.now();

  try {
    logger.info("Attempting to update user information from Spotify");
    await admin.auth().updateUser(userId, data);
    logger.info(
      `Successfully updated user information from Spotify, took ${
        performance.now() - startTime
      } ms`
    );
  } catch (error: any) {
    if (error.code === "auth/user-not-found") {
      logger.info("User not found during attempt to update, creating user");
      await admin.auth().createUser({
        uid: userId,
        ...data,
      });
      logger.info(
        `Successfully created user, took ${performance.now() - startTime} ms`
      );

      logger.info("Schedule next play history request");
      await admin
        .database()
        .ref(`fetchHistory/${userId}`)
        .update({ refresh_at: Date.now() });
      logger.info("Successfully scheduled next play history request");
    }
  }
}
