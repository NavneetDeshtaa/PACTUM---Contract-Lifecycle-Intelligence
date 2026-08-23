import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getWorkflows, getApprovalStatus, submitForApproval, approveStage, rejectStage, getAdvisory,
  getVersions, createVersion, compareVersions,
} from "../api/phase5";

export function useWorkflows() {
  return useQuery({ queryKey: ["workflows"], queryFn: getWorkflows });
}

export function useApprovalStatus(contractId: string | undefined) {
  return useQuery({
    queryKey: ["approval", contractId],
    queryFn: () => getApprovalStatus(contractId as string),
    enabled: !!contractId,
    retry: false, // a 404 here just means "not submitted yet" -- not worth retrying
  });
}

export function useSubmitForApproval(contractId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (workflowId: string) => submitForApproval(contractId as string, workflowId),
    onSuccess: (data) => queryClient.setQueryData(["approval", contractId], data),
  });
}

export function useApproveStage(contractId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (comment?: string) => approveStage(contractId as string, comment),
    onSuccess: (data) => queryClient.setQueryData(["approval", contractId], data),
  });
}

export function useRejectStage(contractId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (comment?: string) => rejectStage(contractId as string, comment),
    onSuccess: (data) => queryClient.setQueryData(["approval", contractId], data),
  });
}

export function useAdvisory(contractId: string | undefined, enabled: boolean) {
  // enabled is controlled by a button click in the component, not fetched
  // automatically -- this costs an LLM call, so it shouldn't fire just
  // because someone viewed the page.
  return useQuery({
    queryKey: ["advisory", contractId],
    queryFn: () => getAdvisory(contractId as string),
    enabled: !!contractId && enabled,
    retry: false,
  });
}

export function useVersions(contractId: string | undefined) {
  return useQuery({
    queryKey: ["versions", contractId],
    queryFn: () => getVersions(contractId as string),
    enabled: !!contractId,
  });
}

export function useCreateVersion(contractId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (rawText: string) => createVersion(contractId as string, rawText),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["versions", contractId] }),
  });
}

export function useCompareVersions(contractId: string | undefined, fromVersion: number | null, toVersion: number | null) {
  return useQuery({
    queryKey: ["compare", contractId, fromVersion, toVersion],
    queryFn: () => compareVersions(contractId as string, fromVersion as number, toVersion as number),
    enabled: !!contractId && fromVersion !== null && toVersion !== null,
  });
}