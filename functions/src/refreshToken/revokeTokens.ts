import { auth, database } from "firebase-admin";
import { logger } from "firebase-functions";
import { performance } from "perf_hooks";

export default async function revokeTokens(userId: string) {
  logger.info(
    `Revoking application refresh token and removing Spotify token record`
  );

  const startTime = performance.now();

  await auth().revokeRefreshTokens(userId);
  await database().ref(`/tokens/${userId}`).remove();

  const endTime = performance.now();

  logger.info(
    `Successfully revoked application refresh token and removed Spotify token record, took ${
      endTime - startTime
    } ms`
  );
}
