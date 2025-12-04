/**
 * Lightweight, deterministic hashing utilities for use in the browser.
 *
 * These functions are intentionally simple and dependency‑free so that the
 * open‑source GuardianJS build can run in any modern browser without relying
 * on Node's `crypto` module or Web Crypto APIs.
 */

/**
 * Canonicalizes an object/array into JSON with sorted keys to guarantee
 * stable hashing across runtimes.
 */
export function canonicalize(value: unknown): string {
  return JSON.stringify(value, replacer);
}

function replacer(_key: string, val: any): any {
  if (!val || typeof val !== 'object' || Array.isArray(val)) return val;
  const sorted: Record<string, any> = {};
  for (const k of Object.keys(val).sort()) {
    sorted[k] = val[k];
  }
  return sorted;
}

/**
 * Normalizes a string for case‑insensitive comparisons and hashing.
 */
export function normalizeString(input?: string | null): string | undefined {
  if (!input) return undefined;
  const trimmed = input.trim().toLowerCase();
  return trimmed || undefined;
}

/**
 * Simple, non‑cryptographic but stable hash function.
 *
 * Produces a 16‑character hexadecimal string (64 bits of output) that is
 * sufficient for the open‑source client identifier. The Pro Guardian backend
 * uses stronger server‑side cryptography and additional signals.
 */
export function stableHash(value: unknown): string {
  const json = typeof value === 'string' ? value : canonicalize(value);
  let h1 = 0xdeadbeef ^ json.length;
  let h2 = 0x41c6ce57 ^ json.length;

  for (let i = 0; i < json.length; i++) {
    const ch = json.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }

  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  const hi = (h1 >>> 0).toString(16).padStart(8, '0');
  const lo = (h2 >>> 0).toString(16).padStart(8, '0');
  return hi + lo;
}



