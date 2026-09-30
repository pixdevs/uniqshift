# UniqShift design rules

This document is the design contract for the UniqShift Ventures site. New UI must reuse the tokens, components, and patterns already defined in `styles.css`. Do not introduce a parallel palette, type scale, spacing scale, radius, shadow, or motion curve.

If a change cannot be expressed with the tokens below, extend the token first, then use it. Do not hardcode a one-off value in a component.

## Principles

1. **Quiet consulting surface.** The page is mostly neutral. Orange is an accent, used for section titles, focus, hover edges, the floating action button, and small washes.
2. **One typeface.** Manrope only. Hierarchy comes from size and weight, not from a second font.
3. **Dark is the default.** The first paint sets `data-theme="dark"` unless `localStorage.theme` is `light`. Both themes must stay complete.
4. **Token-driven scale.** Spacing, type, radius, and control size respond to `--ui-scale`. Do not invent a separate mobile size system.
5. **Motion is short and vertical.** Entrances move up and fade in. Hover lifts are 2px, or 4px on glass cards. Honor `prefers-reduced-motion`.

## Color

Use these custom properties. Do not add hex, rgb, or hsl values in component CSS except inside the token definitions in `:root` and `[data-theme="dark"]`.

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--color-primary` | `#F36C21` | `#ff8c42` | Section titles, focus, hover emphasis, FAB fill, feature index gradient |
| `--color-secondary` | `#1a1f3a` | `#e2e8f0` | Tooltip surface in light; paired with text in dark |
| `--color-text` | `#1a1f3a` | `#e2e8f0` | Headings, primary button fill, logo |
| `--color-text-light` | `#64748b` | `#94a3b8` | Body copy, nav links, meta labels |
| `--color-bg` | `#ffffff` | `#0a0a0a` | Page and primary sections |
| `--color-bg-alt` | `#fafafa` | `#111111` | Alternating sections and footer |
| `--color-border` | `#e5e7eb` | `#1f1f1f` | Hairlines, ghost borders, dividers |

Derived accent tokens (do not recompute ad hoc):

- `--accent-soft` — icon wells, primary-button sheen, social hover
- `--accent-softer` — section washes, service hover, social resting fill
- `--accent-glow` — primary-button hover shadow
- `--accent-wash` — section background wash
- `--cursor-glow` — desktop pointer wash

Glass (header, hero highlights, about cards, founder frame, floating links):

- `--glass-bg`, `--glass-border`, `--glass-shadow`
- Blur is `blur(20px) saturate(180%)` with the `-webkit-backdrop-filter` pair. Do not add a second blur recipe.

### Allowed exceptions

These are the only colors that may sit outside the token table, and only on the component named:

| Value | Where |
| --- | --- |
| `#ffffff` | FAB icon color (`.floating-contact__btn`) |
| `#2e7d32` / `#fff` | Form success state (`.btn--success`) |
| `#c62828` | Form error text (`.form__error`) |
| `#25D366` | WhatsApp brand mark only |
| `#0A66C2` | LinkedIn brand mark only |

Brand marks keep their official color. Do not recolor them to orange, and do not use those greens and blues anywhere else.

### Color rules

- Section titles (`.section__title`) are `--color-primary`. Page and hero titles stay `--color-text`.
- Primary buttons are filled with `--color-text` plus an `--accent-soft` sheen. They are not solid orange.
- Contact-section buttons are the quiet variant: `--color-bg-alt` fill, border, no lift, orange only on hover.
- Large areas stay `--color-bg` or `--color-bg-alt`. Orange appears as a wash, a 1–2px edge, or a small label.
- Body copy uses `--color-text-light`. Do not set paragraphs to the accent color.
- Every new surface needs a light value and a dark value. A rule that only works in one theme is incomplete.

## Typography

Font stack: `'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` (`--font-primary`).

Load weights 300, 400, 500, and 600 only. Do not add another family, and do not use weight 700.

| Role | Weight token | Size | Notes |
| --- | --- | --- | --- |
| Body | `--font-weight-regular` (400) | `16px` | `line-height: 1.7` |
| Hero title | `--font-weight-light` (300) | `clamp(2.5rem, 6vw, 4rem)` | `line-height: 1.2`, `letter-spacing: -0.03em` |
| Section title | `--font-weight-light` (300) | `clamp(1.5rem, 4vw, 2.25rem)` | Accent color, `letter-spacing: -0.02em` |
| Card / item title | `--font-weight-medium` (500) | `1rem`–`1.125rem` | `letter-spacing: -0.01em` |
| Supporting copy | `--font-weight-regular` (400) | `0.8125rem`–`0.9375rem` | `--color-text-light` |
| Eyebrow / label | `--font-weight-medium` (500) | `0.6875rem`–`0.8125rem` | Uppercase, `letter-spacing: 0.05em`–`0.06em` |
| Feature index | `--font-weight-semibold` (600) | inherits title | Gradient clip to `--color-primary` |

Heading defaults: weight 500, `line-height: 1.3`, `letter-spacing: -0.01em`, color `--color-text`. `h1` and `h2` drop to weight 300.

Rules:

