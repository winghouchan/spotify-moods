import * as Spotify from "spotify-web-api-node";

const spotify = new Spotify();

spotify.setAccessToken(process.env.TOKEN);

async function main() {
  const {
    body: { items: recentlyPlayedTracks },
  } = await spotify.getMyRecentlyPlayedTracks();
  const deduplicatedRecentlyPlayedTrackIds = [
    ...new Set(recentlyPlayedTracks.map(({ track: { id } }) => id)),
  ];
  const {
    body: { audio_features: deduplicatedRecentlyPlayedTrackFeatures },
  } = await spotify.getAudioFeaturesForTracks(
    deduplicatedRecentlyPlayedTrackIds
  );
  const recentlyPlayedTracksWithAudioFeatures = recentlyPlayedTracks.map(
    (playHistory) => ({
    ...playHistory,
      audio_features: deduplicatedRecentlyPlayedTrackFeatures.find(
        ({ id }) => id === playHistory.track.id
      ),
    })
  );

  return recentlyPlayedTracksWithAudioFeatures;
}

main();
