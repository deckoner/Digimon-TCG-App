/**
 * Save an item in localStorage with TTL (seconds)
 */
export function setCache<T>(key: string, value: T, ttl: number) {
  const item = {
    value,
    expiry: Date.now() + ttl * 1000, // Convert seconds to milliseconds
  };
  localStorage.setItem(key, JSON.stringify(item));
}

/**
 * Retrieve an item from localStorage, returning null if expired or invalid
 */
export function getCache<T>(key: string): T | null {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return null;

  try {
    const item = JSON.parse(itemStr) as { value: T; expiry: number };
    if (Date.now() > item.expiry) {
      // Expired
      localStorage.removeItem(key);
      return null;
    }
    return item.value;
  } catch (e) {
    console.error('Error reading cache:', e);
    localStorage.removeItem(key);
    return null;
  }
}

/**
 * Remove an item from localStorage
 */
export function clearCache(key: string) {
  localStorage.removeItem(key);
}
