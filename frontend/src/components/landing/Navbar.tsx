import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);

  // =====================================================
  // Scroll navigation
  // =====================================================

  const scrollToSection = (id: string) => {
    setMobileOpen(false);

    // =====================================================
    // Already on landing page
    // =====================================================

    if (location.pathname === "/") {
      const element = document.getElementById(id);

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }

      return;
    }

    // =====================================================
    // Coming from another page
    // =====================================================

    navigate("/", {
      state: {
        scrollTo: id,
      },
    });
  };

  return (
    <nav
      className="
        fixed
        left-0
        right-0
        top-0
        z-[100]
        w-full
        border-b
        border-border
        bg-white/95
        backdrop-blur-xl
      "
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-[72px] items-center justify-between">

          {/* =====================================================
              LOGO
          ===================================================== */}

          <button
            type="button"
            onClick={() => navigate("/")}
            className="group flex shrink-0 items-center gap-3"
            aria-label="Pactum home"
          >
            <span className="relative flex h-8 w-8 items-center justify-center">
              <span className="absolute inset-0 rounded-[9px] bg-brand transition-transform duration-200 group-hover:rotate-3" />

              <span className="relative text-sm font-semibold tracking-tight text-white">
                P
              </span>
            </span>

            <span className="font-body text-[22px] font-semibold tracking-[-0.04em] text-ink">
              PACTUM
            </span>
          </button>

          {/* =====================================================
              DESKTOP NAVIGATION
          ===================================================== */}

          <div className="ml-12 mr-auto hidden items-center gap-9 lg:flex">

            {/* Product */}

            <button
              type="button"
              onClick={() => scrollToSection("product")}
              className="group flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-ink"
            >
              Product

              <span className="text-[10px] text-ink-muted transition-transform duration-200 group-hover:translate-y-0.5">
                ↓
              </span>
            </button>

            {/* Solutions */}

            <button
              type="button"
              onClick={() => scrollToSection("features")}
              className="group flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-ink"
            >
              Solutions

              <span className="text-[10px] text-ink-muted transition-transform duration-200 group-hover:translate-y-0.5">
                ↓
              </span>
            </button>

            {/* How it works */}

            <button
              type="button"
              onClick={() => scrollToSection("how-it-works")}
              className="text-sm font-medium text-ink-soft transition-colors hover:text-ink"
            >
              How it works
            </button>

            {/* Features */}

            <button
              type="button"
              onClick={() => scrollToSection("features")}
              className="text-sm font-medium text-ink-soft transition-colors hover:text-ink"
            >
              Features
            </button>
          </div>

          {/* =====================================================
              DESKTOP ACTIONS
          ===================================================== */}

          <div className="hidden items-center gap-3 md:flex">

            {/* Login */}

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:text-brand"
            >
              Log in
            </button>

            {/* Get Started */}

            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="group inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-dark"
            >
              Get Started

              <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                →
              </span>
            </button>
          </div>

          {/* =====================================================
              MOBILE MENU BUTTON
          ===================================================== */}

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border transition-colors hover:bg-white md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            <div className="flex w-4 flex-col gap-1.5">
              <span
                className={`block h-px bg-ink transition-transform duration-200 ${
                  mobileOpen ? "translate-y-[4px] rotate-45" : ""
                }`}
              />

              <span
                className={`block h-px bg-ink transition-opacity duration-200 ${
                  mobileOpen ? "opacity-0" : ""
                }`}
              />

              <span
                className={`block h-px bg-ink transition-transform duration-200 ${
                  mobileOpen ? "-translate-y-[4px] -rotate-45" : ""
                }`}
              />
            </div>
          </button>
        </div>

        {/* =====================================================
            MOBILE NAVIGATION
        ===================================================== */}

        <div
          className={`overflow-hidden transition-all duration-300 md:hidden ${
            mobileOpen
              ? "max-h-[500px] pb-6 opacity-100"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="border-t border-border pt-3">
            <div className="flex flex-col">

              {/* Product */}

              <button
                type="button"
                onClick={() => scrollToSection("product")}
                className="flex items-center justify-between py-3.5 text-left text-sm font-medium text-ink"
              >
                Product

                <span className="text-ink-muted">→</span>
              </button>

              {/* Solutions */}

              <button
                type="button"
                onClick={() => scrollToSection("features")}
                className="flex items-center justify-between py-3.5 text-left text-sm font-medium text-ink"
              >
                Solutions

                <span className="text-ink-muted">→</span>
              </button>

              {/* How it works */}

              <button
                type="button"
                onClick={() => scrollToSection("how-it-works")}
                className="flex items-center justify-between py-3.5 text-left text-sm font-medium text-ink"
              >
                How it works

                <span className="text-ink-muted">→</span>
              </button>

              {/* Features */}

              <button
                type="button"
                onClick={() => scrollToSection("features")}
                className="flex items-center justify-between py-3.5 text-left text-sm font-medium text-ink"
              >
                Features

                <span className="text-ink-muted">→</span>
              </button>
            </div>

            {/* =================================================
                MOBILE ACTIONS
            ================================================= */}

            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-5">

              {/* Login */}

              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  navigate("/login");
                }}
                className="rounded-full border border-border py-3 text-sm font-semibold transition-colors hover:border-ink/30"
              >
                Log in
              </button>

              {/* Get Started */}

              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  navigate("/signup");
                }}
                className="rounded-full bg-brand py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}