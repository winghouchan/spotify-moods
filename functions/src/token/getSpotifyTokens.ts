import { logger } from "firebase-functions";
import spotify from "../spotify";

export default async function getSpotifyTokens(code: string) {
  logger.info("Requesting Spotify tokens via authorization code grant flow");

  const { body: authorizationCodeGrantData } =
    await spotify.authorizationCodeGrant(code);

  logger.info(
    "Successfully requested Spotify tokens via authorization code grant flow"
  );

  return authorizationCodeGrantData;
}
