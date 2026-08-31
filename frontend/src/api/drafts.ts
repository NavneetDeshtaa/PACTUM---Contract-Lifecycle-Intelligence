import axiosInstance from "./axiosInstance";
import type {
  ContractTemplate,
  CreateTemplateInput,
  DraftGenerationRequest,
  DraftGenerationResponse,
} from "../types/drafts";

export async function getTemplates(): Promise<ContractTemplate[]> {
  const response = await axiosInstance.get<ContractTemplate[]>("/templates");
  return response.data;
}

export async function createTemplate(
  payload: CreateTemplateInput,
): Promise<ContractTemplate> {
  const response = await axiosInstance.post<ContractTemplate>(
    "/templates",
    payload,
  );
  return response.data;
}

export async function deleteTemplate(
  templateId: string,
): Promise<{ message: string }> {
  const response = await axiosInstance.delete<{ message: string }>(
    `/templates/${templateId}`,
  );
  return response.data;
}

export async function generateDraft(
  payload: DraftGenerationRequest,
): Promise<DraftGenerationResponse> {
  const response = await axiosInstance.post<DraftGenerationResponse>(
    "/contracts/generate",
    payload,
  );
  return response.data;
}