- Use `clamp()` for display and section titles. Do not set a single fixed hero size.
- Do not underline links. Color change is the hover signal. Footer links move to `--color-primary`.
- Do not use all-caps for sentences or buttons. Uppercase is reserved for short labels (`.contact__headline`, `.contact__label`).
- Keep line length readable: hero subtitle max `700px`, section subtitle max `600px`, about lead max `800px`, contact intro max `22rem`.

## Spacing and layout

| Token | Value |
| --- | --- |
| `--spacing-xs` | `0.5rem` |
| `--spacing-sm` | `1rem` |
| `--spacing-md` | `2rem` |
| `--spacing-lg` | `4rem` |
| `--spacing-xl` | `6rem` |
| `--section-y` | `calc(4.5rem * var(--ui-scale))` |
| `--gap-md` | `calc(1.25rem * var(--ui-scale) + 0.5rem)` |
| `--card-pad` | `calc(1.25rem * var(--ui-scale) + 0.5rem)` |
| `--phi` | `1.618` |
| `--header-h` | `70px` |
| Container | `max-width: 1200px`, horizontal padding `--spacing-md` |

`--ui-scale` is `1` by default, `0.85` at `max-width: 968px`, and `0.72` at `max-width: 640px`. Button padding, icon size, card padding, gap, and FAB size must keep using this scale.

Layout rules:

- Page content sits in `.container`. Do not introduce a second max-width wrapper.
- Sections stack in document order: hero, about, why choose us, services, founder, contact, footer.
- Section backgrounds alternate `--color-bg` and `--color-bg-alt`. About and Why Choose Us may share `--color-bg-alt`; they are separated by different washes, not by a new color.
- Desktop grids for highlights, about, features, and services are 3 columns. Founder is `0.8fr 1.2fr`. Contact is `1fr 1fr`. Footer is `1.35fr 1fr 1fr 1fr`.
- At `640px` and below, those grids become 1 column. Hero highlight cards cap at `17.5rem` and center.
- Breakpoints are `968px` and `640px` only. Do not add `480px`, `1024px`, or `1200px` layout breakpoints.
- `scroll-padding-top` stays `--header-h` so anchor links clear the fixed header.

## Radius, elevation, borders

| Element | Radius |
| --- | --- |
| Buttons | `calc(10px * var(--ui-scale) + 2px)` |
| Glass cards | `calc(12px * var(--ui-scale) + 4px)` |
| Icon wells | `calc(8px * var(--ui-scale) + 2px)` |
| Founder frame / photo | `20px` / `16px` |
| Mobile contact dialog | `16px` |
| Tooltip | `6px` |
| FAB and social links | `50%` |

Elevation:

- Resting glass uses `--glass-shadow`.
- Header resting shadow is `0 2px 8px rgba(0, 0, 0, 0.05)`; scrolled is `0 4px 16px rgba(0, 0, 0, 0.12)` (dark scrolled: `0 4px 20px rgba(0, 0, 0, 0.4)`).
- Hover on glass cards may deepen the shadow and lift. Do not add drop shadows to text, and do not use a hard black shadow on light surfaces.
- Dividers are `1px` `--color-border`, or a short accent gradient (footer top rule, contact column rule). Do not use thick rules or double borders.

## Components

Class names follow BEM: `block__element--modifier`. Reuse the existing blocks. Do not create a second button, card, or form style.

### Header

- Fixed, full width, height `--header-h`, glass background, bottom glass border, `z-index: 1000`.
- Logo is the mark plus “UniqShift Ventures” at `1.25rem` / weight 500 / `letter-spacing: -0.02em`.
- Nav links are `0.9375rem`, `--color-text-light`, and become `--color-text` on hover or `.nav__link--active`.
- The menu toggle is hidden above `968px`. Below that, the menu is a full-height panel under the header.

### Buttons

- `.btn` is inline-block, weight 500, radius from the button token, padding `--btn-pad-y` / `--btn-pad-x` (horizontal padding is vertical × `--phi`).
- `.btn--primary` is the default call to action outside the contact section.
- `.btn--ghost` is transparent with a `--color-border` stroke. Hover turns border and text to `--color-primary`.
- Hover on hero and general buttons: `translateY(-2px)` plus the allowed shadow. Contact buttons do not lift.
- Disabled and `.btn--success` do not transform.
- On viewports `640px` and below, buttons have `min-height: 44px`.

### Cards and lists

- Hero highlights and about items use the shared glass surface.
- Feature items are unboxed. The index (`01`–`06`) is the accent, set with a background-clip gradient.
- Service items are unboxed, with a transparent left edge that becomes `--color-primary` on hover, plus an `--accent-softer` gradient. On small screens the left border is removed; the wash remains.
- Hover lift is `-2px` for highlights, features, and services, and `-4px` for about items and the founder frame.

### Forms

- Inputs are underline fields: transparent background, no side border, `1px` bottom `--color-border`.
- Focus sets the bottom border and a `1px` shadow to `--color-primary`. Do not use a boxed outline or a filled input.
- Placeholders use `--color-text-light`. Labels stay visually hidden (`.sr-only`) when the placeholder carries the name; the label element must still exist.
- Errors use the error exception color at `0.875rem`.
- On small screens the form opens in `.contact-dialog` (`min(100% - 2rem, 420px)`, radius `16px`). Above `640px` the dialog is a static, borderless flow inside the section.

