import { useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  CalendarDays,
  FileText,
  Star,
} from "lucide-react";

import type { Contract } from "../../types/contract";
import { useRiskOverview } from "../../hooks/useRisk";
import { useToggleStar } from "../../hooks/useContractsByView";
import RiskBadge from "./RiskBadge";

interface ContractTableProps {
  contracts: Contract[];
  /** When set, only show rows whose AI risk level matches */
  riskFilter?: string | null;
}

const statusStyles: Record<
  string,
  {
    container: string;
    dot: string;
    label: string;
  }
> = {
  uploaded: {
    container:
      "border-[#e3e3e3] bg-[#f7f7f6] text-[#666a72]",
    dot: "bg-[#8d9198]",
    label: "Uploaded",
  },

  processing: {
    container:
      "border-[#eadfbd] bg-[#fbf7eb] text-[#8d7027]",
    dot: "bg-[#b8953f]",
    label: "Processing",
  },

  extracted: {
    container:
      "border-[#cfe5dd] bg-[#f0f8f5] text-[#28755f]",
    dot: "bg-[#2f9076]",
    label: "Extracted",
  },

  failed: {
    container:
      "border-[#efcccc] bg-[#fff4f4] text-[#c94b4b]",
    dot: "bg-[#d24d4d]",
    label: "Failed",
  },
};

export default function ContractTable({
  contracts,
  riskFilter = null,
}: ContractTableProps) {
  const navigate = useNavigate();
  const { mutate: toggleStar, isPending: isStarring } = useToggleStar();

  // One bulk risk request for the entire table.
  // Avoids one request per contract row.
  const { data: riskOverview } = useRiskOverview();

  const riskByContractId = new Map(
    (riskOverview ?? []).map((risk) => [
      risk.contract_id,
      risk,
    ]),
  );

  // Apply risk filter if set
  const visibleContracts = riskFilter
    ? contracts.filter((c) => {
        const risk = riskByContractId.get(c.id);
        return risk?.risk_level === riskFilter;
      })
    : contracts;

  if (visibleContracts.length === 0) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-[#e3e3e3] bg-[#fafafa] text-[#656971]">
          <FileText size={18} strokeWidth={1.6} />
        </div>

        <p className="text-[14px] font-semibold text-[#181a20]">
          No contracts
        </p>

        <p className="mt-1 max-w-sm text-[12px] leading-5 text-[#85888f]">
          Your uploaded agreements will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[760px] border-collapse">
        {/* =====================================================
            TABLE HEADER
        ===================================================== */}

        <thead>
          <tr className="border-b border-[#e9e9e9] text-left">
            <th className="px-3 py-3.5 sm:px-4">
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#979aa1]">
                Contract
              </span>
            </th>

            <th className="px-3 py-3.5 sm:px-4">
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#979aa1]">
                Uploaded
              </span>
            </th>

            <th className="px-3 py-3.5 sm:px-4">
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#979aa1]">
                Status
              </span>
            </th>

            <th className="px-3 py-3.5 sm:px-4">
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#979aa1]">
                Risk
              </span>
            </th>

            <th className="w-10 px-3 py-3.5 sm:px-4">
              <span className="sr-only">Star</span>
            </th>

            <th className="w-12 px-3 py-3.5 sm:px-4">
              <span className="sr-only">
                Open contract
              </span>
            </th>
          </tr>
        </thead>

        {/* =====================================================
            TABLE BODY
        ===================================================== */}

        <tbody>
          {visibleContracts.map((contract) => {
            const normalizedStatus =
              contract.status.toLowerCase();

            const status =
              statusStyles[normalizedStatus] ??
              statusStyles.uploaded;

            const risk =
              riskByContractId.get(contract.id);

            const uploadedDate = new Date(
              contract.uploaded_at,
            ).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            return (
              <tr
                key={contract.id}
                onClick={() =>
                  navigate(
                    `/app/contracts/${contract.id}`,
                  )
                }
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" ||
                    event.key === " "
                  ) {
                    event.preventDefault();

                    navigate(
                      `/app/contracts/${contract.id}`,
                    );
                  }
                }}
                tabIndex={0}
                role="button"
                className="group cursor-pointer border-b border-[#eeeeee] transition-colors last:border-b-0 hover:bg-[#fafafa] focus:bg-[#fafafa] focus:outline-none"
              >
                {/* =================================================
                    CONTRACT
                ================================================= */}

                <td className="px-3 py-4 sm:px-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#e3e3e3] bg-white text-[#666a72] transition-colors group-hover:border-[#d2d2d2] group-hover:text-[#181a20]">
                      <FileText
                        size={16}
                        strokeWidth={1.6}
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="max-w-[430px] truncate text-[14px] font-medium tracking-[-0.01em] text-[#181a20]">
                        {contract.file_name}
                      </p>

                      <p className="mt-1 max-w-[390px] truncate text-[10px] text-[#a0a3a9]">
                        {contract.id}
                      </p>
                    </div>
                  </div>
                </td>

                {/* =================================================
                    UPLOADED
                ================================================= */}

                <td className="px-3 py-4 sm:px-4">
                  <div className="flex items-center gap-2 text-[12px] text-[#686c74]">
                    <CalendarDays
                      size={14}
                      strokeWidth={1.6}
                      className="text-[#9a9da3]"
                    />

                    <span>{uploadedDate}</span>
                  </div>
                </td>

                {/* =================================================
                    STATUS
                ================================================= */}

                <td className="px-3 py-4 sm:px-4">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[10px] font-medium ${status.container}`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${status.dot}`}
                    />

                    {status.label}
                  </span>
                </td>

                {/* =================================================
                    RISK
                ================================================= */}

                <td className="px-3 py-4 sm:px-4">
                  <RiskBadge
                    level={risk?.risk_level}
                    score={risk?.risk_score}
                  />
                </td>

                {/* =================================================
                    STAR
                ================================================= */}

                <td
                  className="px-3 py-4 sm:px-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isStarring) toggleStar(contract.id);
                  }}
                >
                  <button
                    type="button"
                    aria-label={
                      contract.is_starred
                        ? "Remove from starred"
                        : "Add to starred"
                    }
                    className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                      contract.is_starred
                        ? "text-[#c9960d]"
                        : "text-[#d0d3da] hover:text-[#c9960d]"
                    }`}
                  >
                    <Star
                      size={14}
                      strokeWidth={1.8}
                      fill={contract.is_starred ? "currentColor" : "none"}
                    />
                  </button>
                </td>

                {/* =================================================
                    OPEN
                ================================================= */}

                <td className="px-3 py-4 text-right sm:px-4">
                  <div className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#92959b] opacity-0 transition-all duration-150 group-hover:bg-[#f0f0ef] group-hover:text-[#181a20] group-hover:opacity-100 group-focus:opacity-100">
                    <ArrowUpRight
                      size={14}
                      strokeWidth={1.8}
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}