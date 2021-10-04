export default function addAudioFeaturesToRecentlyPlayedTracks(
  recentlyPlayedTracks: SpotifyApi.PlayHistoryObject[],
  audioFeatures: SpotifyApi.AudioFeaturesObject[]
) {
  return recentlyPlayedTracks.map((recentlyPlayedTrack) => ({
    ...recentlyPlayedTrack,
    audio_features: audioFeatures.find(
      ({ id }) => id === recentlyPlayedTrack.track.id
    ),
  }));
}
