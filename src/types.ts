import type { WebGlExtensionsPayload } from './sources/webgl';
import type { WebGpuInfo } from './sources/webgpu';
import type { EmeInfo } from './sources/eme';

export type PerformanceTimingInfo = {
  precision: number;
  baseline: number;
};

/**
 * Minimal browser signal bag required to compute the anchor-based visitorId.
 * This intentionally includes only the fields used by `computeAnchor`.
 */
export interface BrowserSignals {
  userAgent: string;
  hardwareConcurrency?: number;
  deviceMemory?: number;
  webgl?:
    | {
        version?: string;
        vendor?: string;
        renderer?: string;
        vendorUnmasked?: string;
        rendererUnmasked?: string;
        shadingLanguageVersion?: string;
        extensions?: string[] | null;
      }
    | undefined;
  /**
   * Raw WebGL extensions payload, when successfully collected.
   * When collection fails, this may be `undefined`.
   */
  webgExtensions?: WebGlExtensionsPayload | undefined;
  /**
   * Audio fingerprint (or a lazy thunk resolving to one) as returned by the audio source.
   */
  audioFingerprint?: number | (() => Promise<number>);
  /**
   * Deterministic math fingerprint based on floating‑point quirks.
   */
  mathFingerprint?: Record<string, number>;
  /**
   * WebGPU capability snapshot.
   */
  webgpu?: WebGpuInfo;
  /**
   * Widevine / EME support info.
   */
  eme?: EmeInfo;
  /**
   * Performance timing precision/baseline.
   */
  performanceTiming?: PerformanceTimingInfo;
}



