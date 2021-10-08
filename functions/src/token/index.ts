import cookieParser from "cookie-parser";
import { https, logger } from "firebase-functions";
import spotify from "../spotify";
import createToken from "./createToken";
import getSpotifyTokens from "./getSpotifyTokens";
import getSpotifyUser from "./getSpotifyUser";
import saveTokens from "./saveTokens";
import updateOrCreateUser from "./updateOrCreateUser";

/**
 * Gets Spotify tokens for user and creates application access token
 *
 * @see https://developer.spotify.com/documentation/general/guides/authorization-guide/#2-have-your-application-request-refresh-and-access-tokens-spotify-returns-access-and-refresh-tokens
 */
const token = https.onRequest((request, response) => {

  if (request.method === "OPTIONS") {
    // Send response to OPTIONS requests
    response.set("Access-Control-Allow-Methods", "GET");
    response.set("Access-Control-Allow-Headers", "Content-Type");
    response.set("Access-Control-Max-Age", "3600");
    response.status(204).send("");
  }

  cookieParser()(request, response, async () => {
    if (process.env.NODE_ENV !== "development") {
      if (!request.cookies?.state) {
        const error = {
          status: 422,
          message:
            "State cookie not set or expired. Maybe you took too long to authorize. Please try again.",
        };

        logger.info("Access token requested without state cookie");
        return response.status(error.status).json(error);
      } else if (
        request.cookies.state !== request.query?.state &&
        request.cookies.state !== request.body?.data.state
      ) {
        const error = {
          status: 422,
          message: "State validation failed.",
        };

        logger.info("Access token requested but state validation failed");
        return response.status(error.status).json(error);
      }
    }

    if (
      typeof request.query.code === "string" ||
      typeof request.body?.data.code === "string"
    ) {
      const authorizationCodeGrantData = await getSpotifyTokens(
        request.query.code || request.body.data.code
      );

      spotify.setAccessToken(authorizationCodeGrantData.access_token);

      const user = await getSpotifyUser();

      const userId = `spotify:${user.id}`;

      await updateOrCreateUser(userId, {
        displayName: user.display_name,
        photoURL: user.images?.[0]?.url,
        email: user.email,
        emailVerified: true,
      });

      await saveTokens(userId, authorizationCodeGrantData);

      const token = await createToken(userId);

      return response.json({ data: { token } });
    } else {
      const error = {
        status: 422,
        message: "Code query parameter invalid or missing.",
      };

      logger.info(
        "Token requested but code query parameter invalid or missing"
      );
      return response.status(error.status).json(error);
    }
  });
});

export default token;
