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
