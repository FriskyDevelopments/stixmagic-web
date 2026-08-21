# LORE Aura Map v1 — Presentation Script

**Audience:** product, design, engineering, and community operators  
**Suggested length:** 8–10 minutes  
**Release reference:** `7bb6f18`  

## Cover

**LORE Aura Map v1**  
**A quiet route through attention**  

### Speaker script

“LORE is an index of interior weather: a small, atmospheric system for following signals, keeping fragments, and making room for what is not yet named. This presentation introduces the Aura Map v1, the six-decision journey that reveals it, and the evidence we have for the current MVP release.”

## Slide 1 — The product is a route, not a feed

**On screen**

- Enter the Archive
- Follow six signals
- Receive an Aura
- Carry one trace forward

### Speaker script

“LORE begins with a different product posture. It does not ask a member to scroll through an endless feed or optimize for a public score. It offers a route. A member enters the Archive, answers six quiet questions, receives an Aura as a creative reflection, and carries that result into a profile, a drop, or a private room. The system is designed to reward attention rather than velocity.”

## Slide 2 — The map has four weather systems

**On screen**

| Aura | Core signal |
| --- | --- |
| Tender Static | You follow the afterimage. |
| Deep Water | You follow the pressure beneath the surface. |
| Afterglow | You follow the warmth that remains. |
| Night Bloom | You follow the shape that only appears at night. |

### Speaker script

“The map contains four Auras. Tender Static follows the afterimage: pauses, objects, and memory. Deep Water follows pressure beneath the surface: depth, silence, and patience. Afterglow follows the warmth that remains: movement, generosity, and release. Night Bloom follows the shape that only appears at night: thresholds, intuition, and possibility. These are not personality types and they are not diagnoses. They are names for temporary conditions of attention.”

## Slide 3 — Six decisions reveal the route

**On screen**

`what-stays → what-calls → what-makes → what-opens → what-keeps → what-returns`

- Every option contributes weighted signals.
- Every Aura has a six-node primary reveal path.
- The published order resolves ties.

### Speaker script

“The journey is deliberately small: six decisions, from what stays in an empty room to what returns when we look back. Each answer adds weighted points to one or more Auras, so the result is not a single simplistic choice. The map also publishes a six-node reveal path for every Aura, which makes the result explainable. The ruleset is versioned as v1, and a stable order resolves ties so the same response set always produces the same result.”

## Slide 4 — The Archive makes the rules visible

**On screen**

- Enter the Archive editorial entry
- Aura Map v1 before the journey
- Progress indicator: `01 / 06` through `06 / 06`
- Result → profile → first drop

### Speaker script

“The Archive route now shows the map before asking for a decision. This matters because the member can understand the shape of the experience without being shown a hidden quiz mechanism. The journey exposes its progress, saves after every answer, and ends with a clear path to the post-discovery profile. From there, the first narrative drop becomes the next room, subject to member access.”

## Slide 5 — Resume is designed for two realities

**On screen**

| Mode | Behavior |
| --- | --- |
| Local fallback | Browser storage keeps the route usable offline. |
| Member session | Server stores step, responses, Aura, and ruleset version. |

- Cross-device resume reconstructs scores from responses.
- No provider tokens are handled in the browser.

### Speaker script

“The MVP supports two realities. Without a member identity, the experience remains usable through browser-local storage. With a signed member session, the server stores the current step and the answers, and the client can reconstruct the exact journey on another device. This distinction is important: local persistence keeps the prototype graceful, while server persistence creates the foundation for a member product. Provider credentials and private destinations remain server-side.”

## Slide 6 — Architecture keeps the public layer quiet

**On screen**

`Static Next.js web → LORE API → tenant-scoped persistence`

- Next.js static export for the public editorial layer
- Fastify API for identity, progress, drops, events, and integrations
- Signed invite identity with tenant isolation
- Nango adapter for server-side Google Calendar operations

### Speaker script

“The architecture separates the quiet public layer from the protected member layer. The Next.js export serves the editorial surface and the map. The Fastify API owns identity, progress, drop access, funnel events, and integrations. Signed invite tokens are interpreted on the server, and the repository stores state by user and tenant. Nango is isolated behind a server-side adapter for Google Calendar; the browser receives connection status and bounded event data, never a provider token.”

## Slide 7 — Verification is strong locally and clear about the production gap

**On screen**

- 11 Playwright E2E tests passing
- 12 API tests passing
- Shared types, API, and web typecheck passing
- Aura Map production route: live
- Production `/lore/me`: not available yet

### Speaker script

“The current release has meaningful verification. Eleven Playwright scenarios cover onboarding, the Archive map, local persistence, remote-resume behavior through an API fixture, profile discovery, protected drops, and privacy behavior. Twelve API tests cover tenant scoping, signed identity, progress, drop gates, funnel aggregation, and HMAC webhook validation. The Aura Map is live at stixmagic.com. The important limitation is equally clear: the static production origin currently returns 404 for `/lore/me`, so remote resume has been verified locally against the member API contract, but not yet against a live production API.”

## Slide 8 — The next sprint is trust before expansion

**On screen**

1. **P0:** deploy the production LORE API and persist member state.
2. **P0:** move exclusive drop bodies behind server authorization.
3. **P0:** configure the private community destination and test revoked/expired access.
4. **P1:** add no-code drop publishing and a protected funnel dashboard.
5. **P2:** activate Nango Calendar and decide the Telegram delivery model.

### Speaker script

“The next sprint should not add more Auras or more decorative surfaces. The constraint is trust. First, deploy the API and wire the explicit production API URL. Then remove member-only drop bodies from the static bundle and serve them only after authorization. After that, configure the private community destination and test the negative cases: incomplete, revoked, expired, and wrong-tenant members. Once the trust boundary is real, the editorial panel, funnel dashboard, Nango Calendar, and Telegram delivery can safely scale the system.”

## Closing — Keep the door open

**LORE is ready for a protected member foundation.**  
**The map is stable. The next decision is infrastructure.**

### Speaker script

“The Aura Map v1 is now stable enough to be a product surface: it has a coherent narrative model, an explainable ruleset, a calm entry experience, persistence contracts, and automated verification. The next milestone is not a larger map. It is making the existing room safe to enter from another device, safe to share with a member, and safe to open without leaking what is meant to remain inside.”
