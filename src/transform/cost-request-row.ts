import type { MiobraCostRequest } from '../miobra/types.js';

export type CostRequestRow = Record<string, unknown>;

function getFullName(user: any): string | null {
  const firstName = user?.first_name ?? '';
  const lastName = user?.last_name ?? '';
  const fullName = `${firstName} ${lastName}`.trim();
  return fullName || null;
}

export function toCostRequestRow(request: MiobraCostRequest): CostRequestRow {
  return {
    categoria: 'REQUISICIONES',
    id: null,
    number: request.number ?? null,
    orderDate: null,
    dueDate: null,
    status: null,
    statusReception: null,
    paymentStatus: request.payment_status ?? null,
    subtotal: null,
    salesTax: null,
    total: null,
    provider: request.provider?.name ?? null,
    project: request.project?.name ?? null,
    createdBy: getFullName(request.created_by),
    approvedBy: null,
    lastAuditUserName: null,
    purchaseOrderSubtotal: null,
    contractAdvanceAmount: null,
    contractWarrantyAmount: null,
    freightAmount: null,
    budgetType: null,
    originType: null,
    type: null,
    workforceOrderId: null,
    workforceOrderNumber: null,
    startedDtTm: null,
    endedDtTm: null,
    workforceStatus: null,
    workforcePaymentStatus: null,
    workforceBudgetType: null,
    lendingAmount: null,
    retentionAmount: null,
    totalAmountToPay: null,
    providerWorkforce: null,
    costRequestId: request.cost_request_id ?? null,
    costRequestNumber: request.number ?? null,
    estimatedAmount: request.estimated_amount ?? null,
    approvedAmount: request.approved_amount ?? null,
    requisitionStatus: request.status ?? null,
    requisitionPaymentStatus: request.payment_status ?? null,
  };
}
