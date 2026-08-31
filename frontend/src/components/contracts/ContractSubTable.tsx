/**
 * ContractSubTable
 *
 * A reusable table for sub-tab views (Starred, Active, Upcoming, Executed).
 * Accepts a column config so each tab can show different data without code
 * duplication.
 */
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, CalendarDays, FileText, Star } from "lucide-react";

import type { Contract } from "../../types/contract";
import { useToggleStar } from "../../hooks/useContractsByView";
import { useRiskOverview } from "../../hooks/useRisk";
import RiskBadge from "./RiskBadge";

/* ── Lifecycle badge styles ─────────────────────────────────────────────────── */

const lifecycleStyles: Record<
  string,
  { container: string; dot: string; label: string }
> = {
  draft: {
    container: "border-[#e3e3e3] bg-[#f7f7f6] text-[#666a72]",
    dot: "bg-[#8d9198]",
    label: "Draft",
  },
  active: {
    container: "border-[#cfe5dd] bg-[#f0f8f5] text-[#28755f]",
    dot: "bg-[#2f9076]",
    label: "Active",
  },
  executed: {
    container: "border-[#c9d9f7] bg-[#eef3fc] text-[#2a57a8]",
    dot: "bg-[#4070c8]",
    label: "Executed",
  },
  expired: {
    container: "border-[#eddbc4] bg-[#fdf5ec] text-[#8b5e2a]",
    dot: "bg-[#c88040]",
    label: "Expired",
  },
  terminated: {
    container: "border-[#efcccc] bg-[#fff4f4] text-[#c94b4b]",
    dot: "bg-[#d24d4d]",
    label: "Terminated",
  },
};

/* ── Days remaining helpers ──────────────────────────────────────────────────── */

