/**
 * Simple logger utility that handles console warnings from linting
 */
export const logger = {
  error: (message: string, ...args: unknown[]) => {
    // This is acceptable for error logging in development and production
    // biome-ignore lint/suspicious/noConsole: Error logging is necessary
    console.error(message, ...args);
  },
  warn: (message: string, ...args: unknown[]) => {
    // biome-ignore lint/suspicious/noConsole: Warning logging is necessary
    console.warn(message, ...args);
  },
  info: (message: string, ...args: unknown[]) => {
    if (process.env.NODE_ENV === "development") {
      // biome-ignore lint/suspicious/noConsole: Info logging is for development
      console.info(message, ...args);
    }
  },
  debug: (message: string, ...args: unknown[]) => {
    if (process.env.NODE_ENV === "development") {
      // biome-ignore lint/suspicious/noConsole: Debug logging is for development
      console.debug(message, ...args);
    }
  },
};
