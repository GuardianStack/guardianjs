import { load } from './agent';
export { load } from './agent';
export type { Agent, GetOptions, GetResult, LoadOptions } from './agent';
export type { BrowserSignals } from './types';
export { computeAnchor, computeVisitorId, type AnchorPayload } from './anchor';

// Default export for `import GuardianJS from '@guardianstack/guardianjs-free'` style.
export default { load };


