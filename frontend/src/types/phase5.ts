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
  active?: boolean;
  active_instances_count?: number;
}

export interface CreateWorkflowInput {
  name: string;
  contract_type?: string;
  stages: string[];
}

export interface ActiveWorkflowInstance {
  instance_id: string;
  contract_id: string;
  contract_file_name: string;
  workflow_id: string;
  workflow_name: string;
  current_stage_index: number;
  current_stage_name: string | null;
  total_stages: number;
  stages: string[];
  status: "in_progress" | "approved" | "rejected";
  started_at: string;
  completed_at: string | null;
  actions: ActionHistoryItem[];
}

export interface WorkflowStats {
  total_workflows: number;
  total_templates: number;
  active_in_progress: number;
  total_approved: number;
  total_rejected: number;
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