import { logger } from '../logger.js';
import type {
  MiobraLoginResponse,
  MiobraPurchaseOrdersResponse,
  MiobraCostRequestsResponse,
  MiobraWorkforceEstimationsResponse,
} from './types.js';

const BASE_URL = 'https://api.miobra.mx';
const USER_AGENT = 'miobra-bigquery-sync/1.0';

export class MiobraClient {
  private token: string | null = null;

  constructor(
    private username: string,
    private password: string,
  ) {}

  async login(): Promise<void> {
    const url = `${BASE_URL}/users/login/`;
    logger.info('logging in', { url });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': USER_AGENT,
      },
      body: JSON.stringify({
        username: this.username,
        password: this.password,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      logger.error('login failed', { status: response.status, url });
      throw new Error(`Miobra login failed: ${response.status} - ${body}`);
    }

    const data = (await response.json()) as MiobraLoginResponse;
    this.token = data.token;
    logger.info('login successful');
  }

  async getPurchaseOrders(): Promise<MiobraPurchaseOrdersResponse> {
    if (!this.token) {
      throw new Error('Not authenticated. Call login() first.');
    }

    const url = `${BASE_URL}/purchases/`;
    logger.info('fetching purchase orders', { url });

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${this.token}`,
        'User-Agent': USER_AGENT,
      },
    });

    if (!response.ok) {
      const body = await response.text();
      logger.error('purchase orders fetch failed', { status: response.status, url });
      throw new Error(`Miobra API failed: ${response.status} - ${body}`);
    }

    const data = (await response.json()) as MiobraPurchaseOrdersResponse;
    logger.info('purchase orders fetched', { count: data.data?.length || 0 });
    return data;
  }

  async getCostRequests(projectId: number): Promise<MiobraCostRequestsResponse> {
    if (!this.token) {
      throw new Error('Not authenticated. Call login() first.');
    }

    const url = `${BASE_URL}/cost_requests/projects/${projectId}`;
    logger.info('fetching cost requests', { url, projectId });

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${this.token}`,
        'User-Agent': USER_AGENT,
      },
    });

    if (!response.ok) {
      const body = await response.text();
      logger.error('cost requests fetch failed', { status: response.status, url, projectId });
      throw new Error(`Miobra API failed: ${response.status} - ${body}`);
    }

    const data = (await response.json()) as MiobraCostRequestsResponse;
    logger.info('cost requests fetched', { projectId, count: data.data?.length || 0 });
    return data;
  }

  async getWorkforceEstimations(projectId: number): Promise<MiobraWorkforceEstimationsResponse> {
    if (!this.token) {
      throw new Error('Not authenticated. Call login() first.');
    }

    const url = `${BASE_URL}/workforce_orders/projects/${projectId}/estimations/`;
    logger.info('fetching workforce estimations', { url, projectId });

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${this.token}`,
        'User-Agent': USER_AGENT,
      },
    });

    if (!response.ok) {
      const body = await response.text();
      logger.error('workforce estimations fetch failed', { status: response.status, url, projectId });
      throw new Error(`Miobra API failed: ${response.status} - ${body}`);
    }

    const data = (await response.json()) as MiobraWorkforceEstimationsResponse;
    logger.info('workforce estimations fetched', { projectId, count: data.data?.length || 0 });
    return data;
  }
}
