import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllObligations,
  getObligationStats,
  getUpcomingObligations,
  getOverdueObligations,
  getCompletedObligations,
  toggleObligationStatus,
  createManualObligation,
  deleteContractObligation,
} from "../api/obligations";
import type {
  ObligationItemType,
  CreateObligationInput,
} from "../types/tracking";

// ─── Query Hooks ─────────────────────────────────────────────────────────────

export function useAllObligations(params?: {
  item_type?: ObligationItemType;
  is_completed?: boolean;
  search?: string;
}) {
  return useQuery({
    queryKey: ["obligations", "all", params],
    queryFn: () => getAllObligations(params),
  });
}

export function useObligationStats() {
  return useQuery({
    queryKey: ["obligations", "stats"],
    queryFn: getObligationStats,
  });
}

export function useUpcomingObligations(days: number = 90) {
  return useQuery({
    queryKey: ["obligations", "upcoming", days],
    queryFn: () => getUpcomingObligations(days),
  });
}

export function useOverdueObligations() {
  return useQuery({
    queryKey: ["obligations", "overdue"],
    queryFn: getOverdueObligations,
  });
}

export function useCompletedObligations() {
  return useQuery({
    queryKey: ["obligations", "completed"],
    queryFn: getCompletedObligations,
  });
}

// ─── Mutation Hooks ──────────────────────────────────────────────────────────

export function useToggleObligation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (obligationId: string) => toggleObligationStatus(obligationId),
    onSuccess: () => {
      // Invalidate all obligations caches and contract-scoped obligation queries
      queryClient.invalidateQueries({ queryKey: ["obligations"] });
      queryClient.invalidateQueries({ queryKey: ["contract-obligations"] });
      queryClient.invalidateQueries({ queryKey: ["contract"] });
    },
  });
}

export function useCreateObligation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      contractId,
      payload,
    }: {
      contractId: string;
      payload: CreateObligationInput;
    }) => createManualObligation(contractId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["obligations"] });
      queryClient.invalidateQueries({ queryKey: ["contract-obligations"] });
    },
  });
}

export function useDeleteObligation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      contractId,
      obligationId,
    }: {
      contractId: string;
      obligationId: string;
    }) => deleteContractObligation(contractId, obligationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["obligations"] });
      queryClient.invalidateQueries({ queryKey: ["contract-obligations"] });
    },
  });
}
