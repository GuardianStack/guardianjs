export type WebGpuInfo = {
  supported: boolean;
  isFallbackAdapter?: boolean;
  vendor?: string;
  architecture?: string;
  device?: string;
};

export default async function getWebGpuInfo(): Promise<WebGpuInfo> {
  try {
    const nav: any = navigator as any;
    const gpu = nav?.gpu;
    if (!gpu || typeof gpu.requestAdapter !== "function") {
      return { supported: false };
    }

    const adapter: any = await gpu.requestAdapter();
    if (!adapter) {
      return { supported: true, isFallbackAdapter: true };
    }

    const info = (adapter as any).adapterInfo || {};
    return {
      supported: true,
      isFallbackAdapter: (adapter as any).isFallbackAdapter === true,
      vendor: typeof info.vendor === "string" ? info.vendor : undefined,
      architecture:
        typeof info.architecture === "string" ? info.architecture : undefined,
      device: typeof info.device === "string" ? info.device : undefined,
    };
  } catch {
    return { supported: false };
  }
}
