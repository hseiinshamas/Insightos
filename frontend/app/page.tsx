"use client";

import { useState } from "react";
import AnalyticsChart from "../components/AnalyticsChart";

interface AnalysisResult {
  filename: string;

  profile: {
    rows: number;
    columns: number;
    column_names: string[];
    missing_values: number;
    numeric_columns: string[];
    categorical_columns: string[];
  };

  kpis: {
    rows: number;
    total_revenue?: number;
    units_sold?: number;
    average_order_value?: number;
    orders: number;
    top_product?: string;
    top_region?: string;
  };

  analytics: {
    product_performance?: {
      product: string;
      revenue: number;
      units_sold: number;
    }[];

    regional_performance?: {
      region: string;
      revenue: number;
      units_sold: number;
      revenue_share?: number;
    }[];

    insights?: string[];
  };



  anomalies: {
    anomalies: {
      type: string;
      severity: "high" | "medium" | "low";
      title: string;
      entity: string;
      message: string;
      metric: number;
      impact: number;
    }[];
    count: number;
    status: string;
  };


  ai_analysis: {
  executive_summary: string;
  strengths: string[];
  risks: string[];
  opportunities: string[];
  recommendations: string[];
};


}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function analyzeDataset() {
    if (!file) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        "http://127.0.0.1:8000/analyze",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to analyze dataset.");
      }

      const data = await response.json();

      setResult(data);
    } catch (err) {
      console.error(err);

      setError(
        "Could not connect to InsightOS backend."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#070708] text-white">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <nav className="border-b border-white/[0.06] bg-[#070708]">

        <div className="mx-auto flex h-20 max-w-[1500px] items-center justify-between px-6 lg:px-10">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white font-bold text-black">
              I
            </div>

            <div>
              <h1 className="text-lg font-semibold tracking-tight">
                InsightOS
              </h1>

              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-600">
                AI Business Intelligence
              </p>
            </div>

          </div>

          <div className="hidden items-center gap-3 sm:flex">

            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.7)]" />

            <span className="text-xs text-slate-500">
              Local Analytics Engine
            </span>

          </div>

        </div>

      </nav>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <section className="mx-auto max-w-[1500px] px-6 py-16 lg:px-10">


        {/* ===================================================
            HERO / UPLOAD
        =================================================== */}

        {!result && (

          <div className="mx-auto max-w-5xl text-center">

            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-xs font-medium text-slate-400">

              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

              AI-powered data analysis

            </div>


            <h2 className="text-5xl font-semibold tracking-[-0.05em] sm:text-6xl lg:text-7xl">

              Turn your data into

              <span className="block text-slate-500">
                decisions.
              </span>

            </h2>


            <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg">

              Upload a dataset and InsightOS automatically
              analyzes your business performance, identifies
              important patterns, and generates actionable insights.

            </p>


            {/* Upload container */}

            <div className="mx-auto mt-12 max-w-2xl">

              <div className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-2">

                <div className="rounded-[22px] border border-dashed border-white/[0.1] px-6 py-12 sm:px-12">

                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04] text-2xl text-slate-400">
                    ↑
                  </div>

                  <h3 className="mt-6 text-xl font-semibold">
                    Upload your dataset
                  </h3>

                  <p className="mt-2 text-sm text-slate-600">
                    CSV files supported
                  </p>


                  <label className="mt-7 inline-flex cursor-pointer items-center rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-black transition hover:bg-slate-200">

                    Choose CSV

                    <input
                      type="file"
                      accept=".csv"
                      className="hidden"
                      onChange={(event) => {
                        setFile(
                          event.target.files?.[0] ?? null
                        );
                      }}
                    />

                  </label>


                  {file && (

                    <div className="mx-auto mt-5 flex max-w-md items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3">

                      <div className="flex min-w-0 items-center gap-3">

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-[10px] font-semibold text-slate-400">
                          CSV
                        </div>

                        <div className="min-w-0 text-left">

                          <p className="truncate text-sm font-medium text-slate-300">
                            {file.name}
                          </p>

                          <p className="mt-0.5 text-xs text-slate-600">
                            Ready for analysis
                          </p>

                        </div>

                      </div>

                      <span className="ml-4 h-2 w-2 shrink-0 rounded-full bg-emerald-400" />

                    </div>

                  )}


                  <button
                    onClick={analyzeDataset}
                    disabled={!file || loading}
                    className="mt-4 w-full rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-black transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-30"
                  >

                    {loading
                      ? "Analyzing your data..."
                      : "Analyze Dataset →"}

                  </button>


                  {error && (

                    <p className="mt-4 text-sm text-red-400">
                      {error}
                    </p>

                  )}

                </div>

              </div>

            </div>

          </div>

        )}


        {/* ===================================================
            DASHBOARD
        =================================================== */}

        {result && (

          <div className="space-y-8">


            {/* =================================================
                DASHBOARD HEADER
            ================================================= */}

            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">

              <div>

                <div className="mb-3 flex items-center gap-2">

                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.7)]" />

                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-400">
                    Analysis complete
                  </span>

                </div>


                <h2 className="text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                  {result.filename}
                </h2>

                <p className="mt-2 text-sm text-slate-600">
                  Automated business intelligence report
                </p>

              </div>


              <div className="flex items-center gap-3">

                <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3">

                  <p className="text-[10px] uppercase tracking-[0.16em] text-slate-600">
                    Dataset
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    {result.profile.rows.toLocaleString()} rows
                    {" · "}
                    {result.profile.columns} columns
                  </p>

                </div>


                <button
                  onClick={() => {
                    setResult(null);
                    setFile(null);
                  }}
                  className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
                >
                  New Analysis
                </button>

              </div>

            </div>


            {/* =================================================
                KPI CARDS
                ONLY KPI CARDS ARE INSIDE THIS GRID
            ================================================= */}

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

              <KpiCard
                title="Total Revenue"
                value={
                  result.kpis.total_revenue !== undefined
                    ? `€${result.kpis.total_revenue.toLocaleString()}`
                    : "N/A"
                }
                icon="€"
              />

              <KpiCard
                title="Orders"
                value={result.kpis.orders.toLocaleString()}
                icon="#"
              />

              <KpiCard
                title="Units Sold"
                value={
                  result.kpis.units_sold?.toLocaleString() ??
                  "N/A"
                }
                icon="↗"
              />

              <KpiCard
                title="Average Order"
                value={
                  result.kpis.average_order_value !== undefined
                    ? `€${result.kpis.average_order_value.toFixed(2)}`
                    : "N/A"
                }
                icon="Ø"
              />

            </div>


            {/* =================================================
                CHART SECTION

                THIS IS OUTSIDE THE KPI GRID.
            ================================================= */}

            <div className="space-y-6">


              {result.analytics.product_performance && (

                <AnalyticsChart
                  title="Revenue by Product"
                  subtitle="Which products are driving your business?"
                  data={{
                    labels:
                      result.analytics.product_performance.map(
                        (item) => item.product
                      ),

                    values:
                      result.analytics.product_performance.map(
                        (item) => item.revenue
                      ),
                  }}
                  valuePrefix="€"
                />

              )}


              {result.analytics.regional_performance && (

                <AnalyticsChart
                  title="Revenue by Region"
                  subtitle="How revenue is distributed across markets"
                  data={{
                    labels:
                      result.analytics.regional_performance.map(
                        (item) => item.region
                      ),

                    values:
                      result.analytics.regional_performance.map(
                        (item) => item.revenue
                      ),
                  }}
                  valuePrefix="€"
                />

              )}

            </div>


            {/* =================================================
                PERFORMANCE SECTION
            ================================================= */}

            <div className="grid gap-6 lg:grid-cols-2">


              <PerformanceCard
                title="Product Performance"
                subtitle="Revenue contribution by product"
                items={
                  result.analytics.product_performance?.map(
                    (product) => ({
                      name: product.product,
                      value: `€${product.revenue.toLocaleString()}`,
                      secondary: `${product.units_sold} units`,
                    })
                  ) ?? []
                }
              />


              <PerformanceCard
                title="Regional Performance"
                subtitle="Revenue contribution by region"
                items={
                  result.analytics.regional_performance?.map(
                    (region) => ({
                      name: region.region,
                      value: `€${region.revenue.toLocaleString()}`,
                      secondary: `${region.units_sold} units`,
                    })
                  ) ?? []
                }
              />

            </div>



            {/* =====================================================
    RISKS & ANOMALIES
===================================================== */}

