import { useState } from "react";

import {
  FileText,
  BarChart3,
  ClipboardCheck,
  Workflow,
  Settings,
  LogOut,
  Menu,
  X,
  Star,
  CalendarCheck,
  CheckCircle2,
  Sparkles,
  Plus,
} from "lucide-react";

import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import NotificationBell from "../components/notifications/NotificationBell";
import { tokenStorage } from "../lib/tokenStorage";

/* ============================================================
   GLOBAL NAVIGATION
============================================================ */

const mainNavigation = [
  {
    name: "Contracts",
    path: "/app/contracts",
    section: "contracts",
  },
  {
    name: "Obligations",
    path: "/app/obligations",
    section: "obligations",
  },
  {
    name: "Workflow",
    path: "/app/workflows",
    section: "workflows",
  },
  {
    name: "Insights",
    path: "/app/analytics",
    section: "analytics",
  },
];

/* ============================================================
   CONTRACT SIDEBAR
============================================================ */

const contractNavigation = [
  {
    name: "Starred",
    path: "/app/contracts/starred",
    icon: Star,
    end: true,
  },
  {
    name: "All contracts",
    path: "/app/contracts",
    icon: FileText,
    end: true,
  },
  {
    name: "Active contracts",
    path: "/app/contracts/active",
    icon: CalendarCheck,
    end: true,
  },
  {
    name: "Upcoming deadlines",
    path: "/app/contracts/upcoming",
    icon: CalendarCheck,
    end: true,
  },
  {
    name: "Executed contracts",
    path: "/app/contracts/executed",
    icon: CheckCircle2,
    end: true,
  },
];

/* ============================================================
   OBLIGATION SIDEBAR
============================================================ */

const obligationNavigation = [
  {
    name: "All obligations",
    path: "/app/obligations",
    icon: ClipboardCheck,
    end: true,
  },
  {
    name: "Upcoming",
    path: "/app/obligations/upcoming",
    icon: CalendarCheck,
    end: true,
  },
  {
    name: "Overdue",
    path: "/app/obligations/overdue",
    icon: CheckCircle2,
    end: true,
  },
];

/* ============================================================
   WORKFLOW SIDEBAR
============================================================ */

const workflowNavigation = [
  {
    name: "All workflows",
    path: "/app/workflows",
    icon: Workflow,
    end: true,
  },
  {
    name: "Templates",
    path: "/app/workflows/templates",
    icon: FileText,
    end: true,
  },
  {
    name: "Active workflows",
    path: "/app/workflows/active",
    icon: CheckCircle2,
    end: true,
  },
];

/* ============================================================
   INSIGHTS SIDEBAR
============================================================ */

const insightsNavigation = [
  {
    name: "Overview",
    path: "/app/analytics",
    icon: BarChart3,
    end: true,
  },
  {
    name: "Contract analytics",
    path: "/app/analytics/contracts",
    icon: FileText,
    end: true,
  },
  {
    name: "Risk analytics",
    path: "/app/analytics/risk",
    icon: Sparkles,
    end: true,
  },
];

/* ============================================================
   TYPES
============================================================ */

type NavigationItem = {
  name: string;
  path: string;
  icon: React.ElementType;
  end?: boolean;
};

type ContextSidebarProps = {
  navigation: NavigationItem[];
  handleLogout: () => void;
};

/* ============================================================
   MAIN APP PAGE
============================================================ */

