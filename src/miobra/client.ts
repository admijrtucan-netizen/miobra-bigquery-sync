import { logger } from '../logger.js';
import type { MiobraLoginResponse, MiobraPurchaseOrdersResponse } from './types.js';

const BASE_URL = 'https://api.miobra.mx';

export class MiobraClient {
  private token: string | null = null;

  constructor(
    private username: string,
    private password: string,
  ) {}

  async login(): Promise<void> {
    const url = `${BASE_URL}/users/login/`;
    const userAgent = 'miobra-bigquery-sync/1.0';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': userAgent,
      },
      body: JSON.stringify({
        username: this.username,
        password: this.password,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Miobra login failed: ${response.status} - ${body}`);
    }

    const data = (await response.json()) as MiobraLoginResponse;
    this.token = data.token;
    logger.info('Miobra login successful');
  }

  async getPurchaseOrders(): Promise<MiobraPurchaseOrdersResponse> {
    if (!this.token) {
      throw new Error('Not authenticated. Call login() first.');
    }

    const url = `${BASE_URL}/purchases/`;
    const userAgent = 'miobra-bigquery-sync/1.0';

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'User-Agent': userAgent,
      },
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Miobra API failed: ${response.status} - ${body}`);
    }

    return (await response.json()) as MiobraPurchaseOrdersResponse;
  }
}
