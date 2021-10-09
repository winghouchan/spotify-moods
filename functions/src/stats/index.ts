import {
  eachHourOfInterval,
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
  endOfHour,
  endOfDay,
  endOfWeek,
  endOfMonth,
  isWithinInterval,
  minTime,
} from "date-fns";
import { https, logger } from "firebase-functions";
import { mean, median, mode } from "mathjs";
import getValenceHistory from "./getValenceHistory";

interface RequestData {
  start?: number;
  end?: number;
  interval?: "hour" | "day" | "week" | "month";
}

/**
 * Signifies weeks start on Monday
 * @see https://date-fns.org/v2.25.0/docs/Day
 */
const weekStartsOn = 1;

const startIntervalFn = {
  hour: eachHourOfInterval,
  day: eachDayOfInterval,
  week: (interval: Interval) => eachWeekOfInterval(interval, { weekStartsOn }),
  month: eachMonthOfInterval,
};

const endIntervalFn = {
  hour: endOfHour,
  day: endOfDay,
  week: (date: number | Date) => endOfWeek(date, { weekStartsOn }),
  month: endOfMonth,
};

/**
 * Get valence statistics from play history. Valence is a measure positivity. 0
 * valence is negative while 1 valence is positive.
 *
 * @param {RequestData} [data]
 * @param {number} [data.start] Get statistics for data starting from this date value (inclusive)
 * @param {number} [data.end] Get statistics for data ending at this date value (inclusive)
 * @param {('hour'|'day'|'week'|'month')} [data.interval] Group data into the specified interval
 *
 * @see `valence` in https://developer.spotify.com/documentation/web-api/reference/#object-audiofeaturesobject
 */
const stats = https.onCall(async (data: RequestData | null, context) => {
  const { interval: intervalParam } = data ?? {};
  const userId = context.auth?.uid;

  const start = typeof data?.start === "number" ? data.start : minTime;
  const end = typeof data?.end === "number" ? data.end : Date.now();

  if (userId) {
    const valenceHistory = await getValenceHistory({
      start,
      end,
      userId,
    });

    if (valenceHistory) {
      logger.info("Calculating statistics");

      const valence = Object.values<number | undefined>(valenceHistory).filter(
        (valence): valence is number => valence !== undefined
      );

      const periodStats = {
        max: Math.max(...valence),
        mean: mean(valence),
        median: median(valence),
        min: Math.min(...valence),
        mode: mode(valence),
      };

      if (intervalParam) {
        const timestamps = Object.keys(valenceHistory);

        const intervalStats = startIntervalFn[intervalParam]({
          start: Number(timestamps[0]),
          end: Number(timestamps[timestamps.length - 1]),
        }).map((interval) => {
          const valenceInInterval = Object.entries(valenceHistory)
            .filter(([key]) =>
              isWithinInterval(Number(key), {
                start: interval,
                end: endIntervalFn[intervalParam](interval),
              })
            )
            .map(([, valence]) => valence)
            .filter((valence): valence is number => valence !== undefined);

          return {
            interval: Number(interval),
            max: valenceInInterval.length
              ? Math.max(...valenceInInterval)
              : null,
            mean: valenceInInterval.length ? mean(valenceInInterval) : null,
            median: valenceInInterval.length ? median(valenceInInterval) : null,
            min: valenceInInterval.length
              ? Math.min(...valenceInInterval)
              : null,
            mode: valenceInInterval.length ? mode(valenceInInterval) : null,
          };
        });

        return {
          period: periodStats,
          interval: intervalStats,
        };
      }

      logger.info("Successfully calculated statistics");

      return { period: periodStats };
    }

    logger.info("No play history found");
  }

  return { period: {}, interval: [] };
});

export default stats;
