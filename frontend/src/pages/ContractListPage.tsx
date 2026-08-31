import { useState, useMemo, useRef, useEffect } from "react";
import {
  AlertTriangle,
  FileText,
  Plus,
  X,
  Search,
  ChevronDown,
  SlidersHorizontal,
  Check,
} from "lucide-react";

import { useContracts } from "../hooks/useContracts";
import ContractTable from "../components/contracts/ContractTable";
import UploadContractModal from "../components/contracts/UploadContractModal";
import type { Contract, ContractStatus, LifecycleStatus } from "../types/contract";

/* ================================================================
   FILTER TYPES
================================================================ */

type RiskLevel = "low" | "medium" | "high";
type SortOrder = "newest" | "oldest" | "az" | "za";

interface ActiveFilters {
  search: string;
  status: ContractStatus | "";
  lifecycle: LifecycleStatus | "";
  risk: RiskLevel | "";
  sort: SortOrder;
}

const DEFAULT_FILTERS: ActiveFilters = {
  search: "",
  status: "",
  lifecycle: "",
  risk: "",
  sort: "newest",
};

/* ================================================================
   DROPDOWN MENU COMPONENT (generic)
================================================================ */

function Dropdown({
  label,
  selected,
  options,
  onSelect,
}: {
  label: string;
  selected: string;
  options: { value: string; label: string }[];
  onSelect: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isActive = selected !== "";
  const selectedLabel = options.find((o) => o.value === selected)?.label;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`inline-flex h-9 items-center gap-2 rounded-full border px-3.5 text-[12px] font-medium transition-all ${
          isActive
            ? "border-[#181A1F] bg-[#181A1F] text-white"
            : "border-[#DCDFE4] bg-white text-[#43464D] hover:border-[#B5B8BF] hover:bg-[#F7F7F6]"
        }`}
      >
        {isActive ? selectedLabel : label}
        <ChevronDown
          size={12}
          strokeWidth={2}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-30 mt-1.5 min-w-[170px] overflow-hidden rounded-xl border border-[#E4E6EB] bg-white shadow-xl">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onSelect(opt.value);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left text-[12px] font-medium transition-colors hover:bg-[#F7F7F6] ${
                selected === opt.value
                  ? "text-[#181A1F]"
                  : "text-[#43464D]"
              }`}
            >
              {opt.label}
              {selected === opt.value && (
                <Check size={12} strokeWidth={2.5} className="text-[#181A1F]" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ================================================================
   PAGE
================================================================ */

export default function ContractListPage() {
  const { data: contracts, isLoading, error } = useContracts();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [filters, setFilters] = useState<ActiveFilters>(DEFAULT_FILTERS);

  /* ----------------------------------------------------------
     Filter + sort logic (client-side)
  ---------------------------------------------------------- */
  const { filtered } = useMemo(() => {
    // Build a set for risk filtering — we do this via riskOverview later.
    // For now mark all as unknown (handled via RiskBadge in table).
    // We'll wire risk filter through a prop to the table.
    const riskFilterMap: Record<string, boolean> = {}; // placeholder

    let result: Contract[] = contracts ?? [];

    // Search — file name
    if (filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      result = result.filter((c) =>
        c.file_name.toLowerCase().includes(q),
      );
    }

    // Processing status
    if (filters.status) {
      result = result.filter((c) => c.status === filters.status);
    }

    // Lifecycle status
    if (filters.lifecycle) {
      result = result.filter(
        (c) => c.lifecycle_status === filters.lifecycle,
      );
    }

    // Sort
    result = [...result].sort((a, b) => {
      switch (filters.sort) {
        case "newest":
          return (
            new Date(b.uploaded_at).getTime() -
            new Date(a.uploaded_at).getTime()
          );
        case "oldest":
          return (
            new Date(a.uploaded_at).getTime() -
            new Date(b.uploaded_at).getTime()
          );
        case "az":
          return a.file_name.localeCompare(b.file_name);
        case "za":
          return b.file_name.localeCompare(a.file_name);
        default:
          return 0;
      }
    });

    return { filtered: result, riskFilterMap };
  }, [contracts, filters]);

  /* ----------------------------------------------------------
     Active filter count for badge
  ---------------------------------------------------------- */
  const activeCount = [
    filters.status,
    filters.lifecycle,
    filters.risk,
  ].filter(Boolean).length;

  function clearFilters() {
    setFilters(DEFAULT_FILTERS);
  }

  function set<K extends keyof ActiveFilters>(key: K, value: ActiveFilters[K]) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  /* ----------------------------------------------------------
     Options
  ---------------------------------------------------------- */
  const STATUS_OPTIONS = [
    { value: "", label: "All statuses" },
    { value: "uploaded", label: "Uploaded" },
    { value: "processing", label: "Processing" },
    { value: "extracted", label: "Extracted" },
    { value: "failed", label: "Failed" },
  ];

  const LIFECYCLE_OPTIONS = [
    { value: "", label: "All lifecycle stages" },
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "executed", label: "Executed" },
    { value: "expired", label: "Expired" },
    { value: "terminated", label: "Terminated" },
  ];

  const RISK_OPTIONS = [
    { value: "", label: "All risk levels" },
    { value: "low", label: "Low risk" },
    { value: "medium", label: "Medium risk" },
    { value: "high", label: "High risk" },
  ];

  const SORT_OPTIONS = [
    { value: "newest", label: "Newest first" },
    { value: "oldest", label: "Oldest first" },
    { value: "az", label: "Name A → Z" },
    { value: "za", label: "Name Z → A" },
  ];

  /* ----------------------------------------------------------
     Render
  ---------------------------------------------------------- */
  return (
    <main className="min-h-full bg-white px-6 py-7 sm:px-8 lg:px-10">
      <div className="mx-auto w-full max-w-[1380px]">
        {/* ====================================================
            PAGE HEADER
        ==================================================== */}
        <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-[28px] font-semibold tracking-[-0.035em] text-[#181A1F] sm:text-[30px]">
              All Contracts
            </h1>
            <p className="mt-1 text-[13px] leading-5 text-[#707773]">
              {isLoading
                ? "Loading your workspace..."
                : filtered.length !== (contracts?.length ?? 0)
                  ? `Showing ${filtered.length} of ${contracts?.length ?? 0} contracts`
                  : `${contracts?.length ?? 0} contract${(contracts?.length ?? 0) === 1 ? "" : "s"} in your workspace`}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setUploadOpen(true)}
            className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-lg bg-[#191C24] px-4 text-[13px] font-medium text-white transition-colors hover:bg-[#292D36]"
          >
            <Plus size={16} strokeWidth={1.8} />
            Upload New Contract
          </button>
        </div>

        {/* ====================================================
            FILTER BAR
        ==================================================== */}
        <div className="mb-5 flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search
              size={13}
              strokeWidth={2}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A9DA3]"
            />
            <input
              type="text"
              placeholder="Search contracts..."
              value={filters.search}
              onChange={(e) => set("search", e.target.value)}
              className="h-9 w-[220px] rounded-full border border-[#DCDFE4] bg-white pl-9 pr-3.5 text-[12px] text-[#181A1F] placeholder-[#9A9DA3] outline-none transition-all focus:border-[#181A1F] focus:ring-2 focus:ring-[#181A1F]/10"
            />
            {filters.search && (
              <button
                type="button"
                onClick={() => set("search", "")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A9DA3] hover:text-[#181A1F]"
              >
                <X size={12} strokeWidth={2.5} />
              </button>
            )}
          </div>

          {/* Divider */}
          <div className="h-5 w-px bg-[#E4E6EB]" />

          {/* Status filter */}
          <Dropdown
            label="Status"
            selected={filters.status}
            options={STATUS_OPTIONS}
            onSelect={(v) => set("status", v as ContractStatus | "")}
          />

          {/* Lifecycle filter */}
          <Dropdown
            label="Lifecycle"
            selected={filters.lifecycle}
            options={LIFECYCLE_OPTIONS}
            onSelect={(v) => set("lifecycle", v as LifecycleStatus | "")}
          />

          {/* Risk filter */}
          <Dropdown
            label="Risk"
            selected={filters.risk}
            options={RISK_OPTIONS}
            onSelect={(v) => set("risk", v as RiskLevel | "")}
          />

          {/* Sort */}
          <div className="h-5 w-px bg-[#E4E6EB]" />
          <Dropdown
            label="Sort"
            selected={filters.sort}
            options={SORT_OPTIONS}
            onSelect={(v) => set("sort", v as SortOrder)}
          />

          {/* Clear all (only if active filters) */}
          {(activeCount > 0 || filters.search) && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[#DCDFE4] bg-white px-3.5 text-[12px] font-medium text-[#43464D] transition-colors hover:border-[#B5B8BF] hover:bg-[#F7F7F6]"
            >
              <X size={12} strokeWidth={2.5} />
              Clear filters
              {activeCount > 0 && (
                <span className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#181A1F] text-[9px] font-bold text-white">
                  {activeCount}
                </span>
              )}
            </button>
          )}

          {/* All filters icon — visible for reference */}
          <button
            type="button"
            className="ml-auto inline-flex h-9 items-center gap-2 rounded-full border border-[#DCDFE4] bg-white px-3.5 text-[12px] font-medium text-[#43464D] transition-colors hover:border-[#B5B8BF] hover:bg-[#F7F7F6]"
          >
            <SlidersHorizontal size={13} strokeWidth={1.8} />
            Filters
            {activeCount > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#181A1F] text-[9px] font-bold text-white">
                {activeCount}
              </span>
            )}
          </button>
        </div>

        <div className="border-t border-[#ECECEC]" />

        {/* ====================================================
            CONTRACT TABLE
        ==================================================== */}
        <section className="w-full">
          {/* Loading */}
          {isLoading && (
            <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">
              <div className="mb-4 h-6 w-6 animate-spin rounded-full border-2 border-[#DEDEDE] border-t-[#181A1F]" />
              <p className="text-[13px] font-medium text-[#181A1F]">
                Loading contracts
              </p>
              <p className="mt-1 text-[12px] text-[#85888F]">
                Preparing your contract workspace...
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#FFF1F1] text-[#D24D4D]">
                <AlertTriangle size={17} />
              </div>
              <p className="text-[13px] font-semibold text-[#181A1F]">
                Unable to load contracts
              </p>
              <p className="mt-1 max-w-sm text-[12px] leading-5 text-[#85888F]">
                Something went wrong while loading your contracts.
              </p>
            </div>
          )}

          {/* Empty workspace */}
          {!isLoading && !error && (contracts?.length ?? 0) === 0 && (
            <div className="flex min-h-[380px] flex-col items-center justify-center px-6 text-center">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-[#E1E1E1] bg-[#FAFAFA] text-[#555961]">
                <FileText size={18} strokeWidth={1.6} />
              </div>
              <h2 className="text-[14px] font-semibold text-[#181A1F]">
                No contracts yet
              </h2>
              <p className="mt-1 max-w-sm text-[12px] leading-5 text-[#85888F]">
                Add your first contract to start organizing and analyzing agreements.
              </p>
              <button
                type="button"
                onClick={() => setUploadOpen(true)}
                className="mt-5 inline-flex h-9 items-center gap-2 rounded-lg bg-[#191C24] px-4 text-[12px] font-medium text-white transition-colors hover:bg-[#292D36]"
              >
                <Plus size={14} />
                New Contract
              </button>
            </div>
          )}

          {/* No results after filters */}
          {!isLoading &&
            !error &&
            (contracts?.length ?? 0) > 0 &&
            filtered.length === 0 && (
              <div className="flex min-h-[280px] flex-col items-center justify-center px-6 text-center">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-[#E4E6EB] bg-[#FAFBFA]">
                  <Search size={16} className="text-[#9A9DA3]" />
                </div>
                <p className="text-[13px] font-semibold text-[#181A1F]">
                  No contracts match your filters
                </p>
                <p className="mt-1 text-[12px] text-[#85888F]">
                  Try adjusting your search or filter criteria.
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-4 inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#DCDFE4] px-3.5 text-[12px] font-medium text-[#43464D] hover:bg-[#F7F7F6]"
                >
                  <X size={12} strokeWidth={2.5} />
                  Clear filters
                </button>
              </div>
            )}

          {/* Contracts Table */}
          {!isLoading && !error && filtered.length > 0 && (
            <div className="overflow-hidden">
              <ContractTable
                contracts={filtered}
                riskFilter={filters.risk || null}
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