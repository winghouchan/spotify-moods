export default function deduplicateRecentlyPlayedTrackIds(
  recentlyPlayedTracks: SpotifyApi.PlayHistoryObject[]
) {
  return [...new Set(recentlyPlayedTracks.map(({ track: { id } }) => id))];
}
