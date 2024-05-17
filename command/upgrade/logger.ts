import type { Spinner } from "@std/cli/spinner";

export interface Logger {
  log(...data: Array<unknown>): void;

  info(...data: Array<unknown>): void;

  error(...data: Array<unknown>): void;
}

export interface LoggerOptions {
  spinner: Spinner;
  verbose?: boolean;
}

export function createLogger({ spinner, verbose }: LoggerOptions): Logger {
  function write(
    type: "log" | "info" | "error",
    ...args: Array<unknown>
  ): void {
    spinner && spinner.stop();
    console[type](...args);
    spinner && spinner.start();
  }

  return {
    log: (...args: Array<unknown>): void => {
      verbose && write("log", ...args);
    },
    info: (...args: Array<unknown>): void => write("info", ...args),
    error: (...args: Array<unknown>): void => write("error", ...args),
  };
}
