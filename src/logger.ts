type Level = 'debug' | 'info' | 'warn' | 'error';

const ORDER: Record<Level, number> = { debug: 10, info: 20, warn: 30, error: 40 };
const threshold = ORDER[(process.env.LOG_LEVEL as Level) ?? 'info'] ?? ORDER.info;

function emit(level: Level, message: string, context?: Record<string, unknown>) {
  if (ORDER[level] < threshold) return;
  const line = `${new Date().toISOString()} [${level}] ${message}`;
  const stream = level === 'error' || level === 'warn' ? process.stderr : process.stdout;
  stream.write(context ? `${line} ${JSON.stringify(context)}\n` : `${line}\n`);
}

export const logger = {
  debug: (message: string, context?: Record<string, unknown>) => emit('debug', message, context),
  info: (message: string, context?: Record<string, unknown>) => emit('info', message, context),
  warn: (message: string, context?: Record<string, unknown>) => emit('warn', message, context),
  error: (message: string, context?: Record<string, unknown>) => emit('error', message, context),
};
