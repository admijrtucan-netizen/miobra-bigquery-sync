# miobra-bigquery-sync

One-shot batch job: pulls purchase orders from Miobra API, writes them as newline-delimited JSON, uploads to Cloud Storage, and loads into BigQuery.

## Setup

```sh
npm install
cp env.example .env
npm run build
```

## Running

```sh
npm start              # full run
npm run dry-run       # extract only
LOG_LEVEL=debug npm start
```

## How it works

```
Miobra API (/api/users/login/ → /api/purchases/)
    ↓
JSON objects extracted
    ↓
JSONL written to /tmp/
    ↓
gs://bucket/data.jsonl (GCS upload)
    ↓
BigQuery MIOBRA.ordenes_compra (WRITE_TRUNCATE load)
```

## Deploying on GitHub Actions

The workflow runs daily at 6:00 AM UTC.

Required secrets in GitHub:
- `MIOBRA_USERNAME` — Email or username for Miobra API
- `MIOBRA_PASSWORD` — Password for Miobra API
- `GCP_PROJECT_ID` — Google Cloud project ID
- `GCS_BUCKET` — Cloud Storage bucket name
- `BQ_DATASET` — BigQuery dataset name
- `BQ_TABLE` — BigQuery table name
- `GCP_SERVICE_ACCOUNT_KEY` — Service account key (base64 encoded)
