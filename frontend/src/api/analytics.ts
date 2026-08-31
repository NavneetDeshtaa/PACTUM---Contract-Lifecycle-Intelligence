import axiosInstance from "./axiosInstance";
import type {
  AnalyticsSummary,
  ContractAnalyticsResponse,
  RiskAnalyticsResponse,
} from "../types/analytics";

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const response = await axiosInstance.get<AnalyticsSummary>(
    "/analytics/summary",
  );
  return response.data;
}

export async function getContractAnalytics(): Promise<ContractAnalyticsResponse> {
  const response = await axiosInstance.get<ContractAnalyticsResponse>(
    "/analytics/contracts",
  );
  return response.data;
}

export async function getRiskAnalytics(): Promise<RiskAnalyticsResponse> {
  const response = await axiosInstance.get<RiskAnalyticsResponse>(
    "/analytics/risk",
  );
  return response.data;
}