import 'dotenv/config';

export interface Config {
  miobra: {
    username: string;
    password: string;
  };
  gcp: {
    projectId: string;
    bucket: string;
    object: string;
    dataset: string;
    table: string;
    keyFilename?: string;
  };
}

function required(key: string): string {
  const value = process.env[key]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function optional(key: string, fallback: string): string {
  return process.env[key]?.trim() || fallback;
}

export function loadConfig(): Config {
  return {
    miobra: {
      username: required('MIOBRA_USERNAME'),
      password: required('MIOBRA_PASSWORD'),
    },
    gcp: {
      projectId: required('GCP_PROJECT_ID'),
      bucket: required('GCS_BUCKET'),
      object: optional('GCS_OBJECT', 'data.jsonl'),
      dataset: required('BQ_DATASET'),
      table: required('BQ_TABLE'),
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim(),
    },
  };
}
