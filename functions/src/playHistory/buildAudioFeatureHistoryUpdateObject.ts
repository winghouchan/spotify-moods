export default function buildAudioFeatureHistoryUpdateObject(
  recentlyPlayedTracks: SpotifyApi.PlayHistoryObject[],
  audioFeatures: SpotifyApi.AudioFeaturesObject[]
): {
  [key: string]: SpotifyApi.AudioFeaturesObject;
} {
  return recentlyPlayedTracks.reduce(
    (accumulator, { played_at, track: { id: trackId } }) => ({
      ...accumulator,
      [Date.parse(played_at)]: audioFeatures.find(({ id }) => id === trackId),
    }),
    {}
  );
}
