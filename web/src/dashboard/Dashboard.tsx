import { Tabs, Spinner } from "@geist-ui/react";
import {
  eachHourOfInterval,
  eachDayOfInterval,
  eachMonthOfInterval,
  endOfToday,
  endOfWeek,
  endOfMonth,
  endOfYear,
  format,
  startOfToday,
  startOfWeek,
  startOfMonth,
  startOfYear,
} from "date-fns";
import { Helmet } from "react-helmet";
import { Authenticated } from "../app/layouts";
import Chart from "./Chart";
import useStats from "./useStats";

function AllTime() {
  const data = useStats({ interval: "hour" });

  return data ? (
    <Chart
      data={data.interval}
      x={{
        data: ({ interval, mean }: any) => (mean === null ? null : interval),
        label: eachDayOfInterval({
          start: data.interval[0].interval,
          end: Number(endOfToday()),
        }),
        format: (tick: any) => format(tick, "dd-MM"),
      }}
      y={{
        data: ({ mean }: any) => mean,
        label: [0, 0.2, 0.4, 0.6, 0.8, 1],
        format: (tick: number) => tick.toFixed(1),
      }}
    />
  ) : (
    <Spinner />
  );
}

function Today() {
  const data = useStats({ start: Number(startOfToday()), interval: "hour" });

  return data ? (
    <Chart
      data={data.interval}
      x={{
        data: ({ interval, mean }: any) => (mean === null ? null : interval),
        label: eachHourOfInterval(
          {
            start: Number(startOfToday()),
            end: Number(endOfToday()),
          },
          { step: 3 }
        ),
        format: (tick: any) => format(tick, "HH:00"),
      }}
      y={{
        data: ({ mean }: any) => mean,
        label: [0, 0.2, 0.4, 0.6, 0.8, 1],
        format: (tick: number) => tick.toFixed(1),
      }}
    />
  ) : (
    <Spinner />
  );
}

function Week() {
  const weekStartsOn = 1;
  const data = useStats({
    start: Number(startOfWeek(new Date(), { weekStartsOn })),
    interval: "day",
  });

  return data ? (
    <Chart
      data={data.interval}
      x={{
        data: ({ interval, mean }: any) => (mean === null ? null : interval),
        label: eachDayOfInterval({
          start: Number(startOfWeek(new Date(), { weekStartsOn })),
          end: Number(endOfWeek(new Date(), { weekStartsOn })),
        }),
        format: (tick: any) => format(tick, "do"),
      }}
      y={{
        data: ({ mean }: any) => mean,
        label: [0, 0.2, 0.4, 0.6, 0.8, 1],
        format: (tick: number) => tick.toFixed(1),
      }}
    />
  ) : (
    <Spinner />
  );
}

function Month() {
  const data = useStats({
    start: Number(startOfMonth(new Date())),
    interval: "day",
  });

  return data ? (
    <Chart
      data={data.interval}
      x={{
        data: ({ interval, mean }: any) => (mean === null ? null : interval),
        label: eachDayOfInterval(
          {
            start: Number(startOfMonth(new Date())),
            end: Number(endOfMonth(new Date())),
          },
          {
            step: 7,
          }
        ),
        format: (tick: any) => format(tick, "do"),
      }}
      y={{
        data: ({ mean }: any) => mean,
        label: [0, 0.2, 0.4, 0.6, 0.8, 1],
        format: (tick: number) => tick.toFixed(1),
      }}
    />
  ) : (
    <Spinner />
  );
}

function Year() {
  const data = useStats({
    start: Number(startOfYear(new Date())),
    interval: "month",
  });

  return data ? (
    <Chart
      data={data.interval}
      x={{
        data: ({ interval, mean }: any) => (mean === null ? null : interval),
        label: eachMonthOfInterval({
          start: Number(startOfYear(new Date())),
          end: Number(endOfYear(new Date())),
        }),
        format: (tick: any) => format(tick, "MMM"),
      }}
      y={{
        data: ({ mean }: any) => mean,
        label: [0, 0.2, 0.4, 0.6, 0.8, 1],
        format: (tick: number) => tick.toFixed(1),
      }}
    />
  ) : (
    <Spinner />
  );
}

export default function Dashboard() {
  return (
    <Authenticated>
      <Helmet>
        <title>Dashboard | Spotify Moods</title>
      </Helmet>
      <Tabs initialValue="0">
        <Tabs.Item label="All time" value="0">
          <AllTime />
        </Tabs.Item>
        <Tabs.Item label="Today" value="1">
          <Today />
        </Tabs.Item>
        <Tabs.Item label="Week" value="2">
          <Week />
        </Tabs.Item>
        <Tabs.Item label="Month" value="3">
          <Month />
        </Tabs.Item>
        <Tabs.Item label="Year" value="4">
          <Year />
        </Tabs.Item>
      </Tabs>
    </Authenticated>
  );
}
