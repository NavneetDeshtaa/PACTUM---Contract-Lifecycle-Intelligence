import { Link } from "react-router-dom";
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  Workflow,
} from "lucide-react";
import type { ActiveWorkflowInstance } from "../../types/phase5";

interface ActiveInstancesTableProps {
  instances: ActiveWorkflowInstance[];
  emptyTitle?: string;
  emptyDescription?: string;
}

export default function ActiveInstancesTable({
  instances,
  emptyTitle = "No active reviews in progress",
  emptyDescription = "Contracts submitted for internal team approval will appear here with live stage tracking.",
}: ActiveInstancesTableProps) {
  if (instances.length === 0) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center px-6 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-[#E9ECEA] bg-[#FAFBFA] text-[#707773]">
          <Workflow size={20} strokeWidth={1.6} />
        </div>
        <p className="text-[14px] font-semibold text-[#181A1F]">{emptyTitle}</p>
        <p className="mt-1 max-w-sm text-[12px] leading-5 text-[#858D89]">
          {emptyDescription}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[800px] border-collapse">
        <thead>
          <tr className="border-b border-[#E9ECEA] text-left">
            <th className="px-3 py-3.5 sm:px-4">
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8E9591]">
                Contract
              </span>
            </th>
            <th className="px-3 py-3.5 sm:px-4">
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8E9591]">
                Workflow Pipeline
              </span>
            </th>
            <th className="px-3 py-3.5 sm:px-4">
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8E9591]">
                Current Progress
              </span>
            </th>
            <th className="px-3 py-3.5 sm:px-4">
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8E9591]">
                Status
              </span>
            </th>
            <th className="px-3 py-3.5 sm:px-4">
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8E9591]">
                Started
              </span>
            </th>
            <th className="w-12 px-3 py-3.5 sm:px-4">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>

        <tbody>
          {instances.map((item) => {
            const isApproved = item.status === "approved";
            const isRejected = item.status === "rejected";

            const progressPct =
              item.total_stages > 0
                ? Math.min(
                    100,
                    Math.round(
                      ((item.current_stage_index + (isApproved ? 1 : 0)) /
                        item.total_stages) *
                        100,
                    ),
                  )
                : 0;

            const startedDate = new Date(item.started_at).toLocaleDateString(
              undefined,
              {
                month: "short",
                day: "numeric",
                year: "numeric",
              },
            );

            return (
              <tr
                key={item.instance_id}
                className="group border-b border-[#F0F1F0] transition-colors last:border-b-0 hover:bg-[#FAFBFA]"
              >
                {/* ── Contract File ────────────────────────────────────── */}
                <td className="px-3 py-4 sm:px-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#E9ECEA] bg-white text-[#707773] group-hover:border-[#184C40] group-hover:text-[#184C40]">
                      <FileText size={16} strokeWidth={1.7} />
                    </div>
                    <div className="min-w-0">
                      <Link
                        to={`/app/contracts/${item.contract_id}`}
                        className="block max-w-[240px] truncate text-[13px] font-medium text-[#181A1F] hover:text-[#184C40]"
                      >
                        {item.contract_file_name}
                      </Link>
                      <p className="mt-0.5 text-[10px] text-[#8E9591]">
                        {item.actions.length} decision
                        {item.actions.length === 1 ? "" : "s"} logged
                      </p>
                    </div>
                  </div>
                </td>

                {/* ── Workflow Name ────────────────────────────────────── */}
                <td className="px-3 py-4 sm:px-4">
                  <span className="text-[12px] font-medium text-[#464C48]">
                    {item.workflow_name}
                  </span>
                </td>

                {/* ── Stage Progress Bar ───────────────────────────────── */}
                <td className="px-3 py-4 sm:px-4">
                  <div className="min-w-[180px] max-w-[240px]">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-[#181A1F]">
                        {item.current_stage_name || "Completed"}
                      </span>
                      <span className="text-[#8E9591]">
                        {isApproved
                          ? `${item.total_stages}/${item.total_stages}`
                          : `Step ${Math.min(
                              item.current_stage_index + 1,
                              item.total_stages,
                            )} of ${item.total_stages}`}
                      </span>
                    </div>
                    <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[#E9ECEA]">
                      <div
                        className={`h-full transition-all duration-300 ${
                          isApproved
                            ? "bg-[#184C40]"
                            : isRejected
                              ? "bg-[#B9443D]"
                              : "bg-[#256B58]"
                        }`}
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>
                </td>

                {/* ── Status Badge ─────────────────────────────────────── */}
                <td className="px-3 py-4 sm:px-4">
                  {isApproved ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-[#DCE8E3] bg-[#F2F8F5] px-2.5 py-0.5 text-[10px] font-medium text-[#184C40]">
                      <CheckCircle2 size={11} strokeWidth={2} />
                      Approved
                    </span>
                  ) : isRejected ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-[#F2D6D3] bg-[#FEF7F6] px-2.5 py-0.5 text-[10px] font-medium text-[#B9443D]">
                      <XCircle size={11} strokeWidth={2} />
                      Rejected
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full border border-[#EADBBD] bg-[#FBF7EB] px-2.5 py-0.5 text-[10px] font-medium text-[#8D7027]">
                      <Clock size={11} strokeWidth={2} />
                      In Progress
                    </span>
                  )}
                </td>

                {/* ── Started Date ─────────────────────────────────────── */}
                <td className="px-3 py-4 sm:px-4">
                  <span className="text-[12px] text-[#707773]">
                    {startedDate}
                  </span>
                </td>

                {/* ── Link to Contract ─────────────────────────────────── */}
                <td className="px-3 py-4 text-right sm:px-4">
                  <Link
                    to={`/app/contracts/${item.contract_id}`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#8E9591] transition-all hover:bg-[#F0F6F4] hover:text-[#184C40]"
                    aria-label="Review contract in detail"
                    title="Review approval in contract details"
                  >
                    <ArrowUpRight size={14} strokeWidth={2} />
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
