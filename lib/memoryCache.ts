type CacheEntry<T> = { data: T; expiresAt: number };

export function createMemoryCache<T>(ttlMs: number) {
  let entry: CacheEntry<T> | null = null;

  return {
    get(): T | null {
      if (!entry || Date.now() > entry.expiresAt) return null;
      return entry.data;
    },
    set(data: T) {
      entry = { data, expiresAt: Date.now() + ttlMs };
    },
    clear() {
      entry = null;
    },
  };
}
