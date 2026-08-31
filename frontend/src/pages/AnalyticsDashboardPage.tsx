import {
  BarChart,
  Bar,
  LineChart,
  Line,
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
import type { ReactNode } from "react";
import {
  BarChart3,
  FileText,
  ShieldAlert,
  DollarSign,
  CalendarCheck,
  Workflow,
  ClipboardCheck,
} from "lucide-react";

import { useAnalytics } from "../hooks/useAnalytics";
import UpcomingRenewalsCard from "../components/notifications/UpcomingRenewalsCard";
import SystemStatusCard from "../components/notifications/SystemStatusCard";
import type { RiskLevelCount, StatusCount } from "../types/analytics";

const RISK_COLORS: Record<string, string> = {
  low: "#184C40",
  medium: "#B8953F",
  high: "#C94B4B",
  not_analyzed: "#929995",
};

const STATUS_COLORS: Record<string, string> = {
  uploaded: "#8D9198",
  processing: "#B8953F",
  extracted: "#184C40",
  failed: "#C94B4B",
};

function ChartCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[#E9ECEA] bg-white p-5 shadow-sm transition-all duration-200 hover:border-[#D0D5D2]">
      <div className="border-b border-[#F0F1F0] pb-3.5">
        <h3 className="text-[13px] font-semibold text-[#181A1F]">{title}</h3>
        {description && (
          <p className="mt-0.5 text-[11px] text-[#707773]">{description}</p>
        )}
      </div>
      <div className="pt-5">{children}</div>
    </section>
  );
}

