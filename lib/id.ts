/**
 * Generates a reasonably unique id for client-side list items
 * (questions, options). Prototype only — not for persistence keys.
 */
export function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2, 10);
}