### Footer and floating contact

- Footer sits on `--color-bg-alt` with a top border and a 2px accent gradient along the top edge.
- Social links are `1.75rem` circles (2rem on small screens), `--accent-softer` fill. Hover uses `--accent-soft`, primary-colored icon, and a 1px glow ring.
- Placeholder social items (no URL yet) use `.footer__social-link--placeholder`: not clickable, `opacity: 0.55`.
- Footer groups become accordions only at `640px` and below. Above that, accordion buttons are not interactive and panels stay visible.
- The floating control is a circle of `--fab-size`, fill `--color-primary`, icon `#ffffff`, fixed bottom-right (`30px`, or `16px` under `640px`), `z-index: 999`.
- Child actions are glass circles. WhatsApp and LinkedIn icons use their brand exception colors.

## Motion

| Token | Value |
| --- | --- |
| `--ease-out` | `cubic-bezier(0.4, 0, 0.2, 1)` |
| `--duration-fast` | `0.2s` |
| `--duration-normal` | `0.35s` |
| `--duration-slow` | `0.6s` |

- The default transition is `all var(--duration-normal) var(--ease-out)`.
- `.reveal` starts at `opacity: 0` and `translateY(24px)`, then `.is-visible` settles to rest. Delay comes from `--reveal-delay`.
- `.hero-enter` uses `fadeInUp` (20px, `0.8s`). On small screens it uses `heroFadeUp` (12px, `0.65s`).
- Ambient hero drift (`ambientDrift`, 18s) and the desktop cursor glow run only as atmosphere. They must not sit above content (`cursor-glow` is `z-index: 1`; sections are `z-index: 2`).
- Cursor glow is limited to `(hover: hover) and (pointer: fine)`.
- When `prefers-reduced-motion: reduce` is set, scroll is instant, glow and ambient layers are hidden, and reveals, hero entrance, and transitions are disabled. Do not add a new animation that ignores this block.

## Icons and images

- UI icons are inline SVG, `fill="none"`, `stroke="currentColor"`, `stroke-width="1.5"` (contact channel icons may use `1.75`). They inherit text color.
- Brand icons (LinkedIn, WhatsApp, Instagram, Facebook, email-in-footer) use `fill="currentColor"`.
- Decorative icons and the cursor layer are `aria-hidden="true"`.
- Logo files are `src/favico.png`. Header mark is 32px (28px under `640px`). Footer mark is 28px. Do not restyle the mark with CSS filters.
- Founder photo uses `object-fit: cover` inside the rounded glass frame, `loading="lazy"`, and a descriptive `alt`.

## Responsive behavior that must stay

- `968px` and below: hamburger nav, `--ui-scale: 0.85`, founder stacks with the photo first, feature and service descriptions clamp to 3 lines.
- `640px` and below: `--ui-scale: 0.72`, `--section-y: 2.25rem`, hero actions hidden, single-column grids, `.soft-trim` and `.form-optional` hidden, contact form becomes a dialog, footer accordions on, FAB tooltips hidden.
- Hero on small screens keeps equal space above and below the content, including header offset and FAB clearance.
- Interactive targets that are tapped on small screens (buttons, dialog close, accordion headers, channel buttons) stay at least 44px tall.

## Accessibility

- Contrast comes from the token pairs above. Do not lighten `--color-text-light` further, and do not put orange text on an orange wash.
- Focus must stay visible. Inputs use the primary underline. Do not remove outlines from buttons and links without a visible replacement.
- Icon-only controls need an `aria-label`. Menus, dialogs, and accordions keep `aria-expanded` and `aria-controls` in sync.
- External links use `target="_blank"` and `rel="noopener noreferrer"`.
- Theme is set on `<html data-theme>` before paint so the page does not flash the wrong theme.

## Do not

- Do not add a second font, a serif, or a display face.
- Do not fill large regions, hero backgrounds, or primary buttons with solid `#F36C21` or `#ff8c42`.
- Do not introduce purple, teal, blue-gray, or pure gray scales (`#333`, `#666`, `#111` as a new text color).
- Do not add card chrome (heavy borders, inner shadows, skewed panels, glassmorphism beyond the existing blur) to feature or service rows. Those rows stay open.
- Do not add new motion that travels sideways, spins content, or lasts longer than `--duration-slow`, except the existing ambient drift.
- Do not change breakpoints, `--phi`, or `--ui-scale` to fix a single component. Adjust that component inside the current scale.
- Do not ship a style that exists only in light or only in dark.

## Changing the system

1. Add or adjust the custom property in both `:root` and `[data-theme="dark"]` when the value is theme-dependent.
2. Point the component at the token.
3. Check the three widths: default, `968px`, and `640px`, in both themes.
4. Confirm `prefers-reduced-motion: reduce` still disables the new motion.

A visual change that skips step 1 is a violation of this file, even if it looks acceptable in one viewport.
