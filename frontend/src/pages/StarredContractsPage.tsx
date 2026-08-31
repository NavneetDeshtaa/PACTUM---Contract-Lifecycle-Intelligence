import { useState } from "react";
import { Star, Plus, AlertTriangle } from "lucide-react";

import { useStarredContracts } from "../hooks/useContractsByView";
import ContractSubTable from "../components/contracts/ContractSubTable";
import UploadContractModal from "../components/contracts/UploadContractModal";

const COLUMNS = [
  { key: "star" as const, label: "" },
  { key: "name" as const, label: "Contract" },
  { key: "uploaded" as const, label: "Uploaded" },
  { key: "risk" as const, label: "Risk" },
  { key: "lifecycle" as const, label: "Stage" },
];

export default function StarredContractsPage() {
  const { data: contracts, isLoading, error } = useStarredContracts();
  const [uploadOpen, setUploadOpen] = useState(false);

  const count = contracts?.length ?? 0;

  return (
    <main className="min-h-full bg-white px-6 py-7 sm:px-8 lg:px-10">
      <div className="mx-auto w-full max-w-[1380px]">

        {/* ── Header ─────────────────────────────────────────────────── */}

        <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-[28px] font-semibold tracking-[-0.035em] text-[#181a20] sm:text-[30px]">
              Starred
            </h1>
            <p className="mt-1 text-[13px] leading-5 text-[#737780]">
              {count > 0
                ? `${count} starred contract${count === 1 ? "" : "s"}`
                : "Contracts you've bookmarked for quick access"}
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

        {/* ── Divider ────────────────────────────────────────────────── */}

        <div className="border-t border-[#ececec]" />

        {/* ── Content ────────────────────────────────────────────────── */}

        <section className="w-full">
          {isLoading && (
            <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">
              <div className="mb-4 h-6 w-6 animate-spin rounded-full border-2 border-[#dedede] border-t-[#181a20]" />
              <p className="text-[13px] font-medium text-[#181a20]">
                Loading starred contracts
              </p>
            </div>
          )}

          {error && (
            <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#fff1f1] text-[#d24d4d]">
                <AlertTriangle size={17} />
              </div>
              <p className="text-[13px] font-semibold text-[#181a20]">
                Unable to load starred contracts
              </p>
            </div>
          )}

          {contracts && !isLoading && !error && (
            <div className="overflow-hidden">
              <ContractSubTable
                contracts={contracts}
                columns={COLUMNS}
                emptyIcon={<Star size={18} strokeWidth={1.6} />}
                emptyTitle="No starred contracts yet"
                emptyDescription='Star any contract using the ☆ icon to find it here instantly. Great for tracking your most important agreements.'
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
