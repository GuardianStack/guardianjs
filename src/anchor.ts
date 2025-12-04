/**
 * @fileoverview Anchor computation for stable visitor identification
 * 
 * This module is responsible for building a stable "anchor" signature from device-level
 * browser signals. The anchor is designed to remain consistent across sessions, viewport
 * changes, and minor browser configuration drifts.
 * 
 * The anchor excludes volatile signals like User-Agent, platform, DPR, and viewport
 * dimensions to maximize stability while maintaining sufficient entropy for identification.
 * 
 * @module anchor
 */

import type { BrowserSignals } from './types';
import { canonicalize, normalizeString, stableHash } from './hash';

/**
 * A normalized, stable payload derived from browser signals.
 * 
 * The anchor contains device-level signals that are less likely to change
 * across sessions or browser updates, making it suitable for visitor identification.
 * 
 * @typedef {Record<string, unknown>} AnchorPayload
 * 
 * @example
 * ```typescript
 * const anchor = computeAnchor(browserSignals);
 * // {
 * //   gpu: { vendor: 'apple', renderer: 'apple m1' },
 * //   webgl: { ext: '3a2b1c', xExt: '4d5e6f', ... },
 * //   hw: 8,
 * //   mem: 8,
 * //   ...
 * // }
 * ```
 */
export type AnchorPayload = Record<string, unknown>;

/**
 * Builds a stable anchor signature from robust, device‑level signals that
 * should not change with viewport emulation or minor browser configuration
 * drifts. This closely mirrors the backend VisitorService anchor logic but
 * runs entirely in the browser.
 * 
 * The anchor includes:
 * - GPU vendor and renderer information (WebGL)
 * - WebGL extensions and parameters
 * - Hardware concurrency (CPU cores)
 * - Device memory
 * - Audio fingerprint
 * - Math fingerprint (floating-point quirks)
 * - WebGPU support info
 * - EME (Widevine) support
 * - Performance timing characteristics
 * 
 * Excluded from the anchor:
 * - User-Agent string
 * - Platform information
 * - Device Pixel Ratio (DPR)
 * - Viewport dimensions
 * 
 * @param {Partial<BrowserSignals>} b - The browser signals to process.
 * @returns {AnchorPayload} A normalized anchor payload with deterministic key ordering.
 * 
 * @example
 * ```typescript
 * const signals = await computeBrowserSignals();
 * const anchor = computeAnchor(signals);
 * console.log(anchor);
 * ```
 * 
 * @public
 */
export function computeAnchor(b: Partial<BrowserSignals>): AnchorPayload {
  const vendor = normalizeString(b.webgl?.vendorUnmasked || b.webgl?.vendor);
  const renderer = normalizeString(b.webgl?.rendererUnmasked || b.webgl?.renderer);
  const gpu = vendor || renderer ? { vendor, renderer } : undefined;

  const webglExtApp = b.webgl?.extensions ? [...b.webgl.extensions].sort() : undefined;
  const webgExt = (b as any)?.webgExtensions?.extensions as string[] | undefined;
  const webgParams = (b as any)?.webgExtensions?.parameters as string[] | undefined;
  const webgShaderPrec = (b as any)?.webgExtensions?.shaderPrecisions as string[] | undefined;

  const hw = typeof b.hardwareConcurrency === 'number' ? b.hardwareConcurrency : undefined;
  const mem = typeof b.deviceMemory === 'number' ? b.deviceMemory : undefined;
  const audio = typeof b.audioFingerprint === 'number' ? b.audioFingerprint : undefined;
  const math = b.mathFingerprint ? b.mathFingerprint : undefined;
  const webgpu = b.webgpu ? { supported: !!b.webgpu.supported, isFallbackAdapter: !!b.webgpu.isFallbackAdapter } : undefined;
  const eme = typeof b.eme?.widevineSupported === 'boolean' ? (b.eme.widevineSupported ? 1 : 0) : undefined;
  const pt = b.performanceTiming ? stableHash(b.performanceTiming) : undefined;

  // Exclude UA, platform, DPR, viewport from the anchor to keep stability across responsive emulation.
  const anchor = {
    gpu,
    webgl: {
      ext: webglExtApp ? stableHash(webglExtApp) : undefined,
      xExt: Array.isArray(webgExt) && webgExt.length ? stableHash([...new Set(webgExt)].sort()) : undefined,
      params: Array.isArray(webgParams) && webgParams.length ? stableHash(webgParams.sort()) : undefined,
      shader: Array.isArray(webgShaderPrec) && webgShaderPrec.length ? stableHash(webgShaderPrec.sort()) : undefined,
    },
    hw,
    mem,
    audio,
    math,
    webgpu,
    eme,
    pt,
  };

  // Canonicalize to ensure deterministic key ordering; parse back to a plain object.
  return JSON.parse(canonicalize(anchor));
}

/**
 * Computes a deterministic visitor identifier from browser signals by:
 *  - deriving the anchor payload
 *  - canonicalizing and hashing the anchor
 *  - truncating the hash to a compact, URL‑safe identifier
 * 
 * The resulting visitor ID is a 22-character string that represents the unique
 * fingerprint of the device/browser combination.
 * 
 * @param {Partial<BrowserSignals>} signals - The browser signals to process.
 * @returns {{ anchor: AnchorPayload; visitorId: string }} An object containing both the anchor payload and the computed visitor ID.
 * 
 * @example
 * ```typescript
 * const signals = await computeBrowserSignals();
 * const { anchor, visitorId } = computeVisitorId(signals);
 * console.log('Visitor ID:', visitorId); // e.g., 'a1b2c3d4e5f6g7h8i9j0k1'
 * ```
 * 
 * @public
 */
export function computeVisitorId(signals: Partial<BrowserSignals>): { anchor: AnchorPayload; visitorId: string } {
  const anchor = computeAnchor(signals);
  const anchorHash = stableHash(canonicalize(anchor));
  // 22 chars roughly mirrors the backend truncation and keeps IDs short but stable.
  const visitorId = anchorHash.slice(0, 22);
  return { anchor, visitorId };
}


