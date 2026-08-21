## Playwright diagnostic findings

The common onboarding failures were caused by the Playwright base URL using `127.0.0.1`. Next development rejects static chunk requests carrying that origin with HTTP 403, so client hydration never completed. Switching Playwright to `http://localhost:3000` removes the 403 and restores the onboarding dialog.

The current Shelf failure screenshot shows the archive card and its `SAVE TO SHELF` control rendered correctly at the anchor. The remaining assertion must be debugged as a state/selector issue after the click rather than a missing base page. The visual direction remains consistent with LORE: dark editorial canvas, restrained mono labels, serif display type, and Aura-colored orbit accents.
