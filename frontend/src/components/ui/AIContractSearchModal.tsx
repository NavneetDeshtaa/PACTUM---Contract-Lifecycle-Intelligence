import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Search, Sparkles, X, ArrowRight, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useSearch } from "../../hooks/useSearch";
import type { SearchResponse } from "../../types/search";

interface AIContractSearchModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AIContractSearchModal({
  open,
  onClose,
}: AIContractSearchModalProps) {
  const [query, setQuery] = useState("");
  const search = useSearch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) {
      setQuery("");
      search.reset();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery || search.isPending) return;

    search.mutate(trimmedQuery);
  }

  function handleSourceClick(contractId: string) {
    onClose();
    navigate(`/app/contracts/${contractId}`);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/45 px-4 py-6 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-search-title"
        className="flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-[0_30px_100px_-30px_rgba(28,35,33,0.4)]"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-ink/10 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink text-paper">
              <Sparkles size={16} />
            </div>

            <div>
              <h2
                id="ai-search-title"
                className="text-sm font-semibold text-ink"
              >
                Search your contracts
              </h2>

              <p className="text-[11px] text-ink-soft">
                Ask questions across your entire contract repository
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-soft transition-colors hover:bg-paper hover:text-ink"
          >
            <X size={17} />
          </button>
        </div>

        {/* Search area */}
        <div className="border-b border-ink/10 bg-paper/40 px-6 py-5">
          <form onSubmit={handleSubmit}>
            <div className="relative">
              <Search
                size={17}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft"
              />

              <input
                autoFocus
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder='Ask anything, e.g. "Which contracts expire next month?"'
                className="h-12 w-full rounded-xl border border-ink/15 bg-white pl-11 pr-28 text-sm text-ink outline-none transition-all placeholder:text-ink-soft/50 hover:border-ink/25 focus:border-ink focus:ring-4 focus:ring-ink/[0.06]"
              />

              <button
                type="submit"
                disabled={search.isPending || !query.trim()}
                className="absolute right-1.5 top-1/2 flex h-9 -translate-y-1/2 items-center gap-1.5 rounded-lg bg-ink px-3.5 text-xs font-semibold text-paper transition-all hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {search.isPending ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-paper/30 border-t-paper" />
                    Searching
                  </>
                ) : (
                  <>
                    Ask
                    <ArrowRight size={13} />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Suggested questions */}
          {!search.isSuccess && !search.isPending && (
            <div className="mt-3 flex flex-wrap gap-2">
              <Suggestion
                text="Contracts expiring next month"
                onClick={() => setQuery("Which contracts are expiring next month?")}
              />

              <Suggestion
                text="Unlimited liability"
                onClick={() =>
                  setQuery("Which contracts contain unlimited liability?")
                }
              />

              <Suggestion
                text="Unusual payment terms"
                onClick={() =>
                  setQuery("Which contracts have unusual payment terms?")
                }
              />
            </div>
          )}
        </div>

        {/* Results */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          {search.isPending && <SearchLoading />}

          {search.isError && <SearchError />}

          {search.isSuccess && search.data && (
            <SearchResult
              result={search.data}
              onSourceClick={handleSourceClick}
            />
          )}

          {!search.isPending && !search.isError && !search.isSuccess && (
            <SearchEmptyState />
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-ink/10 px-6 py-3">
          <p className="text-center text-[10px] text-ink-soft/60">
            AI-generated answers are based on contracts in your workspace.
            Always verify important legal conclusions against the source.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SUGGESTION
============================================================ */

type SuggestionProps = {
  text: string;
  onClick: () => void;
};

function Suggestion({ text, onClick }: SuggestionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-ink/10 bg-white px-3 py-1.5 text-[11px] font-medium text-ink-soft transition-colors hover:border-ink/20 hover:bg-white hover:text-ink"
    >
      {text}
    </button>
  );
}

/* ============================================================
   EMPTY STATE
============================================================ */

function SearchEmptyState() {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-paper text-ink">
        <Search size={20} />
      </div>

      <h3 className="text-sm font-semibold text-ink">
        Ask your contracts anything
      </h3>

      <p className="mt-2 max-w-md text-xs leading-5 text-ink-soft">
        Search across your entire repository using natural language. Clause
        will find relevant contract passages and generate an answer with
        supporting sources.
      </p>
    </div>
  );
}

/* ============================================================
   LOADING
============================================================ */

function SearchLoading() {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
      <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-paper">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-ink/15 border-t-ink" />
      </div>

      <p className="text-sm font-semibold text-ink">
        Searching your contracts
      </p>

      <p className="mt-1 text-xs text-ink-soft">
        Finding relevant clauses and generating an answer...
      </p>
    </div>
  );
}

/* ============================================================
   ERROR
============================================================ */

function SearchError() {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-redline/[0.08] text-redline">
        !
      </div>

      <p className="text-sm font-semibold text-ink">
        Search couldn't be completed
      </p>

      <p className="mt-1 max-w-sm text-xs leading-5 text-ink-soft">
        Something went wrong while searching your contracts. Try asking the
        question again.
      </p>
    </div>
  );
}

/* ============================================================
   RESULT
============================================================ */

interface SearchResultProps {
  result: SearchResponse;
  onSourceClick: (contractId: string) => void;
}

function SearchResult({ result, onSourceClick }: SearchResultProps) {
  return (
    <div className="space-y-6 p-6">
      {/* Answer */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-insert/[0.08] text-insert">
            <Sparkles size={12} />
          </div>

          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
            AI answer
          </p>
        </div>

        <div className="rounded-xl border border-ink/10 bg-paper/50 p-5">
          <p className="whitespace-pre-wrap text-sm leading-7 text-ink">
            {result.answer}
          </p>
        </div>
      </section>

      {/* Sources */}
      {result.sources.length > 0 && (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
              Supporting contracts
            </p>

            <span className="text-[10px] text-ink-soft/60">
              {result.sources.length} source
              {result.sources.length === 1 ? "" : "s"}
            </span>
          </div>

          <div className="space-y-2">
            {result.sources.map((source) => (
              <button
                key={source.contract_id}
                type="button"
                onClick={() => onSourceClick(source.contract_id)}
                className="group flex w-full items-center justify-between rounded-xl border border-ink/10 bg-white px-4 py-3.5 text-left transition-all hover:border-ink/20 hover:bg-paper/40"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-paper text-ink-soft">
                    <FileText size={14} />
                  </div>

                  <span className="truncate text-xs font-semibold text-ink">
                    {source.file_name}
                  </span>
                </div>

                <div className="ml-4 flex shrink-0 items-center gap-3">
                  {source.similarity !== null && (
                    <span className="rounded-full bg-insert/[0.08] px-2.5 py-1 text-[10px] font-semibold text-insert">
                      {Math.round(source.similarity * 100)}% match
                    </span>
                  )}

                  <ArrowRight
                    size={14}
                    className="text-ink-soft transition-transform group-hover:translate-x-0.5 group-hover:text-ink"
                  />
                </div>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}