import { logger } from "firebase-functions";
import spotify from "../spotify";

export default async function getSpotifyUser() {
  logger.info("Requesting Spotify user information");

  const { body: user } = await spotify.getMe();

  logger.info("Successfully requested Spotify user information");

  return user;
}
