export interface MiobraLoginResponse {
  token: string;
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  type: string;
  company?: Record<string, unknown>;
  roles?: string[];
  [key: string]: unknown;
}

export interface MiobraPurchaseOrder {
  purchase_order_id: number;
  number: string;
  order_date: string;
  due_date?: string;
  status: number;
  status_reception: number;
  payment_status: number;
  subtotal: number;
  sales_tax: number;
  total: number;
  provider?: Record<string, unknown>;
  project?: Record<string, unknown>;
  created_by?: Record<string, unknown>;
  cost_requests?: Record<string, unknown>[];
  [key: string]: unknown;
}

export interface MiobraPurchaseOrdersResponse {
  data: MiobraPurchaseOrder[];
  cost_requests?: Record<string, unknown>[];
}

export interface MiobraCostRequest {
  cost_request_id: number;
  number: string;
  created_dt_tm: string;
  estimated_amount: number;
  approved_amount?: number;
  status: number;
  payment_status: number;
  provider?: Record<string, unknown>;
  project?: Record<string, unknown>;
  created_by?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface MiobraCostRequestsResponse {
  data: MiobraCostRequest[];
}

export interface MiobraWorkforceEstimation {
  workforce_order_id: number;
  number: string;
  started_dt_tm?: string;
  ended_dt_tm?: string;
  status: number;
  payment_status: number;
  budget_type: number;
  lending_amount: string;
  retention_amount: string;
  total_amount_to_pay: string;
  provider_workforce?: Record<string, unknown>;
  project?: Record<string, unknown>;
  created_by?: Record<string, unknown>;
  last_audit_user_name?: string;
  [key: string]: unknown;
}

export interface MiobraWorkforceEstimationsResponse {
  data: MiobraWorkforceEstimation[];
}
