import type { BrowserSignals } from './types';
import { canonicalize, normalizeString, stableHash } from './hash';

export type AnchorPayload = Record<string, unknown>;

/**
 * Builds a stable anchor signature from robust, device‑level signals that
 * should not change with viewport emulation or minor browser configuration
 * drifts. This closely mirrors the backend VisitorService anchor logic but
 * runs entirely in the browser.
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
 */
export function computeVisitorId(signals: Partial<BrowserSignals>): { anchor: AnchorPayload; visitorId: string } {
  const anchor = computeAnchor(signals);
  const anchorHash = stableHash(canonicalize(anchor));
  // 22 chars roughly mirrors the backend truncation and keeps IDs short but stable.
  const visitorId = anchorHash.slice(0, 22);
  return { anchor, visitorId };
}


