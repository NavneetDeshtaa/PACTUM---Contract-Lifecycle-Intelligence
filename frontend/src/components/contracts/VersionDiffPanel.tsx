import { useState } from "react";
import { History, GitCompare } from "lucide-react";
import { useVersions, useCompareVersions, useCreateVersion } from "../../hooks/usePhase5";

interface VersionDiffPanelProps {
  contractId: string;
}

export default function VersionDiffPanel({ contractId }: VersionDiffPanelProps) {
  const { data: versions, isLoading } = useVersions(contractId);
  const [fromVersion, setFromVersion] = useState<number | null>(null);
  const [toVersion, setToVersion] = useState<number | null>(null);
  const { data: comparison, isLoading: comparing } = useCompareVersions(contractId, fromVersion, toVersion);

  const [newText, setNewText] = useState("");
  const [showAddVersion, setShowAddVersion] = useState(false);
  const createVersion = useCreateVersion(contractId);

  if (isLoading) {
    return (
      <div className="rounded-xl border border-ink/10 bg-paper/50 p-6 text-center text-xs text-ink-soft">
        Loading versions...
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-ink/10 bg-white p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History size={15} className="text-ink-soft" />
          <h3 className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
            Version History
          </h3>
        </div>
        <button
          onClick={() => setShowAddVersion((s) => !s)}
          className="text-[10px] font-semibold text-ink-soft hover:text-ink transition-colors"
        >
          {showAddVersion ? "Cancel" : "+ Add Version"}
        </button>
      </div>

      {showAddVersion && (
        <div className="space-y-2 rounded-lg border border-ink/10 bg-paper/40 p-3">
          <textarea
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            rows={4}
            placeholder="Paste the revised contract text..."
            className="w-full rounded-lg border border-ink/10 px-3 py-2 text-xs text-ink placeholder:text-ink-soft/50"
          />
          <button
            onClick={() =>
              createVersion.mutate(newText, {
                onSuccess: () => { setNewText(""); setShowAddVersion(false); },
              })
            }
            disabled={!newText.trim() || createVersion.isPending}
            className="rounded-lg bg-ink px-3 py-1.5 text-xs font-semibold text-white hover:bg-ink/90 disabled:bg-ink/30 transition-colors"
          >
            {createVersion.isPending ? "Saving..." : "Save as New Version"}
          </button>
        </div>
      )}

      <div className="flex items-center gap-2">
        <select
          value={fromVersion ?? ""}
          onChange={(e) => setFromVersion(e.target.value ? Number(e.target.value) : null)}
          className="flex-1 rounded-lg border border-ink/10 bg-white px-2.5 py-1.5 text-xs text-ink"
        >
          <option value="">From version</option>
          {versions?.map((v) => (
            <option key={v.id} value={v.version_number}>
              v{v.version_number} — {new Date(v.created_at).toLocaleDateString()}
            </option>
          ))}
        </select>
        <GitCompare size={14} className="text-ink-soft shrink-0" />
        <select
          value={toVersion ?? ""}
          onChange={(e) => setToVersion(e.target.value ? Number(e.target.value) : null)}
          className="flex-1 rounded-lg border border-ink/10 bg-white px-2.5 py-1.5 text-xs text-ink"
        >
          <option value="">To version</option>
          {versions?.map((v) => (
            <option key={v.id} value={v.version_number}>
              v{v.version_number} — {new Date(v.created_at).toLocaleDateString()}
            </option>
          ))}
        </select>
      </div>

      {comparing && <p className="text-xs text-ink-soft">Comparing versions...</p>}

      {comparison && (
        <div className="space-y-4">
          <div className="rounded-lg border border-ink/10 bg-paper/50 px-3.5 py-2.5">
            <p className="text-[9px] font-semibold uppercase tracking-wide text-ink-soft">AI Explanation</p>
            <p className="mt-1 whitespace-pre-wrap text-xs text-ink">{comparison.explanation}</p>
          </div>

          {comparison.changes.length === 0 ? (
            <p className="text-xs text-ink-soft">No differences between these versions.</p>
          ) : (
            <div className="space-y-2">
              {comparison.changes.map((change, i) => (
                <div key={i} className="space-y-1 rounded-lg border border-ink/[0.07] p-2.5">
                  {change.old_text && (
                    <p className="rounded bg-redline/[0.08] px-2 py-1 text-xs text-redline line-through">
                      {change.old_text}
                    </p>
                  )}
                  {change.new_text && (
                    <p className="rounded bg-insert/[0.08] px-2 py-1 text-xs text-insert">
                      {change.new_text}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}