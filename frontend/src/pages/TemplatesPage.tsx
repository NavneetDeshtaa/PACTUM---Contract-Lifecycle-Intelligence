import { useState } from "react";
import { Plus, FileText, AlertTriangle, Search } from "lucide-react";
import { useTemplates } from "../hooks/useWorkflowHub";
import TemplateCard from "../components/workflows/TemplateCard";
import NewTemplateModal from "../components/workflows/NewTemplateModal";

export default function TemplatesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [newModalOpen, setNewModalOpen] = useState(false);

  const { data: templates, isLoading, error } = useTemplates();

  const filteredTemplates = (templates ?? []).filter((t) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      t.name.toLowerCase().includes(term) ||
      t.contract_type.toLowerCase().includes(term) ||
      (t.description && t.description.toLowerCase().includes(term))
    );
  });

  const count = filteredTemplates.length;

  return (
    <main className="min-h-full bg-white px-6 py-7 sm:px-8 lg:px-10">
      <div className="mx-auto w-full max-w-[1380px]">
        {/* ── Page Header ────────────────────────────────────────────── */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-[28px] font-semibold tracking-[-0.035em] text-[#181A1F] sm:text-[30px]">
              Contract Templates
            </h1>
            <p className="mt-1 text-[13px] text-[#707773]">
              Standardized clause frameworks used by AI to draft professional, policy-compliant contracts
            </p>
          </div>

          <button
            type="button"
            onClick={() => setNewModalOpen(true)}
            className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-xl bg-[#184C40] px-4 text-[13px] font-medium text-white shadow-sm transition-all hover:bg-[#1E5C4E] active:scale-[0.99]"
          >
            <Plus size={16} strokeWidth={2} />
            New Template
          </button>
        </div>

        {/* ── Search & Filter Controls ───────────────────────────────── */}
        <div className="mb-6 flex items-center justify-between gap-3 border-y border-[#E9ECEA] py-3">
          <div className="relative min-w-[260px] flex-1 sm:max-w-[340px]">
            <Search
              size={14}
              strokeWidth={2}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E9591]"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search templates or contract types..."
              className="h-9 w-full rounded-xl border border-[#DCDFD0] bg-[#FAFBFA] pl-9 pr-3 text-[12px] text-[#181A1F] transition-all focus:border-[#184C40] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#184C40]/10"
            />
          </div>

          <span className="text-[12px] text-[#707773]">
            {count} template{count === 1 ? "" : "s"} available
          </span>
        </div>

        {/* ── Content Grid ───────────────────────────────────────────── */}
        <section className="w-full">
          {isLoading && (
            <div className="flex min-h-[340px] flex-col items-center justify-center text-center">
              <div className="mb-4 h-6 w-6 animate-spin rounded-full border-2 border-[#DCDFD0] border-t-[#184C40]" />
              <p className="text-[13px] font-medium text-[#181A1F]">
                Loading contract templates...
              </p>
            </div>
          )}

          {error && (
            <div className="flex min-h-[340px] flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#FEF7F6] text-[#B9443D]">
                <AlertTriangle size={17} />
              </div>
              <p className="text-[13px] font-semibold text-[#181A1F]">
                Unable to load templates
              </p>
            </div>
          )}

          {templates && !isLoading && !error && (
            <>
              {filteredTemplates.length === 0 ? (
                <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-[#E9ECEA] bg-[#FAFBFA] px-6 text-center">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-[#E9ECEA] bg-white text-[#707773]">
                    <FileText size={20} strokeWidth={1.6} />
                  </div>
                  <p className="text-[14px] font-semibold text-[#181A1F]">
                    No templates matching &quot;{searchTerm}&quot;
                  </p>
                  <p className="mt-1 max-w-sm text-[12px] leading-5 text-[#858D89]">
                    Try searching for another agreement type or create a custom template.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {filteredTemplates.map((tpl) => (
                    <TemplateCard key={tpl.id} template={tpl} />
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </div>

      <NewTemplateModal
        open={newModalOpen}
        onClose={() => setNewModalOpen(false)}
      />
    </main>
  );
}
