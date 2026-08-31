import { useState } from "react";
import { CheckCircle2, Plus, AlertTriangle } from "lucide-react";

import { useExecutedContracts } from "../hooks/useContractsByView";
import ContractSubTable from "../components/contracts/ContractSubTable";
import UploadContractModal from "../components/contracts/UploadContractModal";

const COLUMNS = [
  { key: "name" as const, label: "Contract" },
  { key: "uploaded" as const, label: "Uploaded" },
  { key: "effective" as const, label: "Effective Date" },
  { key: "expiry" as const, label: "Expiry Date" },
  { key: "risk" as const, label: "Risk" },
  { key: "lifecycle" as const, label: "Stage" },
];

export default function ExecutedContractsPage() {
  const { data: contracts, isLoading, error } = useExecutedContracts();
  const [uploadOpen, setUploadOpen] = useState(false);

  const count = contracts?.length ?? 0;

  return (
    <main className="min-h-full bg-white px-6 py-7 sm:px-8 lg:px-10">
      <div className="mx-auto w-full max-w-[1380px]">

        {/* ── Header ─────────────────────────────────────────────────── */}

        <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-[28px] font-semibold tracking-[-0.035em] text-[#181a20] sm:text-[30px]">
              Executed Contracts
            </h1>
            <p className="mt-1 text-[13px] leading-5 text-[#737780]">
              {count > 0
                ? `${count} fully executed contract${count === 1 ? "" : "s"}`
                : "Contracts that have been fully signed and executed"}
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

        <div className="mb-5 flex items-start gap-3 rounded-xl border border-[#c9d9f7] bg-[#eef3fc] px-4 py-3">
          <CheckCircle2
            size={16}
            strokeWidth={1.8}
            className="mt-0.5 shrink-0 text-[#2a57a8]"
          />
          <p className="text-[12px] leading-5 text-[#2a57a8]">
            These contracts are marked <strong>Executed</strong>. To mark a contract as executed, open its detail page and update the lifecycle stage.
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
                Loading executed contracts
              </p>
            </div>
          )}

          {error && (
            <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#fff1f1] text-[#d24d4d]">
                <AlertTriangle size={17} />
              </div>
              <p className="text-[13px] font-semibold text-[#181a20]">
                Unable to load executed contracts
              </p>
            </div>
          )}

          {contracts && !isLoading && !error && (
            <div className="overflow-hidden">
              <ContractSubTable
                contracts={contracts}
                columns={COLUMNS}
                emptyIcon={<CheckCircle2 size={18} strokeWidth={1.6} />}
                emptyTitle="No executed contracts"
                emptyDescription="Open a contract's detail page and set its lifecycle stage to 'Executed' to track it here."
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
