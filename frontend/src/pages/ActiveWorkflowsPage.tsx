import { useState } from "react";
import { Clock, AlertTriangle } from "lucide-react";
import { useActiveWorkflowInstances } from "../hooks/useWorkflowHub";
import ActiveInstancesTable from "../components/workflows/ActiveInstancesTable";

export default function ActiveWorkflowsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { data: instances, isLoading, error } =
    useActiveWorkflowInstances(statusFilter);

  const inProgressCount =
    instances?.filter((i) => i.status === "in_progress").length ?? 0;
  const approvedCount =
    instances?.filter((i) => i.status === "approved").length ?? 0;

  return (
    <main className="min-h-full bg-white px-6 py-7 sm:px-8 lg:px-10">
      <div className="mx-auto w-full max-w-[1380px]">
        {/* ── Page Header ────────────────────────────────────────────── */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-[28px] font-semibold tracking-[-0.035em] text-[#181A1F] sm:text-[30px]">
              Active Workflows
            </h1>
            <p className="mt-1 text-[13px] text-[#707773]">
              Real-time audit and tracking for contracts in team review and approval
            </p>
          </div>
        </div>

        {/* ── Filter Bar & Metrics ───────────────────────────────────── */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#E9ECEA] bg-[#FAFBFA] p-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#EADBBD] bg-[#FBF7EB] px-3 py-1 text-[11px] font-semibold text-[#8D7027]">
              <Clock size={12} strokeWidth={2} />
              {inProgressCount} in-flight review{inProgressCount === 1 ? "" : "s"}
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#DCE8E3] bg-[#F2F8F5] px-3 py-1 text-[11px] font-medium text-[#184C40]">
              ✓ {approvedCount} completed
            </div>
          </div>

          {/* Status selector */}
          <div className="flex items-center gap-1 rounded-xl border border-[#DCDFD0] bg-white p-1 text-[11px] font-medium">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`rounded-lg px-3 py-1 transition-all ${
                statusFilter === "all"
                  ? "bg-[#184C40] font-semibold text-white shadow-sm"
                  : "text-[#707773] hover:text-[#181A1F]"
              }`}
            >
              All Reviews
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("in_progress")}
              className={`rounded-lg px-3 py-1 transition-all ${
                statusFilter === "in_progress"
                  ? "bg-[#184C40] font-semibold text-white shadow-sm"
                  : "text-[#707773] hover:text-[#181A1F]"
              }`}
            >
              In Progress
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("approved")}
              className={`rounded-lg px-3 py-1 transition-all ${
                statusFilter === "approved"
                  ? "bg-[#184C40] font-semibold text-white shadow-sm"
                  : "text-[#707773] hover:text-[#181A1F]"
              }`}
            >
              Approved
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("rejected")}
              className={`rounded-lg px-3 py-1 transition-all ${
                statusFilter === "rejected"
                  ? "bg-[#184C40] font-semibold text-white shadow-sm"
                  : "text-[#707773] hover:text-[#181A1F]"
              }`}
            >
              Rejected
            </button>
          </div>
        </div>

        {/* ── Table Content ──────────────────────────────────────────── */}
        <section className="w-full">
          {isLoading && (
            <div className="flex min-h-[340px] flex-col items-center justify-center text-center">
              <div className="mb-4 h-6 w-6 animate-spin rounded-full border-2 border-[#DCDFD0] border-t-[#184C40]" />
              <p className="text-[13px] font-medium text-[#181A1F]">
                Loading active review workflows...
              </p>
            </div>
          )}

          {error && (
            <div className="flex min-h-[340px] flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#FEF7F6] text-[#B9443D]">
                <AlertTriangle size={17} />
              </div>
              <p className="text-[13px] font-semibold text-[#181A1F]">
                Unable to load workflow instances
              </p>
            </div>
          )}

          {instances && !isLoading && !error && (
            <ActiveInstancesTable
              instances={instances}
              emptyTitle="No workflow reviews found"
              emptyDescription="Submit contracts for review from the contract detail page to track them here."
            />
          )}
        </section>
      </div>
    </main>
  );
}