export function daysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const diff =
    new Date(dateStr).getTime() - new Date().setHours(0, 0, 0, 0);
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function DaysLeftPill({ days }: { days: number | null }) {
  if (days === null) return <span className="text-[12px] text-[#b0b3ba]">—</span>;

  const isRed = days <= 30;
  const isAmber = days > 30 && days <= 90;

  const cls = isRed
    ? "bg-[#fff4f4] border-[#efcccc] text-[#c94b4b]"
    : isAmber
      ? "bg-[#fbf7eb] border-[#eadfbd] text-[#8d7027]"
      : "bg-[#f0f8f5] border-[#cfe5dd] text-[#28755f]";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${cls}`}
    >
      {days}d left
    </span>
  );
}

/* ── Props ───────────────────────────────────────────────────────────────────── */

export interface SubTableColumn {
  key:
    | "name"
    | "uploaded"
    | "expiry"
    | "effective"
    | "days_left"
    | "risk"
    | "lifecycle"
    | "star";
  label: string;
}

interface ContractSubTableProps {
  contracts: Contract[];
  columns: SubTableColumn[];
  emptyIcon?: React.ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
}

/* ── Component ───────────────────────────────────────────────────────────────── */

export default function ContractSubTable({
  contracts,
  columns,
  emptyIcon,
  emptyTitle = "No contracts",
  emptyDescription = "Your contracts will appear here.",
}: ContractSubTableProps) {
  const navigate = useNavigate();
  const { data: riskOverview } = useRiskOverview();
  const { mutate: toggleStar, isPending: isStarring } = useToggleStar();

  const riskByContractId = new Map(
    (riskOverview ?? []).map((risk) => [risk.contract_id, risk]),
  );

  if (contracts.length === 0) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-[#e3e3e3] bg-[#fafafa] text-[#656971]">
          {emptyIcon ?? <FileText size={18} strokeWidth={1.6} />}
        </div>
        <p className="text-[14px] font-semibold text-[#181a20]">{emptyTitle}</p>
        <p className="mt-1 max-w-sm text-[12px] leading-5 text-[#85888f]">
          {emptyDescription}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[760px] border-collapse">
        {/* ── Header ──────────────────────────────────────────────────── */}
        <thead>
          <tr className="border-b border-[#e9e9e9] text-left">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-3 py-3.5 sm:px-4 ${col.key === "star" ? "w-10" : ""}`}
              >
                {col.key !== "star" && (
                  <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#979aa1]">
                    {col.label}
                  </span>
                )}
              </th>
            ))}
            {/* open arrow col */}
            <th className="w-12 px-3 py-3.5 sm:px-4">
              <span className="sr-only">Open</span>
            </th>
          </tr>
        </thead>

        {/* ── Body ────────────────────────────────────────────────────── */}
        <tbody>
          {contracts.map((contract) => {
            const risk = riskByContractId.get(contract.id);
            const lifecycle =
              lifecycleStyles[contract.lifecycle_status] ??
              lifecycleStyles.draft;

            const uploadedDate = new Date(
              contract.uploaded_at,
            ).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            const expiryDate = contract.extracted_fields?.expiry_date
              ? new Date(
                  contract.extracted_fields.expiry_date,
                ).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "—";

            const effectiveDate = contract.extracted_fields?.effective_date
              ? new Date(
                  contract.extracted_fields.effective_date,
                ).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "—";

            const days = daysUntil(
              contract.extracted_fields?.expiry_date ?? null,
            );

            return (
              <tr
                key={contract.id}
                onClick={() =>
                  navigate(`/app/contracts/${contract.id}`)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    navigate(`/app/contracts/${contract.id}`);
                  }
                }}
                tabIndex={0}
                role="button"
                className="group cursor-pointer border-b border-[#eeeeee] transition-colors last:border-b-0 hover:bg-[#fafafa] focus:bg-[#fafafa] focus:outline-none"
              >
                {columns.map((col) => {
                  /* ── name ─── */
                  if (col.key === "name") {
                    return (
                      <td key="name" className="px-3 py-4 sm:px-4">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#e3e3e3] bg-white text-[#666a72] transition-colors group-hover:border-[#d2d2d2] group-hover:text-[#181a20]">
                            <FileText size={16} strokeWidth={1.6} />
                          </div>
                          <div className="min-w-0">
                            <p className="max-w-[380px] truncate text-[14px] font-medium tracking-[-0.01em] text-[#181a20]">
                              {contract.file_name}
                            </p>
                            <p className="mt-0.5 max-w-[340px] truncate text-[10px] text-[#a0a3a9]">
                              {contract.id}
                            </p>
                          </div>
                        </div>
                      </td>
                    );
                  }

                  /* ── uploaded ─── */
                  if (col.key === "uploaded") {
                    return (
                      <td key="uploaded" className="px-3 py-4 sm:px-4">
                        <div className="flex items-center gap-2 text-[12px] text-[#686c74]">
                          <CalendarDays
                            size={14}
                            strokeWidth={1.6}
                            className="text-[#9a9da3]"
                          />
                          <span>{uploadedDate}</span>
                        </div>
                      </td>
                    );
                  }

                  /* ── expiry ─── */
                  if (col.key === "expiry") {
                    return (
                      <td key="expiry" className="px-3 py-4 sm:px-4">
                        <span className="text-[12px] text-[#686c74]">
                          {expiryDate}
                        </span>
                      </td>
                    );
                  }

                  /* ── effective ─── */
                  if (col.key === "effective") {
                    return (
                      <td key="effective" className="px-3 py-4 sm:px-4">
                        <span className="text-[12px] text-[#686c74]">
                          {effectiveDate}
                        </span>
                      </td>
                    );
                  }

                  /* ── days_left ─── */
                  if (col.key === "days_left") {
                    return (
                      <td key="days_left" className="px-3 py-4 sm:px-4">
                        <DaysLeftPill days={days} />
                      </td>
                    );
                  }

                  /* ── risk ─── */
                  if (col.key === "risk") {
                    return (
                      <td key="risk" className="px-3 py-4 sm:px-4">
                        <RiskBadge
                          level={risk?.risk_level}
                          score={risk?.risk_score}
                        />
                      </td>
                    );
                  }

                  /* ── lifecycle ─── */
                  if (col.key === "lifecycle") {
                    return (
                      <td key="lifecycle" className="px-3 py-4 sm:px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium ${lifecycle.container}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${lifecycle.dot}`}
                          />
                          {lifecycle.label}
                        </span>
                      </td>
                    );
                  }

                  /* ── star ─── */
                  if (col.key === "star") {
                    return (
                      <td
                        key="star"
                        className="px-3 py-4 sm:px-4"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isStarring) toggleStar(contract.id);
                        }}
                      >
                        <button
                          type="button"
                          aria-label={
                            contract.is_starred
                              ? "Remove from starred"
                              : "Add to starred"
                          }
                          className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                            contract.is_starred
                              ? "text-[#c9960d]"
                              : "text-[#c0c3ca] hover:text-[#c9960d]"
                          }`}
                        >
                          <Star
                            size={15}
                            strokeWidth={1.8}
                            fill={contract.is_starred ? "currentColor" : "none"}
                          />
                        </button>
                      </td>
                    );
                  }

                  return null;
                })}

                {/* ── open arrow ── */}
                <td className="px-3 py-4 text-right sm:px-4">
                  <div className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#92959b] opacity-0 transition-all duration-150 group-hover:bg-[#f0f0ef] group-hover:text-[#181a20] group-hover:opacity-100 group-focus:opacity-100">
                    <ArrowUpRight size={14} strokeWidth={1.8} />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
