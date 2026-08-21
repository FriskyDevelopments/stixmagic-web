# LORE Aura Map

## Purpose

The Aura map is the canonical v1 ruleset for the LORE Archive route. It is a creative reflection system, not a psychological assessment, diagnosis, identity proof, or ranking. Each route contains six decisions. Every selected option contributes weighted points to one or more Auras; the highest total at completion is revealed.

## Auras and reveal paths

| Aura | Core signal | Six primary reveal signals |
| --- | --- | --- |
| Tender Static | You follow the afterimage. | Shape in the air → flicker behind the curtain → image with one detail missing → memory not yet visited → loose red thread → a little more softness |
| Deep Water | You follow the pressure beneath the surface. | Change in temperature → water where it should not be → exact observations → weather inside a room → warm stone → clean line through the noise |
| Afterglow | You follow the warmth that remains. | Light left on → voice saying your name → gesture for someone else → light left on for company → unused match → courage to leave warmth |
| Night Bloom | You follow the shape that only appears at night. | Shape in the air → water where it should not be → object with a hidden side → path in the dark → key with no lock → door not expected |

## Decision sequence

The six decision IDs are `what-stays`, `what-calls`, `what-makes`, `what-opens`, `what-keeps`, and `what-returns`. The client renders the same ordered sequence for every member. The ruleset is versioned as `v1` and the server accepts completed progress only when the reported Aura uses that version.

## Determinism

The winner is selected by descending weighted score. Ties resolve by the published order: Tender Static, Deep Water, Afterglow, then Night Bloom. This guarantees the same result for the same response set on every device. When a signed member session is present, the server stores the current step, responses, Aura, and ruleset version; the client retains a local fallback so the experience remains usable offline.

## Access boundary

The profile and member-only drop are unlocked only after a completed Aura journey. Community destinations are returned by the server only when explicitly configured. No provider token, private URL, refresh token, or credential is sent to the browser as part of the map flow.
