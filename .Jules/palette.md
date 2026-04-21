## 2024-04-15 - Accessible Tabs Pattern
**Learning:** The custom `Tabs` component lacked ARIA roles and keyboard focus styles, making it difficult for screen reader users and keyboard navigators to understand its state. Adding `role="tablist"`, `role="tab"`, `role="tabpanel"`, and proper `aria-controls`/`aria-labelledby` linkages is an essential pattern for custom interactive components in this design system.
**Action:** Always check custom interactive components like tabs or dialogs for proper ARIA roles and relationships, and ensure `focus-visible` styles are present for keyboard accessibility.
## 2026-04-18 - Confirmation Dialog for Destructive Actions
**Learning:** Destructive actions like deleting resources (e.g., reaction rules) must have a confirmation step to prevent accidental data loss. This improves user experience by giving a chance to recover from an accidental click.
**Action:** Use native `window.confirm` or custom dialog components to confirm actions before performing API calls to delete data.