{result.anomalies &&
  result.anomalies.anomalies.length > 0 && (
    <div className="mt-8 overflow-hidden rounded-3xl border border-white/[0.07] bg-[#0b0b0d]">

      {/* Header */}

      <div className="flex flex-col gap-5 border-b border-white/[0.06] px-7 py-7 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-sm">
              ⚠️
            </div>

            <div>

              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
                Automated Detection
              </p>

              <h4 className="mt-1 text-xl font-semibold tracking-tight text-white">
                Risks & Anomalies
              </h4>

            </div>

          </div>

          <p className="mt-3 text-sm text-slate-500">
            Patterns detected that may require attention.
          </p>

        </div>


        {/* Detection count */}

        <div className="w-fit shrink-0 rounded-full border border-white/[0.08] bg-white/[0.035] px-4 py-2 text-xs font-medium text-slate-400">

          {result.anomalies.count} detected

        </div>

      </div>


      {/* Anomaly list */}

      <div className="divide-y divide-white/[0.05]">

        {result.anomalies.anomalies.map(
          (anomaly, index) => (

            <div
              key={`${anomaly.type}-${index}`}
              className="px-7 py-7 transition duration-200 hover:bg-white/[0.02]"
            >

              <div className="flex gap-5">

                {/* Severity dot */}

                <div className="flex shrink-0 items-start pt-2">

                  <div
                    className={`h-2.5 w-2.5 rounded-full ${
                      anomaly.severity === "high"
                        ? "bg-red-400"
                        : anomaly.severity === "medium"
                        ? "bg-amber-400"
                        : "bg-slate-400"
                    }`}
                  />

                </div>


                {/* Main content */}

                <div className="min-w-0 flex-1">

                  {/* Title + severity */}

                  <div className="flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center">

                    <h5 className="text-base font-medium text-white">
                      {anomaly.title}
                    </h5>

                    <span
                      className={`inline-flex w-fit shrink-0 items-center rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${
                        anomaly.severity === "high"
                          ? "border border-red-400/20 bg-red-400/10 text-red-300"
                          : anomaly.severity === "medium"
                          ? "border border-amber-400/20 bg-amber-400/10 text-amber-300"
                          : "border border-white/10 bg-white/[0.04] text-slate-400"
                      }`}
                    >
                      {anomaly.severity}
                    </span>

                  </div>


                  {/* Description */}

                  <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
                    {anomaly.message}
                  </p>


                  {/* Metadata */}

                  <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">

                    {/* Entity */}

                    <div className="flex w-fit items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] px-4 py-2.5">

                      <span className="text-xs font-medium text-slate-600">
                        Entity
                      </span>

                      <span className="max-w-[220px] truncate text-xs font-medium text-slate-300">
                        {anomaly.entity}
                      </span>

                    </div>


                    {/* Impact */}

                    <div className="flex w-fit items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] px-4 py-2.5">

                      <span className="text-xs font-medium text-slate-600">
                        Impact
                      </span>

                      <span className="text-xs font-medium text-slate-300">
                        {anomaly.impact}
                        {anomaly.type.includes("concentration") ||
                        anomaly.type.includes("mismatch")
                          ? "%"
                          : ""}
                      </span>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          )
        )}

      </div>

    </div>
  )}



  {/* =====================================================
    AI ANALYST
===================================================== */}

