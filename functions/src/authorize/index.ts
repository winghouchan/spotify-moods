import cookieParser from "cookie-parser";
import crypto from "crypto";
import * as functions from "firebase-functions";
import spotify from "../spotify";

/**
 * Request user authorization with Spotify
 * @see https://developer.spotify.com/documentation/general/guides/authorization-guide/#1-have-your-application-request-authorization-the-user-logs-in-and-authorizes-access
 */
const authorize = functions.https.onRequest((request, response) => {
  cookieParser()(request, response, () => {
    const state =
      request.cookies?.state || crypto.randomBytes(20).toString("hex");
    response.cookie("state", state.toString(), {
      maxAge: 3600000,
      secure: true,
      httpOnly: true,
    });
    response.redirect(
      spotify.createAuthorizeURL(
        ["user-read-recently-played"],
        state.toString()
      )
    );
  });
});

export default authorize;
