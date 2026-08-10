import type { MiobraClient } from './client.js';
import type { MiobraPurchaseOrder } from './types.js';

export class MiobraRepository {
  constructor(private client: MiobraClient) {}

  async listPurchaseOrders(): Promise<MiobraPurchaseOrder[]> {
    const response = await this.client.getPurchaseOrders();
    return response.data || [];
  }
}
