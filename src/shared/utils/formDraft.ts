export function getDraft<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}
export function setDraft<T>(key: string, val: T) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('setDraft failed:', err);
    }
  }
}
export function clearDraft(key: string) {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('clearDraft failed:', err);
    }
  }
}
