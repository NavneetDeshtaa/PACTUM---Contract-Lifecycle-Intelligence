import { useState } from "react";
import { CalendarCheck, Plus, Clock, AlertTriangle } from "lucide-react";
import { useUpcomingObligations } from "../hooks/useObligations";
import ObligationTable from "../components/obligations/ObligationTable";
import NewObligationModal from "../components/obligations/NewObligationModal";

export default function UpcomingObligationsPage() {
  const [daysWindow, setDaysWindow] = useState<number>(90);
  const [newModalOpen, setNewModalOpen] = useState(false);

  const {
    data: obligations,
    isLoading,
    error,
  } = useUpcomingObligations(daysWindow);

  const count = obligations?.length ?? 0;
  const criticalCount =
    obligations?.filter((o) => {
      const diff =
        new Date(o.due_date).getTime() - new Date().setHours(0, 0, 0, 0);
      return Math.ceil(diff / (1000 * 60 * 60 * 24)) <= 30;
    }).length ?? 0;

  return (
    <main className="min-h-full bg-white px-6 py-7 sm:px-8 lg:px-10">
      <div className="mx-auto w-full max-w-[1380px]">
        {/* ── Page Header ────────────────────────────────────────────── */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-[28px] font-semibold tracking-[-0.035em] text-[#181A1F] sm:text-[30px]">
              Upcoming Obligations
            </h1>
            <p className="mt-1 text-[13px] text-[#707773]">
              {count > 0
                ? `${count} pending obligation${
                    count === 1 ? "" : "s"
                  } due in the next ${daysWindow} days`
                : `No pending obligations due in the next ${daysWindow} days`}
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

        {/* ── Filter & Countdown Summary ─────────────────────────────── */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#E9ECEA] bg-[#FAFBFA] p-4">
          <div className="flex flex-wrap items-center gap-2">
            {criticalCount > 0 && (
              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#EADBBD] bg-[#FBF7EB] px-3 py-1 text-[11px] font-semibold text-[#8D7027]">
                <Clock size={12} strokeWidth={2} />
                {criticalCount} due within 30 days
              </div>
            )}
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#E1ECE6] bg-[#F0F7F4] px-3 py-1 text-[11px] font-medium text-[#184C40]">
              <CalendarCheck size={12} strokeWidth={2} />
              Viewing next {daysWindow} days
            </div>
          </div>

          {/* Timeframe Window Selector */}
          <div className="flex items-center gap-1 rounded-xl border border-[#DCDFD0] bg-white p-1 text-[11px] font-medium">
            <button
              type="button"
              onClick={() => setDaysWindow(30)}
              className={`rounded-lg px-3 py-1 transition-all ${
                daysWindow === 30
                  ? "bg-[#184C40] font-semibold text-white shadow-sm"
                  : "text-[#707773] hover:text-[#181A1F]"
              }`}
            >
              30 Days
            </button>
            <button
              type="button"
              onClick={() => setDaysWindow(60)}
              className={`rounded-lg px-3 py-1 transition-all ${
                daysWindow === 60
                  ? "bg-[#184C40] font-semibold text-white shadow-sm"
                  : "text-[#707773] hover:text-[#181A1F]"
              }`}
            >
              60 Days
            </button>
            <button
              type="button"
              onClick={() => setDaysWindow(90)}
              className={`rounded-lg px-3 py-1 transition-all ${
                daysWindow === 90
                  ? "bg-[#184C40] font-semibold text-white shadow-sm"
                  : "text-[#707773] hover:text-[#181A1F]"
              }`}
            >
              90 Days
            </button>
          </div>
        </div>

        {/* ── Table Content ──────────────────────────────────────────── */}
        <section className="w-full">
          {isLoading && (
            <div className="flex min-h-[340px] flex-col items-center justify-center text-center">
              <div className="mb-4 h-6 w-6 animate-spin rounded-full border-2 border-[#DCDFD0] border-t-[#184C40]" />
              <p className="text-[13px] font-medium text-[#181A1F]">
                Loading upcoming deadlines...
              </p>
            </div>
          )}

          {error && (
            <div className="flex min-h-[340px] flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#FEF7F6] text-[#B9443D]">
                <AlertTriangle size={17} />
              </div>
              <p className="text-[13px] font-semibold text-[#181A1F]">
                Unable to load upcoming obligations
              </p>
            </div>
          )}

          {obligations && !isLoading && !error && (
            <ObligationTable
              obligations={obligations}
              emptyTitle="No upcoming obligations"
              emptyDescription={`All obligations due within the next ${daysWindow} days have been fulfilled.`}
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
