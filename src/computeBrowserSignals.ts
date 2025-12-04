import { BrowserSignals, PerformanceTimingInfo } from './types';
import { getWebGlBasics, getWebGlExtensions } from './sources/webgl';
import getWebGpuInfo from './sources/webgpu';
import getAudioFingerprint from './sources/audio';
import getMathFingerprint from './sources/math';
import getEmeInfo from './sources/eme';

function getNavigatorSafe(): Navigator | undefined {
  try {
    return typeof navigator !== 'undefined' ? navigator : undefined;
  } catch {
    return undefined;
  }
}

function getWindowSafe(): Window | undefined {
  try {
    return typeof window !== 'undefined' ? window : undefined;
  } catch {
    return undefined;
  }
}

function getPerformanceTiming(): PerformanceTimingInfo | undefined {
  try {
    const w = getWindowSafe() as any;
    if (!w?.performance?.now) return undefined;

    let min = 1;
    let max = 1;
    let prev = w.performance.now();
    let curr = prev;

    for (let i = 0; i < 50000; i++) {
      prev = curr;
      curr = w.performance.now();
      if (prev < curr) {
        const diff = curr - prev;
        if (diff > min) {
          if (diff < max) max = diff;
        } else if (diff < min) {
          max = min;
          min = diff;
        }
      }
    }

    return { precision: min, baseline: max };
  } catch {
    return undefined;
  }
}

/**
 * Collects the minimal set of browser signals required to build the anchor
 * used for the client-side visitorId. All work is performed locally in the
 * browser; no network calls are made.
 */
export async function computeBrowserSignals(): Promise<BrowserSignals> {
  const nav = getNavigatorSafe() as any;
  const basics = getWebGlBasics({ cache: {} });
  const extensions = getWebGlExtensions({ cache: {} });
  const webgpu = await getWebGpuInfo();
  const eme = await getEmeInfo();
  const mathFingerprint = getMathFingerprint();
  const audioFingerprint = getAudioFingerprint();
  const performanceTiming = getPerformanceTiming();

  let webgl: BrowserSignals['webgl'] = undefined;
  let webgExtensions: BrowserSignals['webgExtensions'] = undefined;

  if (typeof basics !== 'number') {
    webgl = {
      version: basics.version,
      vendor: basics.vendor,
      renderer: basics.renderer,
      vendorUnmasked: basics.vendorUnmasked,
      rendererUnmasked: basics.rendererUnmasked,
      shadingLanguageVersion: basics.shadingLanguageVersion,
      extensions: typeof extensions !== 'number' ? extensions.extensions ?? undefined : undefined,
    };
  }

  if (typeof extensions !== 'number') {
    webgExtensions = extensions;
  }

  const signals: BrowserSignals = {
    userAgent: nav?.userAgent || '',
    hardwareConcurrency: typeof nav?.hardwareConcurrency === 'number' ? nav.hardwareConcurrency : undefined,
    deviceMemory: typeof nav?.deviceMemory === 'number' ? nav.deviceMemory : undefined,
    webgl,
    webgExtensions,
    audioFingerprint,
    mathFingerprint,
    webgpu,
    eme,
    performanceTiming,
  };

  return signals;
}



