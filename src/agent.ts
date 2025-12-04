import { version } from '../package.json';
import type { BrowserSignals } from './types';
import { computeBrowserSignals } from './computeBrowserSignals';
import { computeVisitorId } from './anchor';

export interface LoadOptions {
  /**
   * Whether to print debug information (anchor payload and timing) to the console.
   */
  debug?: boolean;
}

export interface GetOptions {
  /**
   * Per-call debug override. If true, debug output is printed even when `load({ debug: false })`.
   */
  debug?: boolean;
}

export interface GetResult {
  /**
   * Anchor-based visitor identifier derived purely on the client.
   */
  visitorId: string;
  /**
   * Structured anchor payload built from device- and browser-level signals.
   */
  anchor: Record<string, unknown>;
  /**
   * Full browser signal bag as collected by the Guardian JS agent.
   */
  signals: BrowserSignals;
  /**
   * GuardianJS library version.
   */
  version: string;
}

export interface Agent {
  /**
   * Collects browser signals (if not already collected), computes the anchor and visitorId,
   * and returns the full result.
   */
  get(options?: Readonly<GetOptions>): Promise<GetResult>;
}

/**
 * Builds an Agent instance that lazily computes the visitorId from the collected signals.
 */
function makeAgent(signalsPromise: Promise<BrowserSignals>, debug?: boolean): Agent {
  const creationTime = Date.now();

  return {
    async get(options?: Readonly<GetOptions>): Promise<GetResult> {
      const startTime = Date.now();
      const signals = await signalsPromise;
      const { anchor, visitorId } = computeVisitorId(signals);

      if (debug || options?.debug) {
        // eslint-disable-next-line no-console
        console.log(
          `[GuardianJS] Debug data\n` +
            `version: ${version}\n` +
            `userAgent: ${signals.userAgent}\n` +
            `timeBetweenLoadAndGet: ${startTime - creationTime}ms\n` +
            `visitorId: ${visitorId}\n` +
            `anchor: ${JSON.stringify(anchor, null, 2)}\n`,
        );
      }

      return {
        visitorId,
        anchor,
        signals,
        version,
      };
    },
  };
}

/**
 * Initializes GuardianJS and starts collecting browser signals.
 *
 * Unlike the closed-source Guardian Pro agent:
 *  - No API key is required.
 *  - No network calls are made.
 *  - The visitorId is computed entirely on the client from anchor data.
 */
export async function load(options: Readonly<LoadOptions> = {}): Promise<Agent> {
  const { debug } = options;
  const signalsPromise = computeBrowserSignals();
  return makeAgent(signalsPromise, debug);
}


