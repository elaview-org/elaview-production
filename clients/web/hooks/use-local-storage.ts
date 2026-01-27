import { useCallback, useSyncExternalStore } from "react";

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const getSnapshot = useCallback((): T => {
    const stored = localStorage.getItem(key);
    if (stored === null) return defaultValue;
    try {
      return JSON.parse(stored) as T;
    } catch {
      return defaultValue;
    }
  }, [key, defaultValue]);

  const getServerSnapshot = useCallback((): T => defaultValue, [defaultValue]);

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const handleStorage = (e: StorageEvent) => {
        if (e.key === key || e.key === null) {
          onStoreChange();
        }
      };
      window.addEventListener("storage", handleStorage);
      return () => window.removeEventListener("storage", handleStorage);
    },
    [key]
  );

  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const set = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      const current = getSnapshot();
      const resolved =
        newValue instanceof Function ? newValue(current) : newValue;
      localStorage.setItem(key, JSON.stringify(resolved));
      window.dispatchEvent(new StorageEvent("storage", { key }));
    },
    [key, getSnapshot]
  );

  const remove = useCallback(() => {
    localStorage.removeItem(key);
    window.dispatchEvent(new StorageEvent("storage", { key }));
  }, [key]);

  return { value, set, remove };
}