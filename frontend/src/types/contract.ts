export interface ExtractedFields {
  parties: string[] | null;
  effective_date: string | null;
  expiry_date: string | null;
  value: number | null;
  currency: string | null;
  governing_law: string | null;
  renewal_terms: string | null;
  key_clauses: string[] | null;
}

export type ContractStatus = "uploaded" | "processing" | "extracted" | "failed";

export type LifecycleStatus =
  | "draft"
  | "active"
  | "executed"
  | "expired"
  | "terminated";

export interface Contract {
  id: string;
  file_name: string;
  status: ContractStatus;
  uploaded_at: string;
  extracted_fields: ExtractedFields | null;
  is_starred: boolean;
  lifecycle_status: LifecycleStatus;
}