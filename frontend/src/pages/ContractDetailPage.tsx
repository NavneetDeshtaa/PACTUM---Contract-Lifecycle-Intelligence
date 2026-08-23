import { useParams, useNavigate } from "react-router-dom";

import { ArrowLeft, CalendarDays, FileText, ShieldCheck } from "lucide-react";

import { useContract } from "../hooks/useContract";

import ExtractedFieldsPanel from "../components/contracts/ExtractedFieldsPanel";
import SummaryPanel from "../components/ui/SummaryPanel";
import RiskPanel from "../components/contracts/RiskPanel";
import ObligationsPanel from "../components/contracts/ObligationsPanel";
import VersionDiffPanel from "../components/contracts/VersionDiffPanel";
import ApprovalPanel from "../components/contracts/ApprovalPanel";

export default function ContractDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: contract, isLoading, error } = useContract(id);

  /* =========================================================
     LOADING
  ========================================================= */

  if (isLoading) {
    return (
      <main className="min-h-full bg-white px-6 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[1380px]">
          <div className="flex min-h-[500px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 h-6 w-6 animate-spin rounded-full border-2 border-[#dedede] border-t-[#181a20]" />

              <p className="text-[13px] font-medium text-[#181a20]">
                Loading contract
              </p>

              <p className="mt-1 text-[12px] text-[#85888f]">
                Preparing contract details...
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error || !contract) {
    return (
      <main className="min-h-full bg-white px-6 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[1380px]">
          <div className="flex min-h-[500px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-[#e2e2e2] bg-[#fafafa] text-[#666a72]">
                <FileText size={18} strokeWidth={1.6} />
              </div>

              <h1 className="text-[14px] font-semibold text-[#181a20]">
                Contract not found
              </h1>

              <p className="mt-1 max-w-sm text-[12px] leading-5 text-[#85888f]">
                The contract may have been removed or you may not have access to
                it.
              </p>

              <button
                type="button"
                onClick={() => navigate("/app/contracts")}
                className="mt-5 inline-flex h-9 items-center gap-2 rounded-lg bg-[#191c24] px-4 text-[12px] font-medium text-white transition-colors hover:bg-[#292d36]"
              >
                <ArrowLeft size={14} />
                Back to contracts
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* =========================================================
     DATE
  ========================================================= */

  const uploadedDate = new Date(contract.uploaded_at).toLocaleDateString(
    undefined,
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
  );

  return (
    <main className="min-h-full bg-white px-6 py-7 sm:px-8 lg:px-10">
      <div className="mx-auto w-full max-w-[1380px]">
        {/* =====================================================
            BACK
        ===================================================== */}

        <button
          type="button"
          onClick={() => navigate("/app/contracts")}
          className="group mb-5 inline-flex items-center gap-2 text-[12px] font-medium text-[#6f737b] transition-colors hover:text-[#181a20]"
        >
          <ArrowLeft
            size={14}
            strokeWidth={1.7}
            className="transition-transform duration-150 group-hover:-translate-x-0.5"
          />
          Back to contracts
        </button>

        {/* =====================================================
            CONTRACT HEADER
        ===================================================== */}

        <header className="mb-8 border-b border-[#ececec] pb-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            {/* LEFT */}

            <div className="flex min-w-0 items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#e3e3e3] bg-white text-[#5f636b]">
                <FileText size={17} strokeWidth={1.6} />
              </div>

              <div className="min-w-0">
                {/* CONTRACT ID */}

                <div className="mb-1.5 flex min-w-0 items-center gap-2">
                  <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#9b9ea5]">
                    Contract
                  </span>

                  <span className="h-1 w-1 shrink-0 rounded-full bg-[#c2c4c8]" />

                  <span className="max-w-[320px] truncate text-[9px] text-[#aaadb2]">
                    {contract.id}
                  </span>
                </div>

                {/* TITLE */}

                <h1 className="max-w-[900px] break-words text-[26px] font-semibold leading-[1.2] tracking-[-0.035em] text-[#181a20] sm:text-[30px]">
                  {contract.file_name}
                </h1>

                {/* META */}

                <div className="mt-2.5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-[#777b83]">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays
                      size={13}
                      strokeWidth={1.6}
                      className="text-[#9699a0]"
                    />
                    Uploaded {uploadedDate}
                  </span>

                  <span className="hidden h-3 w-px bg-[#dedede] sm:block" />

                  <span className="flex items-center gap-1.5">
                    <ShieldCheck
                      size={13}
                      strokeWidth={1.7}
                      className="text-[#2f9076]"
                    />
                    AI analyzed
                  </span>
                </div>
              </div>
            </div>

            {/* STATUS */}

            <ContractStatus status={contract.status} />
          </div>
        </header>

        {/* =====================================================
            CONTRACT DETAILS
        ===================================================== */}

        <section className="mb-10">
          {/* =================================================
              TOP ROW

              Extracted Fields + Obligations
          ================================================= */}

          <div className="grid items-start gap-6 xl:grid-cols-2">
            {/* EXTRACTED INFORMATION */}

            <section className="min-w-0">
              <SectionHeader
                title="Extracted Information"
                description="Structured metadata identified from the agreement."
              />

              <ExtractedFieldsPanel
                fields={contract.extracted_fields}
                status={contract.status}
              />
            </section>

            {/* OBLIGATIONS */}

            <section className="min-w-0">
              <SectionHeader
                title="Renewals & Obligations"
                description="Track important deadlines and contract duties."
              />

              <ObligationsPanel contractId={contract.id} />
            </section>
          </div>
        </section>

        {/* =====================================================
            AI ANALYSIS
        ===================================================== */}

        <section className="border-t border-[#ececec] pt-8">
          {/* =================================================
              BOTTOM ROW

              Summary + Risk
          ================================================= */}

          <div className="grid items-start gap-6 xl:grid-cols-[1fr_1fr]">
            {/* SUMMARY */}

            <section className="min-w-0">
              <SectionHeader
                title="AI Summary"
                description="A concise analysis of the agreement."
              />

              <SummaryPanel contractId={contract.id} />
            </section>

            {/* RISK */}

            <section className="min-w-0">
              <SectionHeader
                title="Risk Assessment"
                description="Detected risks, missing clauses, and policy concerns."
              />

              <RiskPanel contractId={contract.id} />
            </section>

            <div className="mt-6">
              <ApprovalPanel contractId={contract.id} />
            </div>
            <div className="mt-6">
              <VersionDiffPanel contractId={contract.id} />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

/* ============================================================
   SECTION HEADER
============================================================ */

type SectionHeaderProps = {
  title: string;
  description: string;
};

function SectionHeader({ title, description }: SectionHeaderProps) {
  return (
    <div className="mb-3">
      <h3 className="text-[13px] font-semibold tracking-[-0.01em] text-[#181a20]">
        {title}
      </h3>

      <p className="mt-0.5 text-[11px] leading-4 text-[#85888f]">
        {description}
      </p>
    </div>
  );
}

/* ============================================================
   CONTRACT STATUS
============================================================ */

type ContractStatusProps = {
  status: string;
};

function ContractStatus({ status }: ContractStatusProps) {
  const normalizedStatus = status.toLowerCase();

  const isReady =
    normalizedStatus === "completed" ||
    normalizedStatus === "processed" ||
    normalizedStatus === "active" ||
    normalizedStatus === "extracted";

  const isFailed =
    normalizedStatus === "failed" || normalizedStatus === "error";

  return (
    <span
      className={`inline-flex w-fit shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-medium capitalize ${
        isFailed
          ? "border-[#efcccc] bg-[#fff4f4] text-[#c94b4b]"
          : isReady
            ? "border-[#cfe5dd] bg-[#f0f8f5] text-[#28755f]"
            : "border-[#eadfbd] bg-[#fbf7eb] text-[#8d7027]"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isFailed ? "bg-[#d24d4d]" : isReady ? "bg-[#2f9076]" : "bg-[#b8953f]"
        }`}
      />

      {status}
    </span>
  );
}
