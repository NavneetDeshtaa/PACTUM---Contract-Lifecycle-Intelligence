import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Link } from "react-router-dom";
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  FileWarning,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { useRiskAnalytics } from "../hooks/useAnalytics";
import type { RiskLevelCount } from "../types/analytics";

export default function RiskAnalyticsPage() {
  const { data, isLoading, error } = useRiskAnalytics();

  if (isLoading) {
    return (
      <main className="min-h-full bg-white px-6 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[1380px]">
          <div className="flex min-h-[500px] flex-col items-center justify-center text-center">
            <div className="mb-4 h-6 w-6 animate-spin rounded-full border-2 border-[#DCDFD0] border-t-[#184C40]" />
            <p className="text-[13px] font-medium text-[#181A1F]">
              Analyzing portfolio risk hotspots...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-full bg-white px-6 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[1380px]">
          <div className="flex min-h-[500px] flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#FEF7F6] text-[#B9443D]">
              <AlertTriangle size={17} />
            </div>
            <p className="text-[13px] font-semibold text-[#181A1F]">
              Unable to load risk analytics
            </p>
          </div>
        </div>
      </main>
    );
  }

  const highRiskCount =
    data.risk_distribution.find((r: RiskLevelCount) => r.level === "high")
      ?.count ?? 0;

  return (
    <main className="min-h-full bg-white px-6 py-7 sm:px-8 lg:px-10">
      <div className="mx-auto w-full max-w-[1380px]">
        {/* ── Page Header ────────────────────────────────────────────── */}
        <header className="mb-7 border-b border-[#E9ECEA] pb-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FEF7F6] text-[#B9443D]">
              <ShieldAlert size={19} strokeWidth={1.8} />
            </div>
            <div>
              <h1 className="text-[28px] font-semibold tracking-[-0.035em] text-[#181A1F] sm:text-[30px]">
                Risk Analytics
              </h1>
              <p className="mt-0.5 text-[12px] text-[#707773]">
                AI-driven compliance posture, clause deviation hotspots, and high-risk contract watchlist
              </p>
            </div>
          </div>
        </header>

        {/* ── Risk & Compliance KPI Cards ────────────────────────────── */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Average Risk Score */}
          <div className="rounded-2xl border border-[#E9ECEA] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#707773]">
                Portfolio Avg Risk Score
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F5F6F5] text-[#181A1F]">
                <Sparkles size={16} strokeWidth={1.8} />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <p className="text-[28px] font-semibold tracking-[-0.03em] text-[#181A1F]">
                {data.average_risk_score}
              </p>
              <span className="text-[12px] font-medium text-[#707773]">/ 100</span>
            </div>
            <p className="mt-0.5 text-[11px] text-[#8E9591]">
              Lower is safer (0 = low, 100 = high)
            </p>
          </div>

          {/* Compliance Health Score */}
          <div className="rounded-2xl border border-[#E1ECE6] bg-[#F7FCFA] p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#1E5C4E]">
                Policy Compliance Health
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E2F0EB] text-[#184C40]">
                <ShieldCheck size={16} strokeWidth={2} />
              </div>
            </div>
            <p className="mt-2 text-[28px] font-semibold tracking-[-0.03em] text-[#184C40]">
              {data.compliance_health_score}%
            </p>
            <p className="mt-0.5 text-[11px] text-[#528276]">
              Alignment with enterprise guidelines
            </p>
          </div>

          {/* High Risk Critical Contracts */}
          <div
            className={`rounded-2xl border p-5 shadow-sm ${
              highRiskCount > 0
                ? "border-[#F2D6D3] bg-[#FEF7F6]"
                : "border-[#E9ECEA] bg-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${
                  highRiskCount > 0 ? "text-[#B9443D]" : "text-[#707773]"
                }`}
              >
                High-Risk Watchlist
              </span>
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                  highRiskCount > 0
                    ? "bg-[#FBE4E2] text-[#B9443D]"
                    : "bg-[#F5F6F5] text-[#181A1F]"
                }`}
              >
                <FileWarning size={16} strokeWidth={1.8} />
              </div>
            </div>
            <p
              className={`mt-2 text-[28px] font-semibold tracking-[-0.03em] ${
                highRiskCount > 0 ? "text-[#B9443D]" : "text-[#181A1F]"
              }`}
            >
              {highRiskCount}
            </p>
            <p
              className={`mt-0.5 text-[11px] ${
                highRiskCount > 0 ? "text-[#C46761]" : "text-[#8E9591]"
              }`}
            >
              Agreements requiring legal revision
            </p>
          </div>
        </div>

        {/* ── Clause Deviation Hotspots (Flagged vs Missing) ──────────── */}
        <section className="mb-8 grid items-start gap-6 xl:grid-cols-2">
          {/* Flagged Clause Hotspots */}
          <div className="rounded-2xl border border-[#E9ECEA] bg-white p-5 shadow-sm">
            <div className="border-b border-[#F0F1F0] pb-3.5">
              <h3 className="text-[14px] font-semibold text-[#181A1F]">
                Most Frequently Flagged Clauses
              </h3>
              <p className="mt-0.5 text-[11px] text-[#707773]">
                Clauses with terms that violate or deviate from standard policy
              </p>
            </div>

            <div className="pt-4">
              {data.top_flagged_clauses.length === 0 ? (
                <p className="py-8 text-center text-[12px] text-[#8E9591]">
                  Zero policy deviations detected across analyzed contracts.
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart
                    data={data.top_flagged_clauses}
                    layout="vertical"
                    margin={{ left: 25 }}
                  >
                    <CartesianGrid horizontal={false} stroke="#F0F1F0" />
                    <XAxis
                      type="number"
                      allowDecimals={false}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: "#8E9591" }}
                    />
                    <YAxis
                      dataKey="clause"
                      type="category"
                      width={120}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "#181A1F" }}
                    />
                    <Tooltip />
                    <Bar
                      dataKey="occurrences"
                      name="Flagged Count"
                      fill="#C94B4B"
                      radius={[0, 4, 4, 0]}
                      maxBarSize={22}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Missing Clauses Hotspots */}
          <div className="rounded-2xl border border-[#E9ECEA] bg-white p-5 shadow-sm">
            <div className="border-b border-[#F0F1F0] pb-3.5">
              <h3 className="text-[14px] font-semibold text-[#181A1F]">
                Most Frequently Missing Protections
              </h3>
              <p className="mt-0.5 text-[11px] text-[#707773]">
                Standard protective clauses missing from supplier or third-party drafts
              </p>
            </div>

            <div className="pt-4">
              {data.top_missing_clauses.length === 0 ? (
                <p className="py-8 text-center text-[12px] text-[#8E9591]">
                  No missing clauses identified.
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart
                    data={data.top_missing_clauses}
                    layout="vertical"
                    margin={{ left: 25 }}
                  >
                    <CartesianGrid horizontal={false} stroke="#F0F1F0" />
                    <XAxis
                      type="number"
                      allowDecimals={false}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: "#8E9591" }}
                    />
                    <YAxis
                      dataKey="clause"
                      type="category"
                      width={120}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "#181A1F" }}
                    />
                    <Tooltip />
                    <Bar
                      dataKey="occurrences"
                      name="Missing Count"
                      fill="#B8953F"
                      radius={[0, 4, 4, 0]}
                      maxBarSize={22}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </section>

        {/* ── High Risk Contracts Watchlist ───────────────────────────── */}
        <section className="rounded-2xl border border-[#E9ECEA] bg-white p-5 shadow-sm">
          <div className="border-b border-[#F0F1F0] pb-3.5">
            <h3 className="text-[14px] font-semibold text-[#181A1F]">
              High-Risk Agreements Watchlist
            </h3>
            <p className="mt-0.5 text-[11px] text-[#707773]">
              Agreements flagged with non-standard indemnities, liability caps, or compliance risks
            </p>
          </div>

          <div className="mt-4 overflow-x-auto">
            {data.high_risk_watchlist.length === 0 ? (
              <div className="py-8 text-center text-[12px] text-[#8E9591]">
                No high-risk contracts currently flagged in your workspace.
              </div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#F0F1F0] text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8E9591]">
                    <th className="pb-2.5">Contract</th>
                    <th className="pb-2.5">Risk Score</th>
                    <th className="pb-2.5">Flagged Issues</th>
                    <th className="pb-2.5">Missing Clauses</th>
                    <th className="pb-2.5">AI Summary Note</th>
                    <th className="pb-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0F1F0] text-[12px]">
                  {data.high_risk_watchlist.map((item) => {
                    const isHigh = item.risk_level === "high";

                    return (
                      <tr key={item.contract_id} className="group">
                        <td className="py-3.5 font-medium text-[#181A1F]">
                          <span className="max-w-[200px] truncate block">
                            {item.file_name}
                          </span>
                        </td>
                        <td className="py-3.5">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                              isHigh
                                ? "border-[#F2D6D3] bg-[#FEF7F6] text-[#B9443D]"
                                : "border-[#EADBBD] bg-[#FBF7EB] text-[#8D7027]"
                            }`}
                          >
                            Score: {item.risk_score}
                          </span>
                        </td>
                        <td className="py-3.5 text-[#B9443D] font-medium">
                          {item.flagged_count} issue{item.flagged_count === 1 ? "" : "s"}
                        </td>
                        <td className="py-3.5 text-[#8D7027] font-medium">
                          {item.missing_count} missing
                        </td>
                        <td className="py-3.5 text-[#707773]">
                          <span className="max-w-[260px] truncate block text-[11px]">
                            {item.explanation || "Risk factors detected."}
                          </span>
                        </td>
                        <td className="py-3.5 text-right">
                          <Link
                            to={`/app/contracts/${item.contract_id}`}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#184C40] hover:underline"
                          >
                            Inspect Risk
                            <ArrowUpRight size={12} />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
