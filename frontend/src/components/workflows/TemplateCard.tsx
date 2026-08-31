import { useNavigate } from "react-router-dom";
import { Sparkles, Trash2, Layers } from "lucide-react";
import type { ContractTemplate } from "../../types/drafts";
import { useDeleteTemplate } from "../../hooks/useWorkflowHub";

interface TemplateCardProps {
  template: ContractTemplate;
}

export default function TemplateCard({ template }: TemplateCardProps) {
  const navigate = useNavigate();
  const { mutate: deleteTpl, isPending: isDeleting } = useDeleteTemplate();

  const isDefault = [
    "Standard Service Agreement",
    "Mutual Non-Disclosure Agreement",
  ].includes(template.name);

  return (
    <div className="group flex flex-col justify-between rounded-2xl border border-[#E9ECEA] bg-white p-5 shadow-sm transition-all duration-200 hover:border-[#CBD2CE] hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
      <div>
        {/* ── Top Row ──────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-[15px] font-semibold text-[#181A1F]">
                {template.name}
              </h3>
              <span className="rounded-md border border-[#E1E4E2] bg-[#F7F8F7] px-2 py-0.5 text-[10px] font-medium text-[#545B57] uppercase tracking-wider">
                {template.contract_type}
              </span>
            </div>
            {template.description && (
              <p className="mt-1.5 line-clamp-2 text-[12px] leading-5 text-[#707773]">
                {template.description}
              </p>
            )}
          </div>

          {!isDefault && (
            <button
              type="button"
              onClick={() => !isDeleting && deleteTpl(template.id)}
              aria-label="Delete template"
              title="Delete template"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#8E9591] opacity-0 transition-all hover:bg-[#FEF7F6] hover:text-[#B9443D] group-hover:opacity-100"
            >
              <Trash2 size={14} strokeWidth={1.8} />
            </button>
          )}
        </div>

        {/* ── Clause Outline Pills ─────────────────────────────────────── */}
        <div className="mt-5">
          <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8E9591]">
            <Layers size={11} strokeWidth={2} />
            <span>Clause Outline ({template.clause_outline?.length || 0})</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {template.clause_outline?.slice(0, 6).map((clause, idx) => (
              <span
                key={idx}
                className="rounded-md border border-[#E9ECEA] bg-[#FAFBFA] px-2 py-0.5 text-[10px] font-medium text-[#545B57]"
              >
                {clause}
              </span>
            ))}
            {(template.clause_outline?.length || 0) > 6 && (
              <span className="rounded-md bg-[#F5F6F5] px-2 py-0.5 text-[10px] font-medium text-[#8E9591]">
                +{(template.clause_outline?.length || 0) - 6} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Footer / Quick Action ────────────────────────────────────── */}
      <div className="mt-6 border-t border-[#F0F1F0] pt-4">
        <button
          type="button"
          onClick={() =>
            navigate(
              `/app/drafts/new?templateId=${encodeURIComponent(template.id)}`,
            )
          }
          className="flex h-9 w-full items-center justify-center gap-2 rounded-xl bg-[#F0F6F4] px-4 text-[12px] font-semibold text-[#184C40] transition-all hover:bg-[#184C40] hover:text-white active:scale-[0.99]"
        >
          <Sparkles size={13} strokeWidth={2} />
          <span>Draft with AI</span>
        </button>
      </div>
    </div>
  );
}
