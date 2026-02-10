import type { Instrumentation } from "next";

export const onRequestError: Instrumentation.onRequestError = async (
  error,
  request,
  context
) => {
  const err = error as Error & { digest?: string };

  console.error("[request error]", {
    message: err.message,
    digest: err.digest,
    path: request.path,
    method: request.method,
    routerKind: context.routerKind,
    routePath: context.routePath,
    routeType: context.routeType,
    renderSource: context.renderSource,
    revalidateReason: context.revalidateReason,
  });
};
