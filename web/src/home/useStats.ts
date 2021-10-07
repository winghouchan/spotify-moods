import { getFunctions, httpsCallable } from "firebase/functions";
import { useCallback, useEffect, useState } from "react";

interface Statistics {
  max: number;
  mean: any;
  median: any;
  min: number;
  mode: any;
}

interface Request {
  start?: number;
  end?: number;
  interval: "hour" | "day" | "week" | "month";
}

interface Response {
  period: Statistics;
  interval: Array<Statistics & { interval: number }>;
}

export default function useStats(options?: Request) {
  const [data, setData] = useState<Response>();
  const getStats = useCallback(
    async (options?: Request) =>
      await (
        await httpsCallable<Request, Response>(getFunctions(), "stats")(options)
      ).data,
    []
  );

  useEffect(() => {
    getStats(options).then(setData);
  }, [...Object.values(options || {})]);

  return data;
}
