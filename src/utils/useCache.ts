export function setCache<T>(key: string, value: T, ttl: number) {
	const item = {
		value,
		expiry: Date.now() + ttl * 1000,
	};
	localStorage.setItem(key, JSON.stringify(item));
}

export function getCache<T>(key: string): T | null {
	const itemStr = localStorage.getItem(key);
	if (!itemStr) return null;

	try {
		const item = JSON.parse(itemStr) as { value: T; expiry: number };
		if (Date.now() > item.expiry) {
			// Expirado
			localStorage.removeItem(key);
			return null;
		}
		return item.value;
	} catch (e) {
		console.error("Error leyendo cache:", e);
		localStorage.removeItem(key);
		return null;
	}
}

export function clearCache(key: string) {
	localStorage.removeItem(key);
}
