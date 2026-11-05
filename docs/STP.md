# Software Test Plan (STP)
**Project:** RADIUS ARCHIVE Web Application
**Version:** 1.0
**Date:** November 2026
**Author:** QA Lead / Test Automation Engineer

## 1. Introduction
This document outlines the test plan for the RADIUS ARCHIVE web project. It defines the scope, approach, resources, and schedule of intended testing activities. The project is a static multi-page website built with HTML, CSS, and Vanilla JS, hosted on GitHub Pages.

## 2. Scope of Testing
### 2.1. In Scope
The following areas and features will be tested:
*   **Navigation & Routing:** Primary navigation (Home, Projects, About), language switching (EN ↔ RU), skip-links, and 404 page routing.
*   **Interactive Elements (JS):**
    *   Mobile menu toggle.
    *   Filtering system on the Projects page (genre tags, "+ More" toggle).
    *   "Channels" section toggle on the Index page ("+ More channels").
    *   Audio streaming modals on Project pages (open/close via button, deep-link `?listen=1`, close via Esc/backdrop).
*   **Forms & User Input:**
    *   "Archive Submissions" form validation (required fields).
    *   Form submission flow via Web3Forms API (mocked for automation).
    *   Custom Success Popup (appearance, closing via button, backdrop, and Esc key).
*   **Content & Assets:**
    *   Correct titles and meta descriptions (SEO baseline).
    *   External links (YouTube, Audius, streaming platforms) open in new tabs (`target="_blank"`).
*   **UI/UX & Responsiveness:** Display across Desktop (1440px), Tablet (768px), and Mobile (375px).
*   **Accessibility (A11y):** Semantic HTML, ARIA attributes, contrast, and keyboard navigation.

### 2.2. Out of Scope
*   Backend API testing (Web3Forms is a third-party service, we only test the frontend integration).
*   Load/Performance testing (Static site, low traffic expected).
*   Visual regression testing (for this phase, will be considered in the future).

## 3. Testing Types & Levels
### 3.1. Testing Types
*   **Smoke Testing:** Initial verification that critical paths (navigation, page loading) work.
*   **Functional Testing:** Verification of specific features (filters, modals, forms) against requirements.
*   **UI/UX Testing:** Checking layout, fonts, colors, and responsive behavior.
*   **Accessibility Testing:** Using `@axe-core/playwright` to scan for critical a11y violations.
*   **Cross-Browser Testing:** Execution of tests across Chromium, Firefox, and WebKit (Safari).
*   **Regression Testing:** Ensuring new changes (like adding the Signal Room) do not break existing functionality.

### 3.2. Testing Levels
*   **System Testing:** Testing the complete application as a whole.
*   **Integration Testing:** Testing the interaction between HTML, CSS, JS, and third-party APIs (Web3Forms).

## 4. Test Environment
### 4.1. Environments
*   **Local Environment:** Static HTTP server (e.g., `python -m http.server 8000`).
*   **Production Environment:** GitHub Pages (`https://rtvarchive.github.io`).

### 4.2. Tools & Tech Stack
*   **Test Automation Framework:** Playwright (Node.js).
*   **Design Pattern:** Page Object Model (POM).
*   **A11y Scanner:** `@axe-core/playwright`.
*   **CI/CD:** GitHub Actions.
*   **Browsers:** Chromium, Firefox, WebKit.

## 5. Test Strategy & Approach
*   **Manual Testing:** Exploratory testing for visual bugs, layout shifts, and specific edge cases (e.g., checking the 404 TV test card on mobile).
*   **Automated Testing:** Implementation of a smoke suite covering navigation, forms, and modals. Tests will run on every push to the `main` branch via GitHub Actions.

## 6. Entry & Exit Criteria
### 6.1. Entry Criteria (When we can start)
*   All HTML/CSS/JS files are prepared and stable.
*   `data-testid` attributes are implemented on all key interactive elements.
*   Local server is running, and the site is accessible.

### 6.2. Exit Criteria (When we consider testing done)
*   All planned automated smoke tests are passing (Green build in CI).
*   No open critical (Blocker) or high-severity bugs.
*   A11y scan shows no critical violations.
*   The "Signal Room" page is implemented and tested.
*   STR (Software Test Report) is signed off.

## 7. Deliverables
1.  **STP** (This document).
2.  **STD** (Test Design: Test Cases & Checklists).
3.  **Automation Code** (Playwright scripts).
4.  **Bug Reports** (Logged via the "Signal Room" form or GitHub Issues).
5.  **STR** (Final Test Report).

## 8. Roles & Responsibilities
*   **Product Owner:** Defines requirements (e.g., "No modern glossy pop production", "All modals must have data-testid").
*   **QA Engineer:** Writes test cases, executes manual tests, creates automation scripts (Playwright), reports bugs, and writes the STR.

## 9. Risks & Mitigations
*   **Risk:** Web3Forms API spam during automated tests.
    *   *Mitigation:* Mock the network request in Playwright using `page.route()`.
*   **Risk:** Fonts or images not loading in CI environment.
    *   *Mitigation:* Ensure all assets are statically hosted in the repo; wait for `networkidle` in tests.
*   **Risk:** Flaky tests due to animations (modals fading in).
    *   *Mitigation:* Use `waitForSelector` with `state: 'visible'` or add `--disable-animations` flags.