{result.ai_analysis && (
  <div className="mt-8 overflow-hidden rounded-3xl border border-indigo-400/[0.12] bg-[#0b0b0d]">

    {/* Header */}

    <div className="border-b border-white/[0.06] px-7 py-7">

      <div className="flex items-center gap-3">

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-400/10 text-lg">
          ✦
        </div>

        <div>

          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-indigo-300/60">
            Automated Business Analysis
          </p>

          <h4 className="mt-1 text-xl font-semibold tracking-tight text-white">
            AI Analyst
          </h4>

        </div>

      </div>

      {/* Executive summary */}

      <div className="mt-6 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-5">

        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
          Executive Summary
        </p>

        <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-300">
          {result.ai_analysis.executive_summary}
        </p>

      </div>

    </div>


    {/* Analysis sections */}

    <div className="grid gap-px bg-white/[0.05] md:grid-cols-3">

      {/* Strengths */}

      <div className="bg-[#0b0b0d] p-7">

        <div className="flex items-center gap-2">

          <span className="text-sm">
            ↗
          </span>

          <h5 className="text-sm font-medium text-white">
            Strengths
          </h5>

        </div>

        <div className="mt-5 space-y-3">

          {result.ai_analysis.strengths.length > 0 ? (
            result.ai_analysis.strengths.map(
              (item, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4"
                >
                  <p className="text-sm leading-6 text-slate-400">
                    {item}
                  </p>
                </div>
              )
            )
          ) : (
            <p className="text-sm text-slate-600">
              No major strengths identified.
            </p>
          )}

        </div>

      </div>


      {/* Risks */}

      <div className="bg-[#0b0b0d] p-7">

        <div className="flex items-center gap-2">

          <span className="text-sm">
            ⚠
          </span>

          <h5 className="text-sm font-medium text-white">
            Risks
          </h5>

        </div>

        <div className="mt-5 space-y-3">

          {result.ai_analysis.risks.length > 0 ? (
            result.ai_analysis.risks.map(
              (item, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-red-400/[0.08] bg-red-400/[0.025] p-4"
                >
                  <p className="text-sm leading-6 text-slate-400">
                    {item}
                  </p>
                </div>
              )
            )
          ) : (
            <p className="text-sm text-slate-600">
              No major risks identified.
            </p>
          )}

        </div>

      </div>


      {/* Opportunities */}

      <div className="bg-[#0b0b0d] p-7">

        <div className="flex items-center gap-2">

          <span className="text-sm">
            ✦
          </span>

          <h5 className="text-sm font-medium text-white">
            Opportunities
          </h5>

        </div>

        <div className="mt-5 space-y-3">

          {result.ai_analysis.opportunities.length > 0 ? (
            result.ai_analysis.opportunities.map(
              (item, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-indigo-400/[0.08] bg-indigo-400/[0.025] p-4"
                >
                  <p className="text-sm leading-6 text-slate-400">
                    {item}
                  </p>
                </div>
              )
            )
          ) : (
            <p className="text-sm text-slate-600">
              No major opportunities identified.
            </p>
          )}

        </div>

      </div>

    </div>


    {/* Recommendations */}

    <div className="border-t border-white/[0.06] px-7 py-7">

      <div className="flex items-center gap-3">

        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.03] text-sm">
          →
        </div>

        <div>

          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
            Recommended Actions
          </p>

          <h5 className="mt-1 text-base font-medium text-white">
            What should happen next?
          </h5>

        </div>

      </div>


      <div className="mt-5 grid gap-3">

        {result.ai_analysis.recommendations.map(
          (recommendation, index) => (

            <div
              key={index}
              className="flex gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
            >

              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-[11px] font-medium text-slate-400">
                {index + 1}
              </div>

              <p className="text-sm leading-6 text-slate-400">
                {recommendation}
              </p>

            </div>

          )
        )}

      </div>

    </div>

  </div>
)}


  
            {/* =================================================
                AI INSIGHTS
            ================================================= */}

            <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.025] p-7 sm:p-8">

              <div className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full bg-white/[0.025] blur-3xl" />


              <div className="relative">

                <div className="flex items-start justify-between">

                  <div>

                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-600">
                      InsightOS Intelligence
                    </p>

                    <h3 className="mt-2 text-2xl font-semibold tracking-tight">
                      What we found
                    </h3>

                  </div>


                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-slate-400">
                    ✦
                  </div>

                </div>


                <div className="mt-7 grid gap-3">

                  {result.analytics.insights?.map(
                    (insight, index) => (

                      <div
                        key={index}
                        className="flex items-start gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-5 transition hover:bg-white/[0.045]"
                      >

                        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-xs text-slate-500">
                          {String(index + 1).padStart(2, "0")}
                        </div>

                        <p className="text-sm leading-6 text-slate-300">
                          {insight}
                        </p>

                      </div>

                    )
                  )}

                </div>

              </div>

            </div>

          </div>

        )}

      </section>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="mx-auto max-w-[1500px] border-t border-white/[0.05] px-6 py-8">

        <div className="flex flex-col justify-between gap-3 text-xs text-slate-700 sm:flex-row">

          <span>
            InsightOS · AI-powered analytics
          </span>

          <span>
            Built with Python · FastAPI · Next.js
          </span>

        </div>

      </footer>

    </main>
  );
}


