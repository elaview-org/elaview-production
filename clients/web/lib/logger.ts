import { ApolloLink, Observable } from "@apollo/client";
import pino from "pino";

const logger = pino({
  level: process.env.LOG_LEVEL || "debug",
  timestamp: pino.stdTimeFunctions.isoTime,
  ...(process.env.ELAVIEW_ENVIRONMENT === "development" && {
    transport: {
      target: "pino-pretty",
    },
  }),
});

export default logger;

const log = logger.child({ module: "graphql" });

export const loggingLink = new ApolloLink((operation, forward) => {
  const definition = operation.query.definitions.find(
    (d) => d.kind === "OperationDefinition"
  );
  const type =
    definition && "operation" in definition ? definition.operation : "unknown";
  const name = operation.operationName || "anonymous";
  const context = operation.getContext();
  const fetchPolicy = context.fetchPolicy as string | undefined;
  const nextCache = context.fetchOptions?.next as
    | Record<string, unknown>
    | undefined;
  const start = performance.now();

  log.debug(
    {
      operation: name,
      type,
      ...(fetchPolicy && { fetchPolicy }),
      ...(nextCache && { cache: nextCache }),
    },
    "request started"
  );

  return new Observable((observer) => {
    const subscription = forward(operation).subscribe({
      next(result) {
        const duration = `${Math.round(performance.now() - start)}ms`;

        if (result.errors?.length) {
          log.error(
            {
              operation: name,
              type,
              duration,
              errors: result.errors.map((e) => e.message),
            },
            "request failed"
          );
        } else {
          log.debug({ operation: name, type, duration }, "request completed");
        }

        observer.next(result);
      },
      error(err) {
        const duration = `${Math.round(performance.now() - start)}ms`;
        log.error(
          { operation: name, type, duration, error: String(err) },
          "request error"
        );
        observer.error(err);
      },
      complete() {
        observer.complete();
      },
    });

    return () => subscription.unsubscribe();
  });
});
