export interface StatusCount {
  status: string;
  count: number;
}

export interface MonthCount {
  month: string;
  count: number;
}

export interface BucketCount {
  bucket: string;
  count: number;
}

export interface RiskLevelCount {
  level: string;
  count: number;
}

export interface LifecycleCount {
  stage: string;
  count: number;
}

export interface GoverningLawCount {
  law: string;
  count: number;
}

export interface TopContractItem {
  id: string;
  file_name: string;
  value: number;
  currency: string;
  governing_law: string | null;
  expiry_date: string | null;
}

export interface CounterpartyItem {
  party: string;
  count: number;
}

export interface ClauseFrequencyItem {
  clause: string;
  occurrences: number;
}

export interface HighRiskWatchlistItem {
  contract_id: string;
  file_name: string;
  risk_score: number;
  risk_level: string;
  flagged_count: number;
  missing_count: number;
  explanation: string | null;
}

export interface PortfolioOverviewMetrics {
  total_contracts: number;
  total_value: number;
  average_value: number;
  active_contracts: number;
  in_flight_reviews: number;
  open_obligations: number;
  high_risk_count: number;
}

export interface AnalyticsSummary {
  total_contracts: number;
  metrics: PortfolioOverviewMetrics;
  status_breakdown: StatusCount[];
  volume_over_time: MonthCount[];
  expiry_timeline: MonthCount[];
  value_distribution: BucketCount[];
  risk_distribution: RiskLevelCount[];
}

export interface ContractAnalyticsResponse {
  total_contracts: number;
  total_value: number;
  average_value: number;
  lifecycle_breakdown: LifecycleCount[];
  governing_law_breakdown: GoverningLawCount[];
  value_distribution: BucketCount[];
  top_contracts: TopContractItem[];
  top_counterparties: CounterpartyItem[];
}

export interface RiskAnalyticsResponse {
  average_risk_score: number;
  compliance_health_score: number;
  risk_distribution: RiskLevelCount[];
  top_flagged_clauses: ClauseFrequencyItem[];
  top_missing_clauses: ClauseFrequencyItem[];
  high_risk_watchlist: HighRiskWatchlistItem[];
}