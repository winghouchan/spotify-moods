import * as functions from "firebase-functions";
// @ts-ignore
import * as SpotifyApi from "spotify-web-api-node";

const spotify = new SpotifyApi({
  clientId: functions.config().spotify.client_id,
  clientSecret: functions.config().spotify.client_secret,
  redirectUri:
    (process.env.NODE_ENV === "development" &&
      "https://spotify-moods.localhost:3000/signin") ||
    (process.env.NODE_ENV === "production" &&
      `https://${process.env.GCLOUD_PROJECT}.web.app/signin`) ||
    undefined,
});

export default spotify;
