# lucas-arteaga.github.io

Personal site — live at **https://lucas-arteaga.github.io/**

Hand-written static site. No framework, no build step, no trackers, no web fonts, no cookies.
Three files and a favicon inlined as a data URI.

## Bilingual by construction

Both language versions live in the HTML, marked with `data-lang-only="en"` / `data-lang-only="es"`.
JavaScript only toggles which one is displayed. That means:

- the whole page is crawlable in both languages (no JS-rendered text),
- with JavaScript disabled the page is fully readable and every section visible,
- the choice is remembered in `localStorage`, and `?lang=en` / `?lang=es` overrides it.

## What is in here

| File | Role |
| :--- | :--- |
| `index.html` | Content: hero, figures, what I do, selected work, certifications, how I work, contact |
| `styles.css` | Dark theme, fluid type, responsive layout, reveal-on-scroll states |
| `app.js` | Language toggle, animated counters, scroll reveals, active-section nav, reading progress |
| `.nojekyll` | Skip Jekyll processing on GitHub Pages |

## The hero animation

The declination curve is inline SVG. The solid line and the dashed projection draw themselves
with `stroke-dasharray` / `stroke-dashoffset`, and a marker travels along the curve with
`offset-path` + `offset-distance`. It is a production decline curve — the shape every
production forecast is built on.

## Accessibility

- Semantic landmarks (`header`, `nav`, `main`, `section`, `footer`) and one `h1`.
- Skip-to-content link, visible `:focus-visible` outlines, `aria-pressed` on the language buttons.
- `prefers-reduced-motion: reduce` disables every animation and transition, and reveals content immediately.
- A `@media print` stylesheet strips the chrome.
- Colour contrast targets WCAG AA against the dark surface.

## Data attribution

Figures quoted on the page come from my own work and from public sources:

- Official per-well production data — **Secretaría de Energía**, published on `datos.gob.ar` under **CC-BY-4.0**.
- The GOR/RGP project dataset was provided for a course and included operator records; it is **not published here**.

## License

MIT — see [LICENSE](LICENSE).
