import axiosInstance from "./axiosInstance";
import type { Contract } from "../types/contract";
import type { LifecycleStatus } from "../types/contract";
import type { SearchResponse } from "../types/search";
import type { ContractSummary } from "../types/summary";

// ─── All Contracts ───────────────────────────────────────────────────────────

export async function getContracts(): Promise<Contract[]> {
  const response = await axiosInstance.get<Contract[]>("/contracts");
  return response.data;
}

// ─── Starred ──────────────────────────────────────────────────────────────────

export async function getStarredContracts(): Promise<Contract[]> {
  const response = await axiosInstance.get<Contract[]>("/contracts/starred");
  return response.data;
}

export async function toggleStar(contractId: string): Promise<Contract> {
  const response = await axiosInstance.patch<Contract>(
    `/contracts/${contractId}/star`,
  );
  return response.data;
}

// ─── Active ───────────────────────────────────────────────────────────────────

export async function getActiveContracts(): Promise<Contract[]> {
  const response = await axiosInstance.get<Contract[]>("/contracts/active");
  return response.data;
}

// ─── Upcoming Deadlines ───────────────────────────────────────────────────────

export async function getUpcomingContracts(): Promise<Contract[]> {
  const response = await axiosInstance.get<Contract[]>("/contracts/upcoming");
  return response.data;
}

// ─── Executed ─────────────────────────────────────────────────────────────────

export async function getExecutedContracts(): Promise<Contract[]> {
  const response = await axiosInstance.get<Contract[]>("/contracts/executed");
  return response.data;
}

// ─── Lifecycle ────────────────────────────────────────────────────────────────

export async function updateLifecycleStatus(
  contractId: string,
  lifecycle_status: LifecycleStatus,
): Promise<Contract> {
  const response = await axiosInstance.patch<Contract>(
    `/contracts/${contractId}/lifecycle`,
    { lifecycle_status },
  );
  return response.data;
}

// ─── Single Contract ──────────────────────────────────────────────────────────

export async function getContract(id: string): Promise<Contract> {
  const response = await axiosInstance.get<Contract>(`/contracts/${id}`);
  return response.data;
}

// ─── Upload ───────────────────────────────────────────────────────────────────

export async function uploadContract(file: File): Promise<Contract> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await axiosInstance.post<Contract>(
    "/contracts/upload",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return response.data;
}

// ─── Search ───────────────────────────────────────────────────────────────────

export async function searchContracts(query: string): Promise<SearchResponse> {
  const response = await axiosInstance.post<SearchResponse>("/search", {
    query,
  });
  return response.data;
}

// ─── Summary ──────────────────────────────────────────────────────────────────

export async function getSummary(contractId: string): Promise<ContractSummary> {
  const response = await axiosInstance.get<ContractSummary>(
    `/contracts/${contractId}/summary`,
  );
  return response.data;
}

export async function regenerateSummary(
  contractId: string,
): Promise<ContractSummary> {
  const response = await axiosInstance.post<ContractSummary>(
    `/contracts/${contractId}/summary/regenerate`,
  );
  return response.data;
}