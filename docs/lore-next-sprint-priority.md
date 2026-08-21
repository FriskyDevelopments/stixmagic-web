# LORE Next Sprint Priority

**Basis:** 10-task validation audit for release `7bb6f18`, production smoke checks against `https://stixmagic.com`, 12 API tests, and 11 Playwright E2E tests.

## Sprint objective

The next sprint should convert LORE from a convincing static/local-first experience into a safe member product. The critical path is not another visual surface; it is a production API, persistent member identity, server-authorized exclusive content, and a real cross-device resume test. Until those pieces exist, the member-only drop, private community link, funnel, Nango state, and remote resume are only local contracts.

## Priority matrix

| Priority | Tasks | Why now | Definition of done | Dependencies |
| --- | --- | --- | --- | --- |
| **P0 — release gate** | 3, 5, 10 | Production currently serves the static web app, but `/lore/me` returns 404. The member-only drop body is present in the static client bundle and the server API is not deployed. | Deploy `services/api` to a persistent HTTPS host; set `NEXT_PUBLIC_LORE_API_BASE_URL`; move exclusive drop bodies behind an authorized API response; pass a clean two-browser signed-invite resume test; confirm private URLs and bodies are absent from public HTML/JS. | Production runtime, persistent storage, `LORE_MEMBER_INVITE_SECRET`, deployment secrets, CORS. |
| **P0 — member conversion** | 7 | The CTA is already modeled, but it cannot return a real private destination while the API is absent. | Configure the server-only community destination, return it only after a completed Aura, record the CTA event, and verify that no destination is present for incomplete or revoked members. | P0 API and server-side access control. |
| **P1 — operating system** | 8 | Drops are hard-coded in `drop-data.ts`; editorial staff cannot publish or schedule without a code change. | Add a tenant-scoped drop model with draft, scheduled, published, and archived states; add admin create/edit/publish/schedule routes; add an admin UI; enforce role and tenant boundaries; add audit records. | Persistent storage, admin identity, P0 API. |
| **P1 — measurement** | 9 | Client and server event contracts exist, but the production API is unavailable and there is no operator-facing funnel view. | Persist invitation, journey, decision, Aura, drop, and community events; add a protected funnel dashboard with daily totals, conversion rates, and cohort filters; redact free text and credentials. | P0 API, event retention policy, admin UI. |
| **P1 — trust and access** | 10 | Signed identity and HMAC webhook tests pass locally, but static content protection is not enforceable in production. | Threat-model invite replay, expiration, revocation, tenant confusion, content enumeration, and private-link leakage; add negative tests and production smoke checks; serve exclusive content only after authorization. | P0 API, security review, persistent store. |
| **P2 — calendar integration** | 6 | The calendar UI and Nango adapter exist, but no production Nango configuration or API runtime is available. | Configure Nango Connect Session and signed webhooks in production; store sanitized connection status by tenant; show next events with bounded fields; test connect, refresh, disconnect, and webhook replay behavior. | P0 API, Nango secrets, Google OAuth consent configuration. |
| **P2 — editorial invitation delivery** | 7 | The current hook is optional email-webhook delivery; Telegram-specific delivery is not implemented as a production workflow. | Decide whether the private CTA is a Telegram deep link, bot-delivered invitation, or both; implement the chosen server-side delivery and track delivered/opened outcomes. | P0 API, Telegram bot ownership and privacy decision. |
| **P3 — already complete but keep covered** | 1, 2, 4 | Aura Map v1, Enter the Archive, and the static-safe profile are live and covered. | Keep the 11 Playwright tests, map ruleset versioning, stable tie-break order, and profile deep-link test in CI. | None beyond CI health. |

## Recommended execution order

### Sprint day 1–2: production member foundation

Deploy the Fastify API separately from the static web host, select a persistent datastore, configure the production HTTPS origin, and add the CORS and invite-secret settings. Rebuild the web app with `NEXT_PUBLIC_LORE_API_BASE_URL`. The first acceptance test should create a member through a signed invite, answer three decisions in browser A, and resume at decision four in browser B.

### Sprint day 3–4: protected content and private community

Remove member-only drop bodies from the static data bundle. Replace them with sanitized drop metadata in the static calendar and an API endpoint that returns the body only after verifying the member’s tenant, status, Aura completion, drop visibility, release date, and revocation state. Then wire the server-returned community destination and test incomplete, complete, revoked, expired, and wrong-tenant cases.

### Sprint day 5: editorial and measurement foundations

Add the persisted drop lifecycle and protected admin operations, then connect the existing funnel event vocabulary to an aggregate dashboard. Do not add free-form analytics payloads or expose member email, invite tokens, provider credentials, or private destinations in the dashboard.

### Follow-on sprint: Nango and delivery channels

After the production API and access boundary are stable, configure Nango Google Calendar and decide the Telegram delivery model. Calendar is an operational enhancement; it should not delay the production protection gate.

## Explicit non-goals for the next sprint

The next sprint should not add more Aura archetypes, more decorative animations, a public leaderboard, diagnosis language, or a client-side shortcut around the member gate. The current four-Aura, six-decision map is sufficient to validate conversion and retention; production trust is the constraint.
