## 2024-04-15 - Accessible Tabs Pattern
**Learning:** The custom `Tabs` component lacked ARIA roles and keyboard focus styles, making it difficult for screen reader users and keyboard navigators to understand its state. Adding `role="tablist"`, `role="tab"`, `role="tabpanel"`, and proper `aria-controls`/`aria-labelledby` linkages is an essential pattern for custom interactive components in this design system.
**Action:** Always check custom interactive components like tabs or dialogs for proper ARIA roles and relationships, and ensure `focus-visible` styles are present for keyboard accessibility.

## 2026-04-18 - Confirmation Dialog for Destructive Actions
**Learning:** Destructive actions like deleting resources (e.g., reaction rules) must have a confirmation step to prevent accidental data loss. This improves user experience by giving a chance to recover from an accidental click.
**Action:** Use native `window.confirm` or custom dialog components to confirm actions before performing API calls to delete data.

## 2024-12-07 - Interactive Editor Focus States
**Learning:** Dynamic, app-like editors with custom-styled buttons often lose visible focus states entirely when using Tailwind defaults (like `focus:outline-none`). This makes keyboard navigation nearly impossible for power users or those relying on accessibility tools, as they can't tell which action is currently selected.
**Action:** When building interactive editor UIs with multiple action buttons, always explicitly add `focus-visible:outline-none focus-visible:ring-2` to buttons. Use context-aware ring colors (e.g., `focus-visible:ring-accent-[color]/50`) to match the button's intended styling or severity (like cyan for simulate, teal for toggle, pink for delete).

## 2024-12-10 - Consistent Link Focus States
**Learning:** In highly stylized, app-like dashboard views (such as the Control Center and connected groups UI), standard HTML links and card wrappers frequently lack prominent keyboard focus outlines, leading to hidden or "ghost" tabbing paths that confuse keyboard-only navigation. While focus states are common on standard buttons, interactive "clickable card" patterns built with wrappers like `<Link><Panel /></Link>` or raw text links without dedicated button semantics are regularly overlooked.
**Action:** Always check interactive text links, icon-only buttons, and structural card links for explicitly defined focus states. For Next.js/Tailwind components, reliably apply the `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-[color]/50` class combinations specifically when using standard `Link` or anchor wrappers to preserve consistent keyboard-driven discovery across the whole layout.
