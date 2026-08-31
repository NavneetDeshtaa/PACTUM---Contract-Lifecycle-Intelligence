import { useState } from "react";
import { CheckCircle2, Plus, AlertTriangle } from "lucide-react";
import { useCompletedObligations } from "../hooks/useObligations";
import ObligationTable from "../components/obligations/ObligationTable";
import NewObligationModal from "../components/obligations/NewObligationModal";

export default function CompletedObligationsPage() {
  const [newModalOpen, setNewModalOpen] = useState(false);
  const { data: obligations, isLoading, error } = useCompletedObligations();

  const count = obligations?.length ?? 0;

  return (
    <main className="min-h-full bg-white px-6 py-7 sm:px-8 lg:px-10">
      <div className="mx-auto w-full max-w-[1380px]">
        {/* ── Page Header ────────────────────────────────────────────── */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-[28px] font-semibold tracking-[-0.035em] text-[#181A1F] sm:text-[30px]">
              Completed Obligations
            </h1>
            <p className="mt-1 text-[13px] text-[#707773]">
              {count > 0
                ? `${count} fulfilled contract obligation${
                    count === 1 ? "" : "s"
                  } on record`
                : "Archive of fulfilled contract duties and completed milestones"}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setNewModalOpen(true)}
            className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-xl bg-[#184C40] px-4 text-[13px] font-medium text-white shadow-sm transition-all hover:bg-[#1E5C4E] active:scale-[0.99]"
          >
            <Plus size={16} strokeWidth={2} />
            Add Obligation
          </button>
        </div>

        {/* ── Info Pill Banner ────────────────────────────────────────── */}
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-[#DCE8E3] bg-[#F2F8F5] p-4 text-[#184C40]">
          <CheckCircle2 size={18} className="shrink-0 text-[#184C40]" />
          <p className="text-[12px] leading-5 text-[#256B58]">
            Items in this list have been marked completed. You can uncheck any
            item if it requires reopening or further audit.
          </p>
        </div>

        {/* ── Table Content ──────────────────────────────────────────── */}
        <section className="w-full">
          {isLoading && (
            <div className="flex min-h-[340px] flex-col items-center justify-center text-center">
              <div className="mb-4 h-6 w-6 animate-spin rounded-full border-2 border-[#DCDFD0] border-t-[#184C40]" />
              <p className="text-[13px] font-medium text-[#181A1F]">
                Loading completed obligations...
              </p>
            </div>
          )}

          {error && (
            <div className="flex min-h-[340px] flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#FEF7F6] text-[#B9443D]">
                <AlertTriangle size={17} />
              </div>
              <p className="text-[13px] font-semibold text-[#181A1F]">
                Unable to load completed obligations
              </p>
            </div>
          )}

          {obligations && !isLoading && !error && (
            <ObligationTable
              obligations={obligations}
              emptyTitle="No completed obligations yet"
              emptyDescription="Check off obligations from the All Obligations or Upcoming tabs as you fulfill them."
            />
          )}
        </section>
      </div>

      <NewObligationModal
        open={newModalOpen}
        onClose={() => setNewModalOpen(false)}
      />
    </main>
  );
}
