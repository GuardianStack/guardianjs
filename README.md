## GuardianJS

[![NPM Version](https://img.shields.io/npm/v/@guardianstack/guardianjs-free?style=flat-square&color=blue)](https://www.npmjs.com/package/@guardianstack/guardianjs-free)
[![NPM Downloads](https://img.shields.io/npm/dm/@guardianstack/guardianjs-free?style=flat-square)](https://www.npmjs.com/package/@guardianstack/guardianjs-free)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@guardianstack/guardianjs-free?style=flat-square)](https://bundlephobia.com/package/@guardianstack/guardianjs-free)
[![License](https://img.shields.io/npm/l/@guardianstack/guardianjs-free?style=flat-square)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

Open-source, purely client-side browser fingerprinting that computes a stable **anchor-based visitor identifier** without any API keys or backend calls.

### What is GuardianJS?

GuardianJS is a lightweight library that:

- **Collects rich browser and device signals** via the Guardian JS Agent.
- **Builds a stable “anchor” signature** from GPU/WebGL, hardware, audio, math, and timing signals.
- **Hashes the anchor into a `visitorId`** that stays reasonably stable across sessions and incognito mode on the same device.

Everything runs **entirely in the browser** – no data is sent to Guardian, and no Guardian API key is required.

> **Note**: GuardianJS Free is designed for experimentation, prototyping, and low-risk use cases. For production-grade fraud prevention and far fewer false positives, you should use **Guardian Pro** instead (see below).

### Demo

Visit [GuardianJS vs Guardian Pro Demo](https://demo.guardianstack.ai) to see your visitor identifier.

Now, try visiting the same page in private / incognito mode and notice how the visitor identifier remains the **same**!

### Installation

```bash
npm install @guardianstack/guardianjs-free
```

or

```bash
yarn add @guardianstack/guardianjs-free
```

### Basic usage

GuardianJS mirrors the ergonomics of popular fingerprinting libraries: you **load** the agent once, then **get** the visitor identifier when needed.

```ts
import GuardianJS from '@guardianstack/guardianjs-free';

// Initialize GuardianJS at application startup
const guardianPromise = GuardianJS.load({ debug: false });

// Later, when you need a visitor identifier
guardianPromise
  .then(agent => agent.get())
  .then(result => {
    // Stable, anchor-based visitor identifier
    const visitorId = result.visitorId;

    // Structured anchor payload (GPU/WebGL/hardware/audio/math/timing)
    const anchor = result.anchor;

    // Full browser signals as collected by the Guardian JS Agent
    const signals = result.signals;

    console.log('visitorId', visitorId);
  });
```

#### API surface

- **`load(options?: LoadOptions): Promise<Agent>`**
  - **`debug?: boolean`**: when true, `agent.get()` will print timing and anchor details to the console.
- **`Agent.get(options?: GetOptions): Promise<GetResult>`**
  - **`GetResult.visitorId: string`**: the anchor-based visitor identifier.
  - **`GetResult.anchor: Record<string, unknown>`**: normalized anchor payload.
  - **`GetResult.signals: BrowserSignals`**: raw browser signals from the Guardian JS Agent.
  - **`GetResult.version: string`**: GuardianJS library version.

GuardianJS Free never attempts to contact the Guardian backend – it only reads browser APIs and computes identifiers locally.

### Limitations

#### Accuracy

Since GuardianJS Free processes and generates the fingerprints from within the browser itself, the accuracy is significantly lower than in the commercial version. Different users with identical hardware/software setups may share the same `visitorId`.

#### Security

Because the fingerprints are processed and generated entirely on the client, they are vulnerable to spoofing, replay attacks, and reverse engineering.

### Industry-leading accuracy with Guardian Pro

The main difference between GuardianJS Free and **Guardian Pro** lies in the number of attributes collected, how they are processed, and the accuracy in identifying visitors.

Guardian Pro is a **closed-source, commercial** device intelligence platform designed to prevent fraud and improve user experiences. It is an enhanced version of the open-source strategy and has been fully re-designed to solve the most challenging identification use cases.

Unlike GuardianJS Free, Guardian Pro achieves **industry-leading accuracy** because it:
- Processes browser attributes on the server to verify integrity.
- Analyzes vast amounts of auxiliary data (IP addresses, ASN, network routes, time-of-visit patterns).
- Uses advanced fuzzy matching to reliably deduplicate different visitors that have identical devices.
- Detects bots, automation tools, and spoofing attempts.

Guardian Pro is available for Web and native platforms. You can easily get started by signing up for a free trial.

### GuardianJS Free vs. Guardian Pro

The table below compares and contrasts these two products:

| Feature | GuardianJS Free | Guardian Pro |
| :--- | :---: | :---: |
| **Core Identification** | | |
| Basic signals (screen, OS, device) | ✓ | ✓ |
| Advanced signals (canvas, audio, fonts, WebGL) | - | ✓ |
| **Smart Signals (Output)** | | |
| Bot detection & automation scoring | - | ✓ |
| VPN / Proxy / Tor detection | - | ✓ |
| Browser tampering detection | - | ✓ |
| Incognito mode detection | - | ✓ |
| **Identifier Properties** | | |
| ID Type | Hash of local attributes | Server-verified VisitorID |
| ID Lifetime | Weeks (unstable on updates) | Months / Years |
| ID Origin | Client-side only | Server-issued |
| ID Collisions | Common on similar devices | Very rare |
| **Advanced Features** | | |
| Webhooks & Realtime API | - | ✓ |
| Geolocation (IP-based) | - | ✓ |
| Risk Scoring & Trust Labels | - | ✓ |
| **Operations** | | |
| Data Security | Your responsibility | Encrypted at rest |
| Support | GitHub Issues | Dedicated Support |

👉 **If you care about minimizing false positives and reliably catching bad actors, Guardian Pro is what you want in production.**

You can get started in minutes by signing up at:  
**[https://dashboard.guardianstack.ai](https://dashboard.guardianstack.ai)**

### License and contributions

- **License**: GuardianJS is released under the MIT license (see `LICENSE`).
- **Contributions**: Issues and pull requests are welcome. If you plan a significant change, consider opening an issue first to discuss the approach.
