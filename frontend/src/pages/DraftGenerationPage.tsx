import DraftGenerationForm from "../components/drafts/DraftGenerationForm";

export default function DraftGenerationPage() {


  return (
    <main className="min-h-full bg-white px-6 py-7 sm:px-8 lg:px-10">
      <div className="mx-auto w-full max-w-[1180px]">

        {/* =====================================================
            CONTENT
        ===================================================== */}

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
          {/* =================================================
              FORM
          ================================================= */}

          <section className="min-w-0">
            <DraftGenerationForm />
          </section>

          {/* =================================================
              SIDE INFO
          ================================================= */}

          <aside className="hidden lg:block">
            <div className="sticky top-6 space-y-4">
              <div className="rounded-xl border border-[#e5e5e5] bg-[#fafafa] p-4">
                <p className="text-[11px] font-semibold text-[#181a20]">
                  How drafting works
                </p>

                <div className="mt-4 space-y-4">
                  <Step
                    number="1"
                    title="Choose a template"
                    description="Select the agreement type you want to generate."
                  />

                  <Step
                    number="2"
                    title="Add business details"
                    description="Provide parties, value, duration, and governing law."
                  />

                  <Step
                    number="3"
                    title="Generate with AI"
                    description="Clause creates a first draft using your template and instructions."
                  />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

/* ============================================================
   SIDE STEP
============================================================ */

type StepProps = {
  number: string;
  title: string;
  description: string;
};

function Step({
  number,
  title,
  description,
}: StepProps) {
  return (
    <div className="flex gap-3">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#dedede] bg-white text-[10px] font-semibold text-[#5f636b]">
        {number}
      </div>

      <div>
        <p className="text-[11px] font-semibold text-[#181a20]">
          {title}
        </p>

        <p className="mt-0.5 text-[10px] leading-4 text-[#85888f]">
          {description}
        </p>
      </div>
    </div>
  );
}