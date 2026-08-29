import { useNavigate } from "react-router-dom";

import {
  Lightbulb,
  FileSearch,
  ListChecks,
  ThumbsUp,
  PenLine,
  CheckSquare2,
  Search,
  Settings,
  Sparkles,
} from "lucide-react";

import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";
import RedlineHero from "../components/landing/RedlineHero";

/* ============================================================
   FEATURES
============================================================ */

const featureGroups = [
  {
    number: "01",
    eyebrow: "REPOSITORY",
    title: "Every contract, understood from the moment it lands.",
    description:
      "Upload contracts in any format and let Pactum automatically extract parties, dates, values, clauses, renewal terms, and other critical metadata into one searchable workspace.",
    items: ["AI Contract Repository", "Automatic Data Extraction"],
  },
  {
    number: "02",
    eyebrow: "INTELLIGENCE",
    title: "Ask your contracts questions in plain English.",
    description:
      'Forget keyword hunting. Ask questions like "Which agreements expire next month?" or "Show contracts with unlimited liability." PACTUM finds the answer and cites the source.',
    items: ["Natural Language Search", "AI Summarization"],
  },
  {
    number: "03",
    eyebrow: "RISK",
    title: "See what could become a problem before it does.",
    description:
      "AI analyzes clauses, identifies unusual terms, missing protections, and policy deviations, then explains the potential business impact in plain English.",
    items: ["Risk & Clause Analysis", "AI Risk Insights"],
  },
  {
    number: "04",
    eyebrow: "WORKFLOW",
    title: "Move contracts forward without the email chain.",
    description:
      "Generate contracts from templates, route them through configurable approval stages, and keep every decision and version in one place.",
    items: ["Contract Drafting", "Approval Workflows"],
  },
  {
    number: "05",
    eyebrow: "LIFECYCLE",
    title: "Know what changed, what matters, and what's next.",
    description:
      "Compare versions, understand redlines, monitor obligations, and receive timely visibility into upcoming renewals and deadlines.",
    items: ["Version Comparison", "Renewal & Obligation Tracking"],
  },
];

