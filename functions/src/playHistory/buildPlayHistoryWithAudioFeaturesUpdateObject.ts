export default function buildPlayHistoryUpdateObject(
  array: SpotifyApi.PlayHistoryObject[]
) {
  return array.reduce(
    (accumulator, recentlyPlayedTrack) => ({
      ...accumulator,
      [Date.parse(recentlyPlayedTrack.played_at)]: recentlyPlayedTrack,
    }),
    {}
  );
}
