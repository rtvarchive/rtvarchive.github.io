# Software Test Report (STR)
**Project:** RADIUS ARCHIVE Web Application
**Version:** 1.1
**Date:** November 2026
**Author:** QA Engineer

## 1. Executive Summary
This document represents the final Software Test Report for the RADIUS ARCHIVE web application. The primary objective was to validate the functional, UI, and accessibility (A11y) aspects of the static multi-page website, including the newly implemented "Signal Room" (Аппаратная) feature.

Testing was conducted locally (Windows environment) and automated in the cloud via GitHub Actions. A total of 16 automated Playwright test cases were designed and executed across three major browser engines (Chromium, Firefox, WebKit). 

**Result:** All planned tests passed successfully (100% pass rate). The application is considered stable and ready for production.

## 2. Test Environment & Tools
- **Local Environment:** Windows 10, Node.js v20, PowerShell.
- **CI/CD Environment:** Ubuntu-latest (GitHub Actions).
- **Testing Framework:** Playwright (Node.js) with Page Object Model (POM).
- **A11y Scanner:** `@axe-core/playwright` (WCAG 2.0 A, AA, and WCAG 2.1 A, AA standards).
- **Browsers Tested:** 
  - Chromium (Desktop)
  - Firefox (Desktop)
  - WebKit (Safari Desktop)

## 3. Test Execution Summary
The following test suites were executed:

| Suite | Test Cases | Status |
| :--- | :--- | :--- |
| **Global Navigation & Language** | TC-NAV-01, TC-NAV-02 | ✅ Passed |
| **About Page - Form & Popup** | TC-ABT-01, TC-ABT-03, TC-ABT-05, TC-ABT-07 | ✅ Passed |
| **Projects Page - Filters & Statuses**| TC-PROJ-01, TC-PROJ-04 | ✅ Passed |
| **Project Detail - Listen Modal** | TC-PRJ-01, TC-PRJ-02, TC-PRJ-04 | ✅ Passed |
| **Signal Room (Аппаратная)** | TC-SIG-01, TC-SIG-02, TC-SIG-03 | ✅ Passed |
| **Accessibility (A11y) Scans** | TC-A11Y-01 (Home), TC-A11Y-02 (About) | ✅ Passed |

**Total Executions:** 48 (16 tests × 3 browsers).
**Passed:** 48.
**Failed:** 0.

## 4. Defects Found and Fixed During Testing
During the testing cycle, several defects were identified and resolved:

1. **UI/Functional (About Page):**
   - *Issue:* The modal overlay intercepted clicks even when hidden (`opacity: 0`, `display: flex`), causing form validation tests to fail.
   - *Fix:* Changed CSS to `display: none` by default, toggling to `display: flex` via `.is-active` class.
2. **Accessibility (Contrast):**
   - *Issue:* The "Submit Fragment" button had insufficient color contrast (3.42:1) against its background, violating WCAG AA.
   - *Fix:* Changed text color to `#ffffff`, raising the contrast ratio to an acceptable 4.8:1.
3. **Accessibility (Semantics):**
   - *Issue:* The Home page lacked an `<h1>` heading.
   - *Fix:* Added an invisible `<h1 class="sr-only">` for screen readers and SEO.
   - *Issue:* Invalid heading order in the footer (skipping from `<h1>` to `<h4>`).
   - *Fix:* Replaced `<h4>` tags with `<h2 class="foot__heading">` to maintain a logical document outline.

## 5. CI/CD Integration
A GitHub Actions workflow (`.github/workflows/playwright.yml`) was configured to run the entire test suite on every push to the `main` branch. 
The CI pipeline installs dependencies, installs Playwright browsers, runs tests, and uploads the HTML report as an artifact. 
The pipeline is currently green (passing).

## 6. Conclusion and Recommendations
The RADIUS ARCHIVE web application has successfully passed the QA phase. The core functionality (navigation, language switching, form submission, and modals) works reliably across all tested browsers. 

The high standards of Accessibility (A11y) are met. The **"Signal Room" (Аппаратная)** page has been successfully implemented and tested. It is fully integrated into the main navigation and ready for production use.

**Status: READY FOR RELEASE.**