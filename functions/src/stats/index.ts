import { https, logger } from "firebase-functions";
import { mean, median, mode } from "mathjs";
import { PlayHistoryWithAudioFeatures } from "../playHistory";
import getPlayHistory from "./getPlayHistory";

interface RequestData {
  after?: number;
  before?: number;
}

const stats = https.onCall(async (data: RequestData | null, context) => {
  const { after, before } = data ?? {};
  const userId = context.auth?.uid;

  if (userId) {
    const playHistory = await getPlayHistory({
      after,
      before,
      userId,
    });

    if (playHistory) {
      logger.log("Calculating statistics");

      const valence = Object.values<PlayHistoryWithAudioFeatures>(playHistory)
        .map(({ audio_features }) => audio_features?.valence)
        .filter((valence): valence is number => valence !== undefined);

      const stats = {
        max: Math.max(...valence),
        mean: mean(valence),
        median: median(valence),
        min: Math.min(...valence),
        mode: mode(valence),
      };

      logger.log("Successfully calculated statistics");

      return stats;
    }

    logger.log("No play history found");
  }

  return {};
});

export default stats;
