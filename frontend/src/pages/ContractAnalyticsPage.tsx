import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Link } from "react-router-dom";
import {
  FileText,
  DollarSign,
  Scale,
  Building2,
  ArrowUpRight,
  AlertTriangle,
} from "lucide-react";
import { useContractAnalytics } from "../hooks/useAnalytics";
import type { LifecycleCount } from "../types/analytics";

const LIFECYCLE_COLORS: Record<string, string> = {
  draft: "#8D9198",
  active: "#184C40",
  executed: "#2A57A8",
  expired: "#C88040",
  terminated: "#C94B4B",
};

export default function ContractAnalyticsPage() {
  const { data, isLoading, error } = useContractAnalytics();

  if (isLoading) {
    return (
      <main className="min-h-full bg-white px-6 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[1380px]">
          <div className="flex min-h-[500px] flex-col items-center justify-center text-center">
            <div className="mb-4 h-6 w-6 animate-spin rounded-full border-2 border-[#DCDFD0] border-t-[#184C40]" />
            <p className="text-[13px] font-medium text-[#181A1F]">
              Loading commercial contract analytics...
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
              Unable to load contract analytics
            </p>
          </div>
        </div>
      </main>
    );
  }

  const formattedTotalValue =
    data.total_value >= 1_000_000
      ? `$${(data.total_value / 1_000_000).toFixed(2)}M`
      : `$${data.total_value.toLocaleString()}`;

  const formattedAvgValue =
    data.average_value >= 1_000
      ? `$${(data.average_value / 1_000).toFixed(1)}K`
      : `$${data.average_value.toLocaleString()}`;

  return (
    <main className="min-h-full bg-white px-6 py-7 sm:px-8 lg:px-10">
      <div className="mx-auto w-full max-w-[1380px]">
        {/* ── Page Header ────────────────────────────────────────────── */}
        <header className="mb-7 border-b border-[#E9ECEA] pb-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EBF4F0] text-[#184C40]">
              <FileText size={19} strokeWidth={1.8} />
            </div>
            <div>
              <h1 className="text-[28px] font-semibold tracking-[-0.035em] text-[#181A1F] sm:text-[30px]">
                Contract Analytics
              </h1>
              <p className="mt-0.5 text-[12px] text-[#707773]">
                Commercial commitments, lifecycle maturity, jurisdiction breakdown, and counterparty concentration
              </p>
            </div>
          </div>
        </header>

        {/* ── Commercial Summary Cards ───────────────────────────────── */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#E1ECE6] bg-[#F7FCFA] p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#1E5C4E]">
                Total Portfolio Value
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E2F0EB] text-[#184C40]">
                <DollarSign size={16} strokeWidth={2} />
              </div>
            </div>
            <p className="mt-2 text-[28px] font-semibold tracking-[-0.03em] text-[#184C40]">
              {formattedTotalValue}
            </p>
            <p className="mt-0.5 text-[11px] text-[#528276]">Across all valued agreements</p>
          </div>

          <div className="rounded-2xl border border-[#E9ECEA] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#707773]">
                Average Contract Size
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F5F6F5] text-[#181A1F]">
                <Scale size={16} strokeWidth={1.8} />
              </div>
            </div>
            <p className="mt-2 text-[28px] font-semibold tracking-[-0.03em] text-[#181A1F]">
              {formattedAvgValue}
            </p>
            <p className="mt-0.5 text-[11px] text-[#8E9591]">Mean agreement value</p>
          </div>

          <div className="rounded-2xl border border-[#E9ECEA] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#707773]">
                Total Repository Agreements
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F5F6F5] text-[#181A1F]">
                <FileText size={16} strokeWidth={1.8} />
              </div>
            </div>
            <p className="mt-2 text-[28px] font-semibold tracking-[-0.03em] text-[#181A1F]">
              {data.total_contracts}
            </p>
            <p className="mt-0.5 text-[11px] text-[#8E9591]">Active & historical files</p>
          </div>
        </div>

        {/* ── Visual Breakdowns (Lifecycle & Governing Law) ─────────── */}
        <section className="mb-8">
          <div className="grid items-start gap-6 xl:grid-cols-2">
            {/* Lifecycle Stage Breakdown */}
            <div className="rounded-2xl border border-[#E9ECEA] bg-white p-5 shadow-sm">
              <div className="border-b border-[#F0F1F0] pb-3.5">
                <h3 className="text-[14px] font-semibold text-[#181A1F]">
                  Lifecycle Stage Distribution
                </h3>
                <p className="mt-0.5 text-[11px] text-[#707773]">
                  Progression from draft to executed and archived status
                </p>
              </div>

              <div className="pt-4">
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={data.lifecycle_breakdown}
                      dataKey="count"
                      nameKey="stage"
                      cx="50%"
                      cy="45%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={3}
                      stroke="none"
                    >
                      {data.lifecycle_breakdown.map(
                        (entry: LifecycleCount) => (
                          <Cell
                            key={entry.stage}
                            fill={
                              LIFECYCLE_COLORS[entry.stage] ??
                              "#8D9198"
                            }
                          />
                        ),
                      )}
                    </Pie>
                    <Tooltip />
                    <Legend
                      verticalAlign="bottom"
                      iconType="circle"
                      iconSize={7}
                      formatter={(val) => (
                        <span className="capitalize text-[11px] text-[#626965]">
                          {String(val)}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Governing Law Breakdown */}
            <div className="rounded-2xl border border-[#E9ECEA] bg-white p-5 shadow-sm">
              <div className="border-b border-[#F0F1F0] pb-3.5">
                <h3 className="text-[14px] font-semibold text-[#181A1F]">
                  Top Governing Law Jurisdictions
                </h3>
                <p className="mt-0.5 text-[11px] text-[#707773]">
                  Jurisdictional concentration across agreements
                </p>
              </div>

              <div className="pt-4">
                {data.governing_law_breakdown.length === 0 ? (
                  <div className="flex h-[240px] flex-col items-center justify-center text-center text-[#8E9591]">
                    <p className="text-[12px]">No governing law data extracted yet</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart
                      data={data.governing_law_breakdown}
                      layout="vertical"
                      margin={{ left: 15 }}
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
                        dataKey="law"
                        type="category"
                        width={90}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: "#181A1F" }}
                      />
                      <Tooltip />
                      <Bar
                        dataKey="count"
                        name="Contracts"
                        fill="#184C40"
                        radius={[0, 4, 4, 0]}
                        maxBarSize={22}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── High Value Contracts & Counterparties ───────────────────── */}
        <section className="grid items-start gap-6 xl:grid-cols-[1.5fr_1fr]">
          {/* Top Contracts by Value */}
          <div className="rounded-2xl border border-[#E9ECEA] bg-white p-5 shadow-sm">
            <div className="border-b border-[#F0F1F0] pb-3.5">
              <h3 className="text-[14px] font-semibold text-[#181A1F]">
                Largest Contracts by Commercial Value
              </h3>
              <p className="mt-0.5 text-[11px] text-[#707773]">
                Top value agreements in the workspace
              </p>
            </div>

            <div className="mt-4 overflow-x-auto">
              {data.top_contracts.length === 0 ? (
                <p className="py-8 text-center text-[12px] text-[#8E9591]">
                  No contract values extracted yet.
                </p>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[#F0F1F0] text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8E9591]">
                      <th className="pb-2.5">Contract</th>
                      <th className="pb-2.5">Value</th>
                      <th className="pb-2.5">Jurisdiction</th>
                      <th className="pb-2.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0F1F0] text-[12px]">
                    {data.top_contracts.map((c) => (
                      <tr key={c.id} className="group">
                        <td className="py-3 font-medium text-[#181A1F]">
                          <span className="max-w-[220px] truncate block">
                            {c.file_name}
                          </span>
                        </td>
                        <td className="py-3 font-semibold text-[#184C40]">
                          ${c.value.toLocaleString()} {c.currency}
                        </td>
                        <td className="py-3 text-[#707773]">
                          {c.governing_law || "—"}
                        </td>
                        <td className="py-3 text-right">
                          <Link
                            to={`/app/contracts/${c.id}`}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#184C40] hover:underline"
                          >
                            View
                            <ArrowUpRight size={12} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Top Counterparties */}
          <div className="rounded-2xl border border-[#E9ECEA] bg-white p-5 shadow-sm">
            <div className="border-b border-[#F0F1F0] pb-3.5">
              <h3 className="text-[14px] font-semibold text-[#181A1F]">
                Counterparty Concentration
              </h3>
              <p className="mt-0.5 text-[11px] text-[#707773]">
                Most frequent vendors, clients, and partners
              </p>
            </div>

            <div className="mt-4 space-y-3">
              {data.top_counterparties.length === 0 ? (
                <p className="py-8 text-center text-[12px] text-[#8E9591]">
                  No counterparty data extracted yet.
                </p>
              ) : (
                data.top_counterparties.map((cp, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-xl border border-[#E9ECEA] bg-[#FAFBFA] px-3.5 py-2.5"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-[#707773] shadow-2xs">
                        <Building2 size={14} strokeWidth={1.7} />
                      </div>
                      <span className="text-[12px] font-medium text-[#181A1F]">
                        {cp.party}
                      </span>
                    </div>
                    <span className="rounded-full bg-[#E2F0EB] px-2.5 py-0.5 text-[11px] font-semibold text-[#184C40]">
                      {cp.count} agreement{cp.count === 1 ? "" : "s"}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
