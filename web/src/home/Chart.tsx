import { useContext } from "react";
import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryTheme,
  VictoryThemeDefinition,
  VictoryScatter,
} from "victory";
import { ThemeContext } from "../app/theme";

const lightTheme: VictoryThemeDefinition = {
  ...VictoryTheme.grayscale,

  axis: {
    ...VictoryTheme.grayscale.axis,
    style: {
      ...VictoryTheme.grayscale.axis?.style,
      grid: {
        ...VictoryTheme.grayscale.axis?.style?.grid,
        fill: "none",
        stroke: [
          ...(VictoryTheme.grayscale.axis?.colorScale as string[]),
        ].reverse()[0],
        strokeLinecap: "round",
        strokeLinejoin: "round",
        pointerEvents: "painted",
      },
    },
  },
};

const darkTheme: VictoryThemeDefinition = {
  ...VictoryTheme.grayscale,

  axis: {
    style: {
      ...VictoryTheme.grayscale.axis?.style,
      axis: {
        ...VictoryTheme.grayscale.axis?.style?.axis,
        stroke: "white",
      },
      axisLabel: {
        ...VictoryTheme.grayscale.axis?.style?.axisLabel,
        // @ts-ignore
        fill: "white",
      },
      tickLabels: {
        ...VictoryTheme.grayscale.axis?.style?.tickLabels,
        // @ts-ignore
        fill: "white",
      },
      grid: {
        ...VictoryTheme.grayscale.axis?.style?.grid,
        fill: "none",
        stroke: (VictoryTheme.grayscale.axis?.colorScale as string[])[0],
        strokeLinecap: "round",
        strokeLinejoin: "round",
        pointerEvents: "painted",
      },
    },
  },

  line: {
    style: {
      data: {
        ...VictoryTheme.grayscale.line?.style?.data,
        fill: VictoryTheme.grayscale.line?.style?.data?.fill,
        stroke: "white",
        strokeWidth: 1,
      },
    },
  },

  scatter: {
    style: {
      data: {
        ...VictoryTheme.grayscale.scatter?.style?.data,
        fill: "white",
      },
    },
  },
};

interface ChartProps {
  data: any;
  x: {
    data?: any;
    format: any;
    label: any;
  };
  y: {
    data?: any;
    format: any;
    label: any;
  };
}

export default function Chart({ data, x, y }: ChartProps) {
  const { theme } = useContext(ThemeContext);

  return (
    <VictoryChart
      domain={{ x: [x.label[0], x.label[x.label.length - 1]] }}
      // domainPadding={50}
      theme={theme === "dark" ? darkTheme : lightTheme}
    >
      <VictoryAxis tickValues={x.label} tickFormat={x.format} />
      <VictoryAxis dependentAxis tickValues={y.label} tickFormat={y.format} />
      <VictoryLine
        animate={{ onLoad: { duration: 1000 } }}
        data={data}
        interpolation="monotoneX"
        x={x.data}
        y={y.data}
      />
      <VictoryScatter data={data} x={x.data} y={y.data} size={2} />
    </VictoryChart>
  );
}
