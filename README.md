# RADIUS ARCHIVE — RADIUS TV ARCHIVE

An independent archival music project built around a fictional television center in the closed city of Radinsk (1976–1998). 

The project reconstructs lost recordings, broadcasts, and artifacts from a parallel history, presented through a dark, retro-futuristic web interface inspired by Soviet television, VHS aesthetics, and analog tape degradation.

> **Disclaimer:** A work of fiction. RADIUS ARCHIVE is an original archival reconstruction project. All characters, bands, institutes, and events are fictional.

## QA & Documentation
This project includes a full Software Testing Life Cycle (STLC) documentation:
- [Software Test Plan (STP)](docs/STP.md)
- [Software Test Description (STD)](docs/STD.md)
- [Software Test Report (STR)](docs/STR.md)

Automated tests are built with Playwright and run via GitHub Actions.

## Project Structure

- `index.html` / `ru/index.html` — Home page (hero, catalog, channels, manifesto)
- `projects.html` / `ru/projects.html` — Full catalog of 15 musical projects with filters
- `about.html` / `ru/about.html` — Archive lore, timeline, and Web3Forms submission
- `404.html` / `ru/404.html` — Custom "Signal Lost" error page with CRT test card
- `[project-name].html` — Individual project pages (e.g., `605.html`, `phasezero.html`) with tracklists and streaming modals.
- `assets/css/styles.css` — Global design system (colors, typography, layout)
- `assets/js/main.js` — Core interactive logic (filters, modals, mobile menu, form submission)
- `assets/img/` — Cover art, banners, and the 404 TV test card.

## Tech Stack

- **Static HTML / CSS / JS** — No build step, no frameworks.
- **Typography:** Google Fonts (`Bebas Neue`, `Syne`, `JetBrains Mono`).
- **Responsive:** Mobile-first, fluid typography, adaptive grids.
- **Accessibility:** Semantic landmarks, `aria` attributes, focus states, skip-links.
- **Forms:** Integrated with [Web3Forms](https://web3forms.com/) for archive submissions and bug reports.

## Core Interactions

- **Playlists & Modals:** Each project page features a streaming modal triggered by the "Listen on all platforms" button or the `?listen=1` deep link.
- **Filters:** The Projects page includes genre filtering with a "Show More" toggle.
- **Submissions:** The About page features a working submission form that sends entries directly to the archive's email.
- **404 Error:** A custom 404 page styled as a malfunctioning Soviet television test card, complete with static noise and a return button.

## Customising

Design tokens (colors, fonts, spacing) are defined as CSS custom properties at the top of `assets/css/styles.css`. Update these variables to adjust the global theme.

## Testing & QA

The project is prepared for automated testing (Playwright). 
Key elements are marked with `data-testid` attributes (e.g., `nav-home`, `artist-card-01`, `listen-button`, `submission-form`, `channel-605`) to ensure stable selectors for QA automation.