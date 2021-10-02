import * as functions from "firebase-functions";
// @ts-ignore
import * as SpotifyApi from "spotify-web-api-node";

const spotify = new SpotifyApi({
  clientId: functions.config().spotify.client_id,
  clientSecret: functions.config().spotify.client_secret,
  redirectUri:
    (process.env.NODE_ENV === "development" &&
      "https://spotify-moods.localhost:3000/authorize") ||
    (process.env.NODE_ENV === "production" &&
      `http://${process.env.GCLOUD_PROJECT}.web.app/authorize`) ||
    undefined,
});

export default spotify;
