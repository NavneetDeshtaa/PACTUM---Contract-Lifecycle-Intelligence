import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  CalendarDays,
  FileText,
  ShieldCheck,
  Star,
  ChevronDown,
  LayoutDashboard,
  ShieldAlert,
  ClipboardCheck,
  GitMerge,
  CheckSquare,
} from "lucide-react";

import { useContract } from "../hooks/useContract";
import { useToggleStar, useUpdateLifecycle } from "../hooks/useContractsByView";
import type { LifecycleStatus } from "../types/contract";

import ExtractedFieldsPanel from "../components/contracts/ExtractedFieldsPanel";
import SummaryPanel from "../components/ui/SummaryPanel";
import RiskPanel from "../components/contracts/RiskPanel";
import ObligationsPanel from "../components/contracts/ObligationsPanel";
import VersionDiffPanel from "../components/contracts/VersionDiffPanel";
import ApprovalPanel from "../components/contracts/ApprovalPanel";

/* ================================================================
   TAB DEFINITIONS
================================================================ */

type TabId = "overview" | "risk" | "obligations" | "approval" | "versions";

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "risk", label: "Risk & Compliance", icon: ShieldAlert },
  { id: "obligations", label: "Obligations", icon: ClipboardCheck },
  { id: "approval", label: "Approval", icon: CheckSquare },
  { id: "versions", label: "Version History", icon: GitMerge },
];

/* ================================================================
   PAGE
================================================================ */

