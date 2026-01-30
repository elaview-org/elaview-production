import type { Instrumentation } from "next";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { default: logger } = await import("@/lib/logger");
    const log = logger.child({ module: "system" });

    globalThis.console.log = (...args: unknown[]) =>
      log.info(args.map(String).join(" "));
    globalThis.console.info = (...args: unknown[]) =>
      log.info(args.map(String).join(" "));
    globalThis.console.warn = (...args: unknown[]) =>
      log.warn(args.map(String).join(" "));
    globalThis.console.error = (...args: unknown[]) =>
      log.error(args.map(String).join(" "));
    globalThis.console.debug = (...args: unknown[]) =>
      log.debug(args.map(String).join(" "));

    const nextLog = logger.child({ module: "nextjs" });
    let stdoutBuffer: string[] = [];
    let stdoutTimer: ReturnType<typeof setTimeout> | null = null;

    function flushStdoutBuffer() {
      stdoutTimer = null;
      if (stdoutBuffer.length > 0) {
        const [first, ...rest] = stdoutBuffer;
        const message = rest.length
          ? first + "\n" + rest.map((l) => "    " + l).join("\n")
          : first;
        nextLog.debug(message);
        stdoutBuffer = [];
      }
    }

    process.stdout.write = (
      chunk: Uint8Array | string,
      encodingOrCallback?: BufferEncoding | ((err?: Error) => void),
      callback?: (err?: Error) => void
    ): boolean => {
      const text = typeof chunk === "string" ? chunk : chunk.toString();
      const clean = text.replace(/\x1B\[[0-9;]*[A-Za-z]/g, "").trim();

      if (clean) {
        stdoutBuffer.push(clean);
        if (stdoutTimer) clearTimeout(stdoutTimer);
        stdoutTimer = setTimeout(flushStdoutBuffer, 0);
      }

      const cb =
        typeof encodingOrCallback === "function"
          ? encodingOrCallback
          : callback;
      if (cb) cb();

      return true;
    };
  }
}

export const onRequestError: Instrumentation.onRequestError = async (
  error,
  request,
  context
) => {
  const { default: logger } = await import("@/lib/logger");
  const log = logger.child({ module: "nextjs" });

  const err = error as Error & { digest?: string };

  log.error(
    {
      message: err.message,
      digest: err.digest,
      path: request.path,
      method: request.method,
      routerKind: context.routerKind,
      routePath: context.routePath,
      routeType: context.routeType,
      renderSource: context.renderSource,
      revalidateReason: context.revalidateReason,
    },
    "request error"
  );
};
