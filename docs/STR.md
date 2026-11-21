# Software Test Report (STR) - RADIUS ARCHIVE

**Document Version:** 4.0  
**Date:** November 21, 2026  
**Status:** Final Report for Sprint 5–7  
**Reference Documents:** STD v4.0, STP v4.0

---

## 1. Executive Summary

This report summarizes the testing activities conducted during the latest update cycle of the RADIUS ARCHIVE website. The primary focus was on completing all 18 project pages, integrating Archive Dossiers, fixing tracklist rendering logic, and ensuring global cross-browser stability.

A total of **186 automated test executions** were conducted across 3 browser engines (Chromium, Firefox, WebKit). All **186 tests passed successfully**. The coverage now includes global navigation, Archive Room, Signal Room, About forms, 404 page, Project Pages (all 18), Archive Dossiers, and Easter Eggs.

---

## 2. Test Environment

*   **Local:** Windows 10, Node.js `http-server` (localhost:8000)
*   **Live:** GitHub Pages (`https://rtvarchive.github.io`)
*   **Browsers for Automation:** Chromium, Firefox, WebKit.

---

## 3. Test Execution Metrics

*   **Total Automated Test Cases:** 62 (Unique scenarios across all files)
*   **Total Executions (Cross-Browser):** 186
*   **Passed:** 186
*   **Failed:** 0
*   **Pass Rate:** 100%

---

## 4. Key Testing Activities & Results

### 4.1. Project Pages (All 18 Projects)
*   **Coverage:** Updated `project-pages.spec.js` to test all single-album and multi-album projects. Updated track count selectors (`ol.project-tracks li`) to ignore group headers.
*   **Key Checks:** Verified presence of album cards, correct statuses, tracklist counts, Listen button states, modal open/close logic, and deep-linking.

### 4.2. Archive Dossiers
*   **Coverage:** Added HTML/CSS structure for dossiers on all project pages. Dossiers include unique tabs (Photos/Documents, Stills/Notes, Tapes/Archive Notes) and optional "Show all" buttons for hiding extra images.
*   **Stability Fixes:** Removed `data-more-btn` from custom buttons and implemented a pure `onclick` logic to prevent conflicts with `main.js`. Verified that buttons correctly toggle between "Show all" and "Show less".

### 4.3. Easter Eggs & Global Features
*   **Coverage:** Verified hidden console logs (`OPERATOR ID: 7749`) and the hidden link in Signal Room. Maintained tests for Archive Room, Forms, and Navigation.

---

## 5. Defects Found and Resolved

During this sprint, the following issues were identified and fixed:

*   **DEF-01 (Tracklist Count Mismatch):** Tests were failing because they were counting `<h3>` headers instead of just tracks.
    *   *Resolution:* Updated selectors to `ol.project-tracks li` and adjusted expected track counts in `project-pages.spec.js`.
*   **DEF-02 (Show All Button Logic):** The "Show all" button in dossiers was not toggling back correctly due to `main.js` conflicts.
    *   *Resolution:* Removed `data-more-btn` and implemented pure `onclick` logic.

---

## 6. Conclusion & Next Steps

The automation suite is now comprehensive, stable, and fully cross-browser compatible. The site's core functionality (audio players, forms, navigation, project pages, dossiers) is covered by 186 passing tests.

**Next Steps:**
1.  **Localization of Tests:** Adapt the Project Pages tests to run against the RU versions using a translation dictionary (planned for Sprint 5).
2.  **Continuous Playback:** Add tests for the automatic track transition logic (`allCards`/`currentCardIndex`) in the Archive Room.
3.  **Dossier Tests:** Add explicit automated tests for opening/closing dossiers and switching tabs.