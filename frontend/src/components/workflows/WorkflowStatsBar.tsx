import {
  Workflow,
  FileText,
  Clock,
  CheckCircle2,
} from "lucide-react";
import type { WorkflowStats } from "../../types/phase5";

interface WorkflowStatsBarProps {
  stats: WorkflowStats | undefined;
  isLoading?: boolean;
}

export default function WorkflowStatsBar({
  stats,
  isLoading,
}: WorkflowStatsBarProps) {
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

  const totalWorkflows = stats?.total_workflows ?? 0;
  const totalTemplates = stats?.total_templates ?? 0;
  const activeInProgress = stats?.active_in_progress ?? 0;
  const totalApproved = stats?.total_approved ?? 0;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
      {/* ── Total Pipelines ──────────────────────────────────────────── */}
      <div className="rounded-xl border border-[#E9ECEA] bg-white p-4 transition-all duration-200 hover:border-[#D0D5D2] hover:shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#707773]">
            Workflows
          </span>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F5F6F5] text-[#181A1F]">
            <Workflow size={14} strokeWidth={1.8} />
          </div>
        </div>
        <p className="mt-2 text-[24px] font-semibold tracking-[-0.03em] text-[#181A1F]">
          {totalWorkflows}
        </p>
        <p className="mt-0.5 text-[11px] text-[#8E9591]">Configured pipelines</p>
      </div>

      {/* ── Active In-Flight Reviews ─────────────────────────────────── */}
      <div className="rounded-xl border border-[#E1ECE6] bg-[#F7FCFA] p-4 transition-all duration-200 hover:border-[#BEDACE] hover:shadow-[0_2px_8px_rgba(24,76,64,0.04)]">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#1E5C4E]">
            In-Flight Reviews
          </span>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#E2F0EB] text-[#184C40]">
            <Clock size={14} strokeWidth={1.8} />
          </div>
        </div>
        <p className="mt-2 text-[24px] font-semibold tracking-[-0.03em] text-[#184C40]">
          {activeInProgress}
        </p>
        <p className="mt-0.5 text-[11px] text-[#528276]">Active review processes</p>
      </div>

      {/* ── Approved Contracts ───────────────────────────────────────── */}
      <div className="rounded-xl border border-[#E9ECEA] bg-white p-4 transition-all duration-200 hover:border-[#D0D5D2] hover:shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#707773]">
            Approved
          </span>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F5F6F5] text-[#181A1F]">
            <CheckCircle2 size={14} strokeWidth={1.8} />
          </div>
        </div>
        <p className="mt-2 text-[24px] font-semibold tracking-[-0.03em] text-[#181A1F]">
          {totalApproved}
        </p>
        <p className="mt-0.5 text-[11px] text-[#8E9591]">Fully approved contracts</p>
      </div>

      {/* ── Contract Templates ───────────────────────────────────────── */}
      <div className="rounded-xl border border-[#E9ECEA] bg-white p-4 transition-all duration-200 hover:border-[#D0D5D2] hover:shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#707773]">
            Templates
          </span>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F5F6F5] text-[#181A1F]">
            <FileText size={14} strokeWidth={1.8} />
          </div>
        </div>
        <p className="mt-2 text-[24px] font-semibold tracking-[-0.03em] text-[#181A1F]">
          {totalTemplates}
        </p>
        <p className="mt-0.5 text-[11px] text-[#8E9591]">AI-ready drafts library</p>
      </div>
    </div>
  );
}
