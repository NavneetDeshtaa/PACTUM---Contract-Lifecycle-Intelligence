import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getWorkflows,
  createWorkflow,
  deleteWorkflow,
  getWorkflowStats,
  getActiveWorkflowInstances,
} from "../api/phase5";
import {
  getTemplates,
  createTemplate,
  deleteTemplate,
} from "../api/drafts";
import type { CreateWorkflowInput } from "../types/phase5";
import type { CreateTemplateInput } from "../types/drafts";

// ─── Workflows Hooks ─────────────────────────────────────────────────────────

export function useWorkflows() {
  return useQuery({
    queryKey: ["workflows"],
    queryFn: getWorkflows,
  });
}

export function useWorkflowStats() {
  return useQuery({
    queryKey: ["workflows", "stats"],
    queryFn: getWorkflowStats,
  });
}

export function useActiveWorkflowInstances(status?: string) {
  return useQuery({
    queryKey: ["workflows", "instances", status],
    queryFn: () => getActiveWorkflowInstances(status),
  });
}

export function useCreateWorkflow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateWorkflowInput) => createWorkflow(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
    },
  });
}

export function useDeleteWorkflow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (workflowId: string) => deleteWorkflow(workflowId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
    },
  });
}

// ─── Templates Hooks ─────────────────────────────────────────────────────────

export function useTemplates() {
  return useQuery({
    queryKey: ["templates"],
    queryFn: getTemplates,
  });
}

export function useCreateTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTemplateInput) => createTemplate(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      queryClient.invalidateQueries({ queryKey: ["workflows", "stats"] });
    },
  });
}

export function useDeleteTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (templateId: string) => deleteTemplate(templateId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      queryClient.invalidateQueries({ queryKey: ["workflows", "stats"] });
    },
  });
}
