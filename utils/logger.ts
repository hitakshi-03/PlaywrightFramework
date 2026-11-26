export interface Logger {
  debug(message: string): void;
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
}

export function createLogger(scope: string): Logger {
  const formatMessage = (message: string): string => `[${scope}] ${message}`;

  return {
    debug: (message) => console.debug(formatMessage(message)),
    info: (message) => console.info(formatMessage(message)),
    warn: (message) => console.warn(formatMessage(message)),
    error: (message) => console.error(formatMessage(message)),
  };
}
