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

      {/* Background glow */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-white/[0.025] blur-3xl" />

      <div className="relative">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="flex items-start justify-between border-b border-white/[0.06] px-7 py-6">

          <div>

            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
              Performance
            </p>

            <h3 className="mt-2 text-xl font-semibold tracking-tight text-white">
              {title}
            </h3>

            {subtitle && (
              <p className="mt-1.5 text-sm text-slate-600">
                {subtitle}
              </p>
            )}

          </div>


          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.035] text-sm text-slate-500">
            ↗
          </div>

        </div>


        {/* =====================================================
            CHART
        ===================================================== */}

        <div className="px-3 pb-4 pt-2">

          <Plot
            data={[
              {
                x: data.labels,
                y: data.values,

                type: "bar",

                // Important:
                // Use a dark transparent-looking bar instead
                // of making the entire plot white.

                marker: {
                  color: "#e5e7eb",

                  line: {
                    width: 0,
                  },

                  opacity: 0.9,
                },

                hovertemplate:
                  `<b>%{x}</b><br />${valuePrefix}%{y:,.2f}<extra></extra>`,

                hoverlabel: {
                  bgcolor: "#18181b",
                  bordercolor: "#3f3f46",

                  font: {
                    color: "#ffffff",
                    size: 13,
                  },
                },
              },
            ]}

            layout={{
              autosize: true,

              height: 470,

              margin: {
                l: 70,
                r: 35,
                t: 25,
                b: 85,
              },

              // THESE ARE IMPORTANT
              // They prevent Plotly from creating
              // a white chart background.

              paper_bgcolor: "rgba(0,0,0,0)",
              plot_bgcolor: "rgba(0,0,0,0)",

              font: {
                color: "#64748b",

                family:
                  "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
              },


              // =================================================
              // X AXIS
              // =================================================

              xaxis: {

                showgrid: false,

                zeroline: false,

                showline: false,

                automargin: true,

                tickfont: {
                  size: 12,
                  color: "#64748b",
                },

                tickangle: 0,

                fixedrange: true,

              },


              // =================================================
              // Y AXIS
              // =================================================

              yaxis: {

                showgrid: true,

                gridcolor: "rgba(255,255,255,0.055)",

                gridwidth: 1,

                zeroline: false,

                showline: false,

                automargin: true,

                tickfont: {
                  size: 11,
                  color: "#52525b",
                },

                tickprefix: valuePrefix,

                fixedrange: true,

              },


              // =================================================
              // BAR SPACING
              // =================================================

              bargap: 0.35,

              bargroupgap: 0.1,


              // =================================================
              // HOVER
              // =================================================

              hovermode: "closest",

              hoverdistance: 20,


              // =================================================
              // REMOVE LEGEND
              // =================================================

              showlegend: false,

            }}

            config={{
              responsive: true,

              displayModeBar: false,

              scrollZoom: false,

              doubleClick: false,

              displaylogo: false,

            }}

            style={{
              width: "100%",
              height: "470px",
            }}
          />

        </div>

      </div>

    </div>
  );
}