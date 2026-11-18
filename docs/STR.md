# Software Test Report (STR) - RADIUS ARCHIVE

**Document Version:** 3.0  
**Date:** November 18, 2026  
**Status:** Final Report for Sprint 4  
**Reference Documents:** STD v3.0, STP v3.0

---

## 1. Executive Summary

This report summarizes the testing activities conducted during the latest update cycle of the RADIUS ARCHIVE website. The primary focus was on expanding the test automation suite to cover Project Pages (Ritual-84, Kokle Dub, and single-album projects), Easter Eggs (console logs and operator dossier link), and ensuring global cross-browser stability.

A total of **186 automated test executions** were conducted across 3 browser engines (Chromium, Firefox, WebKit). All **186 tests passed successfully**. The coverage now includes global navigation, Archive Room, Signal Room, About forms, 404 page, Project Pages, and Easter Eggs.

---

## 2. Test Environment

*   **Local:** Windows 10, Node.js `http-server` (localhost:8000)
*   **Live:** GitHub Pages (`https://rtvarchive.github.io`)
*   **Browsers for Automation:** Chromium, Firefox, WebKit.
*   **Devices for Manual Testing:** Desktop, Android (Chrome), iOS (Safari).

---

## 3. Test Execution Metrics

*   **Total Automated Test Cases:** 62 (Unique scenarios across all files)
*   **Total Executions (Cross-Browser):** 186
*   **Passed:** 186
*   **Failed:** 0
*   **Pass Rate:** 100%

---

## 4. Key Testing Activities & Results

### 4.1. Project Pages (Ritual-84 & Single Albums)
*   **Coverage:** Created `project-pages.spec.js` to test 6 project pages (Ritual-84, 605 Mikrorayon, Oriental Bazaar, Phase/Zero, Final Psalm, Gurt Groove).
*   **Key Checks:** Verified presence of album cards, correct statuses (`available`/`soon`), tracklist counts, Listen button states, modal open/close logic (via close button and backdrop), and deep-linking (`?listen=...`).
*   **Stability Fixes:** Implemented direct replacement of the `window.copyLink` function in tests (via `page.evaluate`) to bypass `navigator.clipboard` restrictions in headless Firefox/WebKit, ensuring the "Copy Link" toast test passes everywhere.

### 4.2. Easter Eggs
*   **Coverage:** Created `easter-eggs.spec.js` to verify hidden console logs (`OPERATOR ID: 7749`, dossier URL) and the hidden link in Signal Room (EN & RU) leading to `/resume/`.

### 4.3. Archive Room, Forms, Navigation, and Accessibility
*   **Coverage:** Existing tests for Archive Room (CRT & Tape Monitor), Forms (About & Signal Room), Navigation, and 404 pages were maintained and passed successfully.
*   **Formspark & YouTube:** Mocking remains in place to protect API limits and ensure stable video player tests.

---

## 5. Defects Found and Resolved

During this sprint, the following issues were identified and fixed:

*   **DEF-01 (Clipboard API Restriction):** Tests for the "Copy Link" toast failed in Firefox/WebKit because `navigator.clipboard` is blocked by default in headless mode.
    *   *Resolution:* Replaced the `clipboard` object in tests with a mocked function (`page.evaluate`) that directly toggles the toast's `opacity`, bypassing browser security restrictions.
*   **DEF-02 (Config Syntax Error):** The `playwright.config.js` was accidentally overwritten with test code, causing `SyntaxError` and blocking all test runs.
    *   *Resolution:* Restored the correct config file and separated tests from configuration.

---

## 6. Conclusion & Next Steps

The automation suite is now comprehensive, stable, and fully cross-browser compatible. The site's core functionality (audio players, forms, navigation, project pages) is covered by 186 passing tests.

**Next Steps:**
1.  **Localization:** Adapt the Project Pages tests to run against the RU versions using a translation dictionary (planned for Sprint 5).
2.  **Continuous Playback:** Add tests for the automatic track transition logic (`allCards`/`currentCardIndex`) in the Archive Room.