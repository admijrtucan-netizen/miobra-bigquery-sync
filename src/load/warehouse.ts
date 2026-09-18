import { BigQuery } from '@google-cloud/bigquery';
import { Storage } from '@google-cloud/storage';
import { logger } from '../logger.js';
import type { Config } from '../config.js';

const SCHEMA = {
  fields: [
    { name: 'categoria', type: 'STRING' },
    { name: 'id', type: 'INTEGER' },
    { name: 'number', type: 'STRING' },
    { name: 'orderDate', type: 'TIMESTAMP' },
    { name: 'dueDate', type: 'DATE' },
    { name: 'status', type: 'INTEGER' },
    { name: 'statusReception', type: 'INTEGER' },
    { name: 'paymentStatus', type: 'INTEGER' },
    { name: 'subtotal', type: 'FLOAT64' },
    { name: 'salesTax', type: 'FLOAT64' },
    { name: 'total', type: 'FLOAT64' },
    { name: 'provider', type: 'STRING' },
    { name: 'project', type: 'STRING' },
    { name: 'createdBy', type: 'STRING' },
    { name: 'approvedBy', type: 'STRING' },
    { name: 'lastAuditUserName', type: 'STRING' },
    { name: 'purchaseOrderSubtotal', type: 'FLOAT64' },
    { name: 'contractAdvanceAmount', type: 'FLOAT64' },
    { name: 'contractWarrantyAmount', type: 'FLOAT64' },
    { name: 'freightAmount', type: 'FLOAT64' },
    { name: 'budgetType', type: 'INTEGER' },
    { name: 'originType', type: 'INTEGER' },
    { name: 'type', type: 'INTEGER' },
    { name: 'workforceOrderId', type: 'INTEGER' },
    { name: 'workforceOrderNumber', type: 'STRING' },
    { name: 'startedDtTm', type: 'TIMESTAMP' },
    { name: 'endedDtTm', type: 'TIMESTAMP' },
    { name: 'workforceStatus', type: 'INTEGER' },
    { name: 'workforcePaymentStatus', type: 'INTEGER' },
    { name: 'workforceBudgetType', type: 'INTEGER' },
    { name: 'lendingAmount', type: 'FLOAT64' },
    { name: 'retentionAmount', type: 'FLOAT64' },
    { name: 'totalAmountToPay', type: 'FLOAT64' },
    { name: 'providerWorkforce', type: 'STRING' },
    { name: 'costRequestId', type: 'INTEGER' },
    { name: 'costRequestNumber', type: 'STRING' },
    { name: 'estimatedAmount', type: 'FLOAT64' },
    { name: 'approvedAmount', type: 'FLOAT64' },
    { name: 'requisitionStatus', type: 'INTEGER' },
    { name: 'requisitionPaymentStatus', type: 'INTEGER' },
    { name: 'notes', type: 'STRING' },
    { name: 'alias', type: 'STRING' },
    { name: 'created_dt_tm', type: 'TIMESTAMP' },
    { name: 'updated_dt_tm', type: 'TIMESTAMP' },
    { name: 'last_audit_dt_tm', type: 'TIMESTAMP' },
    { name: 'total_estimated_amount', type: 'FLOAT64' },
    { name: 'total_amount', type: 'FLOAT64' },
    { name: 'real_total_amount_to_pay', type: 'FLOAT64' },
    { name: 'lending_refund_amount', type: 'FLOAT64' },
    { name: 'real_lending_amount', type: 'FLOAT64' },
    { name: 'real_lending_refund_amount', type: 'FLOAT64' },
    { name: 'real_retention_amount', type: 'FLOAT64' },
    { name: 'total_amount_difference', type: 'FLOAT64' },
    { name: 'retention_applies_to_all_amounts', type: 'BOOLEAN' },
    { name: 'is_resendable', type: 'BOOLEAN' },
    { name: 'has_linked_collection_estimates', type: 'BOOLEAN' },
    { name: 'requires_approval_confirmation', type: 'BOOLEAN' },
    { name: 'workforce_agreement_json', type: 'STRING' },
    { name: 'pdf_file_name', type: 'STRING' },
    { name: 'pdf_file_url', type: 'STRING' },
  ],
};

export class Warehouse {
  private readonly storage: Storage;
  private readonly bigquery: BigQuery;

  constructor(private gcp: Config['gcp']) {
    const options = {
      projectId: gcp.projectId,
      ...(gcp.keyFilename ? { keyFilename: gcp.keyFilename } : {}),
    };
    this.storage = new Storage(options);
    this.bigquery = new BigQuery(options);
  }

  async upload(localPath: string): Promise<void> {
    const { bucket, object } = this.gcp;
    logger.info('uploading to gcs', { destination: `gs://${bucket}/${object}` });

    await this.storage.bucket(bucket).upload(localPath, {
      destination: object,
      contentType: 'application/x-ndjson',
    });
  }

  async load(): Promise<number> {
    const { bucket, object, dataset, table } = this.gcp;
    logger.info('starting bigquery load job', { dataset, table });

    const source = this.storage.bucket(bucket).file(object);
    const [job] = await this.bigquery.dataset(dataset).table(table).load(source, {
      sourceFormat: 'NEWLINE_DELIMITED_JSON',
      writeDisposition: 'WRITE_TRUNCATE',
      schema: SCHEMA,
    });

    if (job.status?.errorResult) {
      throw new Error(`BigQuery load failed: ${JSON.stringify(job.status.errors ?? job.status.errorResult)}`);
    }

    return Number(job.statistics?.load?.outputRows ?? 0);
  }
}
