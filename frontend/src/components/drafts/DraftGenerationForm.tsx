import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  FileSignature,
  Sparkles,
} from "lucide-react";

import {
  useTemplates,
  useGenerateDraft,
} from "../../hooks/usePhase4";

export default function DraftGenerationForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTemplateId = searchParams.get("templateId") || "";

  const {
    data: templates,
    isLoading: templatesLoading,
  } = useTemplates();

  const generate = useGenerateDraft();

  const [templateId, setTemplateId] = useState(initialTemplateId);
  const [customerName, setCustomerName] = useState("");
  const [ourCompanyName, setOurCompanyName] = useState("");
  const [value, setValue] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [durationMonths, setDurationMonths] = useState("12");
  const [jurisdiction, setJurisdiction] = useState("");
  const [additionalInstructions, setAdditionalInstructions] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    generate.mutate(
      {
        template_id: templateId,
        customer_name: customerName,
        our_company_name:
          ourCompanyName || "Our Company",
        value: value
          ? Number(value)
          : null,
        currency,
        duration_months:
          Number(durationMonths) || 12,
        jurisdiction,
        additional_instructions:
          additionalInstructions || null,
      },
      {
        onSuccess: (data) =>
          navigate(`/app/contracts/${data.id}`),
      },
    );
  }

  const inputClass =
    "w-full rounded-lg border border-[#dddddd] bg-white px-3.5 py-2.5 text-[13px] text-[#181a20] outline-none transition-colors placeholder:text-[#b0b2b7] focus:border-[#aeb1b6] focus:ring-2 focus:ring-[#181a20]/5";

  const labelClass =
    "mb-1.5 block text-[11px] font-medium text-[#5f636b]";

  return (
    <form
      onSubmit={handleSubmit}
      className="overflow-hidden rounded-xl border border-[#e5e5e5] bg-white"
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="border-b border-[#ececec] px-6 py-5">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#e2e2e2] bg-[#fafafa] text-[#62666e]">
            <FileSignature
              size={16}
              strokeWidth={1.7}
            />
          </div>

          <div>
            <h2 className="text-[15px] font-semibold tracking-[-0.015em] text-[#181a20]">
              Generate Contract Draft
            </h2>

            <p className="mt-1 text-[11px] leading-5 text-[#85888f]">
              Create a contract from a template using structured business details.
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          FORM CONTENT
      ===================================================== */}

      <div className="space-y-6 px-6 py-6">
        {/* =================================================
            TEMPLATE
        ================================================= */}

        <div>
          <label className={labelClass}>
            Template
          </label>

          <select
            required
            value={templateId}
            onChange={(e) =>
              setTemplateId(e.target.value)
            }
            className={inputClass}
          >
            <option
              value=""
              disabled
            >
              {templatesLoading
                ? "Loading templates..."
                : "Select a template"}
            </option>

            {templates?.map((template) => (
              <option
                key={template.id}
                value={template.id}
              >
                {template.name}
              </option>
            ))}
          </select>
        </div>

        {/* =================================================
            PARTIES
        ================================================= */}

        <div>
          <div className="mb-3">
            <p className="text-[11px] font-semibold text-[#181a20]">
              Parties
            </p>

            <p className="mt-0.5 text-[10px] text-[#92959b]">
              Define the organizations involved in this agreement.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass}>
                Our company name
              </label>

              <input
                required
                value={ourCompanyName}
                onChange={(e) =>
                  setOurCompanyName(e.target.value)
                }
                className={inputClass}
                placeholder="Clause Inc."
              />
            </div>

            <div>
              <label className={labelClass}>
                Customer name
              </label>

              <input
                required
                value={customerName}
                onChange={(e) =>
                  setCustomerName(e.target.value)
                }
                className={inputClass}
                placeholder="Acme Corp"
              />
            </div>
          </div>
        </div>

        {/* =================================================
            COMMERCIAL TERMS
        ================================================= */}

        <div>
          <div className="mb-3">
            <p className="text-[11px] font-semibold text-[#181a20]">
              Commercial Terms
            </p>

            <p className="mt-0.5 text-[10px] text-[#92959b]">
              Set the contract value, currency, and duration.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className={labelClass}>
                Contract value
              </label>

              <input
                type="number"
                value={value}
                onChange={(e) =>
                  setValue(e.target.value)
                }
                className={inputClass}
                placeholder="75000"
              />
            </div>

            <div>
              <label className={labelClass}>
                Currency
              </label>

              <input
                value={currency}
                onChange={(e) =>
                  setCurrency(e.target.value)
                }
                className={inputClass}
                placeholder="USD"
              />
            </div>

            <div>
              <label className={labelClass}>
                Duration
              </label>

              <div className="relative">
                <input
                  type="number"
                  min="1"
                  value={durationMonths}
                  onChange={(e) =>
                    setDurationMonths(e.target.value)
                  }
                  className={`${inputClass} pr-16`}
                />

                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#999ca2]">
                  months
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            GOVERNING LAW
        ================================================= */}

        <div>
          <label className={labelClass}>
            Jurisdiction / Governing Law
          </label>

          <input
            required
            value={jurisdiction}
            onChange={(e) =>
              setJurisdiction(e.target.value)
            }
            className={inputClass}
            placeholder="Delaware, USA"
          />
        </div>

        {/* =================================================
            AI INSTRUCTIONS
        ================================================= */}

        <div>
          <div className="mb-2 flex items-center gap-2">
            <Sparkles
              size={13}
              strokeWidth={1.7}
              className="text-[#2f9076]"
            />

            <label className="text-[11px] font-medium text-[#5f636b]">
              Additional instructions
            </label>

            <span className="text-[10px] text-[#a0a3a9]">
              Optional
            </span>
          </div>

          <textarea
            value={additionalInstructions}
            onChange={(e) =>
              setAdditionalInstructions(e.target.value)
            }
            className={`${inputClass} min-h-[110px] resize-y`}
            rows={4}
            placeholder="Example: Include a 30-day termination notice and standard confidentiality obligations."
          />

          <p className="mt-1.5 text-[10px] leading-4 text-[#989ba1]">
            These instructions help tailor the generated draft without changing the selected template.
          </p>
        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {generate.isError && (
          <div className="rounded-lg border border-[#efd0d0] bg-[#fff6f6] px-4 py-3">
            <p className="text-[11px] font-medium text-[#c94b4b]">
              Something went wrong while generating the draft. Please try again.
            </p>
          </div>
        )}
      </div>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <div className="flex items-center justify-between border-t border-[#ececec] bg-[#fafafa] px-6 py-4">
        <p className="hidden text-[10px] text-[#999ca2] sm:block">
          The generated draft will be added to your contract workspace.
        </p>

        <button
          type="submit"
          disabled={
            generate.isPending ||
            !templateId
          }
          className="ml-auto inline-flex h-10 min-w-[150px] items-center justify-center gap-2 rounded-lg bg-[#191c24] px-5 text-[12px] font-medium text-white transition-colors hover:bg-[#292d36] disabled:cursor-not-allowed disabled:bg-[#d7d8da] disabled:text-[#95989e]"
        >
          {generate.isPending ? (
            <>
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />

              Generating...
            </>
          ) : (
            <>
              <Sparkles
                size={13}
                strokeWidth={1.8}
              />

              Generate Draft
            </>
          )}
        </button>
      </div>
    </form>
  );
}