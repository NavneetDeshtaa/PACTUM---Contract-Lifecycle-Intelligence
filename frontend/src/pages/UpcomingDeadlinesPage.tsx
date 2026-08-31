import { useState } from "react";
import { Clock, Plus, AlertTriangle } from "lucide-react";

import { useUpcomingContracts } from "../hooks/useContractsByView";
import ContractSubTable from "../components/contracts/ContractSubTable";
import UploadContractModal from "../components/contracts/UploadContractModal";

const COLUMNS = [
  { key: "name" as const, label: "Contract" },
  { key: "expiry" as const, label: "Expires On" },
  { key: "days_left" as const, label: "Days Left" },
  { key: "risk" as const, label: "Risk" },
  { key: "lifecycle" as const, label: "Stage" },
];

export default function UpcomingDeadlinesPage() {
  const { data: contracts, isLoading, error } = useUpcomingContracts();
  const [uploadOpen, setUploadOpen] = useState(false);

  const count = contracts?.length ?? 0;

  /* bucket counts for the summary row */
  const critical = contracts?.filter((c) => {
    const expiry = c.extracted_fields?.expiry_date;
    if (!expiry) return false;
    const days = Math.ceil(
      (new Date(expiry).getTime() - new Date().setHours(0, 0, 0, 0)) /
        (1000 * 60 * 60 * 24),
    );
    return days <= 30;
  }).length ?? 0;

  const warning = contracts?.filter((c) => {
    const expiry = c.extracted_fields?.expiry_date;
    if (!expiry) return false;
    const days = Math.ceil(
      (new Date(expiry).getTime() - new Date().setHours(0, 0, 0, 0)) /
        (1000 * 60 * 60 * 24),
    );
    return days > 30 && days <= 60;
  }).length ?? 0;

  return (
    <main className="min-h-full bg-white px-6 py-7 sm:px-8 lg:px-10">
      <div className="mx-auto w-full max-w-[1380px]">

        {/* ── Header ─────────────────────────────────────────────────── */}

        <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-[28px] font-semibold tracking-[-0.035em] text-[#181a20] sm:text-[30px]">
              Upcoming Deadlines
            </h1>
            <p className="mt-1 text-[13px] leading-5 text-[#737780]">
              {count > 0
                ? `${count} contract${count === 1 ? "" : "s"} expiring within 90 days`
                : "Contracts expiring in the next 90 days"}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setUploadOpen(true)}
            className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-lg bg-[#191c24] px-4 text-[13px] font-medium text-white transition-colors hover:bg-[#292d36]"
          >
            <Plus size={16} strokeWidth={1.8} />
            Upload New Contract
          </button>
        </div>

        {/* ── Summary pills ───────────────────────────────────────────── */}

        {count > 0 && (
          <div className="mb-5 flex flex-wrap gap-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#efcccc] bg-[#fff4f4] px-3 py-1.5 text-[12px] font-medium text-[#c94b4b]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d24d4d]" />
              {critical} expiring within 30 days
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#eadfbd] bg-[#fbf7eb] px-3 py-1.5 text-[12px] font-medium text-[#8d7027]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#b8953f]" />
              {warning} expiring in 31–60 days
            </div>
          </div>
        )}

        {/* ── Divider ────────────────────────────────────────────────── */}

        <div className="border-t border-[#ececec]" />

        {/* ── Content ────────────────────────────────────────────────── */}

        <section className="w-full">
          {isLoading && (
            <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
              <div className="mb-4 h-6 w-6 animate-spin rounded-full border-2 border-[#dedede] border-t-[#181a20]" />
              <p className="text-[13px] font-medium text-[#181a20]">
                Loading upcoming deadlines
              </p>
            </div>
          )}

          {error && (
            <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#fff1f1] text-[#d24d4d]">
                <AlertTriangle size={17} />
              </div>
              <p className="text-[13px] font-semibold text-[#181a20]">
                Unable to load deadlines
              </p>
            </div>
          )}

          {contracts && !isLoading && !error && (
            <div className="overflow-hidden">
              <ContractSubTable
                contracts={contracts}
                columns={COLUMNS}
                emptyIcon={<Clock size={18} strokeWidth={1.6} />}
                emptyTitle="No upcoming deadlines"
                emptyDescription="Contracts expiring in the next 90 days will appear here, sorted by nearest expiry first. You're all clear!"
              />
            </div>
          )}
        </section>
      </div>

      <UploadContractModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
      />
    </main>
  );
}
