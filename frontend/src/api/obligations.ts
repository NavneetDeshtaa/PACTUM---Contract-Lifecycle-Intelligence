import axiosInstance from "./axiosInstance";
import type {
  RenewalObligation,
  ObligationStats,
  CreateObligationInput,
  ObligationItemType,
} from "../types/tracking";

// ─── Global Obligations Queries ──────────────────────────────────────────────

export async function getAllObligations(params?: {
  item_type?: ObligationItemType;
  is_completed?: boolean;
  search?: string;
}): Promise<RenewalObligation[]> {
  const queryParams = new URLSearchParams();
  if (params?.item_type) queryParams.append("item_type", params.item_type);
  if (params?.is_completed !== undefined)
    queryParams.append("is_completed", String(params.is_completed));
  if (params?.search) queryParams.append("search", params.search);

  const url = `/obligations${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
  const response = await axiosInstance.get<RenewalObligation[]>(url);
  return response.data;
}

export async function getObligationStats(): Promise<ObligationStats> {
  const response = await axiosInstance.get<ObligationStats>("/obligations/stats");
  return response.data;
}

export async function getUpcomingObligations(
  days: number = 90,
): Promise<RenewalObligation[]> {
  const response = await axiosInstance.get<RenewalObligation[]>(
    `/obligations/upcoming?days=${days}`,
  );
  return response.data;
}

export async function getOverdueObligations(): Promise<RenewalObligation[]> {
  const response = await axiosInstance.get<RenewalObligation[]>(
    "/obligations/overdue",
  );
  return response.data;
}

export async function getCompletedObligations(): Promise<RenewalObligation[]> {
  const response = await axiosInstance.get<RenewalObligation[]>(
    "/obligations/completed",
  );
  return response.data;
}

export async function toggleObligationStatus(
  obligationId: string,
): Promise<RenewalObligation> {
  const response = await axiosInstance.patch<RenewalObligation>(
    `/obligations/${obligationId}/toggle`,
  );
  return response.data;
}

// ─── Contract-Scoped Obligations ─────────────────────────────────────────────

export async function getContractObligations(
  contractId: string,
): Promise<RenewalObligation[]> {
  const response = await axiosInstance.get<RenewalObligation[]>(
    `/contracts/${contractId}/obligations`,
  );
  return response.data;
}

export async function regenerateObligations(
  contractId: string,
): Promise<RenewalObligation[]> {
  const response = await axiosInstance.post<RenewalObligation[]>(
    `/contracts/${contractId}/obligations/regenerate`,
  );
  return response.data;
}

export async function completeObligation(
  contractId: string,
  obligationId: string,
): Promise<RenewalObligation> {
  const response = await axiosInstance.patch<RenewalObligation>(
    `/contracts/${contractId}/obligations/${obligationId}/complete`,
  );
  return response.data;
}

export async function createManualObligation(
  contractId: string,
  payload: CreateObligationInput,
): Promise<RenewalObligation> {
  const response = await axiosInstance.post<RenewalObligation>(
    `/contracts/${contractId}/obligations`,
    payload,
  );
  return response.data;
}

export async function deleteContractObligation(
  contractId: string,
  obligationId: string,
): Promise<{ message: string }> {
  const response = await axiosInstance.delete<{ message: string }>(
    `/contracts/${contractId}/obligations/${obligationId}`,
  );
  return response.data;
}