export default function AppPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* ==========================================================
     ACTIVE SECTION
  ========================================================== */

  const getActiveSection = () => {
    const pathname = location.pathname;

    if (pathname.startsWith("/app/obligations")) {
      return "obligations";
    }

    if (pathname.startsWith("/app/workflows")) {
      return "workflows";
    }

    if (pathname.startsWith("/app/analytics")) {
      return "analytics";
    }

    return "contracts";
  };

  const activeSection = getActiveSection();

  /* ==========================================================
     CONTEXTUAL SIDEBAR
  ========================================================== */

  const getSidebarNavigation = (): NavigationItem[] => {
    switch (activeSection) {
      case "obligations":
        return obligationNavigation;

      case "workflows":
        return workflowNavigation;

      case "analytics":
        return insightsNavigation;

      case "contracts":
      default:
        return contractNavigation;
    }
  };

  const sidebarNavigation = getSidebarNavigation();

  /* ==========================================================
     LOGOUT
  ========================================================== */

  const handleLogout = () => {
    tokenStorage.clear();

    setSidebarOpen(false);

    navigate("/login", {
      replace: true,
    });
  };

  const closeMobileSidebar = () => {
    setSidebarOpen(false);
  };

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <div className="h-screen w-full overflow-hidden bg-white text-[#181A1F]">
      <div className="flex h-full w-full flex-col">

        {/* =====================================================
            TOP NAVIGATION
        ===================================================== */}

        <header className="z-40 shrink-0 border-b border-[#E9ECEA] bg-white">
          <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8">

            {/* =================================================
                MOBILE MENU
            ================================================= */}

            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="mr-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#545B57] transition-colors hover:bg-[#F5F6F5] hover:text-[#181A1F] lg:hidden"
              aria-label="Open navigation"
            >
              <Menu size={19} strokeWidth={1.8} />
            </button>

            {/* =================================================
                BRAND
            ================================================= */}

            <button
              type="button"
              onClick={() => navigate("/app/contracts")}
              className="flex w-auto shrink-0 items-center gap-3 lg:w-[220px]"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#184C40] text-sm font-bold text-white">
                P
              </div>

              <div className="hidden text-left sm:block">
                <p className="text-[15px] font-semibold tracking-[-0.025em] text-[#181A1F]">
                  PACTUM
                </p>

                <p className="mt-[1px] text-[8px] font-semibold uppercase tracking-[0.18em] text-[#929995]">
                  Intelligence
                </p>
              </div>
            </button>

            {/* =================================================
                DESKTOP GLOBAL NAV
            ================================================= */}

            <nav className="hidden h-16 items-center gap-8 lg:flex">
              {mainNavigation.map((item) => {
                const isActive = activeSection === item.section;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={[
                      "relative flex h-16 items-center whitespace-nowrap text-[14px] font-medium transition-colors",
                      isActive
                        ? "text-[#181A1F]"
                        : "text-[#707773] hover:text-[#181A1F]",
                    ].join(" ")}
                  >
                    {item.name}

                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#184C40]" />
                    )}
                  </NavLink>
                );
              })}

              {/* ===============================================
                  NOTIFICATION
              =============================================== */}

              <div className="ml-1 flex items-center border-l border-[#E9ECEA] pl-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-[#F5F6F5]">
                  <NotificationBell />
                </div>
              </div>
            </nav>

            {/* =================================================
                MOBILE NOTIFICATION
            ================================================= */}

            <div className="ml-auto lg:hidden">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-[#F5F6F5]">
                <NotificationBell />
              </div>
            </div>
          </div>

          {/* ===================================================
              MOBILE MAIN NAVIGATION
          =================================================== */}

          <div className="flex overflow-x-auto border-t border-[#F0F1F0] px-3 lg:hidden">
            {mainNavigation.map((item) => {
              const isActive = activeSection === item.section;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={[
                    "relative flex h-11 shrink-0 items-center px-4 text-[12px] font-medium",
                    isActive
                      ? "text-[#181A1F]"
                      : "text-[#737A76]",
                  ].join(" ")}
                >
                  {item.name}

                  {isActive && (
                    <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-[#184C40]" />
                  )}
                </NavLink>
              );
            })}
          </div>
        </header>

        {/* =====================================================
            BODY
        ===================================================== */}

        <div className="flex min-h-0 flex-1">

          {/* ===================================================
              DESKTOP SIDEBAR
          =================================================== */}

          <aside className="hidden w-[220px] shrink-0 border-r border-[#E9ECEA] bg-white lg:flex lg:flex-col">
            <ContextSidebar
              navigation={sidebarNavigation}
              handleLogout={handleLogout}
            />
          </aside>

          {/* ===================================================
              MOBILE SIDEBAR
          =================================================== */}

          {sidebarOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">

              {/* BACKDROP */}

              <button
                type="button"
                aria-label="Close navigation"
                onClick={closeMobileSidebar}
                className="absolute inset-0 bg-[#10211D]/20 backdrop-blur-[1px]"
              />

              {/* DRAWER */}

              <aside className="relative z-10 flex h-full w-[270px] flex-col border-r border-[#E7EAE8] bg-white shadow-xl">
                <div className="flex h-16 items-center border-b border-[#E9ECEA] px-5">
                  <button
                    type="button"
                    onClick={() => {
                      navigate("/app/contracts");
                      closeMobileSidebar();
                    }}
                    className="flex items-center gap-3"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#184C40] text-sm font-bold text-white">
                      P
                    </div>

                    <div className="text-left">
                      <p className="text-[15px] font-semibold tracking-[-0.025em] text-[#181A1F]">
                        PACTUM
                      </p>

                      <p className="text-[8px] uppercase tracking-[0.18em] text-[#929995]">
                        Intelligence
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={closeMobileSidebar}
                    className="ml-auto flex h-9 w-9 items-center justify-center rounded-lg text-[#69716D] transition-colors hover:bg-[#F5F6F5] hover:text-[#181A1F]"
                    aria-label="Close sidebar"
                  >
                    <X size={18} />
                  </button>
                </div>

                <ContextSidebar
                  navigation={sidebarNavigation}
                  handleLogout={handleLogout}
                />
              </aside>
            </div>
          )}

          {/* ===================================================
              MAIN CONTENT
          =================================================== */}

          <main className="min-w-0 flex-1 overflow-y-auto bg-white">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   CONTEXT SIDEBAR
