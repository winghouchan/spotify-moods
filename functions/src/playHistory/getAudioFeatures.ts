import { logger } from "firebase-functions";
import { performance } from "perf_hooks";
import spotify from "../spotify";

export default async function getAudioFeatures(trackIds: string[]) {
  logger.info(
    "Requesting audio features for recently played tracks from Spotify"
  );

  const startTime = performance.now();

  const {
    body: { audio_features },
  } = await spotify.getAudioFeaturesForTracks(trackIds);

  const endTime = performance.now();

  logger.info(
    `Successfully requested audio features for recently played tracks from Spotify, took ${
      endTime - startTime
    } ms`
  );

  return audio_features;
}
