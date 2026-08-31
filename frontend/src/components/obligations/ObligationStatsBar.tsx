import {
  ClipboardCheck,
  CalendarCheck,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import type { ObligationStats } from "../../types/tracking";

interface ObligationStatsBarProps {
  stats: ObligationStats | undefined;
  isLoading?: boolean;
}

export default function ObligationStatsBar({
  stats,
  isLoading,
}: ObligationStatsBarProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-xl border border-[#E9ECEA] bg-[#FAFBFA]"
          />
        ))}
      </div>
    );
  }

  const total = stats?.total ?? 0;
  const upcoming = stats?.upcoming ?? 0;
  const overdue = stats?.overdue ?? 0;
  const completed = stats?.completed ?? 0;
  const completionRate = stats?.completion_rate ?? 0;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
      {/* ── Total Obligations ────────────────────────────────────────── */}
      <div className="rounded-xl border border-[#E9ECEA] bg-white p-4 transition-all duration-200 hover:border-[#D0D5D2] hover:shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#707773]">
            Total Tracked
          </span>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F5F6F5] text-[#181A1F]">
            <ClipboardCheck size={14} strokeWidth={1.8} />
          </div>
        </div>
        <p className="mt-2 text-[24px] font-semibold tracking-[-0.03em] text-[#181A1F]">
          {total}
        </p>
        <p className="mt-0.5 text-[11px] text-[#8E9591]">Across all contracts</p>
      </div>

      {/* ── Upcoming (90d) ───────────────────────────────────────────── */}
      <div className="rounded-xl border border-[#E1ECE6] bg-[#F7FCFA] p-4 transition-all duration-200 hover:border-[#BEDACE] hover:shadow-[0_2px_8px_rgba(24,76,64,0.04)]">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#1E5C4E]">
            Upcoming (90d)
          </span>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#E2F0EB] text-[#184C40]">
            <CalendarCheck size={14} strokeWidth={1.8} />
          </div>
        </div>
        <p className="mt-2 text-[24px] font-semibold tracking-[-0.03em] text-[#184C40]">
          {upcoming}
        </p>
        <p className="mt-0.5 text-[11px] text-[#528276]">Due in next 90 days</p>
      </div>

      {/* ── Overdue ─────────────────────────────────────────────────── */}
      <div
        className={`rounded-xl border p-4 transition-all duration-200 ${
          overdue > 0
            ? "border-[#F2D6D3] bg-[#FEF7F6] hover:border-[#E8B5AF] hover:shadow-[0_2px_8px_rgba(201,75,75,0.05)]"
            : "border-[#E9ECEA] bg-white hover:border-[#D0D5D2]"
        }`}
      >
        <div className="flex items-center justify-between">
          <span
            className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${
              overdue > 0 ? "text-[#B9443D]" : "text-[#707773]"
            }`}
          >
            Overdue
          </span>
          <div
            className={`flex h-7 w-7 items-center justify-center rounded-lg ${
              overdue > 0
                ? "bg-[#FBE4E2] text-[#B9443D]"
                : "bg-[#F5F6F5] text-[#8E9591]"
            }`}
          >
            <AlertTriangle size={14} strokeWidth={1.8} />
          </div>
        </div>
        <p
          className={`mt-2 text-[24px] font-semibold tracking-[-0.03em] ${
            overdue > 0 ? "text-[#B9443D]" : "text-[#181A1F]"
          }`}
        >
          {overdue}
        </p>
        <p
          className={`mt-0.5 text-[11px] ${
            overdue > 0 ? "text-[#C46761]" : "text-[#8E9591]"
          }`}
        >
          {overdue > 0 ? "Requires action" : "Zero overdue items"}
        </p>
      </div>

      {/* ── Completed ────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-[#E9ECEA] bg-white p-4 transition-all duration-200 hover:border-[#D0D5D2] hover:shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#707773]">
            Completed
          </span>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F5F6F5] text-[#181A1F]">
            <CheckCircle2 size={14} strokeWidth={1.8} />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <p className="text-[24px] font-semibold tracking-[-0.03em] text-[#181A1F]">
            {completed}
          </p>
          <span className="text-[12px] font-medium text-[#707773]">
            ({completionRate}%)
          </span>
        </div>
        <p className="mt-0.5 text-[11px] text-[#8E9591]">Fulfillment rate</p>
      </div>
    </div>
  );
}
