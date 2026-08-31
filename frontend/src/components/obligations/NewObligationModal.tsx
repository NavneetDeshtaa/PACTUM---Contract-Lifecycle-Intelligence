import { useState } from "react";
import { X, Plus, FileText, Bell } from "lucide-react";
import { useContracts } from "../../hooks/useContracts";
import { useCreateObligation } from "../../hooks/useObligations";
import type { ObligationItemType } from "../../types/tracking";

interface NewObligationModalProps {
  open: boolean;
  onClose: () => void;
  defaultContractId?: string;
}

export default function NewObligationModal({
  open,
  onClose,
  defaultContractId,
}: NewObligationModalProps) {
  const { data: contracts } = useContracts();
  const { mutate: createObligation, isPending } = useCreateObligation();

  const [contractId, setContractId] = useState(
    defaultContractId || (contracts?.[0]?.id ?? ""),
  );
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [itemType, setItemType] = useState<ObligationItemType>("obligation");
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  );
  const [noticePeriodDays, setNoticePeriodDays] = useState<number | "">("");
  const [errorMsg, setErrorMsg] = useState("");

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contractId) {
      setErrorMsg("Please select a contract");
      return;
    }
    if (!title.trim()) {
      setErrorMsg("Please enter an obligation title");
      return;
    }
    if (!dueDate) {
      setErrorMsg("Please select a due date");
      return;
    }

    createObligation(
      {
        contractId,
        payload: {
          item_type: itemType,
          title: title.trim(),
          description: description.trim() || undefined,
          due_date: dueDate,
          notice_period_days:
            noticePeriodDays === "" ? undefined : Number(noticePeriodDays),
        },
      },
      {
        onSuccess: () => {
          setTitle("");
          setDescription("");
          setNoticePeriodDays("");
          setErrorMsg("");
          onClose();
        },
        onError: () => {
          setErrorMsg("Failed to create obligation. Please try again.");
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#10211D]/30 backdrop-blur-[2px] transition-opacity"
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-[520px] rounded-2xl border border-[#E9ECEA] bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#F0F1F0] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EBF4F0] text-[#184C40]">
              <Plus size={18} strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-[16px] font-semibold text-[#181A1F]">
                New Obligation
              </h2>
              <p className="text-[12px] text-[#707773]">
                Add a renewal deadline, deliverable, or milestone
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#8E9591] transition-colors hover:bg-[#F5F6F5] hover:text-[#181A1F]"
          >
            <X size={17} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {errorMsg && (
            <div className="rounded-lg border border-[#F2D6D3] bg-[#FEF7F6] px-3.5 py-2 text-[12px] font-medium text-[#B9443D]">
              {errorMsg}
            </div>
          )}

          {/* Contract Selector */}
          <div>
            <label className="block text-[12px] font-medium text-[#464C48]">
              Associated Contract
            </label>
            <div className="relative mt-1.5">
              <select
                value={contractId}
                onChange={(e) => setContractId(e.target.value)}
                className="w-full appearance-none rounded-xl border border-[#DCDFD0] bg-white px-3.5 py-2.5 text-[13px] text-[#181A1F] transition-all focus:border-[#184C40] focus:outline-none focus:ring-2 focus:ring-[#184C40]/10"
              >
                {contracts && contracts.length > 0 ? (
                  contracts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.file_name}
                    </option>
                  ))
                ) : (
                  <option value="">No contracts available</option>
                )}
              </select>
              <FileText
                size={14}
                className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8E9591]"
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-[12px] font-medium text-[#464C48]">
              Obligation Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Annual SLA Review, Security Compliance Audit"
              className="mt-1.5 w-full rounded-xl border border-[#DCDFD0] bg-white px-3.5 py-2.5 text-[13px] text-[#181A1F] transition-all focus:border-[#184C40] focus:outline-none focus:ring-2 focus:ring-[#184C40]/10"
            />
          </div>

          {/* Type & Due Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-medium text-[#464C48]">
                Item Type
              </label>
              <select
                value={itemType}
                onChange={(e) =>
                  setItemType(e.target.value as ObligationItemType)
                }
                className="mt-1.5 w-full rounded-xl border border-[#DCDFD0] bg-white px-3.5 py-2.5 text-[13px] text-[#181A1F] transition-all focus:border-[#184C40] focus:outline-none focus:ring-2 focus:ring-[#184C40]/10"
              >
                <option value="obligation">Contract Obligation</option>
                <option value="renewal">Renewal Deadline</option>
              </select>
            </div>

            <div>
              <label className="block text-[12px] font-medium text-[#464C48]">
                Due Date
              </label>
              <div className="relative mt-1.5">
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full rounded-xl border border-[#DCDFD0] bg-white px-3.5 py-2.5 text-[13px] text-[#181A1F] transition-all focus:border-[#184C40] focus:outline-none focus:ring-2 focus:ring-[#184C40]/10"
                />
              </div>
            </div>
          </div>

          {/* Notice Period */}
          <div>
            <label className="block text-[12px] font-medium text-[#464C48]">
              Notice Period (Days in advance)
            </label>
            <div className="relative mt-1.5">
              <input
                type="number"
                min="0"
                max="365"
                value={noticePeriodDays}
                onChange={(e) =>
                  setNoticePeriodDays(
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
                placeholder="e.g. 30, 60, 90"
                className="w-full rounded-xl border border-[#DCDFD0] bg-white px-3.5 py-2.5 text-[13px] text-[#181A1F] transition-all focus:border-[#184C40] focus:outline-none focus:ring-2 focus:ring-[#184C40]/10"
              />
              <Bell
                size={14}
                className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8E9591]"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[12px] font-medium text-[#464C48]">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add additional contractual details or compliance instructions..."
              className="mt-1.5 w-full resize-none rounded-xl border border-[#DCDFD0] bg-white px-3.5 py-2 text-[13px] text-[#181A1F] transition-all focus:border-[#184C40] focus:outline-none focus:ring-2 focus:ring-[#184C40]/10"
            />
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-end gap-3 border-t border-[#F0F1F0] pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2.5 text-[13px] font-medium text-[#626965] transition-colors hover:bg-[#F5F6F5] hover:text-[#181A1F]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-xl bg-[#184C40] px-5 py-2.5 text-[13px] font-medium text-white shadow-sm transition-all hover:bg-[#1E5C4E] disabled:opacity-50"
            >
              {isPending ? "Creating..." : "Create Obligation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
