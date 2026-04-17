## 2024-04-15 - Accessible Tabs Pattern
**Learning:** The custom `Tabs` component lacked ARIA roles and keyboard focus styles, making it difficult for screen reader users and keyboard navigators to understand its state. Adding `role="tablist"`, `role="tab"`, `role="tabpanel"`, and proper `aria-controls`/`aria-labelledby` linkages is an essential pattern for custom interactive components in this design system.
**Action:** Always check custom interactive components like tabs or dialogs for proper ARIA roles and relationships, and ensure `focus-visible` styles are present for keyboard accessibility.

## 2024-05-17 - Radio Group Accessibility
**Learning:** Custom interactive elements that act as radio buttons (like the Trigger Type and Response Type grids in `ReactionsEditor`) need `role="radiogroup"` on the container and `role="radio"` with `aria-checked` on the options. Without these, screen readers treat them as separate buttons without a semantic group relationship. Note: True WCAG compliance for radiogroups expects arrow-key navigation rather than just `Tab`.
**Action:** When converting lists of options into custom radio-like selections, always apply `role="radiogroup"`, `role="radio"`, and `aria-checked` attributes to provide context to assistive technologies.