/* ============================================================
   LANDING PAGE
============================================================ */

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-body text-ink">
      <Navbar />

      {/* Navbar = 72px */}
      <main className="pt-[72px]">

        {/* =====================================================
            HERO
        ===================================================== */}

        <section
          id="product"
          className="relative scroll-mt-[72px] bg-white"
        >
          <div className="mx-auto max-w-7xl px-6 pb-16 pt-7 sm:pb-20 sm:pt-9 md:pb-24 md:pt-10">
            <div className="mx-auto w-full max-w-6xl text-center">
              <p className="mb-5 text-sm font-medium tracking-wide text-brand md:text-base">
                AI-Native Contract Intelligence
              </p>

              <h1 className="mx-auto w-full font-body text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-ink sm:text-6xl md:text-7xl lg:text-[84px]">
                Turn every contract into
                <br />

                <span className="font-editorial font-normal text-brand">
                  business intelligence.
                </span>
              </h1>

              <div className="mx-auto mt-7 w-full max-w-3xl">
                <p className="text-center text-base leading-relaxed text-ink-soft md:text-lg">
                  PACTUM reads, understands, analyzes, and manages your
                  contracts — from first draft to final renewal. One intelligent
                  layer across the entire contract lifecycle.
                </p>
              </div>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-md sm:w-auto"
                >
                  Get Started

                  <span className="text-lg leading-none transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </button>

                <a
                  href="#how-it-works"
                  className="inline-flex w-full items-center justify-center gap-3 rounded-full border border-ink/20 px-7 py-3.5 text-sm font-medium transition-colors hover:border-ink/40 sm:w-auto"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full border border-ink/30 text-[9px]">
                    ▶
                  </span>

                  See how it works
                </a>
              </div>
            </div>

            <div className="mt-12 sm:mt-14 md:mt-16">
              <RedlineHero />
            </div>
          </div>
        </section>

        {/* =====================================================
            TRUST
        ===================================================== */}

        <section className="border-y border-border bg-white">
          <div className="mx-auto max-w-7xl px-6 py-14 md:py-16">
            <div className="grid items-center gap-10 md:grid-cols-3 md:gap-6">

              <div className="md:col-span-2">
                <p className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-ink-muted">
                  Contract intelligence, without the manual work
                </p>

                <h2 className="max-w-3xl text-3xl font-semibold leading-[1.05] tracking-[-0.04em] md:text-4xl lg:text-[46px]">
                  Your contracts already contain the answers.

                  <span className="text-ink-muted">
                    {" "}
                    PACTUM makes them accessible.
                  </span>
                </h2>
              </div>

              <div className="md:border-l md:border-border md:pl-8">
                <p className="text-sm leading-relaxed text-ink-soft">
                  Stop searching through hundreds of PDFs, chasing approvals
                  over email, and discovering renewal dates too late.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            AI PRODUCT PREVIEW
        ===================================================== */}

        <section className="bg-white py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">

              <div className="lg:col-span-5">
                <p className="mb-5 font-mono text-xs uppercase tracking-[0.18em] text-brand">
                  AI Contract Understanding
                </p>

                <h2 className="text-4xl font-semibold leading-[1.02] tracking-[-0.045em] md:text-5xl">
                  Don't just store contracts.
                  <br />

                  <span className="font-editorial font-normal text-brand">
                    Understand them.
                  </span>
                </h2>

                <p className="mt-6 max-w-lg text-base leading-relaxed text-ink-soft">
                  PACTUM turns unstructured agreements into structured,
                  searchable intelligence. Every important field, clause,
                  obligation, and risk becomes accessible to your team.
                </p>

                <div className="mt-7 flex flex-wrap gap-2">
                  {[
                    "Parties",
                    "Contract Value",
                    "Renewal Date",
                    "Clauses",
                    "Obligations",
                    "Governing Law",
                  ].map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium text-ink-soft"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* PRODUCT MOCKUP */}

              <div className="lg:col-span-7">
                <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-card">

                  <div className="flex h-12 items-center justify-between border-b border-border px-5">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-danger" />
                      <span className="h-2 w-2 rounded-full bg-warning" />
                      <span className="h-2 w-2 rounded-full bg-success" />
                    </div>

                    <div className="font-mono text-[11px] text-ink-muted">
                      PACTUM / CONTRACT
                    </div>
                  </div>

                  <div className="p-6 md:p-8">
                    <div className="mb-8 flex items-start justify-between gap-4">

                      <div>
                        <p className="mb-2 text-xs text-ink-muted">
                          MASTER SERVICE AGREEMENT
                        </p>

                        <h3 className="text-xl font-semibold tracking-tight md:text-2xl">
                          Acme Corporation
                        </h3>
                      </div>

                      <span className="shrink-0 rounded-full bg-success-soft px-2.5 py-1 text-[11px] font-semibold text-success">
                        Active
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-b border-border pb-7 md:grid-cols-4">

                      <div>
                        <p className="mb-1 text-[11px] text-ink-muted">
                          CONTRACT VALUE
                        </p>

                        <p className="font-semibold">$2.4M</p>
                      </div>

                      <div>
                        <p className="mb-1 text-[11px] text-ink-muted">
                          EFFECTIVE
                        </p>

                        <p className="font-semibold">Jan 12, 2026</p>
                      </div>

                      <div>
                        <p className="mb-1 text-[11px] text-ink-muted">
                          RENEWAL
                        </p>

                        <p className="font-semibold">Jan 12, 2027</p>
                      </div>

                      <div>
                        <p className="mb-1 text-[11px] text-ink-muted">
                          GOVERNING LAW
                        </p>

                        <p className="font-semibold">California</p>
                      </div>
                    </div>

                    <div className="mt-7 grid gap-7 md:grid-cols-2">

                      <div>
                        <div className="mb-4 flex items-center justify-between">
                          <p className="text-xs font-semibold uppercase tracking-wider">
                            AI Risk Analysis
                          </p>

                          <span className="font-mono text-[10px] text-ai">
                            AI ANALYZED
                          </span>
                        </div>

                        <div className="space-y-2.5">

                          <div className="flex items-center justify-between rounded-lg bg-danger-soft p-3">
                            <span className="text-xs font-medium">
                              Unlimited liability
                            </span>

                            <span className="text-[10px] font-semibold text-danger">
                              HIGH RISK
                            </span>
                          </div>

                          <div className="flex items-center justify-between rounded-lg bg-warning-soft p-3">
                            <span className="text-xs font-medium">
                              Auto-renewal
                            </span>

                            <span className="text-[10px] font-semibold text-warning">
                              REVIEW
                            </span>
                          </div>

                          <div className="flex items-center justify-between rounded-lg bg-success-soft p-3">
                            <span className="text-xs font-medium">
                              Governing law
                            </span>

                            <span className="text-[10px] font-semibold text-success">
                              FOUND
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="mb-4 text-xs font-semibold uppercase tracking-wider">
                          AI Summary
                        </p>

                        <div className="rounded-lg border border-ai/10 bg-ai-soft p-4">

                          <div className="flex gap-2">
                            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-ai" />

                            <p className="text-xs leading-relaxed text-ink-soft">
                              This agreement contains a broad liability
                              provision that may expose the company to uncapped
                              damages. Consider reviewing the limitation
                              language before approval.
                            </p>
                          </div>

                          <button
                            type="button"
                            className="mt-4 text-[11px] font-semibold text-ai transition-colors hover:text-ai-dark"
                          >
                            View source clause →
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            COMPACT CONTRACT LIFECYCLE
        ===================================================== */}

        <section
          id="how-it-works"
          className="relative scroll-mt-[72px] overflow-hidden bg-white py-14 md:py-16 lg:py-16"
        >
          <div className="mx-auto max-w-[1400px] px-6">

            {/* =================================================
                HEADING
            ================================================= */}

            <div className="mx-auto mb-8 max-w-3xl text-center md:mb-10">

              <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-brand">
                One intelligent lifecycle
              </p>

              <h2 className="text-3xl font-semibold leading-[1] tracking-[-0.045em] text-ink md:text-4xl lg:text-[46px]">
                Every stage connected.
                <br />

                <span className="font-editorial font-normal text-brand">
                  One intelligent system.
                </span>
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-ink-soft">
                PACTUM brings creation, review, approvals, execution,
                obligations, analytics, and optimization into one continuous
                contract lifecycle.
              </p>
            </div>

            {/* =================================================
                DESKTOP COMPACT LOOP
            ================================================= */}

            <div className="relative mx-auto hidden h-[455px] max-w-[1080px] lg:block">

              {/* =================================================
                  CONNECTING LINES
              ================================================= */}

              <svg
                className="pointer-events-none absolute inset-0 h-full w-full"
                viewBox="0 0 1080 455"
                fill="none"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <defs>
                  <marker
                    id="lifecycleArrowCompact"
                    markerWidth="7"
                    markerHeight="7"
                    refX="5.5"
                    refY="3.5"
                    orient="auto"
                  >
                    <path
                      d="M0 0L7 3.5L0 7"
                      fill="none"
                      stroke="#D9AE78"
                      strokeWidth="1.4"
                    />
                  </marker>
                </defs>

                {/* Create -> Research */}

                <path
                  d="M85 215
                     C85 145 125 80 230 72"
                  stroke="#D9AE78"
                  strokeWidth="1.5"
                  markerEnd="url(#lifecycleArrowCompact)"
                />

                {/* Research -> Review */}

                <path
                  d="M285 72 L475 72"
                  stroke="#D9AE78"
                  strokeWidth="1.5"
                  markerEnd="url(#lifecycleArrowCompact)"
                />

                {/* Review -> Approve */}

                <path
                  d="M595 72 L785 72"
                  stroke="#D9AE78"
                  strokeWidth="1.5"
                  markerEnd="url(#lifecycleArrowCompact)"
                />

                {/* Approve -> Execute */}

                <path
                  d="M845 72
                     C955 78 995 140 995 215"
                  stroke="#D9AE78"
                  strokeWidth="1.5"
                  markerEnd="url(#lifecycleArrowCompact)"
                />

                {/* Execute -> Fulfill */}

                <path
                  d="M995 255
                     C995 330 955 375 855 382"
                  stroke="#D9AE78"
                  strokeWidth="1.5"
                  markerEnd="url(#lifecycleArrowCompact)"
                />

                {/* Fulfill -> Analyze */}

                <path
                  d="M795 382 L600 382"
                  stroke="#D9AE78"
                  strokeWidth="1.5"
                  markerEnd="url(#lifecycleArrowCompact)"
                />

                {/* Analyze -> Optimize */}

                <path
                  d="M480 382 L285 382"
                  stroke="#D9AE78"
                  strokeWidth="1.5"
                  markerEnd="url(#lifecycleArrowCompact)"
                />

                {/* Optimize -> Create */}

                <path
                  d="M225 382
                     C125 375 85 325 85 260"
                  stroke="#D9AE78"
                  strokeWidth="1.5"
                  markerEnd="url(#lifecycleArrowCompact)"
                />
              </svg>

              {/* =================================================
                  CREATE
              ================================================= */}

              <LifecycleStage
                className="absolute left-0 top-[42%]"
                label="CREATE"
                icon={<Lightbulb size={25} strokeWidth={1.6} />}
                color="text-[#F26944]"
                labelPosition="right"
              />

              {/* =================================================
                  RESEARCH
              ================================================= */}

              <LifecycleStage
                className="absolute left-[18%] top-0"
                label="RESEARCH"
                icon={<FileSearch size={25} strokeWidth={1.6} />}
                color="text-ai"
              />

              {/* =================================================
                  REVIEW
              ================================================= */}

              <LifecycleStage
                className="absolute left-1/2 top-0 -translate-x-1/2"
                label="REVIEW"
                icon={<ListChecks size={26} strokeWidth={1.6} />}
                color="text-ai"
              />

              {/* =================================================
                  APPROVE
              ================================================= */}

              <LifecycleStage
                className="absolute right-[18%] top-0"
                label="APPROVE"
                icon={<ThumbsUp size={25} strokeWidth={1.6} />}
                color="text-ai"
              />

              {/* =================================================
                  EXECUTE
              ================================================= */}

              <LifecycleStage
                className="absolute right-0 top-[42%]"
                label="EXECUTE"
                icon={<PenLine size={25} strokeWidth={1.6} />}
                color="text-[#F26944]"
                labelPosition="left"
              />

              {/* =================================================
                  FULFILL
              ================================================= */}

              <LifecycleStage
                className="absolute bottom-0 right-[18%]"
                label="FULFILL"
                icon={<CheckSquare2 size={25} strokeWidth={1.6} />}
                color="text-brand"
                bottom
              />

              {/* =================================================
                  ANALYZE
              ================================================= */}

              <LifecycleStage
                className="absolute bottom-0 left-1/2 -translate-x-1/2"
                label="ANALYZE"
                icon={<Search size={25} strokeWidth={1.6} />}
                color="text-brand"
                bottom
              />

              {/* =================================================
                  OPTIMIZE
              ================================================= */}

              <LifecycleStage
                className="absolute bottom-0 left-[18%]"
                label="OPTIMIZE"
                icon={<Settings size={25} strokeWidth={1.6} />}
                color="text-brand"
                bottom
              />

              {/* =================================================
                  CENTER AI
              ================================================= */}

              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="group flex items-center gap-3 rounded-full bg-[#F3F3F1] px-7 py-4 transition-all duration-300 hover:bg-[#ECECE9] hover:shadow-soft">

                  <Sparkles
                    size={28}
                    strokeWidth={1.7}
                    className="text-ink"
                  />

                  <span className="whitespace-nowrap text-[22px] font-semibold tracking-[-0.035em] text-ink">
                    PACTUM AI
                  </span>
                </div>
              </div>
            </div>

            {/* =================================================
                TABLET / MOBILE
            ================================================= */}

            <div className="mx-auto grid max-w-3xl grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 lg:hidden">

              <MobileLifecycleStage
                label="CREATE"
                icon={<Lightbulb size={23} strokeWidth={1.6} />}
                color="text-[#F26944]"
              />

              <MobileLifecycleStage
                label="RESEARCH"
                icon={<FileSearch size={23} strokeWidth={1.6} />}
                color="text-ai"
              />

              <MobileLifecycleStage
                label="REVIEW"
                icon={<ListChecks size={23} strokeWidth={1.6} />}
                color="text-ai"
              />

              <MobileLifecycleStage
                label="APPROVE"
                icon={<ThumbsUp size={23} strokeWidth={1.6} />}
                color="text-ai"
              />

              <MobileLifecycleStage
                label="EXECUTE"
                icon={<PenLine size={23} strokeWidth={1.6} />}
                color="text-[#F26944]"
              />

              <MobileLifecycleStage
                label="FULFILL"
                icon={<CheckSquare2 size={23} strokeWidth={1.6} />}
                color="text-brand"
              />

              <MobileLifecycleStage
                label="ANALYZE"
                icon={<Search size={23} strokeWidth={1.6} />}
                color="text-brand"
              />

              <MobileLifecycleStage
                label="OPTIMIZE"
                icon={<Settings size={23} strokeWidth={1.6} />}
                color="text-brand"
              />
            </div>

            {/* Mobile AI */}

            <div className="mt-10 flex justify-center lg:hidden">
              <div className="inline-flex items-center gap-3 rounded-full bg-[#F3F3F1] px-6 py-3.5">
                <Sparkles size={21} strokeWidth={1.7} />

                <span className="text-sm font-semibold tracking-[-0.025em]">
                  PACTUM AI
                </span>
              </div>
            </div>

            {/* CTA */}

            <div className="mt-10 flex justify-center lg:mt-3">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="group inline-flex items-center gap-3 rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              >
                Explore PACTUM

                <span className="text-lg leading-none transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* =====================================================
            FEATURES
        ===================================================== */}

        <section
          id="features"
          className="scroll-mt-[72px] border-t border-border bg-white py-24 md:py-32"
        >
          <div className="mx-auto max-w-7xl px-6">

            <div className="mb-16 max-w-3xl">
              <p className="mb-5 font-mono text-xs uppercase tracking-[0.18em] text-brand">
                Built for the entire contract lifecycle
              </p>

              <h2 className="text-4xl font-semibold leading-[1] tracking-[-0.045em] md:text-5xl lg:text-6xl">
                One workspace.
                <br />

                <span className="font-editorial font-normal text-brand">
                  Every contract.
                </span>
              </h2>
            </div>

            <div className="divide-y divide-border border-y border-border">

              {featureGroups.map((group) => (
                <div
                  key={group.number}
                  className="group grid gap-8 py-12 md:py-16 lg:grid-cols-12 lg:gap-16"
                >
                  <div className="lg:col-span-2">
                    <span className="font-mono text-xs text-ink-muted">
                      {group.number}
                    </span>

                    <p className="mt-3 text-[11px] font-semibold tracking-[0.18em] text-brand">
                      {group.eyebrow}
                    </p>
                  </div>

                  <div className="lg:col-span-5">
                    <h3 className="text-2xl font-semibold leading-tight tracking-[-0.035em] transition-colors duration-300 group-hover:text-brand md:text-3xl">
                      {group.title}
                    </h3>
                  </div>

                  <div className="lg:col-span-5">
                    <p className="text-sm leading-relaxed text-ink-soft md:text-base">
                      {group.description}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            ANALYTICS
        ===================================================== */}

        <section className="bg-white py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-6">

            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">

              <div>
                <p className="mb-5 font-mono text-xs uppercase tracking-[0.18em] text-brand">
                  Portfolio Intelligence
                </p>

                <h2 className="text-4xl font-semibold leading-[1.02] tracking-[-0.045em] md:text-5xl">
                  See your entire contract portfolio at a glance.
                </h2>

                <p className="mt-6 max-w-lg leading-relaxed text-ink-soft">
                  Move beyond individual contracts. Understand contract
                  volume, financial exposure, upcoming expirations, approval
                  bottlenecks, and AI-detected risks across your organization.
                </p>

                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand transition-colors hover:text-brand-dark"
                >
                  Explore PACTUM →
                </button>
              </div>

              <div className="rounded-2xl border border-border bg-white p-6 shadow-soft md:p-8">

                <div className="mb-8 flex items-center justify-between">

                  <div>
                    <p className="text-xs uppercase tracking-wider text-ink-muted">
                      Contract Portfolio
                    </p>

                    <p className="mt-1 text-2xl font-semibold">
                      $48.6M
                    </p>
                  </div>

                  <span className="rounded-full bg-success-soft px-2.5 py-1 text-xs font-semibold text-success">
                    +12.4%
                  </span>
                </div>

                <div className="flex h-40 items-end gap-3">

                  {[
                    38,
                    55,
                    46,
                    72,
                    64,
                    82,
                    68,
                    92,
                    76,
                    100,
                    84,
                    96,
                  ].map((height, index) => (
                    <div
                      key={index}
                      className="flex h-full flex-1 items-end"
                    >
                      <div
                        className="w-full rounded-t-sm bg-brand/15 transition-colors hover:bg-brand/40"
                        style={{
                          height: `${height}%`,
                        }}
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-7 grid grid-cols-3 gap-4 border-t border-border pt-6">

                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-ink-muted">
                      Active
                    </p>

                    <p className="mt-1 text-lg font-semibold">
                      1,284
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-ink-muted">
                      Renewing
                    </p>

                    <p className="mt-1 text-lg font-semibold">
                      42
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-ink-muted">
                      At Risk
                    </p>

                    <p className="mt-1 text-lg font-semibold text-danger">
                      18
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            FINAL CTA
        ===================================================== */}

        <section className="bg-ink text-paper">
          <div className="mx-auto max-w-5xl px-6 py-24 text-center md:py-32">

            <p className="mb-6 font-mono text-xs uppercase tracking-[0.18em] text-brand">
              Contract intelligence starts here
            </p>

            <h2 className="text-4xl font-semibold leading-[0.98] tracking-[-0.05em] md:text-6xl lg:text-7xl">
              Stop managing contracts.
              <br />

              <span className="font-editorial font-normal text-brand">
                Start understanding them.
              </span>
            </h2>

            <p className="mx-auto mt-7 max-w-xl leading-relaxed text-paper/60">
              Bring your contracts, workflows, and legal intelligence into one
              place.
            </p>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="group mt-9 inline-flex items-center gap-3 rounded-full bg-brand px-8 py-4 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-brand-dark"
            >
              Get Started

              <span className="text-lg transition-transform group-hover:translate-x-1">
                →
              </span>
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

/* ============================================================
   DESKTOP LIFECYCLE STAGE
============================================================ */

type LifecycleStageProps = {
  label: string;
  icon: React.ReactNode;
  color: string;
  className?: string;
  labelPosition?: "top" | "left" | "right";
  bottom?: boolean;
};

function LifecycleStage({
  label,
  icon,
  color,
  className = "",
  labelPosition = "top",
  bottom = false,
}: LifecycleStageProps) {

  if (labelPosition === "right") {
    return (
      <div className={`flex items-center gap-4 ${className}`}>

        <div
          className={[
            "flex h-[68px] w-[68px] items-center justify-center rounded-full",
            "bg-[#F3F3F1]",
            "transition-all duration-300",
            "hover:-translate-y-1 hover:shadow-soft",
            color,
          ].join(" ")}
        >
          {icon}
        </div>

        <p className="font-mono text-[14px] font-medium tracking-[0.16em] text-ink">
          {label}
        </p>
      </div>
    );
  }

  if (labelPosition === "left") {
    return (
      <div className={`flex items-center gap-4 ${className}`}>

        <p className="font-mono text-[14px] font-medium tracking-[0.16em] text-ink">
          {label}
        </p>

        <div
          className={[
            "flex h-[68px] w-[68px] items-center justify-center rounded-full",
            "bg-[#F3F3F1]",
            "transition-all duration-300",
            "hover:-translate-y-1 hover:shadow-soft",
            color,
          ].join(" ")}
        >
          {icon}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex w-[125px] flex-col items-center ${className}`}>

      {bottom && (
        <p className="mb-3 font-mono text-[14px] font-medium tracking-[0.16em] text-ink">
          {label}
        </p>
      )}

      <div
        className={[
          "flex h-[68px] w-[68px] items-center justify-center rounded-full",
          "bg-[#F3F3F1]",
          "transition-all duration-300",
          "hover:-translate-y-1 hover:shadow-soft",
          color,
        ].join(" ")}
      >
        {icon}
      </div>

      {!bottom && (
        <p className="mt-3 font-mono text-[14px] font-medium tracking-[0.16em] text-ink">
          {label}
        </p>
      )}
    </div>
  );
}

/* ============================================================
   MOBILE LIFECYCLE
============================================================ */

type MobileLifecycleStageProps = {
  label: string;
  icon: React.ReactNode;
  color: string;
};

function MobileLifecycleStage({
  label,
  icon,
  color,
}: MobileLifecycleStageProps) {
  return (
    <div className="flex flex-col items-center text-center">

      <div
        className={[
          "flex h-14 w-14 items-center justify-center rounded-full",
          "bg-[#F3F3F1]",
          color,
        ].join(" ")}
      >
        {icon}
      </div>

      <p className="mt-3 font-mono text-[10px] font-medium tracking-[0.14em] text-ink">
        {label}
      </p>
    </div>
  );
}