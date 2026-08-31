import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getContractObligations, regenerateObligations, completeObligation, getUpcomingObligations } from "../api/obligations";

export function useContractObligations(contractId: string | undefined) {
  return useQuery({
    queryKey: ["obligations", contractId],
    queryFn: () => getContractObligations(contractId as string),
    enabled: !!contractId,
  });
}

export function useRegenerateObligations(contractId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => regenerateObligations(contractId as string),
    onSuccess: (data) => {
      queryClient.setQueryData(["obligations", contractId], data);
      queryClient.invalidateQueries({ queryKey: ["obligations"] });
      queryClient.invalidateQueries({ queryKey: ["upcoming-obligations"] });
    },
  });
}

export function useCompleteObligation(contractId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (obligationId: string) => completeObligation(contractId as string, obligationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["obligations", contractId] });
      queryClient.invalidateQueries({ queryKey: ["obligations"] });
      queryClient.invalidateQueries({ queryKey: ["upcoming-obligations"] });
    },
  });
}

export function useUpcomingObligations(days: number = 30) {
  return useQuery({
    queryKey: ["upcoming-obligations", days],
    queryFn: () => getUpcomingObligations(days),
  });
}