import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getStarredContracts,
  getActiveContracts,
  getUpcomingContracts,
  getExecutedContracts,
  toggleStar,
  updateLifecycleStatus,
} from "../api/contracts";
import type { LifecycleStatus } from "../types/contract";

// ─── Starred ──────────────────────────────────────────────────────────────────

export function useStarredContracts() {
  return useQuery({
    queryKey: ["contracts", "starred"],
    queryFn: getStarredContracts,
  });
}

// ─── Active ───────────────────────────────────────────────────────────────────

export function useActiveContracts() {
  return useQuery({
    queryKey: ["contracts", "active"],
    queryFn: getActiveContracts,
  });
}

// ─── Upcoming Deadlines ───────────────────────────────────────────────────────

export function useUpcomingContracts() {
  return useQuery({
    queryKey: ["contracts", "upcoming"],
    queryFn: getUpcomingContracts,
  });
}

// ─── Executed ─────────────────────────────────────────────────────────────────

export function useExecutedContracts() {
  return useQuery({
    queryKey: ["contracts", "executed"],
    queryFn: getExecutedContracts,
  });
}

// ─── Toggle Star (mutation) ───────────────────────────────────────────────────

export function useToggleStar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contractId: string) => toggleStar(contractId),
    onSuccess: (updatedContract) => {
      // Invalidate both list views and individual detail view
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      queryClient.invalidateQueries({ queryKey: ["contract", updatedContract.id] });
      queryClient.setQueryData(["contract", updatedContract.id], updatedContract);
    },
  });
}

// ─── Update Lifecycle (mutation) ──────────────────────────────────────────────

export function useUpdateLifecycle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      contractId,
      status,
    }: {
      contractId: string;
      status: LifecycleStatus;
    }) => updateLifecycleStatus(contractId, status),
    onSuccess: (updatedContract) => {
      // Invalidate both list views and individual detail view
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      queryClient.invalidateQueries({ queryKey: ["contract", updatedContract.id] });
      queryClient.setQueryData(["contract", updatedContract.id], updatedContract);
    },
  });
}
