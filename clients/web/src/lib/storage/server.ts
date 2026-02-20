"use server";

import { cookies } from "next/headers";
import keys from "./storage";
import { isKeyDef, type StorageKeyDef } from "./_internal/index";

type ServerHandle<T> = {
  value: T;
  set: (value: T) => Promise<void>;
  remove: () => Promise<void>;
};

type ServerStorage<T> = {
  [K in keyof T]: T[K] extends StorageKeyDef<infer V>
    ? Promise<ServerHandle<V>>
    : T[K] extends object
    ? ServerStorage<T[K]>
    : never;
};

async function resolveKey<T>(keyDef: StorageKeyDef<T>): Promise<ServerHandle<T>> {
  const { key, backend, defaultValue, cookieOptions } = keyDef._internal;

  if (backend === "localStorage") {
    return { value: defaultValue, set: async () => {}, remove: async () => {} };
  }

  const store = await cookies();
  const raw = store.get(key)?.value ?? null;
  const value: T = raw === null ? defaultValue : (() => { try { return JSON.parse(raw) as T; } catch { return defaultValue; } })();

  return {
    value,
    set: async (newValue: T) => { (await cookies()).set(key, JSON.stringify(newValue), cookieOptions ?? {}); },
    remove: async () => { (await cookies()).delete(key); },
  };
}

function createProxy<T extends object>(tree: T): ServerStorage<T> {
  return new Proxy(tree, {
    get(target, prop: string | symbol) {
      if (typeof prop !== "string") return undefined;
      const val = (target as Record<string, unknown>)[prop];
      if (isKeyDef(val)) return resolveKey(val);
      if (val && typeof val === "object") return createProxy(val as object);
      return undefined;
    },
  }) as ServerStorage<T>;
}

export default createProxy(keys);
