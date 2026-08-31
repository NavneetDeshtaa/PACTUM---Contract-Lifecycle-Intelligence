export interface Notification {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  contract_id: string | null;
  email_sent: boolean;
  created_at: string;
}

export type ObligationItemType = "renewal" | "obligation";

export interface RenewalObligation {
  id: string;
  contract_id: string;
  contract_file_name?: string | null;
  item_type: ObligationItemType;
  title: string;
  description: string | null;
  due_date: string;
  notice_period_days: number | null;
  is_completed: boolean;
  generated_at?: string;
}

export interface ObligationStats {
  total: number;
  upcoming: number;
  overdue: number;
  completed: number;
  completion_rate: number;
}

export interface CreateObligationInput {
  item_type: ObligationItemType;
  title: string;
  description?: string;
  due_date: string;
  notice_period_days?: number | null;
}