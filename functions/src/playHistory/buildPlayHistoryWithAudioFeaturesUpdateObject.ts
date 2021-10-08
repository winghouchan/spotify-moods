import { PlayHistoryWithAudioFeatures } from ".";

export default function buildPlayHistoryWithAudioFeaturesUpdateObject(
  array: PlayHistoryWithAudioFeatures[]
) {
  return array.reduce(
    (accumulator, recentlyPlayedTrack) => ({
      ...accumulator,
      [Date.parse(recentlyPlayedTrack.played_at)]: recentlyPlayedTrack,
    }),
    {}
  );
}
