import type { MiobraWorkforceEstimation } from '../miobra/types.js';

export type WorkforceRow = Record<string, unknown>;

function getFullName(user: any): string | null {
  const firstName = user?.first_name ?? '';
  const lastName = user?.last_name ?? '';
  const fullName = `${firstName} ${lastName}`.trim();
  return fullName || null;
}

export function toWorkforceRow(estimation: MiobraWorkforceEstimation): WorkforceRow {
  return {
    categoria: 'MANO DE OBRA',
    id: null,
    number: estimation.number ?? null,
    orderDate: null,
    dueDate: null,
    status: null,
    statusReception: null,
    paymentStatus: null,
    subtotal: null,
    salesTax: null,
    total: null,
    provider: null,
    project: estimation.project?.name ?? null,
    createdBy: getFullName(estimation.created_by),
    approvedBy: null,
    lastAuditUserName: estimation.last_audit_user_name ?? null,
    purchaseOrderSubtotal: null,
    contractAdvanceAmount: null,
    contractWarrantyAmount: null,
    freightAmount: null,
    budgetType: null,
    originType: null,
    type: null,
    workforceOrderId: estimation.workforce_order_id ?? null,
    workforceOrderNumber: estimation.number ?? null,
    startedDtTm: estimation.started_dt_tm ?? null,
    endedDtTm: estimation.ended_dt_tm ?? null,
    workforceStatus: estimation.status ?? null,
    workforcePaymentStatus: estimation.payment_status ?? null,
    workforceBudgetType: estimation.budget_type ?? null,
    lendingAmount: parseFloat(estimation.lending_amount) || null,
    retentionAmount: parseFloat(estimation.retention_amount) || null,
    totalAmountToPay: parseFloat(estimation.total_amount_to_pay) || null,
    providerWorkforce: estimation.provider_workforce?.name ?? null,
    costRequestId: null,
    costRequestNumber: null,
    estimatedAmount: null,
    approvedAmount: null,
    requisitionStatus: null,
    requisitionPaymentStatus: null,
  };
}
