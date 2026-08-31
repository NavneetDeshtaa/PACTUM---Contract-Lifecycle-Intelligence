import { useState } from "react";
import { X, Plus, Trash2, Workflow } from "lucide-react";
import { useCreateWorkflow } from "../../hooks/useWorkflowHub";

interface NewWorkflowModalProps {
  open: boolean;
  onClose: () => void;
}

export default function NewWorkflowModal({
  open,
  onClose,
}: NewWorkflowModalProps) {
  const { mutate: createWorkflow, isPending } = useCreateWorkflow();

  const [name, setName] = useState("");
  const [contractType, setContractType] = useState("");
  const [stages, setStages] = useState<string[]>([
    "Department Review",
    "Legal Approval",
    "Signature",
  ]);
  const [newStageInput, setNewStageInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  if (!open) return null;

  const handleAddStage = () => {
    if (!newStageInput.trim()) return;
    setStages([...stages, newStageInput.trim()]);
    setNewStageInput("");
  };

  const handleRemoveStage = (index: number) => {
    if (stages.length <= 1) {
      setErrorMsg("A workflow must have at least one stage.");
      return;
    }
    setStages(stages.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg("Please enter a workflow name.");
      return;
    }
    if (stages.length === 0) {
      setErrorMsg("Please add at least one stage to the sequence.");
      return;
    }

    createWorkflow(
      {
        name: name.trim(),
        contract_type: contractType.trim() || undefined,
        stages,
      },
      {
        onSuccess: () => {
          setName("");
          setContractType("");
          setStages(["Department Review", "Legal Approval", "Signature"]);
          setErrorMsg("");
          onClose();
        },
        onError: () => {
          setErrorMsg("Failed to create workflow. Please check the name.");
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
      <div className="relative z-10 w-full max-w-[560px] rounded-2xl border border-[#E9ECEA] bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#F0F1F0] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EBF4F0] text-[#184C40]">
              <Workflow size={18} strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-[16px] font-semibold text-[#181A1F]">
                New Approval Workflow
              </h2>
              <p className="text-[12px] text-[#707773]">
                Define an ordered sequence of review and sign-off stages
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

          {/* Workflow Name */}
          <div>
            <label className="block text-[12px] font-medium text-[#464C48]">
              Workflow Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Enterprise Procurement Review, Executive Sign-Off"
              className="mt-1.5 w-full rounded-xl border border-[#DCDFD0] bg-white px-3.5 py-2.5 text-[13px] text-[#181A1F] transition-all focus:border-[#184C40] focus:outline-none focus:ring-2 focus:ring-[#184C40]/10"
            />
          </div>

          {/* Contract Type (optional) */}
          <div>
            <label className="block text-[12px] font-medium text-[#464C48]">
              Target Contract Type (Optional)
            </label>
            <input
              type="text"
              value={contractType}
              onChange={(e) => setContractType(e.target.value)}
              placeholder="e.g. service_agreement, nda, procurement"
              className="mt-1.5 w-full rounded-xl border border-[#DCDFD0] bg-white px-3.5 py-2.5 text-[13px] text-[#181A1F] transition-all focus:border-[#184C40] focus:outline-none focus:ring-2 focus:ring-[#184C40]/10"
            />
          </div>

          {/* Ordered Stages */}
          <div>
            <label className="block text-[12px] font-medium text-[#464C48]">
              Approval Sequence (Ordered Steps)
            </label>
            <div className="mt-2 space-y-2">
              {stages.map((stage, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-xl border border-[#E9ECEA] bg-[#FAFBFA] px-3 py-2 text-[13px]"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E2F0EB] text-[10px] font-bold text-[#184C40]">
                      {idx + 1}
                    </span>
                    <span className="font-medium text-[#181A1F]">{stage}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveStage(idx)}
                    aria-label="Remove stage"
                    className="flex h-6 w-6 items-center justify-center rounded text-[#8E9591] hover:bg-[#FEF7F6] hover:text-[#B9443D]"
                  >
                    <Trash2 size={12} strokeWidth={1.8} />
                  </button>
                </div>
              ))}
            </div>

            {/* Add stage input */}
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={newStageInput}
                onChange={(e) => setNewStageInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddStage();
                  }
                }}
                placeholder="Add next stage name (e.g. Finance Approval)..."
                className="flex-1 rounded-xl border border-[#DCDFD0] bg-white px-3.5 py-2 text-[12px] text-[#181A1F] transition-all focus:border-[#184C40] focus:outline-none focus:ring-2 focus:ring-[#184C40]/10"
              />
              <button
                type="button"
                onClick={handleAddStage}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#DCDFD0] bg-[#FAFBFA] px-3.5 py-2 text-[12px] font-semibold text-[#181A1F] transition-colors hover:bg-[#EBF4F0] hover:text-[#184C40]"
              >
                <Plus size={14} />
                Add Step
              </button>
            </div>
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
              {isPending ? "Creating..." : "Save Workflow"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
