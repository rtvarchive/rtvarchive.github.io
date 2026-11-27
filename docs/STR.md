# Software Test Report (STR) - RADIUS ARCHIVE

**Document Version:** 4.1  
**Date:** November 27, 2026  
**Status:** Final Report for Sprint 5–7 & Android Build  
**Reference Documents:** STD v4.1, STP v4.1

---

## 1. Executive Summary

This report summarizes the testing activities conducted during the latest update cycle of the RADIUS ARCHIVE website and the release of its Android mobile application. The primary focus was on completing all 18 project pages, integrating Archive Dossiers, fixing tracklist rendering logic, ensuring global cross-browser stability, and adapting the WebView for mobile playback.

A total of **186 automated test executions** were conducted across 3 browser engines (Chromium, Firefox, WebKit). All **186 tests passed successfully**. Additionally, manual testing was performed on the Android APK (Emulator API 37.0) to verify WebView-specific behaviors. The coverage now includes global navigation, Archive Room, Signal Room, About forms, 404 page, Project Pages, Dossiers, Easter Eggs, and the Mobile Download flow.

---

## 2. Test Environment

*   **Local (Web):** Windows 10, Node.js `http-server` (localhost:8000)
*   **Local (Android):** Android Studio, Emulator (Medium Phone API 37.0)
*   **Live:** GitHub Pages (`https://rtvarchive.github.io`), GitHub Releases (APK)
*   **Browsers for Automation:** Chromium, Firefox, WebKit.
*   **Mobile Runtime:** Android WebView (Capacitor).

---

## 3. Test Execution Metrics

*   **Total Automated Test Cases (Web):** 62 (Unique scenarios across all files)
*   **Total Executions (Cross-Browser):** 186
*   **Passed:** 186
*   **Failed:** 0
*   **Pass Rate (Web):** 100%
*   **Manual Android Checks:** 15 (Navigation, Player tap, Icon, Install flow) — All Passed.

---

## 4. Key Testing Activities & Results

### 4.1. Project Pages (All 18 Projects)
*   **Coverage:** Updated `project-pages.spec.js` to test all single-album and multi-album projects. Updated track count selectors (`ol.project-tracks li`) to ignore group headers.
*   **Key Checks:** Verified presence of album cards, correct statuses, tracklist counts, Listen button states, modal open/close logic, and deep-linking.

### 4.2. Archive Dossiers
*   **Coverage:** Added HTML/CSS structure for dossiers on all project pages. Dossiers include unique tabs and optional "Show all" buttons for hiding extra images.
*   **Stability Fixes:** Removed `data-more-btn` from custom buttons and implemented a pure `onclick` logic to prevent conflicts with `main.js`. Verified that buttons correctly toggle between "Show all" and "Show less".

### 4.3. Android App Integration (Capacitor)
*   **Coverage:** Wrapped the web project in Capacitor. Tested installation, startup, and core navigation on the Android emulator.
*   **WebView Autoplay Fix:** Verified that calling `loadVideoById` synchronously within the click handler works. Confirmed that removing the `origin` parameter and setting `opacity: 1` on the player container resolves the `NotAllowedError` on mobile.
*   **App Icon:** Generated and verified custom icon assets (`@capacitor/assets`).
*   **Mobile UX:** Verified that the "Signal Room" is removed from mobile navigation (accessible only via direct URL) and that the "Personnel File" Easter Egg is correctly placed in the About page.

### 4.4. Easter Eggs & Global Features
*   **Coverage:** Verified hidden console logs (`OPERATOR ID: 7749`) and the hidden link in Signal Room (Web) and About page (Mobile). Maintained tests for Archive Room, Forms, and Navigation.
*   **Download Flow:** Verified that the "Mobile Terminal" button in the homepage Archive section correctly points to the GitHub Releases APK.

---

## 5. Defects Found and Resolved

During this sprint, the following issues were identified and fixed:

*   **DEF-01 (Tracklist Count Mismatch):** Tests were failing because they were counting `<h3>` headers instead of just tracks.
    *   *Resolution:* Updated selectors to `ol.project-tracks li` and adjusted expected track counts in `project-pages.spec.js`.
*   **DEF-02 (Show All Button Logic):** The "Show all" button in dossiers was not toggling back correctly due to `main.js` conflicts.
    *   *Resolution:* Removed `data-more-btn` and implemented pure `onclick` logic.
*   **DEF-03 (Android WebView Autoplay Block):** YouTube player failed to play sound in the APK because `playVideo()` was wrapped in `setTimeout` and the player container had `opacity: 0`.
    *   *Resolution:* Removed `setTimeout`, set the player container to `opacity: 1`, and ensured `playVideo()` / `loadVideoById()` is called synchronously within the user tap handler.
*   **DEF-04 (Broken Paths after Relocation):** Moving `resume.html` to the root broke relative paths (`../assets/`).
    *   *Resolution:* Updated all paths in `resume.html` to remove `../`.

---

## 6. Conclusion & Next Steps

The automation suite is now comprehensive, stable, and fully cross-browser compatible. The site's core functionality (audio players, forms, navigation, project pages, dossiers) is covered by 186 passing tests. The Android APK successfully passes manual WebView-specific checks and is ready for public distribution via GitHub Releases.

**Next Steps:**
1.  **Localization of Tests:** Adapt the Project Pages tests to run against the RU versions using a translation dictionary (planned for Sprint 8).
2.  **Continuous Playback:** Add tests for the automatic track transition logic (`allCards`/`currentCardIndex`) in the Archive Room.
3.  **App Store Preparation:** If Google Play distribution is desired in the future, replace the debug APK with a release build (`.aab`), sign it, and prepare store listing assets.