import { Link } from "react-router-dom";
import {
  CalendarDays,
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Bell,
  Trash2,
} from "lucide-react";
import type { RenewalObligation } from "../../types/tracking";
import {
  useToggleObligation,
  useDeleteObligation,
} from "../../hooks/useObligations";

interface ObligationTableProps {
  obligations: RenewalObligation[];
  showContractColumn?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function getDaysRemaining(due_date: string): number {
  const due = new Date(due_date).getTime();
  const today = new Date().setHours(0, 0, 0, 0);
  return Math.ceil((due - today) / (1000 * 60 * 60 * 24));
}

export default function ObligationTable({
  obligations,
  showContractColumn = true,
  emptyTitle = "No obligations found",
  emptyDescription = "Track renewals, compliance deadlines, and contractual milestones here.",
}: ObligationTableProps) {
  const { mutate: toggleStatus, isPending: isToggling } =
    useToggleObligation();
  const { mutate: deleteObligation, isPending: isDeleting } =
    useDeleteObligation();

  if (obligations.length === 0) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center px-6 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-[#E9ECEA] bg-[#FAFBFA] text-[#707773]">
          <CalendarDays size={20} strokeWidth={1.6} />
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
      <table className="w-full min-w-[760px] border-collapse">
        <thead>
          <tr className="border-b border-[#E9ECEA] text-left">
            <th className="w-12 px-3 py-3.5 sm:px-4">
              <span className="sr-only">Status</span>
            </th>
            <th className="px-3 py-3.5 sm:px-4">
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8E9591]">
                Title & Description
              </span>
            </th>
            {showContractColumn && (
              <th className="px-3 py-3.5 sm:px-4">
                <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8E9591]">
                  Contract
                </span>
              </th>
            )}
            <th className="px-3 py-3.5 sm:px-4">
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8E9591]">
                Type
              </span>
            </th>
            <th className="px-3 py-3.5 sm:px-4">
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8E9591]">
                Due Date
              </span>
            </th>
            <th className="px-3 py-3.5 sm:px-4">
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8E9591]">
                Urgency
              </span>
            </th>
            <th className="w-12 px-3 py-3.5 sm:px-4">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>

        <tbody>
          {obligations.map((item) => {
            const days = getDaysRemaining(item.due_date);
            const isOverdue = days < 0 && !item.is_completed;
            const isDueSoon = days >= 0 && days <= 30 && !item.is_completed;
            const isRenewal = item.item_type === "renewal";

            const formattedDate = new Date(item.due_date).toLocaleDateString(
              undefined,
              {
                month: "short",
                day: "numeric",
                year: "numeric",
              },
            );

            return (
              <tr
                key={item.id}
                className={`group border-b border-[#F0F1F0] transition-colors last:border-b-0 hover:bg-[#FAFBFA] ${
                  item.is_completed ? "bg-[#FAFBFA]/60 opacity-75" : ""
                }`}
              >
                {/* ── Checkbox / Completion ───────────────────────────── */}
                <td className="px-3 py-4 sm:px-4">
                  <button
                    type="button"
                    onClick={() => !isToggling && toggleStatus(item.id)}
                    aria-label={
                      item.is_completed
                        ? "Mark as pending"
                        : "Mark as completed"
                    }
                    className={`flex h-6 w-6 items-center justify-center rounded-md border transition-all ${
                      item.is_completed
                        ? "border-[#184C40] bg-[#184C40] text-white"
                        : "border-[#D0D5D2] bg-white text-transparent hover:border-[#184C40] hover:text-[#184C40]/30"
                    }`}
                  >
                    <CheckCircle2 size={15} strokeWidth={2.5} />
                  </button>
                </td>

                {/* ── Title & Description ─────────────────────────────── */}
                <td className="px-3 py-4 sm:px-4">
                  <div className="max-w-[360px]">
                    <p
                      className={`text-[13px] font-medium tracking-[-0.01em] text-[#181A1F] ${
                        item.is_completed ? "line-through text-[#8E9591]" : ""
                      }`}
                    >
                      {item.title}
                    </p>
                    {item.description && (
                      <p className="mt-0.5 line-clamp-2 text-[11px] leading-4 text-[#707773]">
                        {item.description}
                      </p>
                    )}
                    {item.notice_period_days && !item.is_completed && (
                      <span className="mt-1 inline-flex items-center gap-1 rounded bg-[#F5F6F5] px-1.5 py-0.5 text-[10px] font-medium text-[#707773]">
                        <Bell size={10} strokeWidth={2} />
                        {item.notice_period_days}d notice required
                      </span>
                    )}
                  </div>
                </td>

                {/* ── Contract ────────────────────────────────────────── */}
                {showContractColumn && (
                  <td className="px-3 py-4 sm:px-4">
                    <Link
                      to={`/app/contracts/${item.contract_id}`}
                      className="group/c inline-flex items-center gap-1.5 text-[12px] font-medium text-[#181A1F] transition-colors hover:text-[#184C40]"
                    >
                      <FileText
                        size={13}
                        strokeWidth={1.7}
                        className="shrink-0 text-[#8E9591] group-hover/c:text-[#184C40]"
                      />
                      <span className="max-w-[180px] truncate underline-offset-2 group-hover/c:underline">
                        {item.contract_file_name || "View Contract"}
                      </span>
                    </Link>
                  </td>
                )}

                {/* ── Item Type ───────────────────────────────────────── */}
                <td className="px-3 py-4 sm:px-4">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-medium capitalize ${
                      isRenewal
                        ? "border-[#D6E3DF] bg-[#F0F6F4] text-[#1E5C4E]"
                        : "border-[#E1E4E2] bg-[#F7F8F7] text-[#545B57]"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        isRenewal ? "bg-[#184C40]" : "bg-[#707773]"
                      }`}
                    />
                    {item.item_type}
                  </span>
                </td>

                {/* ── Due Date ────────────────────────────────────────── */}
                <td className="px-3 py-4 sm:px-4">
                  <div className="flex items-center gap-1.5 text-[12px] text-[#545B57]">
                    <CalendarDays
                      size={13}
                      strokeWidth={1.6}
                      className="text-[#8E9591]"
                    />
                    <span>{formattedDate}</span>
                  </div>
                </td>

                {/* ── Urgency Pill ────────────────────────────────────── */}
                <td className="px-3 py-4 sm:px-4">
                  {item.is_completed ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-[#DCE8E3] bg-[#F2F8F5] px-2.5 py-0.5 text-[10px] font-medium text-[#256B58]">
                      <CheckCircle2 size={11} strokeWidth={2} />
                      Completed
                    </span>
                  ) : isOverdue ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-[#F2D6D3] bg-[#FEF7F6] px-2.5 py-0.5 text-[10px] font-semibold text-[#B9443D]">
                      <AlertTriangle size={11} strokeWidth={2} />
                      {Math.abs(days)}d overdue
                    </span>
                  ) : isDueSoon ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-[#EADBBD] bg-[#FBF7EB] px-2.5 py-0.5 text-[10px] font-semibold text-[#8D7027]">
                      <Clock size={11} strokeWidth={2} />
                      {days === 0 ? "Due today" : `${days}d left`}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full border border-[#E9ECEA] bg-[#FAFBFA] px-2.5 py-0.5 text-[10px] font-medium text-[#707773]">
                      {days}d left
                    </span>
                  )}
                </td>

                {/* ── Delete Action ───────────────────────────────────── */}
                <td className="px-3 py-4 text-right sm:px-4">
                  <button
                    type="button"
                    onClick={() =>
                      !isDeleting &&
                      deleteObligation({
                        contractId: item.contract_id,
                        obligationId: item.id,
                      })
                    }
                    aria-label="Delete obligation"
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-[#8E9591] opacity-0 transition-all hover:bg-[#FBE4E2] hover:text-[#B9443D] group-hover:opacity-100"
                  >
                    <Trash2 size={13} strokeWidth={1.8} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