function StatCard({
  icon,
  label,
  value,
  description,
  highlight = false,
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
  description: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 transition-all duration-200 hover:shadow-sm ${
        highlight
          ? "border-[#E1ECE6] bg-[#F7FCFA] hover:border-[#BEDACE]"
          : "border-[#E9ECEA] bg-white hover:border-[#D0D5D2]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#707773]">
            {label}
          </span>
          <p
            className={`mt-1.5 text-[22px] font-semibold tracking-[-0.03em] ${
              highlight ? "text-[#184C40]" : "text-[#181A1F]"
            }`}
          >
            {value}
          </p>
          <p className="mt-0.5 text-[11px] text-[#8E9591]">{description}</p>
        </div>
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-xl ${
            highlight
              ? "bg-[#E2F0EB] text-[#184C40]"
              : "border border-[#E9ECEA] bg-[#FAFBFA] text-[#626965]"
          }`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function AnalyticsTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{
    value?: number | string;
    name?: string;
  }>;
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-xl border border-[#DCDFD0] bg-white px-3 py-2 shadow-lg">
      {label && <p className="mb-1 text-[10px] font-medium text-[#707773]">{label}</p>}
      {payload.map((item, index) => (
        <p key={index} className="text-[11px] font-semibold text-[#181A1F]">
          {item.name ?? "Count"}: {item.value}
        </p>
      ))}
    </div>
  );
}

export default function AnalyticsDashboardPage() {
  const { data, isLoading, error } = useAnalytics();

  if (isLoading) {
    return (
      <main className="min-h-full bg-white px-6 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[1380px]">
          <div className="flex min-h-[500px] flex-col items-center justify-center text-center">
            <div className="mb-4 h-6 w-6 animate-spin rounded-full border-2 border-[#DCDFD0] border-t-[#184C40]" />
            <p className="text-[13px] font-medium text-[#181A1F]">
              Loading executive analytics...
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
            <BarChart3 size={20} strokeWidth={1.6} className="mb-3 text-[#8E9591]" />
            <p className="text-[13px] font-medium text-[#181A1F]">
              Analytics unavailable
            </p>
            <p className="mt-1 text-[11px] text-[#707773]">
              Unable to load portfolio analytics right now.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const metrics = data.metrics || {
    total_contracts: data.total_contracts,
    total_value: 0,
    average_value: 0,
    active_contracts: 0,
    in_flight_reviews: 0,
    open_obligations: 0,
    high_risk_count: 0,
  };

  const formattedTotalValue =
    metrics.total_value >= 1_000_000
      ? `$${(metrics.total_value / 1_000_000).toFixed(1)}M`
      : metrics.total_value >= 1_000
        ? `$${(metrics.total_value / 1_000).toFixed(0)}K`
        : `$${metrics.total_value.toLocaleString()}`;

  return (
    <main className="min-h-full bg-white px-6 py-7 sm:px-8 lg:px-10">
      <div className="mx-auto w-full max-w-[1380px]">
        {/* ── Page Header ────────────────────────────────────────────── */}
        <header className="mb-7 border-b border-[#E9ECEA] pb-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EBF4F0] text-[#184C40]">
              <BarChart3 size={19} strokeWidth={1.8} />
            </div>
            <div>
              <h1 className="text-[28px] font-semibold tracking-[-0.035em] text-[#181A1F] sm:text-[30px]">
                Portfolio Overview
              </h1>
              <p className="mt-0.5 text-[12px] text-[#707773]">
                High-level operational, risk, and commercial intelligence across all workspace contracts
              </p>
            </div>
          </div>
        </header>

        {/* ── Executive KPI Metrics Grid ─────────────────────────────── */}
        <section className="mb-8">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <StatCard
              icon={<FileText size={15} strokeWidth={1.8} />}
              label="Contracts"
              value={metrics.total_contracts}
              description="Repository total"
            />
            <StatCard
              icon={<DollarSign size={15} strokeWidth={1.8} />}
              label="Portfolio Value"
              value={formattedTotalValue}
              description="Total committed"
              highlight
            />
            <StatCard
              icon={<CalendarCheck size={15} strokeWidth={1.8} />}
              label="In-Force"
              value={metrics.active_contracts}
              description="Active today"
            />
            <StatCard
              icon={<Workflow size={15} strokeWidth={1.8} />}
              label="In Review"
              value={metrics.in_flight_reviews}
              description="Active workflows"
            />
            <StatCard
              icon={<ClipboardCheck size={15} strokeWidth={1.8} />}
              label="Obligations"
              value={metrics.open_obligations}
              description="Pending duties"
            />
            <StatCard
              icon={<ShieldAlert size={15} strokeWidth={1.8} />}
              label="High Risk"
              value={metrics.high_risk_count}
              description="Closer review"
            />
          </div>
        </section>

        {/* ── Operational Overview ───────────────────────────────────── */}
        <section className="mb-8">
          <div className="mb-4">
            <h2 className="text-[15px] font-semibold text-[#181A1F]">
              Operational Status
            </h2>
            <p className="text-[11px] text-[#707773]">
              Upcoming renewals & background pipeline processing health
            </p>
          </div>

          <div className="grid items-stretch gap-5 xl:grid-cols-2">
            <UpcomingRenewalsCard />
            <SystemStatusCard />
          </div>
        </section>

        {/* ── Portfolio Activity & Trends ────────────────────────────── */}
        <section className="mb-8">
          <div className="mb-4">
            <h2 className="text-[15px] font-semibold text-[#181A1F]">
              Activity & Financial Analytics
            </h2>
            <p className="text-[11px] text-[#707773]">
              Contract volume, expiration runway, and commercial brackets
            </p>
          </div>

          <div className="grid items-start gap-5 xl:grid-cols-3">
            {/* Volume Over Time */}
            <ChartCard
              title="Ingestion Trend"
              description="Agreements added over time"
            >
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={data.volume_over_time}>
                  <CartesianGrid vertical={false} stroke="#F0F1F0" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#8E9591" }}
                    dy={6}
                  />
                  <YAxis
                    allowDecimals={false}
                    axisLine={false}
                    tickLine={false}
                    width={24}
                    tick={{ fontSize: 10, fill: "#8E9591" }}
                  />
                  <Tooltip content={<AnalyticsTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="count"
                    name="Contracts"
                    stroke="#184C40"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: "#184C40" }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Upcoming Expiries */}
            <ChartCard
              title="Expiration Timeline"
              description="Upcoming contract end dates by month"
            >
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data.expiry_timeline}>
                  <CartesianGrid vertical={false} stroke="#F0F1F0" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#8E9591" }}
                    dy={6}
                  />
                  <YAxis
                    allowDecimals={false}
                    axisLine={false}
                    tickLine={false}
                    width={24}
                    tick={{ fontSize: 10, fill: "#8E9591" }}
                  />
                  <Tooltip content={<AnalyticsTooltip />} />
                  <Bar
                    dataKey="count"
                    name="Expiring"
                    fill="#B8953F"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={36}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Value Distribution */}
            <ChartCard
              title="Commercial Distribution"
              description="Contracts categorized by value tier"
            >
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={data.value_distribution}
                  layout="vertical"
                  margin={{ left: 10 }}
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
                    dataKey="bucket"
                    type="category"
                    width={85}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#626965" }}
                  />
                  <Tooltip content={<AnalyticsTooltip />} />
                  <Bar
                    dataKey="count"
                    name="Contracts"
                    fill="#256B58"
                    radius={[0, 4, 4, 0]}
                    maxBarSize={24}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </section>

        {/* ── Portfolio Breakdown Donut Charts ───────────────────────── */}
        <section>
          <div className="mb-4">
            <h2 className="text-[15px] font-semibold text-[#181A1F]">
              Portfolio Composition
            </h2>
            <p className="text-[11px] text-[#707773]">
              Risk posture and processing completion state
            </p>
          </div>

          <div className="grid items-start gap-5 xl:grid-cols-2">
            {/* Risk Distribution */}
            <ChartCard
              title="Risk Exposure Distribution"
              description="Breakdown of contracts across AI risk tiers"
            >
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={data.risk_distribution}
                    dataKey="count"
                    nameKey="level"
                    cx="50%"
                    cy="45%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {data.risk_distribution.map((entry: RiskLevelCount) => (
                      <Cell
                        key={entry.level}
                        fill={RISK_COLORS[entry.level] ?? "#929995"}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<AnalyticsTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    iconSize={7}
                    formatter={(val) => (
                      <span className="capitalize text-[10px] text-[#626965]">
                        {String(val).replace("_", " ")}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Status Breakdown */}
            <ChartCard
              title="Repository Extraction Status"
              description="AI text extraction and vector processing status"
            >
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={data.status_breakdown}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="45%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {data.status_breakdown.map((entry: StatusCount) => (
                      <Cell
                        key={entry.status}
                        fill={STATUS_COLORS[entry.status] ?? "#929995"}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<AnalyticsTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    iconSize={7}
                    formatter={(val) => (
                      <span className="capitalize text-[10px] text-[#626965]">
                        {String(val).replace("_", " ")}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </section>
      </div>
    </main>
  );
}