export default function ContractDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  const { data: contract, isLoading, error } = useContract(id);
  const { mutate: toggleStar, isPending: isStarring } = useToggleStar();

  /* ── Loading ──────────────────────────────────────────────── */
  if (isLoading) {
    return (
      <main className="min-h-full bg-[#FAFBFA] px-6 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[1380px]">
          <div className="flex min-h-[500px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 h-6 w-6 animate-spin rounded-full border-2 border-[#DCDFD0] border-t-[#184C40]" />
              <p className="text-[13px] font-medium text-[#181A1F]">
                Loading contract
              </p>
              <p className="mt-1 text-[12px] text-[#8E9591]">
                Preparing contract details...
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* ── Error ────────────────────────────────────────────────── */
  if (error || !contract) {
    return (
      <main className="min-h-full bg-[#FAFBFA] px-6 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[1380px]">
          <div className="flex min-h-[500px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-[#E2E2E2] bg-white text-[#666A72]">
                <FileText size={18} strokeWidth={1.6} />
              </div>
              <h1 className="text-[14px] font-semibold text-[#181A1F]">
                Contract not found
              </h1>
              <p className="mt-1 max-w-sm text-[12px] leading-5 text-[#8E9591]">
                The contract may have been removed or you may not have access.
              </p>
              <button
                type="button"
                onClick={() => navigate("/app/contracts")}
                className="mt-5 inline-flex h-9 items-center gap-2 rounded-lg bg-[#191C24] px-4 text-[12px] font-medium text-white transition-colors hover:bg-[#292D36]"
              >
                <ArrowLeft size={14} />
                Back to contracts
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* ── Date format ──────────────────────────────────────────── */
  const uploadedDate = new Date(contract.uploaded_at).toLocaleDateString(
    undefined,
    { year: "numeric", month: "long", day: "numeric" },
  );

  const ef = contract.extracted_fields;
  const effectiveDate = ef?.effective_date
    ? new Date(ef.effective_date).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;
  const expiryDate = ef?.expiry_date
    ? new Date(ef.expiry_date).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const today = new Date();
  const expiryRaw = ef?.expiry_date ? new Date(ef.expiry_date) : null;
  const daysToExpiry = expiryRaw
    ? Math.ceil(
        (expiryRaw.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
      )
    : null;

  return (
    <main className="min-h-full bg-[#FAFBFA]">
      {/* ================================================================
          STICKY CONTRACT HEADER
      ================================================================ */}
      <div className="sticky top-0 z-20 border-b border-[#E4E8E4] bg-white shadow-sm">
        <div className="mx-auto w-full max-w-[1380px] px-6 sm:px-8 lg:px-10">

          {/* ── Breadcrumb ────────────────────────────────────────────── */}
          <div className="flex items-center gap-2 pb-0 pt-4">
            <button
              type="button"
              onClick={() => navigate("/app/contracts")}
              className="group inline-flex items-center gap-1.5 text-[11px] font-medium text-[#707773] transition-colors hover:text-[#181A1F]"
            >
              <ArrowLeft
                size={13}
                strokeWidth={1.8}
                className="transition-transform duration-150 group-hover:-translate-x-0.5"
              />
              Contracts
            </button>
            <span className="text-[11px] text-[#BFBFBF]">/</span>
            <span className="max-w-[260px] truncate text-[11px] text-[#181A1F] font-medium">
              {contract.file_name}
            </span>
          </div>

          {/* ── Title row ─────────────────────────────────────────────── */}
          <div className="flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Left: Icon + Title + meta */}
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#E4E8E4] bg-[#F0F8F5] text-[#184C40]">
                <FileText size={18} strokeWidth={1.6} />
              </div>
              <div className="min-w-0">
                <h1 className="max-w-[700px] truncate text-[20px] font-semibold tracking-[-0.025em] text-[#181A1F] sm:text-[22px]">
                  {contract.file_name}
                </h1>
                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-[#707773]">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays size={12} strokeWidth={1.7} className="text-[#9A9DA3]" />
                    Uploaded {uploadedDate}
                  </span>
                  {effectiveDate && (
                    <>
                      <span className="h-3 w-px bg-[#DCDFE4]" />
                      <span>Effective {effectiveDate}</span>
                    </>
                  )}
                  {expiryDate && (
                    <>
                      <span className="h-3 w-px bg-[#DCDFE4]" />
                      <span
                        className={
                          daysToExpiry !== null && daysToExpiry <= 30
                            ? "font-semibold text-[#B8953F]"
                            : ""
                        }
                      >
                        Expires {expiryDate}
                        {daysToExpiry !== null && daysToExpiry <= 90 && (
                          <span className="ml-1 text-[#B8953F]">
                            ({daysToExpiry <= 0 ? "expired" : `${daysToExpiry}d left`})
                          </span>
                        )}
                      </span>
                    </>
                  )}
                  {ef?.governing_law && (
                    <>
                      <span className="h-3 w-px bg-[#DCDFE4]" />
                      <span>{ef.governing_law}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Action buttons */}
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              {/* AI Analyzed badge */}
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#CCDFD8] bg-[#EBF5F0] px-3 py-1.5 text-[10px] font-semibold text-[#1E5C4E]">
                <ShieldCheck size={11} strokeWidth={2} />
                AI Analyzed
              </span>

              {/* Processing status badge */}
              <ContractStatusBadge status={contract.status} />

              {/* Lifecycle selector */}
              <LifecycleSelector
                contractId={contract.id}
                current={contract.lifecycle_status}
              />

              {/* Star */}
              <button
                type="button"
                onClick={() => contract && toggleStar(contract.id)}
                disabled={isStarring}
                aria-label={
                  contract.is_starred ? "Remove from starred" : "Add to starred"
                }
                className={`inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-[12px] font-medium transition-all ${
                  contract.is_starred
                    ? "border-[#E8D89A] bg-[#FFFBEE] text-[#A07A10] hover:bg-[#FDF4D3]"
                    : "border-[#E4E8E4] bg-white text-[#707773] hover:border-[#D0D5D2] hover:bg-[#F7F8F7]"
                }`}
              >
                <Star
                  size={13}
                  strokeWidth={1.8}
                  fill={contract.is_starred ? "currentColor" : "none"}
                />
                {contract.is_starred ? "Starred" : "Star"}
              </button>
            </div>
          </div>

          {/* ── Tab bar ───────────────────────────────────────────────── */}
          <div className="flex gap-0 border-t border-[#F0F1F0]">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-4 py-3.5 text-[12px] font-medium transition-colors ${
                    isActive
                      ? "text-[#184C40]"
                      : "text-[#707773] hover:text-[#181A1F]"
                  }`}
                >
                  <Icon size={14} strokeWidth={isActive ? 2 : 1.7} />
                  {tab.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-t-full bg-[#184C40]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================================================================
          TAB CONTENT
      ================================================================ */}
      <div className="mx-auto w-full max-w-[1380px] px-6 py-7 sm:px-8 lg:px-10">

        {/* ── TAB: OVERVIEW ─────────────────────────────────────────── */}
        {activeTab === "overview" && (
          <div className="space-y-7">
            {/* Key data points row */}
            {ef && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <KpiCard
                  label="Contract Value"
                  value={
                    ef.value
                      ? `${ef.currency ? ef.currency + " " : ""}${ef.value.toLocaleString()}`
                      : "—"
                  }
                  highlight={!!ef.value}
                />
                <KpiCard label="Effective Date" value={effectiveDate ?? "—"} />
                <KpiCard
                  label="Expiry Date"
                  value={expiryDate ?? "—"}
                  warn={daysToExpiry !== null && daysToExpiry <= 90 && daysToExpiry > 0}
                  danger={daysToExpiry !== null && daysToExpiry <= 0}
                />
                <KpiCard
                  label="Governing Law"
                  value={ef.governing_law ?? "—"}
                />
              </div>
            )}

            <div className="grid items-start gap-6 xl:grid-cols-2">
              {/* Extracted Information */}
              <div>
                <SectionLabel
                  title="Extracted Information"
                  description="Structured metadata identified from the agreement."
                />
                <ExtractedFieldsPanel
                  fields={contract.extracted_fields}
                  status={contract.status}
                />
              </div>

              {/* AI Summary */}
              <div>
                <SectionLabel
                  title="AI Contract Summary"
                  description="A concise analysis of the agreement generated by AI."
                />
                <SummaryPanel contractId={contract.id} />
              </div>
            </div>

            {/* Parties */}
            {ef?.parties && ef.parties.length > 0 && (
              <div>
                <SectionLabel
                  title="Parties to the Agreement"
                  description="All identified signatories and counterparties."
                />
                <div className="flex flex-wrap gap-3">
                  {ef.parties.map((party, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-xl border border-[#E4E8E4] bg-white px-4 py-3 shadow-sm"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EBF5F0] text-[11px] font-bold text-[#184C40]">
                        {party.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-[12px] font-semibold text-[#181A1F]">
                          {party}
                        </p>
                        <p className="text-[10px] text-[#8E9591]">
                          {i === 0 ? "Primary party" : "Counterparty"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Clauses */}
            {ef?.key_clauses && ef.key_clauses.length > 0 && (
              <div>
                <SectionLabel
                  title="Key Clauses Identified"
                  description="Important contractual provisions detected during AI extraction."
                />
                <div className="flex flex-wrap gap-2">
                  {ef.key_clauses.map((clause, i) => (
                    <span
                      key={i}
                      className="rounded-full border border-[#E4E8E4] bg-white px-3.5 py-1.5 text-[11px] font-medium text-[#43464D] shadow-sm hover:border-[#C5CBC5] hover:bg-[#F7F8F7] transition-colors"
                    >
                      {clause}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Renewal Terms */}
            {ef?.renewal_terms && (
              <div>
                <SectionLabel
                  title="Renewal Terms"
                  description="Contractual provisions governing renewal or extension."
                />
                <div className="rounded-xl border border-[#E4E8E4] bg-white p-5 shadow-sm">
                  <p className="text-[13px] leading-6 text-[#3C4040]">
                    {ef.renewal_terms}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── TAB: RISK & COMPLIANCE ─────────────────────────────────── */}
        {activeTab === "risk" && (
          <div className="max-w-[900px] space-y-6">
            <SectionLabel
              title="Risk Assessment"
              description="AI-detected risks, flagged clauses, missing protections, and compliance concerns."
            />
            <RiskPanel contractId={contract.id} />
          </div>
        )}

        {/* ── TAB: OBLIGATIONS ──────────────────────────────────────── */}
        {activeTab === "obligations" && (
          <div className="max-w-[900px] space-y-6">
            <SectionLabel
              title="Renewals & Obligations"
              description="Track important deadlines, compliance duties, and renewal actions for this contract."
            />
            <ObligationsPanel contractId={contract.id} />
          </div>
        )}

        {/* ── TAB: APPROVAL ─────────────────────────────────────────── */}
        {activeTab === "approval" && (
          <div className="max-w-[900px] space-y-6">
            <SectionLabel
              title="Approval Workflow"
              description="Track the review and approval progress for this contract across all stakeholders."
            />
            <ApprovalPanel contractId={contract.id} />
          </div>
        )}

        {/* ── TAB: VERSION HISTORY ──────────────────────────────────── */}
        {activeTab === "versions" && (
          <div className="max-w-[900px] space-y-6">
            <SectionLabel
              title="Version History & Diff"
              description="Compare changes between contract versions and track document evolution."
            />
            <VersionDiffPanel contractId={contract.id} />
          </div>
        )}
      </div>
    </main>
  );
}

/* ================================================================
   KPI CARD
================================================================ */

function KpiCard({
  label,
  value,
  highlight = false,
  warn = false,
  danger = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  warn?: boolean;
  danger?: boolean;
}) {
  const borderColor = danger
    ? "border-[#F2D6D3]"
    : warn
      ? "border-[#EAD9BD]"
      : highlight
        ? "border-[#CDDFD8]"
        : "border-[#E4E8E4]";

  const bg = danger
    ? "bg-[#FEF7F6]"
    : warn
      ? "bg-[#FBF7EB]"
      : highlight
        ? "bg-[#EBF5F0]"
        : "bg-white";

  const valueColor = danger
    ? "text-[#B9443D]"
    : warn
      ? "text-[#8D7027]"
      : highlight
        ? "text-[#184C40]"
        : "text-[#181A1F]";

  return (
    <div className={`rounded-2xl border p-4 shadow-sm ${borderColor} ${bg}`}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8E9591]">
        {label}
      </p>
      <p
        className={`mt-1.5 text-[15px] font-semibold tracking-[-0.02em] ${valueColor} ${value === "—" ? "opacity-30" : ""}`}
      >
        {value}
      </p>
    </div>
  );
}

/* ================================================================
   SECTION LABEL
================================================================ */

function SectionLabel({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-4">
      <h2 className="text-[14px] font-semibold tracking-[-0.01em] text-[#181A1F]">
        {title}
      </h2>
      <p className="mt-0.5 text-[11px] leading-4 text-[#8E9591]">
        {description}
      </p>
    </div>
  );
}

/* ================================================================
   CONTRACT STATUS BADGE
================================================================ */

function ContractStatusBadge({ status }: { status: string }) {
  const normalizedStatus = status.toLowerCase();
  const isFailed = normalizedStatus === "failed" || normalizedStatus === "error";
  const isReady =
    normalizedStatus === "completed" ||
    normalizedStatus === "processed" ||
    normalizedStatus === "active" ||
    normalizedStatus === "extracted";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-semibold capitalize ${
        isFailed
          ? "border-[#F2D6D3] bg-[#FEF7F6] text-[#B9443D]"
          : isReady
            ? "border-[#CDDFD8] bg-[#EBF5F0] text-[#1E5C4E]"
            : "border-[#EAD9BD] bg-[#FBF7EB] text-[#8D7027]"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isFailed ? "bg-[#C94B4B]" : isReady ? "bg-[#184C40]" : "bg-[#B8953F]"
        }`}
      />
      {status}
    </span>
  );
}

/* ================================================================
   LIFECYCLE SELECTOR
================================================================ */

const LIFECYCLE_OPTIONS: { value: LifecycleStatus; label: string; color: string }[] = [
  { value: "draft", label: "Draft", color: "#707773" },
  { value: "active", label: "Active", color: "#184C40" },
  { value: "executed", label: "Executed", color: "#2A57A8" },
  { value: "expired", label: "Expired", color: "#8B5E2A" },
  { value: "terminated", label: "Terminated", color: "#C94B4B" },
];

const lifecycleStyle: Record<
  LifecycleStatus,
  { border: string; bg: string; text: string; dot: string }
> = {
  draft: {
    border: "border-[#E4E8E4]",
    bg: "bg-[#F7F8F7]",
    text: "text-[#707773]",
    dot: "bg-[#9A9DA3]",
  },
  active: {
    border: "border-[#CDDFD8]",
    bg: "bg-[#EBF5F0]",
    text: "text-[#1E5C4E]",
    dot: "bg-[#184C40]",
  },
  executed: {
    border: "border-[#C5D5F0]",
    bg: "bg-[#EEF3FC]",
    text: "text-[#2A57A8]",
    dot: "bg-[#2A57A8]",
  },
  expired: {
    border: "border-[#EAD9BD]",
    bg: "bg-[#FBF7EB]",
    text: "text-[#8B5E2A]",
    dot: "bg-[#B8953F]",
  },
  terminated: {
    border: "border-[#F2D6D3]",
    bg: "bg-[#FEF7F6]",
    text: "text-[#C94B4B]",
    dot: "bg-[#C94B4B]",
  },
};

function LifecycleSelector({
  contractId,
  current,
}: {
  contractId: string;
  current: LifecycleStatus;
}) {
  const { mutate: updateLifecycle, isPending } = useUpdateLifecycle();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const style = lifecycleStyle[current] ?? lifecycleStyle.draft;

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        disabled={isPending}
        onClick={() => setOpen((p) => !p)}
        className={`inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-[12px] font-semibold transition-all ${style.border} ${style.bg} ${style.text}`}
      >
        <span className={`h-2 w-2 rounded-full ${style.dot}`} />
        {LIFECYCLE_OPTIONS.find((o) => o.value === current)?.label ?? current}
        <ChevronDown
          size={12}
          strokeWidth={2}
          className={`ml-0.5 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-40 mt-1.5 min-w-[165px] overflow-hidden rounded-xl border border-[#E4E8E4] bg-white shadow-xl">
          <div className="px-3 pb-1.5 pt-2.5">
            <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#9A9DA3]">
              Lifecycle Stage
            </p>
          </div>
          {LIFECYCLE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                updateLifecycle({ contractId, status: opt.value });
                setOpen(false);
              }}
              className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-[12px] font-medium transition-colors hover:bg-[#F7F8F7] ${
                current === opt.value
                  ? "text-[#181A1F]"
                  : "text-[#43464D]"
              }`}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: opt.color }}
              />
              {opt.label}
              {current === opt.value && (
                <span className="ml-auto text-[#184C40]">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
