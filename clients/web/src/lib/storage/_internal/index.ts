export type StorageBackend = "localStorage" | "cookie";

export type CookieOptions = {
  maxAge?: number;
  path?: string;
  sameSite?: "lax" | "strict" | "none";
  secure?: boolean;
  httpOnly?: boolean;
};

export type StorageKeyDef<T> = {
  readonly _internal: {
    readonly key: string;
    readonly backend: StorageBackend;
    readonly defaultValue: T;
    readonly cookieOptions?: CookieOptions;
  };
};

export type StorageTree = {
  [k: string]: StorageKeyDef<unknown> | StorageTree;
};

export function def<T>(
  key: string,
  backend: StorageBackend,
  defaultValue: T,
  cookieOptions?: CookieOptions
): StorageKeyDef<T> {
  return { _internal: { key, backend, defaultValue, cookieOptions } };
}

export function isKeyDef(val: unknown): val is StorageKeyDef<unknown> {
  return typeof val === "object" && val !== null && "_internal" in (val as object);
}
