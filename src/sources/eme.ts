/**
 * Detects EME (Encrypted Media Extensions) support for Widevine.
 * Returns `{ widevineSupported: boolean }` when a definitive answer is available,
 * otherwise returns `{}`.
 *
 * Notes:
 * - Some environments (iframes with Permissions Policy, privacy extensions, disabled CDM)
 *   can cause the EME probe to be slow or unreliable. The caller wraps this with a soft
 *   timeout to avoid blocking overall signal collection.
 */
export type EmeInfo = { widevineSupported?: boolean };

export default async function getEmeInfo(): Promise<EmeInfo> {
  try {
    // If the page is not allowed to use EME by Permissions Policy, short-circuit.
    try {
      const doc: any = document as any;
      const policy = (doc && (doc.permissionsPolicy || doc.featurePolicy)) as any;
      if (policy && typeof policy.allowsFeature === "function") {
        if (policy.allowsFeature && policy.allowsFeature("encrypted-media") === false) {
          return {};
        }
      }
    } catch {}
    // Non-secure contexts and some embedded contexts may not reliably answer; avoid probing.
    try {
      const w: any = window as any;
      if (typeof w?.isSecureContext === "boolean" && w.isSecureContext === false) {
        return {};
      }
    } catch {}

    const nav: any = navigator as any;
    const req = nav?.requestMediaKeySystemAccess;
    if (typeof req !== "function") return {};
    const keySystem = "com.widevine.alpha";
    const config = [
      {
        initDataTypes: ["cenc"],
        audioCapabilities: [{ contentType: 'audio/mp4; codecs="mp4a.40.2"' }],
        videoCapabilities: [{ contentType: 'video/mp4; codecs="avc1.42E01E"' }],
      },
    ];
    try {
      await nav.requestMediaKeySystemAccess(keySystem, config as any);
      return { widevineSupported: true };
    } catch {
      return { widevineSupported: false };
    }
  } catch {
    return {};
  }
}


