import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";

import AppPage from "../pages/AppPage";

import ContractListPage from "../pages/ContractListPage";
import ContractDetailPage from "../pages/ContractDetailPage";
import StarredContractsPage from "../pages/StarredContractsPage";
import ActiveContractsPage from "../pages/ActiveContractsPage";
import UpcomingDeadlinesPage from "../pages/UpcomingDeadlinesPage";
import ExecutedContractsPage from "../pages/ExecutedContractsPage";
import AnalyticsDashboardPage from "../pages/AnalyticsDashboardPage";
import ContractAnalyticsPage from "../pages/ContractAnalyticsPage";
import RiskAnalyticsPage from "../pages/RiskAnalyticsPage";
import DraftGenerationPage from "../pages/DraftGenerationPage";
import ObligationsListPage from "../pages/ObligationsListPage";
import UpcomingObligationsPage from "../pages/UpcomingObligationsPage";
import OverdueObligationsPage from "../pages/OverdueObligationsPage";
import CompletedObligationsPage from "../pages/CompletedObligationsPage";
import WorkflowsOverviewPage from "../pages/WorkflowsOverviewPage";
import TemplatesPage from "../pages/TemplatesPage";
import ActiveWorkflowsPage from "../pages/ActiveWorkflowsPage";

import ProtectedRoute from "./ProtectedRoute";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ============================================
            PUBLIC ROUTES
        ============================================ */}

        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* ============================================
            PROTECTED ROUTES
        ============================================ */}

        <Route element={<ProtectedRoute />}>
          {/* Main authenticated application shell */}
          <Route path="/app" element={<AppPage />}>
            {/* /app redirects to contracts */}
            <Route
              index
              element={<Navigate to="contracts" replace />}
            />

            {/* ── CONTRACT ROUTES ── */}

            {/* All contracts (default for /app/contracts) */}
            <Route
              path="contracts"
              element={<ContractListPage />}
            />

            {/* Contract sub-tabs */}
            <Route
              path="contracts/starred"
              element={<StarredContractsPage />}
            />
            <Route
              path="contracts/active"
              element={<ActiveContractsPage />}
            />
            <Route
              path="contracts/upcoming"
              element={<UpcomingDeadlinesPage />}
            />
            <Route
              path="contracts/executed"
              element={<ExecutedContractsPage />}
            />

            {/* Contract details */}
            <Route
              path="contracts/:id"
              element={<ContractDetailPage />}
            />

            {/* ── OBLIGATION ROUTES ── */}
            <Route
              path="obligations"
              element={<ObligationsListPage />}
            />
            <Route
              path="obligations/upcoming"
              element={<UpcomingObligationsPage />}
            />
            <Route
              path="obligations/overdue"
              element={<OverdueObligationsPage />}
            />
            <Route
              path="obligations/completed"
              element={<CompletedObligationsPage />}
            />

            {/* ── WORKFLOW ROUTES ── */}
            <Route
              path="workflows"
              element={<WorkflowsOverviewPage />}
            />
            <Route
              path="workflows/templates"
              element={<TemplatesPage />}
            />
            <Route
              path="workflows/active"
              element={<ActiveWorkflowsPage />}
            />

            {/* ── INSIGHTS / ANALYTICS ROUTES ── */}
            <Route
              path="analytics"
              element={<AnalyticsDashboardPage />}
            />
            <Route
              path="analytics/contracts"
              element={<ContractAnalyticsPage />}
            />
            <Route
              path="analytics/risk"
              element={<RiskAnalyticsPage />}
            />

            {/* New contract / AI draft generation */}
            <Route
              path="drafts/new"
              element={<DraftGenerationPage />}
            />
          </Route>
        </Route>

        {/* ============================================
            OPTIONAL FALLBACK
        ============================================ */}

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}