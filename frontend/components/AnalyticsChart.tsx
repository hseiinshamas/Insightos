"use client";

import dynamic from "next/dynamic";

const Plot = dynamic(
  () => import("react-plotly.js"),
  {
    ssr: false,
  }
);

interface ChartData {
  labels: string[];
  values: number[];
}

interface AnalyticsChartProps {
  title: string;
  subtitle?: string;
  data: ChartData;
  valuePrefix?: string;
}

export default function AnalyticsChart({
  title,
  subtitle,
  data,
  valuePrefix = "",
}: AnalyticsChartProps) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/[0.07] bg-[#0b0b0d]">

      {/* Subtle glow */}

      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-indigo-500/[0.05] blur-3xl" />

      <div className="relative">

        {/* Header */}

        <div className="flex items-start justify-between px-7 pt-7">

          <div>

            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
              Performance
            </p>

            <h3 className="mt-2 text-lg font-semibold tracking-tight text-white">
              {title}
            </h3>

            {subtitle && (
              <p className="mt-1.5 text-sm text-slate-500">
                {subtitle}
              </p>
            )}

          </div>

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025] text-slate-500 transition duration-200 group-hover:border-white/[0.12] group-hover:text-slate-300">
            ↗
          </div>

        </div>


        {/* Chart */}

        <div className="px-3 pb-4 pt-3">

          <Plot
            data={[
              {
                x: data.labels,
                y: data.values,
                type: "bar",

                marker: {
                  color: "rgba(129, 140, 248, 0.75)",

                  line: {
                    width: 0,
                  },

                },

                hovertemplate:
                  `<b>%{x}</b><br>` +
                  `<span style="color:#a5b4fc">●</span> ` +
                  `${valuePrefix}%{y:,.2f}` +
                  `<extra></extra>`,

                hoverlabel: {
                  bgcolor: "#111113",
                  bordercolor: "#27272a",

                  font: {
                    color: "#ffffff",
                    size: 13,
                    family:
                      "Inter, ui-sans-serif, system-ui, sans-serif",
                  },

                  align: "left",
                },
              },
            ]}

            layout={{
              autosize: true,

              height: 390,

              margin: {
                l: 55,
                r: 20,
                t: 25,
                b: 70,
              },

              paper_bgcolor: "rgba(0,0,0,0)",

              plot_bgcolor: "rgba(0,0,0,0)",

              font: {
                color: "#64748b",
                family:
                  "Inter, ui-sans-serif, system-ui, sans-serif",
              },

              xaxis: {

                showgrid: false,

                zeroline: false,

                showline: false,

                tickfont: {
                  size: 11,
                  color: "#64748b",
                },

                tickangle: -25,

                fixedrange: true,

              },

              yaxis: {

                showgrid: true,

                gridcolor:
                  "rgba(255,255,255,0.045)",

                gridwidth: 1,

                zeroline: false,

                showline: false,

                tickfont: {
                  size: 10,
                  color: "#52525b",
                },

                tickprefix: valuePrefix,

                fixedrange: true,

              },

              bargap: 0.42,

              hovermode: "closest",

              hoverdistance: 30,

            }}

            config={{
              responsive: true,

              displayModeBar: false,

              scrollZoom: false,

              doubleClick: false,

            }}

            style={{
              width: "100%",
            }}
          />

        </div>

      </div>

    </div>
  );
}