============================================================ */

function ContextSidebar({
  navigation,
  handleLogout,
}: ContextSidebarProps) {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-0 flex-1 flex-col px-4 py-6">
      {/* NAVIGATION */}
      <nav className="space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                [
                  "group flex h-11 items-center gap-3 rounded-lg px-3 text-[13px] transition-colors",
                  isActive
                    ? "bg-[#F1F3F2] font-semibold text-[#181A1F]"
                    : "font-medium text-[#626965] hover:bg-[#F7F8F7] hover:text-[#181A1F]",
                ].join(" ")
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={17}
                    strokeWidth={isActive ? 1.9 : 1.7}
                    className={
                      isActive
                        ? "text-[#184C40]"
                        : "text-[#7D8581] group-hover:text-[#4B5450]"
                    }
                  />

                  <span>{item.name}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* ACTIONS */}
      <div className="mt-7 border-t border-[#EDF0EE] pt-6">
        <p className="mb-3 px-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#9AA29E]">
          Actions
        </p>

        <button
          type="button"
          onClick={() => navigate("/app/drafts/new")}
          className="flex h-11 w-full items-center justify-center gap-2.5 rounded-xl bg-[#173D35] px-4 text-[13px] font-semibold text-white transition-all hover:bg-[#205448] active:scale-[0.99]"
        >
          <Plus size={17} strokeWidth={2} />
          <span>New Contract</span>
        </button>
      </div>

      {/* Push bottom navigation to bottom */}
      <div className="flex-1" />

      {/* BOTTOM NAVIGATION */}
      <div className="border-t border-[#ECEEED] pt-4">
        <NavLink
          to="/app/settings"
          className={({ isActive }) =>
            [
              "group flex h-11 items-center gap-3 rounded-lg px-3 text-[13px] transition-colors",
              isActive
                ? "bg-[#F1F3F2] font-semibold text-[#181A1F]"
                : "font-medium text-[#626965] hover:bg-[#F7F8F7] hover:text-[#181A1F]",
            ].join(" ")
          }
        >
          {({ isActive }) => (
            <>
              <Settings
                size={17}
                strokeWidth={isActive ? 1.9 : 1.7}
                className={
                  isActive
                    ? "text-[#184C40]"
                    : "text-[#7D8581] group-hover:text-[#4B5450]"
                }
              />

              <span>Settings</span>
            </>
          )}
        </NavLink>

        <button
          type="button"
          onClick={handleLogout}
          className="group mt-1 flex h-11 w-full items-center gap-3 rounded-lg px-3 text-[13px] font-medium text-[#626965] transition-colors hover:bg-[#FFF5F4] hover:text-[#B44940]"
        >
          <LogOut
            size={17}
            strokeWidth={1.7}
            className="text-[#7D8581] transition-colors group-hover:text-[#B44940]"
          />

          <span>Log out</span>
        </button>
      </div>
    </div>
  );
}