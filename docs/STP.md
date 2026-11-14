# Software Test Plan (STP) - RADIUS ARCHIVE

**Document Version:** 2.1  
**Date:** November 14, 2026  
**Status:** Active  
**Reference Document:** STD v2.1  

---

## 1. Introduction

### 1.1. Purpose
This Test Plan defines the strategy, approach, and specific test cases required to validate the RADIUS ARCHIVE website. It details how we will verify mobile video functionality, Formspark integration, layout fixes, and the newly automated Archive Room tests.

### 1.2. Scope
The testing covers both EN (root) and RU (`/ru/`) language versions of the site. The primary focus areas are:
*   Archive Room (CRT Monitor & Tape Monitor players, accordions, search).
*   Form submission and modal interactions (About & Signal Room).
*   Global responsive navigation (Mobile menu).
*   Layout stability (long text strings).

---

## 2. Test Items

*   **HTML Files:** `index.html`, `projects.html`, `archive-room-en.html`, `signal-room-en.html`, `about.html` (and their `/ru/` counterparts).
*   **JavaScript:** `assets/js/main.js` (Global logic, forms, modal handling), inline scripts in `archive-room`.
*   **Data:** `archive-data.json`, `archive-data-ru.json`, `signal-status.json`.
*   **External Services:** YouTube IFrame API, Formspark API.

---

## 3. Features to be Tested

### 3.1. Global Navigation & Layout
*   **TC-NAV-MOB-01:** Verify that clicking the "MENU" button on mobile screens (< 720px) toggles the navigation list (`is-open` class).
*   **TC-NAV-LAYOUT-01:** Verify that long error strings in the Signal Room do not cause horizontal scrolling or push the "MENU" button off-screen.

### 3.2. Archive Room (Media Players)
*   **TC-ARC-01 (CRT):** Verify catalog loading and folder expansion (`is-open` class).
*   **TC-ARC-02 (CRT):** Verify clicking a track updates the log (`#archive-log`) and channel ID (`#current-channel`).
*   **TC-ARC-03 (CRT):** Verify search functionality by project name.
*   **TC-ARC-04 (CRT):** Verify search functionality by track name (auto-expands folder).
*   **TC-ARC-05 (CRT):** Verify resetting the search restores all folders.
*   **TC-ARC-06 (Reel):** Verify release catalog loading and album folder expansion.
*   **TC-ARC-07 (Reel):** Verify clicking an album activates the card (`active` class) and the Tape Monitor.
*   **TC-ARC-08 (Reel):** Verify search functionality in releases.
*   **TC-ARC-09 (Reel):** Verify the Stop button resets the status to STANDBY and stops wheel animations.
*   **TC-ARC-10 (CRT):** Verify Next/Prev buttons navigate through the playlist.

### 3.3. Form Submissions (Optimistic UI)
*   **TC-FORM-01 (EN/RU):** Verify that submitting a form changes the submit button text to "Transmitting..." and disables it.
*   **TC-FORM-02 (EN/RU):** Verify that the form **always** resets and opens the `#success-modal` (`is-active` class), regardless of the Formspark API response.
*   **TC-FORM-03:** Verify that the browser console logs the actual API response without showing an `alert()`.

### 3.4. Modal Accessibility & Interactions
*   **TC-MODAL-01:** Verify the modal closes when clicking the "Close" button.
*   **TC-MODAL-02:** Verify the modal closes when clicking the background overlay.
*   **TC-MODAL-03:** Verify the modal closes when pressing the `Escape` key.

---

## 4. Test Approach & Strategy

### 4.1. Automated Testing (Playwright)
*   **Cross-Browser:** All tests will be executed against Chromium, Firefox, and WebKit to ensure maximum compatibility.
*   **Mocking (Network Interception):** 
    *   Formspark API calls are mocked to simulate success/failure without consuming real submission limits.
    *   YouTube API calls (`iframe_api` and `embed`) are mocked in Archive Room tests to prevent real video loading, reduce test execution time, and avoid flakiness.
*   **Stability Techniques:** Tests will use `scrollIntoViewIfNeeded()` and wait for specific CSS classes (e.g., `is-open`, `is-active`) rather than relying on fixed timeouts.

### 4.2. Manual Testing
*   **Real Device Testing:** Mobile video playback and layout rendering must be verified on actual iOS and Android devices.
*   **Cache Busting:** All manual testing on GitHub Pages will be conducted in Incognito mode.

---

## 5. Pass/Fail Criteria

*   **PASS:** The observed behavior matches the STD requirements. UI interactions work without throwing unhandled JavaScript exceptions.
*   **FAIL:** The UI breaks, the modal fails to open after form submission, the mobile layout suffers horizontal scrolling, or media players fail to initialize.

---

## 6. Test Environment

*   **OS:** Windows 10/11
*   **Local Server:** Node.js `http-server` (port 8000)
*   **Browsers:** Chromium, Firefox, WebKit (via Playwright)
*   **Live Environment:** GitHub Pages (`https://rtvarchive.github.io`)
*   **Devices:** Desktop, Android (Chrome), iOS (Safari)

---

## 7. Risks and Mitigations

*   **Risk:** GitHub Pages deployment delays cause tests to run against old code.
    *   *Mitigation:* Wait 2-3 minutes post-push and always use Incognito mode.
*   **Risk:** Formspark API limits block real submissions.
    *   *Mitigation:* Implemented "Optimistic UI" and automated API mocking.
*   **Risk:** YouTube API changes or blocking breaks the player.
    *   *Mitigation:* Automated tests use mocked API responses. Real-world mobile playback relies on synchronous user gestures and `playsinline`.