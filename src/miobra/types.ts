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
