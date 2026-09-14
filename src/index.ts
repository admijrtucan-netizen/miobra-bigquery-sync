import { rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { loadConfig } from './config.js';
import { logger } from './logger.js';
import { MiobraClient } from './miobra/client.js';
import { MiobraRepository } from './miobra/repository.js';
import { JsonlWriter } from './load/jsonl-writer.js';
import { Warehouse } from './load/warehouse.js';
import { toPurchaseOrderRow } from './transform/purchase-order-row.js';
import { toCostRequestRow } from './transform/cost-request-row.js';
import { toWorkforceRow } from './transform/workforce-row.js';

async function main(): Promise<void> {
  const dryRun = process.argv.includes('--dry-run');
  const startedAt = Date.now();
  const config = loadConfig();

  const localPath = join(tmpdir(), `miobra-export-${process.pid}-${startedAt}.jsonl`);
  const client = new MiobraClient(config.miobra.username, config.miobra.password);
  const repository = new MiobraRepository(client);
  const writer = new JsonlWriter(localPath);

  try {
    await client.login();

    const [orders, costRequests, workforceEstimations] = await Promise.all([
      repository.listPurchaseOrders(),
      repository.listCostRequests(),
      repository.listWorkforceEstimations(),
    ]);

    logger.info('fetched all data', {
      purchaseOrders: orders.length,
      costRequests: costRequests.length,
      workforceEstimations: workforceEstimations.length,
    });

    for (const order of orders) {
      await writer.write(toPurchaseOrderRow(order));
    }

    for (const request of costRequests) {
      await writer.write(toCostRequestRow(request));
    }

    for (const estimation of workforceEstimations) {
      await writer.write(toWorkforceRow(estimation));
    }

    await writer.close();
    logger.info('extraction complete', { rows: writer.rowCount });

    if (writer.rowCount === 0) {
      throw new Error('Extraction produced 0 rows; refusing to truncate the BigQuery table.');
    }

    if (dryRun) {
      logger.info('dry run: skipping gcs upload and bigquery load', { file: localPath });
      return;
    }

    const warehouse = new Warehouse(config.gcp);
    await warehouse.upload(localPath);
    const loadedRows = await warehouse.load();

    logger.info('bigquery load complete', {
      dataset: config.gcp.dataset,
      table: config.gcp.table,
      rows: loadedRows,
      durationMs: Date.now() - startedAt,
    });
  } finally {
    await writer.close().catch(() => undefined);
    if (!dryRun) await rm(localPath, { force: true });
  }
}

main().catch((error: unknown) => {
  logger.error('batch failed', {
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
  });
  process.exitCode = 1;
});
