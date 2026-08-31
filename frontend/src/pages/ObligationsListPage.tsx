import { useState } from "react";
import {
  Plus,
  Search,
  AlertTriangle,
} from "lucide-react";
import {
  useAllObligations,
  useObligationStats,
} from "../hooks/useObligations";
import ObligationStatsBar from "../components/obligations/ObligationStatsBar";
import ObligationTable from "../components/obligations/ObligationTable";
import NewObligationModal from "../components/obligations/NewObligationModal";
import type { ObligationItemType } from "../types/tracking";

export default function ObligationsListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<
    ObligationItemType | "all"
  >("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "completed"
  >("all");
  const [newModalOpen, setNewModalOpen] = useState(false);

  const { data: stats, isLoading: statsLoading } = useObligationStats();

  const {
    data: obligations,
    isLoading,
    error,
  } = useAllObligations({
    item_type: selectedType === "all" ? undefined : selectedType,
    is_completed:
      statusFilter === "all"
        ? undefined
        : statusFilter === "completed"
          ? true
          : false,
    search: searchTerm.trim() || undefined,
  });

  return (
    <main className="min-h-full bg-white px-6 py-7 sm:px-8 lg:px-10">
      <div className="mx-auto w-full max-w-[1380px]">
        {/* ── Page Header ────────────────────────────────────────────── */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-[28px] font-semibold tracking-[-0.035em] text-[#181A1F] sm:text-[30px]">
              All Obligations
            </h1>
            <p className="mt-1 text-[13px] text-[#707773]">
              Track and fulfill critical contract milestones, renewals, and compliance duties
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

        {/* ── Stats Bar ──────────────────────────────────────────────── */}
        <div className="mb-7">
          <ObligationStatsBar stats={stats} isLoading={statsLoading} />
        </div>

        {/* ── Search & Filter Controls ───────────────────────────────── */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-y border-[#E9ECEA] py-3">
          {/* Search bar */}
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
              placeholder="Search obligations or clauses..."
              className="h-9 w-full rounded-xl border border-[#DCDFD0] bg-[#FAFBFA] pl-9 pr-3 text-[12px] text-[#181A1F] transition-all focus:border-[#184C40] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#184C40]/10"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Type selector */}
            <div className="flex rounded-lg border border-[#E9ECEA] bg-[#FAFBFA] p-0.5 text-[11px] font-medium">
              <button
                type="button"
                onClick={() => setSelectedType("all")}
                className={`rounded-md px-3 py-1 transition-colors ${
                  selectedType === "all"
                    ? "bg-white text-[#181A1F] shadow-sm font-semibold"
                    : "text-[#707773] hover:text-[#181A1F]"
                }`}
              >
                All Types
              </button>
              <button
                type="button"
                onClick={() => setSelectedType("renewal")}
                className={`rounded-md px-3 py-1 transition-colors ${
                  selectedType === "renewal"
                    ? "bg-white text-[#181A1F] shadow-sm font-semibold"
                    : "text-[#707773] hover:text-[#181A1F]"
                }`}
              >
                Renewals
              </button>
              <button
                type="button"
                onClick={() => setSelectedType("obligation")}
                className={`rounded-md px-3 py-1 transition-colors ${
                  selectedType === "obligation"
                    ? "bg-white text-[#181A1F] shadow-sm font-semibold"
                    : "text-[#707773] hover:text-[#181A1F]"
                }`}
              >
                Obligations
              </button>
            </div>

            {/* Status selector */}
            <div className="flex rounded-lg border border-[#E9ECEA] bg-[#FAFBFA] p-0.5 text-[11px] font-medium">
              <button
                type="button"
                onClick={() => setStatusFilter("all")}
                className={`rounded-md px-3 py-1 transition-colors ${
                  statusFilter === "all"
                    ? "bg-white text-[#181A1F] shadow-sm font-semibold"
                    : "text-[#707773] hover:text-[#181A1F]"
                }`}
              >
                All Status
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("pending")}
                className={`rounded-md px-3 py-1 transition-colors ${
                  statusFilter === "pending"
                    ? "bg-white text-[#181A1F] shadow-sm font-semibold"
                    : "text-[#707773] hover:text-[#181A1F]"
                }`}
              >
                Pending
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("completed")}
                className={`rounded-md px-3 py-1 transition-colors ${
                  statusFilter === "completed"
                    ? "bg-white text-[#181A1F] shadow-sm font-semibold"
                    : "text-[#707773] hover:text-[#181A1F]"
                }`}
              >
                Completed
              </button>
            </div>
          </div>
        </div>

        {/* ── Table Content ──────────────────────────────────────────── */}
        <section className="w-full">
          {isLoading && (
            <div className="flex min-h-[340px] flex-col items-center justify-center text-center">
              <div className="mb-4 h-6 w-6 animate-spin rounded-full border-2 border-[#DCDFD0] border-t-[#184C40]" />
              <p className="text-[13px] font-medium text-[#181A1F]">
                Loading obligations...
              </p>
            </div>
          )}

          {error && (
            <div className="flex min-h-[340px] flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#FEF7F6] text-[#B9443D]">
                <AlertTriangle size={17} />
              </div>
              <p className="text-[13px] font-semibold text-[#181A1F]">
                Unable to load obligations
              </p>
            </div>
          )}

          {obligations && !isLoading && !error && (
            <ObligationTable
              obligations={obligations}
              emptyTitle="No obligations matching criteria"
              emptyDescription="Try adjusting your filters or search term, or create a new obligation."
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
