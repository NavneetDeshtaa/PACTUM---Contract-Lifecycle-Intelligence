import { useState } from "react";
import { Plus, Workflow, AlertTriangle } from "lucide-react";
import {
  useWorkflows,
  useWorkflowStats,
} from "../hooks/useWorkflowHub";
import WorkflowStatsBar from "../components/workflows/WorkflowStatsBar";
import WorkflowCard from "../components/workflows/WorkflowCard";
import NewWorkflowModal from "../components/workflows/NewWorkflowModal";

export default function WorkflowsOverviewPage() {
  const [newModalOpen, setNewModalOpen] = useState(false);

  const { data: stats, isLoading: statsLoading } = useWorkflowStats();
  const { data: workflows, isLoading, error } = useWorkflows();

  const count = workflows?.length ?? 0;

  return (
    <main className="min-h-full bg-white px-6 py-7 sm:px-8 lg:px-10">
      <div className="mx-auto w-full max-w-[1380px]">
        {/* ── Page Header ────────────────────────────────────────────── */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-[28px] font-semibold tracking-[-0.035em] text-[#181A1F] sm:text-[30px]">
              Approval Workflows
            </h1>
            <p className="mt-1 text-[13px] text-[#707773]">
              Configure multi-stage approval sequences and automated governance for contracts
            </p>
          </div>

          <button
            type="button"
            onClick={() => setNewModalOpen(true)}
            className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-xl bg-[#184C40] px-4 text-[13px] font-medium text-white shadow-sm transition-all hover:bg-[#1E5C4E] active:scale-[0.99]"
          >
            <Plus size={16} strokeWidth={2} />
            Create Workflow
          </button>
        </div>

        {/* ── Stats Bar ──────────────────────────────────────────────── */}
        <div className="mb-7">
          <WorkflowStatsBar stats={stats} isLoading={statsLoading} />
        </div>

        {/* ── Section Title ──────────────────────────────────────────── */}
        <div className="mb-5 flex items-center justify-between border-b border-[#E9ECEA] pb-3">
          <div>
            <h2 className="text-[15px] font-semibold text-[#181A1F]">
              Configured Pipelines ({count})
            </h2>
            <p className="text-[12px] text-[#707773]">
              Selectable approval tracks available for agreement submission
            </p>
          </div>
        </div>

        {/* ── Content Grid ───────────────────────────────────────────── */}
        <section className="w-full">
          {isLoading && (
            <div className="flex min-h-[340px] flex-col items-center justify-center text-center">
              <div className="mb-4 h-6 w-6 animate-spin rounded-full border-2 border-[#DCDFD0] border-t-[#184C40]" />
              <p className="text-[13px] font-medium text-[#181A1F]">
                Loading workflow pipelines...
              </p>
            </div>
          )}

          {error && (
            <div className="flex min-h-[340px] flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#FEF7F6] text-[#B9443D]">
                <AlertTriangle size={17} />
              </div>
              <p className="text-[13px] font-semibold text-[#181A1F]">
                Unable to load workflows
              </p>
            </div>
          )}

          {workflows && !isLoading && !error && (
            <>
              {workflows.length === 0 ? (
                <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-[#E9ECEA] bg-[#FAFBFA] px-6 text-center">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-[#E9ECEA] bg-white text-[#707773]">
                    <Workflow size={20} strokeWidth={1.6} />
                  </div>
                  <p className="text-[14px] font-semibold text-[#181A1F]">
                    No approval workflows defined
                  </p>
                  <p className="mt-1 max-w-sm text-[12px] leading-5 text-[#858D89]">
                    Create your first workflow to route contracts through structured team approvals.
                  </p>
                  <button
                    type="button"
                    onClick={() => setNewModalOpen(true)}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#184C40] px-4 py-2 text-[12px] font-medium text-white shadow-sm hover:bg-[#1E5C4E]"
                  >
                    <Plus size={14} />
                    New Workflow
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {workflows.map((wf) => (
                    <WorkflowCard key={wf.id} workflow={wf} />
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </div>

      <NewWorkflowModal
        open={newModalOpen}
        onClose={() => setNewModalOpen(false)}
      />
    </main>
  );
}
