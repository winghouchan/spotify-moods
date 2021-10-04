import { logger } from "firebase-functions";
import spotify from "../spotify";

export default async function getAudioFeatures(trackIds: string[]) {
  logger.log(
    "Requesting audio features for recently played tracks from Spotify"
  );

  const {
    body: { audio_features },
  } = await spotify.getAudioFeaturesForTracks(trackIds);

  logger.log(
    "Successfully requested audio features for recently played tracks from Spotify"
  );

  return audio_features;
}
