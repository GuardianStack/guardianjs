// Ambient DOM type augmentations used by GuardianJS sources.
// This mirrors the agent package's globals but without any runtime side effects.

export {};

declare global {
  interface Window {
    URLPattern?: new (...args: unknown[]) => unknown;
    webkitOfflineAudioContext?: typeof OfflineAudioContext;
    openDatabase?(...args: unknown[]): void;
  }

  interface Element {
    webkitRequestFullscreen?: typeof Element.prototype.requestFullscreen;
  }

  interface Document {
    msFullscreenElement?: typeof document.fullscreenElement;
    mozFullScreenElement?: typeof document.fullscreenElement;
    webkitFullscreenElement?: typeof document.fullscreenElement;

    msExitFullscreen?: typeof document.exitFullscreen;
    mozCancelFullScreen?: typeof document.exitFullscreen;
    webkitExitFullscreen?: typeof document.exitFullscreen;
  }

  interface Navigator {
    oscpu?: string;
    userLanguage?: string;
    browserLanguage?: string;
    systemLanguage?: string;
    deviceMemory?: number;
    cpuClass?: string;
    readonly msMaxTouchPoints?: number;
    connection?: {
      ontypechange?: () => void;
    };
  }

  interface CSSStyleDeclaration {
    zoom: string;
    textSizeAdjust: string;
  }
}



