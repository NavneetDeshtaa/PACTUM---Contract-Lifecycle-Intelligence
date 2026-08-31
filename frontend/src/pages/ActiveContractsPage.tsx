import { useState } from "react";
import { CalendarCheck, Plus, AlertTriangle } from "lucide-react";

import { useActiveContracts } from "../hooks/useContractsByView";
import ContractSubTable from "../components/contracts/ContractSubTable";
import UploadContractModal from "../components/contracts/UploadContractModal";

const COLUMNS = [
  { key: "name" as const, label: "Contract" },
  { key: "effective" as const, label: "Effective Date" },
  { key: "expiry" as const, label: "Expires On" },
  { key: "days_left" as const, label: "Days Remaining" },
  { key: "risk" as const, label: "Risk" },
];

export default function ActiveContractsPage() {
  const { data: contracts, isLoading, error } = useActiveContracts();
  const [uploadOpen, setUploadOpen] = useState(false);

  const count = contracts?.length ?? 0;

  return (
    <main className="min-h-full bg-white px-6 py-7 sm:px-8 lg:px-10">
      <div className="mx-auto w-full max-w-[1380px]">

        {/* ── Header ─────────────────────────────────────────────────── */}

        <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-[28px] font-semibold tracking-[-0.035em] text-[#181a20] sm:text-[30px]">
              Active Contracts
            </h1>
            <p className="mt-1 text-[13px] leading-5 text-[#737780]">
              {count > 0
                ? `${count} contract${count === 1 ? "" : "s"} currently in force`
                : "Contracts whose effective date has passed and haven't yet expired"}
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

        {/* ── Info banner ─────────────────────────────────────────────── */}

        <div className="mb-5 flex items-start gap-3 rounded-xl border border-[#d1e8e1] bg-[#f0f8f5] px-4 py-3">
          <CalendarCheck
            size={16}
            strokeWidth={1.8}
            className="mt-0.5 shrink-0 text-[#28755f]"
          />
          <p className="text-[12px] leading-5 text-[#28755f]">
            Showing contracts where <strong>Effective Date ≤ Today ≤ Expiry Date</strong>.
            Dates are extracted from the contract document automatically.
          </p>
        </div>

        {/* ── Divider ────────────────────────────────────────────────── */}

        <div className="border-t border-[#ececec]" />

        {/* ── Content ────────────────────────────────────────────────── */}

        <section className="w-full">
          {isLoading && (
            <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
              <div className="mb-4 h-6 w-6 animate-spin rounded-full border-2 border-[#dedede] border-t-[#181a20]" />
              <p className="text-[13px] font-medium text-[#181a20]">
                Loading active contracts
              </p>
            </div>
          )}

          {error && (
            <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#fff1f1] text-[#d24d4d]">
                <AlertTriangle size={17} />
              </div>
              <p className="text-[13px] font-semibold text-[#181a20]">
                Unable to load active contracts
              </p>
            </div>
          )}

          {contracts && !isLoading && !error && (
            <div className="overflow-hidden">
              <ContractSubTable
                contracts={contracts}
                columns={COLUMNS}
                emptyIcon={<CalendarCheck size={18} strokeWidth={1.6} />}
                emptyTitle="No active contracts"
                emptyDescription="Contracts with an effective date in the past and a future expiry date will appear here. Upload a contract and make sure dates are extracted correctly."
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
