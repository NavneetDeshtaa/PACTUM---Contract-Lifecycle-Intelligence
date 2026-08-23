import { useState } from "react";
import { GitBranch, Check, X, Sparkles } from "lucide-react";
import {
  useWorkflows, useApprovalStatus, useSubmitForApproval,
  useApproveStage, useRejectStage, useAdvisory,
} from "../../hooks/usePhase5";

interface ApprovalPanelProps {
  contractId: string;
}

const statusColor: Record<string, string> = {
  in_progress: "border-gold/20 bg-gold/[0.06] text-gold",
  approved: "border-insert/20 bg-insert/[0.06] text-insert",
  rejected: "border-redline/20 bg-redline/[0.06] text-redline",
};

export default function ApprovalPanel({ contractId }: ApprovalPanelProps) {
  const { data: status, isLoading, error } = useApprovalStatus(contractId);
  const { data: workflows } = useWorkflows();
  const submit = useSubmitForApproval(contractId);
  const approve = useApproveStage(contractId);
  const reject = useRejectStage(contractId);

  const [selectedWorkflow, setSelectedWorkflow] = useState("");
  const [comment, setComment] = useState("");
  const [showAdvisory, setShowAdvisory] = useState(false);
  const { data: advisory, isLoading: advisoryLoading } = useAdvisory(contractId, showAdvisory);

  if (isLoading) {
    return (
      <div className="rounded-xl border border-ink/10 bg-paper/50 p-6 text-center text-xs text-ink-soft">
        Loading approval status...
      </div>
    );
  }

  // No approval instance yet -- show the submit form.
  if (error || !status) {
    return (
      <div className="rounded-xl border border-ink/10 bg-white p-6 space-y-4">
        <div className="flex items-center gap-2">
          <GitBranch size={15} className="text-ink-soft" />
          <h3 className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
            Approval Workflow
          </h3>
        </div>
        <p className="text-xs text-ink-soft">Not yet submitted for approval.</p>
        <div className="flex gap-2">
          <select
            value={selectedWorkflow}
            onChange={(e) => setSelectedWorkflow(e.target.value)}
            className="flex-1 rounded-lg border border-ink/10 bg-white px-3 py-2 text-xs text-ink"
          >
            <option value="" disabled>Select a workflow</option>
            {workflows?.map((w) => (
              <option key={w.id} value={w.id}>{w.name} ({w.stages.join(" \u2192 ")})</option>
            ))}
          </select>
          <button
            onClick={() => selectedWorkflow && submit.mutate(selectedWorkflow)}
            disabled={!selectedWorkflow || submit.isPending}
            className="rounded-lg bg-ink px-4 py-2 text-xs font-semibold text-white hover:bg-ink/90 disabled:bg-ink/30 transition-colors"
          >
            {submit.isPending ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-ink/10 bg-white p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GitBranch size={15} className="text-ink-soft" />
          <h3 className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
            Approval Workflow
          </h3>
        </div>
        <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold capitalize ${statusColor[status.status]}`}>
          {status.status.replace("_", " ")}
        </span>
      </div>

      {/* Stage pipeline */}
      <div className="flex items-center">
        {status.stages.map((stage, i) => {
          const isPast = i < status.current_stage_index || status.status === "approved";
          const isCurrent = i === status.current_stage_index && status.status === "in_progress";
          return (
            <div key={stage} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
                    isPast ? "bg-insert text-white" : isCurrent ? "bg-gold text-white" : "bg-paper text-ink-soft border border-ink/10"
                  }`}
                >
                  {isPast ? <Check size={11} /> : i + 1}
                </div>
                <span className="text-[9px] text-ink-soft text-center max-w-[60px]">{stage}</span>
              </div>
              {i < status.stages.length - 1 && (
                <div className={`h-[2px] flex-1 ${isPast ? "bg-insert" : "bg-ink/10"}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Actions */}
      {status.status === "in_progress" && (
        <div className="space-y-3 border-t border-ink/[0.07] pt-4">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Optional comment..."
            rows={2}
            className="w-full rounded-lg border border-ink/10 px-3 py-2 text-xs text-ink placeholder:text-ink-soft/50"
          />
          <div className="flex gap-2">
            <button
              onClick={() => approve.mutate(comment || undefined, { onSuccess: () => setComment("") })}
              disabled={approve.isPending}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-insert px-3 py-2 text-xs font-semibold text-white hover:bg-insert/90 transition-colors"
            >
              <Check size={12} /> Approve
            </button>
            <button
              onClick={() => reject.mutate(comment || undefined, { onSuccess: () => setComment("") })}
              disabled={reject.isPending}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-redline px-3 py-2 text-xs font-semibold text-white hover:bg-redline/90 transition-colors"
            >
              <X size={12} /> Reject
            </button>
          </div>

          {!showAdvisory ? (
            <button
              onClick={() => setShowAdvisory(true)}
              className="flex items-center gap-1.5 text-[10px] font-semibold text-ink-soft hover:text-ink transition-colors"
            >
              <Sparkles size={11} /> Get AI Advisory
            </button>
          ) : advisoryLoading ? (
            <p className="text-[10px] text-ink-soft">Loading advisory...</p>
          ) : advisory ? (
            <div className="rounded-lg border border-ink/10 bg-paper/50 px-3.5 py-2.5">
              <p className="text-[9px] font-semibold uppercase tracking-wide text-ink-soft">
                Advisory: {advisory.recommendation.replace("_", " ")}
              </p>
              <p className="mt-1 text-xs text-ink-soft">{advisory.reasoning}</p>
            </div>
          ) : null}
        </div>
      )}

      {/* History */}
      {status.actions.length > 0 && (
        <div className="border-t border-ink/[0.07] pt-4">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-soft/60">History</p>
          <div className="space-y-2">
            {status.actions.map((a, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                {a.action === "approved" ? (
                  <Check size={12} className="mt-0.5 text-insert shrink-0" />
                ) : (
                  <X size={12} className="mt-0.5 text-redline shrink-0" />
                )}
                <div className="min-w-0">
                  <p className="text-ink-soft">
                    <span className="font-semibold text-ink">{a.stage_name}</span> {a.action} by {a.actor_email ?? "unknown"}
                  </p>
                  {a.comment && <p className="text-ink-soft/70">"{a.comment}"</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}