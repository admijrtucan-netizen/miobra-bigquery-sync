import type { MiobraClient } from './client.js';
import type { MiobraPurchaseOrder, MiobraCostRequest, MiobraWorkforceEstimation } from './types.js';

export class MiobraRepository {
  constructor(private client: MiobraClient) {}

  async listPurchaseOrders(): Promise<MiobraPurchaseOrder[]> {
    const response = await this.client.getPurchaseOrders();
    return response.data || [];
  }

  async listCostRequests(): Promise<MiobraCostRequest[]> {
    // Get all purchase orders to extract unique project IDs
    const orders = await this.listPurchaseOrders();
    const projectIds = new Set<number>();

    for (const order of orders) {
      const projectId = (order.project as any)?.project_id;
      if (typeof projectId === 'number') {
        projectIds.add(projectId);
      }
    }

    const costRequests: MiobraCostRequest[] = [];
    for (const projectId of projectIds) {
      const response = await this.client.getCostRequests(projectId);
      costRequests.push(...(response.data || []));
    }

    return costRequests;
  }

  async listWorkforceEstimations(): Promise<MiobraWorkforceEstimation[]> {
    // Get all purchase orders to extract unique project IDs
    const orders = await this.listPurchaseOrders();
    const projectIds = new Set<number>();

    for (const order of orders) {
      const projectId = (order.project as any)?.project_id;
      if (typeof projectId === 'number') {
        projectIds.add(projectId);
      }
    }

    const estimations: MiobraWorkforceEstimation[] = [];
    for (const projectId of projectIds) {
      const response = await this.client.getWorkforceEstimations(projectId);
      estimations.push(...(response.data || []));
    }

    return estimations;
  }
}
