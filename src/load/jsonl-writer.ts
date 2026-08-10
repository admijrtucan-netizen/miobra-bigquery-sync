import { createWriteStream, type WriteStream } from 'node:fs';
import { once } from 'node:events';
import { finished } from 'node:stream/promises';

export class JsonlWriter {
  private readonly stream: WriteStream;
  private rows = 0;
  private closed = false;

  constructor(readonly path: string) {
    this.stream = createWriteStream(path, { encoding: 'utf8' });
  }

  get rowCount(): number {
    return this.rows;
  }

  async write(row: unknown): Promise<void> {
    this.rows += 1;
    if (!this.stream.write(`${JSON.stringify(row)}\n`)) {
      await once(this.stream, 'drain');
    }
  }

  async close(): Promise<void> {
    if (this.closed) return;
    this.closed = true;
    this.stream.end();
    await finished(this.stream);
  }
}
