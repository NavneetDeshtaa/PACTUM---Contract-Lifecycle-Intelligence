export interface ActionHistoryItem {
  stage_name: string;
  action: string;
  actor_email: string | null;
  comment: string | null;
  created_at: string;
}

export interface ApprovalStatus {
  status: "in_progress" | "approved" | "rejected";
  current_stage_index: number;
  current_stage_name: string | null;
  stages: string[];
  started_at: string;
  completed_at: string | null;
  actions: ActionHistoryItem[];
}

export interface ApprovalWorkflowOption {
  id: string;
  name: string;
  contract_type: string | null;
  stages: string[];
}

export interface AdvisoryResponse {
  recommendation: string;
  reasoning: string;
  current_stage: string;
}

export interface ContractVersionItem {
  id: string;
  version_number: number;
  created_at: string;
  preview: string;
}

export interface DiffChange {
  type: "replace" | "delete" | "insert";
  old_text: string;
  new_text: string;
}

export interface CompareResult {
  version_a: number;
  version_b: number;
  changes: DiffChange[];
  explanation: string;
}