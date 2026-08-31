import axiosInstance from "./axiosInstance";
import type {
  ApprovalStatus,
  ApprovalWorkflowOption,
  AdvisoryResponse,
  ContractVersionItem,
  CompareResult,
  ActiveWorkflowInstance,
  WorkflowStats,
  CreateWorkflowInput,
} from "../types/phase5";

// ─── Global Workflow Management ──────────────────────────────────────────────

export async function getWorkflows(): Promise<ApprovalWorkflowOption[]> {
  const response = await axiosInstance.get<ApprovalWorkflowOption[]>("/workflows");
  return response.data;
}

export async function createWorkflow(
  payload: CreateWorkflowInput,
): Promise<ApprovalWorkflowOption> {
  const response = await axiosInstance.post<ApprovalWorkflowOption>(
    "/workflows",
    payload,
  );
  return response.data;
}

export async function deleteWorkflow(
  workflowId: string,
): Promise<{ message: string }> {
  const response = await axiosInstance.delete<{ message: string }>(
    `/workflows/${workflowId}`,
  );
  return response.data;
}

export async function getWorkflowStats(): Promise<WorkflowStats> {
  const response = await axiosInstance.get<WorkflowStats>("/workflows/stats");
  return response.data;
}

export async function getActiveWorkflowInstances(
  status?: string,
): Promise<ActiveWorkflowInstance[]> {
  const url = status && status !== "all"
    ? `/workflows/instances?status=${status}`
    : "/workflows/instances";
  const response = await axiosInstance.get<ActiveWorkflowInstance[]>(url);
  return response.data;
}

// ─── Contract-Scoped Approvals ────────────────────────────────────────────────

export async function getApprovalStatus(
  contractId: string,
): Promise<ApprovalStatus> {
  const response = await axiosInstance.get<ApprovalStatus>(
    `/contracts/${contractId}/approval`,
  );
  return response.data;
}

export async function submitForApproval(
  contractId: string,
  workflowId: string,
): Promise<ApprovalStatus> {
  const response = await axiosInstance.post<ApprovalStatus>(
    `/contracts/${contractId}/approval/submit`,
    {
      workflow_id: workflowId,
    },
  );
  return response.data;
}

export async function approveStage(
  contractId: string,
  comment?: string,
): Promise<ApprovalStatus> {
  const response = await axiosInstance.post<ApprovalStatus>(
    `/contracts/${contractId}/approval/approve`,
    { comment },
  );
  return response.data;
}

export async function rejectStage(
  contractId: string,
  comment?: string,
): Promise<ApprovalStatus> {
  const response = await axiosInstance.post<ApprovalStatus>(
    `/contracts/${contractId}/approval/reject`,
    { comment },
  );
  return response.data;
}

export async function getAdvisory(
  contractId: string,
): Promise<AdvisoryResponse> {
  const response = await axiosInstance.get<AdvisoryResponse>(
    `/contracts/${contractId}/approval/advisory`,
  );
  return response.data;
}

// ─── Versioning ──────────────────────────────────────────────────────────────

export async function getVersions(
  contractId: string,
): Promise<ContractVersionItem[]> {
  const response = await axiosInstance.get<ContractVersionItem[]>(
    `/contracts/${contractId}/versions`,
  );
  return response.data;
}

export async function createVersion(
  contractId: string,
  rawText: string,
): Promise<ContractVersionItem> {
  const response = await axiosInstance.post<ContractVersionItem>(
    `/contracts/${contractId}/versions`,
    {
      raw_text: rawText,
    },
  );
  return response.data;
}

export async function compareVersions(
  contractId: string,
  fromVersion: number,
  toVersion: number,
): Promise<CompareResult> {
  const response = await axiosInstance.get<CompareResult>(
    `/contracts/${contractId}/versions/compare`,
    {
      params: { from_version: fromVersion, to_version: toVersion },
    },
  );
  return response.data;
}