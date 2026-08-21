# LORE: 10-Task Validation Audit

**Audit date:** 2026-08-21  
**Audited release:** `7bb6f18` (`main`)  
**Production web target:** `https://stixmagic.com`

## Executive assessment

The Aura Map and static LORE experience are **successfully deployed** to the production web origin. The production Archive page renders both the six-decision journey and the visible Aura Map v1. The current release is therefore suitable for validating the editorial onboarding and local-first experience.

However, the production site is served as a static export and does **not** currently expose the Fastify LORE API. `https://stixmagic.com/lore/me` returns HTTP 404. The LORE client now fails closed when `NEXT_PUBLIC_LORE_API_BASE_URL` is absent, so it no longer attempts to call localhost from a visitor's browser. As a result, authenticated cross-device resume, server-side access gates, private community destinations, funnel collection, email hooks, Nango operations, and administrative actions are implemented in source but **not live**. A production API endpoint and the Pages variable `LORE_API_BASE_URL_PAGES` are the release-critical dependency for the next sprint.

## Task-by-task validation

| # | Requested capability | Current evidence | Validation status | Production status | Main gap |
| --- | --- | --- | --- | --- | --- |
| 1 | Define Aura map and revealing decisions | `aura-map.ts` defines four Auras, six decisions, weighted options, version `v1`, primary reveal paths, and stable tie-break order. `/lore/archive` renders `AuraMap`. | **Complete** | **Live** | None for MVP validation. |
| 2 | Create **Enter the Archive** entry screen | `/lore/archive` contains the editorial entry, map, six-decision route, privacy copy, and metadata. | **Complete** | **Live** | None. |
| 3 | Save and resume Aura journey | Browser local fallback works; member API persists answers and progress; E2E covers reload and mocked cross-device resume. | **Implemented, blocked** | **Local only** | No production LORE API; `/lore/me` is 404. |
| 4 | Post-discovery LORE profile | Static-safe `/lore/profile` reads Aura from the client URL and reconciles browser/server state. | **Complete in code** | **Local-only profile state** | Remote profile recovery awaits production API. |
| 5 | First member-exclusive narrative drop | `The Soft Machinery` exists and the API rejects drop-read requests until a member has a completed Aura. | **Prototype gate only** | **Not secure in production** | Static client still exposes member-drop body; content must be served after server authorization. |
| 6 | Calendar for drops and events | Drop calendar exists with UTC dates. Nango/Google Calendar integration API and admin panel exist. | **Partial** | **Static dates only** | No connected Nango production configuration or deployed API; no event ingestion/publishing model. |
| 7 | Private Telegram invitation after onboarding | Profile queries an authenticated community destination; API returns it only after completed Aura and explicit environment configuration. | **Implemented, blocked** | **Unavailable** | Needs production API plus configured `LORE_PRIVATE_COMMUNITY_URL`; delivery currently uses optional email webhook, not Telegram bot automation. |
| 8 | No-code panel to publish and schedule drops | No LORE drops editorial route exists. Admin currently contains only Google Calendar integrations. Drops are hard-coded in `drop-data.ts`. | **Not started** | **Unavailable** | Requires persisted drop model, draft/publish/schedule workflow, role guard, and media/content storage. |
| 9 | Funnel instrumentation: invitation → journey → Aura → community | Browser event layer plus server event endpoints and an aggregated admin funnel endpoint are implemented. | **Implemented, blocked** | **No live collection** | Events fail closed against absent production API; dashboard surface is missing. |
| 10 | Review permissions, private links, exclusive-content protection | Signed invite identity, tenant scoping, member/admin route guards, HMAC Nango webhook verification, and API tests exist. | **Partial** | **Not enforceable from static site** | Private drop text must move off the static bundle and be served only after server authorization. |

## Production verification evidence

| Check | Result | Interpretation |
| --- | --- | --- |
| GitHub Pages workflow for `7bb6f18` | Passed | The latest static web build was deployed automatically from `main`. |
| `https://stixmagic.com/` | HTTP 200 | Production web origin is live. |
| `https://stixmagic.com/lore/archive/` | HTTP 200, contains `ENTER THE ARCHIVE` and `Four weather systems` | Aura Map v1 and Archive entry are live. |
| `https://stixmagic.com/lore/profile/?aura=tender-static` | HTTP 200 | Static-safe profile route is published. |
| `https://stixmagic.com/lore/me` | HTTP 404 | No production member API exists at the configured public origin. |
| API tests | 12 passing | Server contracts pass locally. |
| Playwright tests | 11 passing | Static UX, local resume, mocked remote resume, profile, drop and privacy behavior pass locally. |

## Release-critical conclusion

> **The Aura Map frontend is deployed. Remote resume is implemented and tested against a mocked member API, but it cannot be verified live until a public LORE API is deployed and injected through `NEXT_PUBLIC_STIXMAGIC_API_BASE_URL`.**

The `stixmagic-bot` repository was also reviewed as a possible host. Its current production process is a separate Flask/Telegram service and its own documentation explicitly describes production rollout as a manual restart of a persistent host. It is therefore not a safe automatic host for the Fastify LORE API without an explicit deployment and operations decision.

## Recommended sprint gate

Do not launch any paid, member-only, or private-community promise before the following gate is satisfied:

1. Deploy `services/api` to a persistent production runtime with protected environment variables and persistent tenant-scoped data.
2. Configure `NEXT_PUBLIC_STIXMAGIC_API_BASE_URL` to that HTTPS origin and rebuild/deploy the web app.
3. Move the member-only drop body off the static frontend bundle and return it only after the server authorizes the member.
4. Run a real signed-invite production resume test across two clean browser contexts.
5. Confirm the community URL is only returned after server-side completion and that no private URL is present in built JavaScript or static HTML.

This gate turns Tasks 3, 5, 7, 9, and 10 from local MVP contracts into production-capable member flows.
