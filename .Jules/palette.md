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

## 2024-12-14 - ARIA Live Regions for Dynamic Messages
**Learning:** Dynamic, auto-dismissing toast or inline notification messages (such as "Rule saved successfully" or error messages) must use ARIA live regions to be perceivable by screen reader users. Without `aria-live`, visually appearing text is silent to assistive technologies, leading to missed critical feedback.
**Action:** Always add `role="status" aria-live="polite"` to dynamically appearing non-critical status messages (like success toasts), and `role="alert" aria-live="assertive"` to critical or error messages.

## 2024-05-07 - Accessible Custom Radio Groups
**Learning:** When building custom radio button selections with `<button>`, using `aria-pressed` incorrectly treats them as individual toggles rather than mutually exclusive options. Wrapping them in a container with `role="radiogroup"` and applying `role="radio"` and `aria-checked` provides the correct semantic grouping for screen readers.
**Action:** Always use `radiogroup` / `radio` for mutually exclusive options instead of independent toggles to ensure standard keyboard and screen reader accessibility patterns.

## 2024-12-15 - Required Field Indicators and Submit Button Titles
**Learning:** When creating forms with multiple required fields, relying solely on a disabled submit button can be frustrating for users who don't know what is missing. A common pattern in this app is to disable the submit button based on form state (`!form.name.trim() || ...`).
**Action:** Always pair a disabled submit button with a helpful `title` attribute explaining the disabled state (e.g., `title={saving ? 'Saving...' : !isValid ? 'Please fill out all required fields' : undefined}`). In addition, ensure standard required visual indicators (a red `*` hidden from screen readers `aria-hidden="true"`) and semantic properties (`required`, `aria-required="true"`) are explicitly set on the inputs and labels to make expectations clear.

## 2024-12-16 - Accessible Card Grid Links
**Learning:** In grids of components (like `PackGrid`), wrapping interactive cards (`PackCard`) inside standard Next.js `<Link>` components is critical for making grid items accessible and navigable via keyboard. Without an interactive wrapping element like `<Link>` or `<button>`, users relying on keyboard navigation cannot access or focus these elements.
**Action:** When constructing interactive grids mapping to distinct routes (such as a detail page), ensure you wrap the card content in an explicit `<Link>` element, and reliably apply standard focus styling to the wrapper (`focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50`) so its focused state is clearly visible.
