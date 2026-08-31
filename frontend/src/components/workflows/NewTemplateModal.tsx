import { useState } from "react";
import { X, Plus, Trash2, FileText } from "lucide-react";
import { useCreateTemplate } from "../../hooks/useWorkflowHub";

interface NewTemplateModalProps {
  open: boolean;
  onClose: () => void;
}

export default function NewTemplateModal({
  open,
  onClose,
}: NewTemplateModalProps) {
  const { mutate: createTemplate, isPending } = useCreateTemplate();

  const [name, setName] = useState("");
  const [contractType, setContractType] = useState("service_agreement");
  const [description, setDescription] = useState("");
  const [clauseList, setClauseList] = useState<string[]>([
    "Parties & Background",
    "Scope of Work & Deliverables",
    "Payment & Compensation",
    "Term & Termination",
    "Confidentiality & Non-Disclosure",
    "Governing Law & Jurisdiction",
  ]);
  const [newClauseInput, setNewClauseInput] = useState("");
  const [generationInstructions, setGenerationInstructions] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  if (!open) return null;

  const handleAddClause = () => {
    if (!newClauseInput.trim()) return;
    setClauseList([...clauseList, newClauseInput.trim()]);
    setNewClauseInput("");
  };

  const handleRemoveClause = (index: number) => {
    if (clauseList.length <= 1) {
      setErrorMsg("A template must have at least one clause.");
      return;
    }
    setClauseList(clauseList.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg("Please enter a template name.");
      return;
    }
    if (clauseList.length === 0) {
      setErrorMsg("Please add at least one clause to the outline.");
      return;
    }

    createTemplate(
      {
        name: name.trim(),
        contract_type: contractType.trim(),
        description: description.trim() || undefined,
        clause_outline: clauseList,
        generation_instructions: generationInstructions.trim() || undefined,
      },
      {
        onSuccess: () => {
          setName("");
          setDescription("");
          setGenerationInstructions("");
          setErrorMsg("");
          onClose();
        },
        onError: () => {
          setErrorMsg("Failed to create template. Please check the inputs.");
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
      <div className="relative z-10 max-h-[90vh] w-full max-w-[580px] overflow-y-auto rounded-2xl border border-[#E9ECEA] bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#F0F1F0] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EBF4F0] text-[#184C40]">
              <FileText size={18} strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-[16px] font-semibold text-[#181A1F]">
                New Contract Template
              </h2>
              <p className="text-[12px] text-[#707773]">
                Create a reusable structure with clause outline for AI drafting
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

          {/* Template Name & Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-medium text-[#464C48]">
                Template Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Master Services Agreement"
                className="mt-1.5 w-full rounded-xl border border-[#DCDFD0] bg-white px-3.5 py-2 text-[13px] text-[#181A1F] transition-all focus:border-[#184C40] focus:outline-none focus:ring-2 focus:ring-[#184C40]/10"
              />
            </div>

            <div>
              <label className="block text-[12px] font-medium text-[#464C48]">
                Contract Type Identifier
              </label>
              <input
                type="text"
                required
                value={contractType}
                onChange={(e) => setContractType(e.target.value)}
                placeholder="e.g. msa, nda, employment"
                className="mt-1.5 w-full rounded-xl border border-[#DCDFD0] bg-white px-3.5 py-2 text-[13px] text-[#181A1F] transition-all focus:border-[#184C40] focus:outline-none focus:ring-2 focus:ring-[#184C40]/10"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[12px] font-medium text-[#464C48]">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What kind of agreements is this template suited for..."
              className="mt-1.5 w-full resize-none rounded-xl border border-[#DCDFD0] bg-white px-3.5 py-2 text-[12px] text-[#181A1F] transition-all focus:border-[#184C40] focus:outline-none focus:ring-2 focus:ring-[#184C40]/10"
            />
          </div>

          {/* Clause Outline */}
          <div>
            <label className="block text-[12px] font-medium text-[#464C48]">
              Clause Outline Structure
            </label>
            <div className="mt-2 max-h-40 space-y-1.5 overflow-y-auto pr-1">
              {clauseList.map((clause, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg border border-[#E9ECEA] bg-[#FAFBFA] px-3 py-1.5 text-[12px]"
                >
                  <span className="font-medium text-[#181A1F]">{clause}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveClause(idx)}
                    aria-label="Remove clause"
                    className="text-[#8E9591] hover:text-[#B9443D]"
                  >
                    <Trash2 size={12} strokeWidth={1.8} />
                  </button>
                </div>
              ))}
            </div>

            {/* Add clause input */}
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={newClauseInput}
                onChange={(e) => setNewClauseInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddClause();
                  }
                }}
                placeholder="Add next clause (e.g. Indemnification & Liability)..."
                className="flex-1 rounded-xl border border-[#DCDFD0] bg-white px-3.5 py-2 text-[12px] text-[#181A1F] transition-all focus:border-[#184C40] focus:outline-none focus:ring-2 focus:ring-[#184C40]/10"
              />
              <button
                type="button"
                onClick={handleAddClause}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#DCDFD0] bg-[#FAFBFA] px-3.5 py-2 text-[12px] font-semibold text-[#181A1F] transition-colors hover:bg-[#EBF4F0] hover:text-[#184C40]"
              >
                <Plus size={14} />
                Add Clause
              </button>
            </div>
          </div>

          {/* LLM Generation Instructions */}
          <div>
            <label className="block text-[12px] font-medium text-[#464C48]">
              AI Drafting Prompt / Guidelines
            </label>
            <textarea
              rows={3}
              value={generationInstructions}
              onChange={(e) => setGenerationInstructions(e.target.value)}
              placeholder="e.g. Favor mutual confidentiality obligations. Keep terms balanced and professional..."
              className="mt-1.5 w-full resize-none rounded-xl border border-[#DCDFD0] bg-white px-3.5 py-2 text-[12px] text-[#181A1F] transition-all focus:border-[#184C40] focus:outline-none focus:ring-2 focus:ring-[#184C40]/10"
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
              {isPending ? "Creating..." : "Save Template"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
