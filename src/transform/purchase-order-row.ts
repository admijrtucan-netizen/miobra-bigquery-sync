import type { MiobraPurchaseOrder } from '../miobra/types.js';

export type PurchaseOrderRow = Record<string, unknown>;

function getFullName(user: any): string | null {
  const firstName = user?.first_name ?? '';
  const lastName = user?.last_name ?? '';
  const fullName = `${firstName} ${lastName}`.trim();
  return fullName || null;
}

export function toPurchaseOrderRow(order: MiobraPurchaseOrder): PurchaseOrderRow {
  return {
    id: order.purchase_order_id ?? null,
    number: order.number ?? null,
    orderDate: order.order_date ?? null,
    dueDate: order.due_date ?? null,
    status: order.status ?? null,
    statusReception: order.status_reception ?? null,
    paymentStatus: order.payment_status ?? null,
    subtotal: order.subtotal ?? null,
    salesTax: order.sales_tax ?? null,
    total: order.total ?? null,
    provider: order.provider?.name ?? null,
    project: order.project?.name ?? null,
    createdBy: getFullName(order.created_by),
  };
}
