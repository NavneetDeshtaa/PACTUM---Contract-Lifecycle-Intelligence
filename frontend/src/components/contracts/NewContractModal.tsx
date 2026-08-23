import {
  FilePlus2,
  Upload,
  X,
  ArrowRight,
} from "lucide-react";

interface NewContractModalProps {
  open: boolean;
  onClose: () => void;
  onCreateFromTemplate: () => void;
  onUploadExisting: () => void;
}

export default function NewContractModal({
  open,
  onClose,
  onCreateFromTemplate,
  onUploadExisting,
}: NewContractModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 px-4 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-contract-title"
        className="
          w-full max-w-[500px]
          overflow-hidden
          rounded-2xl
          border border-[#E5E8E6]
          bg-white
          shadow-[0_24px_80px_-30px_rgba(0,0,0,0.30)]
        "
      >
        {/* HEADER */}

        <div className="flex items-start justify-between px-6 pb-4 pt-6">
          <div>
            <h2
              id="new-contract-title"
              className="text-[19px] font-semibold tracking-[-0.025em] text-[#181A1F]"
            >
              New Contract
            </h2>

            <p className="mt-1 text-[12px] text-[#818783]">
              Choose how you want to add a contract.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              flex h-8 w-8 items-center justify-center
              rounded-lg text-[#858B87]
              transition-colors
              hover:bg-[#F4F6F5]
              hover:text-[#181A1F]
            "
            aria-label="Close"
          >
            <X size={17} strokeWidth={1.7} />
          </button>
        </div>

        {/* OPTIONS */}

        <div className="space-y-2.5 px-6 pb-6 pt-2">

          {/* CREATE FROM TEMPLATE */}

          <button
            type="button"
            onClick={onCreateFromTemplate}
            className="
              group flex w-full items-center gap-4
              rounded-xl border border-[#E5E8E6]
              px-4 py-4 text-left
              transition-all
              hover:border-[#CBD3CF]
              hover:bg-[#FAFBFA]
            "
          >
            <div
              className="
                flex h-10 w-10 shrink-0 items-center justify-center
                rounded-lg bg-[#EEF5F2]
                text-[#184C40]
              "
            >
              <FilePlus2 size={18} strokeWidth={1.7} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-[#181A1F]">
                Create from template
              </p>

              <p className="mt-1 text-[11px] leading-4 text-[#858B87]">
                Generate a new contract using one of your templates.
              </p>
            </div>

            <ArrowRight
              size={16}
              strokeWidth={1.7}
              className="
                shrink-0 text-[#A1A6A3]
                transition-transform
                group-hover:translate-x-0.5
                group-hover:text-[#181A1F]
              "
            />
          </button>

          {/* UPLOAD */}

          <button
            type="button"
            onClick={onUploadExisting}
            className="
              group flex w-full items-center gap-4
              rounded-xl border border-[#E5E8E6]
              px-4 py-4 text-left
              transition-all
              hover:border-[#CBD3CF]
              hover:bg-[#FAFBFA]
            "
          >
            <div
              className="
                flex h-10 w-10 shrink-0 items-center justify-center
                rounded-lg bg-[#F3F4F3]
                text-[#626965]
              "
            >
              <Upload size={18} strokeWidth={1.7} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-[#181A1F]">
                Upload existing contract
              </p>

              <p className="mt-1 text-[11px] leading-4 text-[#858B87]">
                Import a PDF, DOC or DOCX contract you already have.
              </p>
            </div>

            <ArrowRight
              size={16}
              strokeWidth={1.7}
              className="
                shrink-0 text-[#A1A6A3]
                transition-transform
                group-hover:translate-x-0.5
                group-hover:text-[#181A1F]
              "
            />
          </button>
        </div>
      </div>
    </div>
  );
}