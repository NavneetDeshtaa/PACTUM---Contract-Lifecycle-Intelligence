import { useState } from "react";
import { AlertTriangle, Plus, ShieldAlert } from "lucide-react";
import { useOverdueObligations } from "../hooks/useObligations";
import ObligationTable from "../components/obligations/ObligationTable";
import NewObligationModal from "../components/obligations/NewObligationModal";

export default function OverdueObligationsPage() {
  const [newModalOpen, setNewModalOpen] = useState(false);

  const { data: obligations, isLoading, error } = useOverdueObligations();
  const count = obligations?.length ?? 0;

  return (
    <main className="min-h-full bg-white px-6 py-7 sm:px-8 lg:px-10">
      <div className="mx-auto w-full max-w-[1380px]">
        {/* ── Page Header ────────────────────────────────────────────── */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-[28px] font-semibold tracking-[-0.035em] text-[#181A1F] sm:text-[30px]">
              Overdue Obligations
            </h1>
            <p className="mt-1 text-[13px] text-[#707773]">
              {count > 0
                ? `${count} obligation${
                    count === 1 ? "" : "s"
                  } past their contractual due date requiring immediate attention`
                : "Great news! You have zero overdue contract obligations."}
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

        {/* ── Warning Banner (if any overdue items exist) ─────────────── */}
        {count > 0 ? (
          <div className="mb-6 flex items-start gap-3.5 rounded-2xl border border-[#F2D6D3] bg-[#FEF7F6] p-4 text-[#B9443D]">
            <ShieldAlert size={20} className="mt-0.5 shrink-0 text-[#B9443D]" />
            <div>
              <p className="text-[13px] font-semibold">
                Action Required: {count} overdue contract deadline
                {count === 1 ? "" : "s"}
              </p>
              <p className="mt-0.5 text-[12px] text-[#C46761]">
                Failing to meet contract deadlines or renewal notices may result
                in financial penalties, breach of SLA, or automatic agreement
                renewal. Complete them or update the terms accordingly.
              </p>
            </div>
          </div>
        ) : (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-[#DCE8E3] bg-[#F2F8F5] p-4 text-[#184C40]">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#E2F0EB]">
              ✓
            </div>
            <p className="text-[13px] font-medium">
              Zero overdue obligations across your entire contract portfolio.
            </p>
          </div>
        )}

        {/* ── Table Content ──────────────────────────────────────────── */}
        <section className="w-full">
          {isLoading && (
            <div className="flex min-h-[340px] flex-col items-center justify-center text-center">
              <div className="mb-4 h-6 w-6 animate-spin rounded-full border-2 border-[#DCDFD0] border-t-[#184C40]" />
              <p className="text-[13px] font-medium text-[#181A1F]">
                Checking overdue obligations...
              </p>
            </div>
          )}

          {error && (
            <div className="flex min-h-[340px] flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#FEF7F6] text-[#B9443D]">
                <AlertTriangle size={17} />
              </div>
              <p className="text-[13px] font-semibold text-[#181A1F]">
                Unable to load overdue obligations
              </p>
            </div>
          )}

          {obligations && !isLoading && !error && (
            <ObligationTable
              obligations={obligations}
              emptyTitle="Zero overdue obligations"
              emptyDescription="All past contractual milestones have been addressed or checked off."
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
