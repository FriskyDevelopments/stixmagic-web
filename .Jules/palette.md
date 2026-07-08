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

## 2024-12-16 - Accessible Radiogroup Navigation
**Learning:** For custom mutually exclusive selection UI components built with buttons (like the `MaskCatalog`), simple `aria-pressed` toggles are insufficient for screen readers. Using `role="radiogroup"` with `role="radio"` and `aria-checked` accurately communicates semantic grouping. More importantly, keyboard accessibility for these groups must strictly follow W3C ARIA specs: implementing a roving `tabIndex` (`selected ? 0 : -1`) combined with arrow-key navigation logic, ensuring the entire group acts as a single tab stop rather than forcing users to tab through every individual option.
**Action:** When creating mutually exclusive options out of non-native inputs, always apply the complete `radiogroup` pattern, including arrow-key-based focus management and roving tab indexes.

## 2024-05-16 - Roving TabIndex for ARIA Tabs
**Learning:** Standard ARIA Tab components built manually require more than just `role="tab"` and `role="tabpanel"`. They must implement a roving tabindex (`tabIndex={isSelected ? 0 : -1}` on the tabs) and arrow-key navigation so the entire tablist acts as a single tab stop. Additionally, the active `tabpanel` itself should have `tabIndex={0}` and a visible focus style so users can tab directly into the active pane from the tablist.
**Action:** When implementing custom tab components, always verify that the roving tabindex pattern is implemented with arrow key navigation, and ensure the content pane is focusable.

## 2024-12-16 - Make Cards Fully Clickable with Links
**Learning:** Grids of content cards (like the packs grid) that are intended to navigate users to detail pages often miss actual semantic links if the card is built mostly for display (e.g. wrapped in an animation div instead of an anchor). This hurts accessibility (no tab focus, screen readers can't activate them) and general usability (can't right-click or middle-click to open in a new tab).
**Action:** When a visual card represents a destination, always wrap the card component (or its interactive area) in a standard semantic `<Link>` component with `focus-visible` ring styling to maintain accessibility and expected browser behaviors.

## 2024-12-16 - Explicit Empty States for Dynamic Grids
**Learning:** When using map functions to render dynamic data grids (e.g., connected groups or active rules), simply checking `loading` is not enough. If the loaded data array is empty (`length === 0`), it leaves a blank void in the UI. This is bad for user experience and accessibility, as users are unsure if it's broken, still loading invisibly, or truly empty.
**Action:** Always provide explicit, visually distinct empty states (e.g., using a disabled or secondary `<Panel>`) containing helpful text and a clear call-to-action when dynamic lists or grids return zero results.

## 2024-06-03 - Added SVG Loading Spinner to Async Button
**Learning:** Adding an inline SVG loading spinner to an async submit button gives much better immediate visual feedback that a process is running compared to just updating the button text (e.g. from "Save" to "Saving...").
**Action:** Always include an `aria-hidden="true"` SVG spinner next to the text on asynchronous primary action buttons to convey loading state, and use `inline-flex items-center justify-center gap-2` on the button itself.
## 2026-06-11 - [Grid Components Accessibility and UX Polish]
**Learning:** When building dynamic grid or list components (like `PackGrid`, `GalleryGrid`), it's crucial for accessibility to use semantic list wrappers (`<ul>` and `<li>`) so assistive technologies can announce the number of items. Additionally, explicitly handling the empty state (e.g., providing a visually distinct `<Panel>` with guidance) avoids rendering a confusing blank space when no items match.
**Action:** Always verify that mapped list/grid components in `@stixmagic/ui` default to semantic `<ul>` and `<li>` structures, and explicitly render an empty state UI when array lengths are zero.

## 2026-06-19 - Accessible "Coming Soon" Tabs/Buttons
**Learning:** When implementing 'Coming Soon' tabs or similar inactive buttons, using the native `disabled` attribute completely removes them from the keyboard navigation sequence. This prevents screen reader users and keyboard navigators from discovering what features are upcoming.
**Action:** Always use `aria-disabled="true"` instead of the native `disabled` attribute for these types of elements. Ensure they remain focusable and continue to use CSS utility classes (e.g., `opacity-50 cursor-not-allowed hover:text-muted/50`) to visually simulate the disabled state.

## 2024-12-16 - Decorative Elements Accessibility
**Learning:** Decorative background elements, such as glows, blurs, and ASCII visual separators (e.g., '✦ ───────── ✦'), that serve no semantic or structural purpose can create significant noise for screen reader users if left exposed in the accessibility tree. They are often announced generically (like 'span') or read out as literal punctuation, causing confusion.
**Action:** Always ensure that purely visual, non-informative elements (like decorative spans, background gradients, SVG shapes without meaning, and ASCII art) are explicitly hidden from assistive technologies by applying `aria-hidden="true"`.

## 2024-12-16 - Accessible External Links
**Learning:** External links that open in a new tab (using `target="_blank"`) can disorient screen reader users because they switch the user's context without warning. Additionally, external links missing `rel="noopener noreferrer"` can pose security/performance risks.
**Action:** Whenever adding an external link that opens in a new tab, always include `rel="noopener noreferrer"` and append visually hidden text (e.g. `<span className="sr-only"> (opens in a new tab)</span>`) inside the link to warn users of assistive technologies.
