## 2024-04-13 - Form Accessibility in ReactionsEditor
**Learning:** Found a specific accessibility pattern where Next.js forms lacked proper `htmlFor` and `id` linking for standard text inputs and textareas, making screen reader navigation difficult and lacking click-to-focus for labels.
**Action:** When working on similar form components in `packages/ui` or `apps/web/app`, ensure that all custom inputs properly accept and set an `id`, and always associate their label using `htmlFor`.
