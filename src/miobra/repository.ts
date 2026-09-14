import type { MiobraClient } from './client.js';
import type { MiobraPurchaseOrder, MiobraCostRequest, MiobraWorkforceEstimation } from './types.js';

export class MiobraRepository {
  constructor(private client: MiobraClient) {}

  async listPurchaseOrders(): Promise<MiobraPurchaseOrder[]> {
    const response = await this.client.getPurchaseOrders();
    return response.data || [];
  }

  async listCostRequests(): Promise<MiobraCostRequest[]> {
    const response = await this.client.getCostRequests();
    return response.data || [];
  }

  async listWorkforceEstimations(): Promise<MiobraWorkforceEstimation[]> {
    const response = await this.client.getWorkforceEstimations();
    return response.data || [];
  }
}
