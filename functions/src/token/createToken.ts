import admin from "firebase-admin";
import { logger } from "firebase-functions";

export default async function createToken(userId: string) {
  logger.info("Creating application access token");

  const token = await admin.auth().createCustomToken(userId);

  logger.info("Successfully created application access token");

  return token;
}
