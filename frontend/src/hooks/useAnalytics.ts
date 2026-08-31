import { useQuery } from "@tanstack/react-query";
import {
  getAnalyticsSummary,
  getContractAnalytics,
  getRiskAnalytics,
} from "../api/analytics";

export function useAnalytics() {
  return useQuery({
    queryKey: ["analytics", "summary"],
    queryFn: getAnalyticsSummary,
  });
}

export function useContractAnalytics() {
  return useQuery({
    queryKey: ["analytics", "contracts"],
    queryFn: getContractAnalytics,
  });
}

export function useRiskAnalytics() {
  return useQuery({
    queryKey: ["analytics", "risk"],
    queryFn: getRiskAnalytics,
  });
}