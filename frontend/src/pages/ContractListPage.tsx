import { useState } from "react";
import {
  AlertTriangle,
  ChevronDown,
  FileText,
  Plus,
  SlidersHorizontal,
} from "lucide-react";

import { useContracts } from "../hooks/useContracts";
import ContractTable from "../components/contracts/ContractTable";
import UploadContractModal from "../components/contracts/UploadContractModal";

export default function ContractListPage() {
  const { data: contracts, isLoading, error } = useContracts();

  const [uploadOpen, setUploadOpen] = useState(false);

  const contractCount = contracts?.length ?? 0;

  return (
    <main className="min-h-full bg-white px-6 py-7 sm:px-8 lg:px-10">
      <div className="mx-auto w-full max-w-[1380px]">
        {/* =====================================================
            PAGE HEADER
        ===================================================== */}

        <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-[28px] font-semibold tracking-[-0.035em] text-[#181a20] sm:text-[30px]">
              All Contracts
            </h1>

            <p className="mt-1 text-[13px] leading-5 text-[#737780]">
              {contractCount > 0
                ? `${contractCount} contract${
                    contractCount === 1 ? "" : "s"
                  } in your workspace`
                : "Manage all agreements in your workspace"}
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

        {/* =====================================================
            FILTERS
        ===================================================== */}

        <div className="mb-5 flex flex-wrap items-center gap-2">
          <FilterButton label="Status" />

          <FilterButton label="Type" />

          <FilterButton label="Date" />

          <FilterButton label="Risk" />

          <button
            type="button"
            className="inline-flex h-9 items-center gap-2 rounded-full border border-[#dddddd] bg-white px-4 text-[12px] font-medium text-[#43464d] transition-colors hover:border-[#c7c7c7] hover:bg-[#f7f7f6]"
          >
            All filters

            <SlidersHorizontal size={14} strokeWidth={1.8} />
          </button>
        </div>

        {/* =====================================================
            SUBTLE DIVIDER
        ===================================================== */}

        <div className="border-t border-[#ececec]" />

        {/* =====================================================
            CONTRACT TABLE
        ===================================================== */}

        <section className="w-full">
          {/* Loading */}

          {isLoading && (
            <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">
              <div className="mb-4 h-6 w-6 animate-spin rounded-full border-2 border-[#dedede] border-t-[#181a20]" />

              <p className="text-[13px] font-medium text-[#181a20]">
                Loading contracts
              </p>

              <p className="mt-1 text-[12px] text-[#85888f]">
                Preparing your contract workspace...
              </p>
            </div>
          )}

          {/* Error */}

          {error && (
            <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#fff1f1] text-[#d24d4d]">
                <AlertTriangle size={17} />
              </div>

              <p className="text-[13px] font-semibold text-[#181a20]">
                Unable to load contracts
              </p>

              <p className="mt-1 max-w-sm text-[12px] leading-5 text-[#85888f]">
                Something went wrong while loading your contracts.
              </p>
            </div>
          )}

          {/* Empty */}

          {contracts &&
            contracts.length === 0 &&
            !isLoading &&
            !error && (
              <div className="flex min-h-[380px] flex-col items-center justify-center px-6 text-center">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-[#e1e1e1] bg-[#fafafa] text-[#555961]">
                  <FileText size={18} strokeWidth={1.6} />
                </div>

                <h2 className="text-[14px] font-semibold text-[#181a20]">
                  No contracts yet
                </h2>

                <p className="mt-1 max-w-sm text-[12px] leading-5 text-[#85888f]">
                  Add your first contract to start organizing and analyzing
                  agreements.
                </p>

                <button
                  type="button"
                  onClick={() => setUploadOpen(true)}
                  className="mt-5 inline-flex h-9 items-center gap-2 rounded-lg bg-[#191c24] px-4 text-[12px] font-medium text-white transition-colors hover:bg-[#292d36]"
                >
                  <Plus size={14} />

                  New Contract
                </button>
              </div>
            )}

          {/* Contracts */}

          {contracts &&
            contracts.length > 0 &&
            !isLoading &&
            !error && (
              <div className="overflow-hidden">
                <ContractTable contracts={contracts} />
              </div>
            )}
        </section>
      </div>

      {/* =====================================================
          UPLOAD MODAL
      ===================================================== */}

      <UploadContractModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
      />
    </main>
  );
}

/* ============================================================
   FILTER BUTTON
   UI ONLY FOR NOW
============================================================ */

type FilterButtonProps = {
  label: string;
};

function FilterButton({ label }: FilterButtonProps) {
  return (
    <button
      type="button"
      className="inline-flex h-9 items-center gap-2 rounded-full border border-[#dddddd] bg-white px-4 text-[12px] font-medium text-[#43464d] transition-colors hover:border-[#c7c7c7] hover:bg-[#f7f7f6]"
    >
      {label}

      <ChevronDown
        size={13}
        strokeWidth={1.8}
        className="text-[#8b8e95]"
      />
    </button>
  );
}