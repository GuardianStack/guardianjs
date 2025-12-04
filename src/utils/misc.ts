/**
 * @fileoverview Miscellaneous utility functions
 * 
 * This module contains various helper functions that don't fit into other categories.
 * 
 * @module utils/misc
 */

/**
 * Converts an error object to a plain object that can be serialized with JSON.stringify.
 * 
 * Error objects don't serialize properly with JSON.stringify by default - they produce '{}'. 
 * This function extracts the error's properties into a plain object.
 * 
 * @param {Readonly<Error>} error - The error to convert.
 * @returns {Record<string, unknown>} A plain object with the error's properties.
 * 
 * @example
 * ```typescript
 * try {
 *   throw new Error('Something went wrong');
 * } catch (error) {
 *   const serializable = errorToObject(error);
 *   console.log(JSON.stringify(serializable));
 * }
 * ```
 * 
 * @public
 */
export function errorToObject(error: Readonly<Error>): Record<string, unknown> {
  return {
    name: error.name,
    message: error.message,
    stack: error.stack?.split('\n'),
    // The fields are not enumerable, so TS is wrong saying that they will be overridden
    ...(error as Omit<Error, 'name' | 'message'>),
  }
}

/**
 * Checks if a function is a native browser function (not overridden or polyfilled).
 * 
 * Native functions have '[native code]' in their string representation.
 * This can be useful for detecting if browser APIs have been tampered with.
 * 
 * @param {(...args: unknown[]) => unknown} func - The function to check.
 * @returns {boolean} True if the function appears to be native.
 * 
 * @example
 * ```typescript
 * isFunctionNative(Array.prototype.map); // true
 * isFunctionNative(() => {}); // false
 * ```
 * 
 * @public
 */
export function isFunctionNative(func: (...args: unknown[]) => unknown): boolean {
  return /^function\s.*?\{\s*\[native code]\s*}$/.test(String(func))
}
