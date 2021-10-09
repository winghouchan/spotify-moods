export default function buildValenceHistoryUpdateObject(audioFeaturesHistory: {
  [key: string]: SpotifyApi.AudioFeaturesObject;
}) {
  return Object.entries(audioFeaturesHistory).reduce(
    (accumulator, [key, { valence }]) => ({
      ...accumulator,
      [key]: valence,
    }),
    {}
  );
}
