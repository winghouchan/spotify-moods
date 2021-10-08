import { logger, pubsub } from "firebase-functions";
import spotify from "../spotify";
import queryUsersForSpotifyTokenRefresh from "./queryUsersForSpotifyTokenRefresh";
import revokeTokens from "./revokeTokens";
import updateSpotifyAccessTokens from "./updateSpotifyTokens";

/**
 * Refreshes Spotify access token
 *
 * @see https://developer.spotify.com/documentation/general/guides/authorization-guide/#4-requesting-a-refreshed-access-token-spotify-returns-a-new-access-token-to-your-app
 */
const refreshToken = pubsub.schedule("every 1 minutes").onRun(async () => {
  const tokenRecords = await queryUsersForSpotifyTokenRefresh();

  if (tokenRecords.length > 0) {
    await Promise.all(
      tokenRecords.map(async ([userId, { access_token, refresh_token }]) => {
        logger.info("Requesting new Spotify access token");

        spotify.setAccessToken(access_token);
        spotify.setRefreshToken(refresh_token);

        try {
          const { body: refreshAccessTokenData } =
            await spotify.refreshAccessToken();

          logger.log("Successfully requested new Spotify access token");

          await updateSpotifyAccessTokens(userId, refreshAccessTokenData);
        } catch (error: any) {
          if (error.body?.error === "invalid_grant") {
            logger.info(
              `Request for new Spotify access token failed${
                error.body?.error_description
                  ? ` because: "${error.body.error_description}"`
                  : ""
              }, revoking application refresh token and removing Spotify token record`
            );

            await revokeTokens(userId);

            return;
          }

          logger.error(error);

          throw error;
        }
      })
    );
  }
});

export default refreshToken;