/* ===========================================================
   KPI CARD
=========================================================== */

function KpiCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: string;
}) {
  return (

    <div className="group relative overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.025] p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.13] hover:bg-white/[0.04]">

      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/[0.025] blur-3xl" />

      <div className="relative">

        <div className="flex items-center justify-between">

          <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-600">
            {title}
          </p>

          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.035] text-xs text-slate-500">
            {icon}
          </div>

        </div>


        <p className="mt-6 text-3xl font-semibold tracking-[-0.03em] text-white">
          {value}
        </p>


        <div className="mt-4 h-px w-full bg-white/[0.05]" />


        <p className="mt-3 text-[11px] text-slate-700">
          From uploaded dataset
        </p>

      </div>

    </div>

  );
}




/* ===========================================================
   PERFORMANCE CARD
=========================================================== */

function PerformanceCard({
  title,
  subtitle,
  items,
}: {
  title: string;
  subtitle: string;

  items: {
    name: string;
    value: string;
    secondary: string;
  }[];
}) {
  return (

    <div className="overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.025]">


      <div className="border-b border-white/[0.06] px-6 py-5">

        <h3 className="font-semibold">
          {title}
        </h3>

        <p className="mt-1 text-xs text-slate-600">
          {subtitle}
        </p>

      </div>


      <div className="divide-y divide-white/[0.05]">

        {items.length > 0 ? (

          items.map((item, index) => (

            <div
              key={`${item.name}-${index}`}
              className="flex items-center justify-between px-6 py-5 transition hover:bg-white/[0.025]"
            >

              <div className="flex items-center gap-4">

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] text-xs text-slate-600">
                  {String(index + 1).padStart(2, "0")}
                </div>


                <div>

                  <p className="text-sm font-medium text-slate-300">
                    {item.name}
                  </p>

                  <p className="mt-1 text-xs text-slate-700">
                    {item.secondary}
                  </p>

                </div>

              </div>


              <p className="text-sm font-semibold text-white">
                {item.value}
              </p>

            </div>

          ))

        ) : (

          <div className="px-6 py-10 text-center text-sm text-slate-600">
            No data available
          </div>

        )}

      </div>

    </div>

  );
}