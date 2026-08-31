import { ArrowRight, Trash2 } from "lucide-react";
import type { ApprovalWorkflowOption } from "../../types/phase5";
import { useDeleteWorkflow } from "../../hooks/useWorkflowHub";

interface WorkflowCardProps {
  workflow: ApprovalWorkflowOption;
}

export default function WorkflowCard({ workflow }: WorkflowCardProps) {
  const { mutate: deleteWf, isPending: isDeleting } = useDeleteWorkflow();

  const isCustom = !["Standard Approval", "Quick Approval"].includes(
    workflow.name,
  );

  return (
    <div className="group flex flex-col justify-between rounded-2xl border border-[#E9ECEA] bg-white p-5 shadow-sm transition-all duration-200 hover:border-[#CBD2CE] hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
      <div>
        {/* ── Top Row ──────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-[15px] font-semibold text-[#181A1F]">
                {workflow.name}
              </h3>
              {workflow.contract_type && (
                <span className="rounded-md border border-[#E1E4E2] bg-[#F7F8F7] px-2 py-0.5 text-[10px] font-medium text-[#545B57] uppercase tracking-wider">
                  {workflow.contract_type}
                </span>
              )}
            </div>
            <p className="mt-1 text-[12px] text-[#707773]">
              {workflow.stages.length} Approval Stage
              {workflow.stages.length === 1 ? "" : "s"}
            </p>
          </div>

          {/* Delete Action (for custom workflows) */}
          {isCustom && (
            <button
              type="button"
              onClick={() => !isDeleting && deleteWf(workflow.id)}
              aria-label="Deactivate workflow"
              title="Deactivate workflow"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#8E9591] opacity-0 transition-all hover:bg-[#FEF7F6] hover:text-[#B9443D] group-hover:opacity-100"
            >
              <Trash2 size={14} strokeWidth={1.8} />
            </button>
          )}
        </div>

        {/* ── Visual Stages Progression ────────────────────────────────── */}
        <div className="mt-5">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8E9591]">
            Approval Sequence
          </p>
          <div className="flex flex-wrap items-center gap-1.5">
            {workflow.stages.map((stage, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#E1ECE6] bg-[#F7FCFA] px-2.5 py-1 text-[11px] font-medium text-[#184C40]">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#E2F0EB] text-[9px] font-bold text-[#184C40]">
                    {idx + 1}
                  </span>
                  {stage}
                </span>
                {idx < workflow.stages.length - 1 && (
                  <ArrowRight
                    size={11}
                    className="shrink-0 text-[#B0B6B2]"
                    strokeWidth={2}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <div className="mt-6 flex items-center justify-between border-t border-[#F0F1F0] pt-3 text-[11px] text-[#707773]">
        <span>
          {workflow.active_instances_count !== undefined
            ? `${workflow.active_instances_count} in-flight contract${
                workflow.active_instances_count === 1 ? "" : "s"
              }`
            : "Active pipeline"}
        </span>
        <span className="inline-flex items-center gap-1 font-medium text-[#184C40]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#184C40]" />
          Production Ready
        </span>
      </div>
    </div>
  );
}
