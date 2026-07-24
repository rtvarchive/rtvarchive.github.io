# RTV ARCHIVE WEB SITE

A free, self-contained HTML template for an independent music label, artist
collective, or radio station.

## Pages

- `index.html` — Home (hero with kinetic marquee, releases, roster, tour, press)
- `archive.html` — Catalogue grid with format / genre filters
- `projects.html` — Roster grid with bios and listening links
- `about.html` — Studio info, demo submissions, contact form, stockist list

## Tech

- Static HTML, vanilla CSS, vanilla JS (no build step, no framework)
- Google Fonts: Bebas Neue (display), Syne (body), JetBrains Mono (mono)
- Polished SVG placeholders in `assets/img/` — replace with your own art
- Reduced-motion friendly, keyboard accessible, semantic landmarks
- Responsive at 320 / 768 / 1024 / 1440

## Replacing the placeholders

Every `<img>` is preceded by descriptive `alt` text and references SVG art in
`assets/img/`. Drop in your own cover art and artist portraits at the same
paths and the layout will absorb them. SVG covers are square (`100x100`
viewBox); portraits are 5:6.

## Customising

All design tokens live at the top of `assets/css/styles.css` as CSS custom
properties — palette, neon accents, type scale, spacing rhythm, motion easing.
Adjust there to recolor or rescale the whole template.

