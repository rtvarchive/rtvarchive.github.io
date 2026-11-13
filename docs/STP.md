# Software Test Plan (STP) - RADIUS ARCHIVE

**Document Version:** 2.0  
**Date:** November 13, 2026  
**Status:** Active  
**Reference Document:** STD v2.0  

---

## 1. Introduction

### 1.1. Purpose
This Test Plan defines the strategy, approach, and specific test cases required to validate the RADIUS ARCHIVE website. It details how we will verify the newly implemented mobile video functionality, the Formspark integration, and the layout fixes.

### 1.2. Scope
The testing covers both EN (root) and RU (`/ru/`) language versions of the site. The primary focus areas are:
*   Archive Room (CRT Monitor & Tape Monitor players).
*   Form submission and modal interactions (About & Signal Room).
*   Global responsive navigation (Mobile menu).
*   Layout stability (long text strings).

---

## 2. Test Items

*   **HTML Files:** `index.html`, `projects.html`, `archive-room-en.html`, `signal-room-en.html`, `about.html` (and their `/ru/` counterparts).
*   **JavaScript:** `assets/js/main.js` (Global logic, forms, modal handling).
*   **Data:** `archive-data.json`, `archive-data-ru.json`, `signal-status.json`.
*   **External Services:** YouTube IFrame API, Formspark API.

---

## 3. Features to be Tested

### 3.1. Global Navigation & Layout
*   **TC-NAV-MOB-01:** Verify that clicking the "MENU" button on mobile screens (< 720px) toggles the navigation list (`is-open` class).
*   **TC-NAV-LAYOUT-01:** Verify that long error strings in the Signal Room do not cause horizontal scrolling or push the "MENU" button off-screen.

### 3.2. Archive Room (Media Players)
*   **TC-ARC-CRT-01:** Verify that clicking a track plays the video in the CRT Monitor on desktop.
*   **TC-ARC-MOB-01:** Verify that the `playsinline` attribute is present in the YouTube player configuration to prevent full-screen takeover on iOS.
*   **TC-ARC-MOB-02:** Verify that clicking a track immediately hides the standby image overlay to expose the YouTube Play button (simulating mobile behavior).
*   **TC-ARC-REEL-01:** Verify that the Tape Monitor (`#streaming-youtube-player`) is visible and square on mobile view.
*   **TC-ARC-REEL-02:** Verify that clicking an album starts the playlist (synchronously binding to user gesture).

### 3.3. Form Submissions (Optimistic UI)
*   **TC-FORM-01 (EN/RU):** Verify that submitting a form (About / Signal Room) changes the submit button text to "Transmitting..." and disables it.
*   **TC-FORM-02 (EN/RU):** Verify that the form **always** resets and opens the `#success-modal` (`is-active` class), regardless of whether the Formspark API request succeeds or fails (mocking network error/rate limits).
*   **TC-FORM-03:** Verify that the browser console logs the actual API response (success or failure) without showing an `alert()` to the user.

### 3.4. Modal Accessibility & Interactions
*   **TC-MODAL-01:** Verify the modal closes when clicking the "Close" button.
*   **TC-MODAL-02:** Verify the modal closes when clicking the background overlay (`.modal-overlay`).
*   **TC-MODAL-03:** Verify the modal closes when pressing the `Escape` key.

---

## 4. Test Approach & Strategy

### 4.1. Automated Testing (Playwright)
*   Tests will be executed against a local server (`http://localhost:8000`) using Playwright.
*   **Mocking:** Because free form services (Formspark) have rate limits, API calls will be intercepted and mocked in Playwright to simulate both success (`200 OK`) and failure (`429 Too Many Requests`). The tests will assert that the UI behaves identically in both scenarios (Optimistic UI).
*   Viewport sizes will be simulated in Playwright to test mobile layouts (e.g., iPhone 12, Pixel 5).

### 4.2. Manual Testing
*   **Real Device Testing:** Mobile video playback (Archive Room) and layout rendering must be verified on actual iOS and Android devices, as Playwright cannot accurately simulate mobile media playback policies (User Gesture).
*   **Cache Busting:** All manual testing on GitHub Pages will be conducted in Incognito mode to avoid outdated cached files.

---

## 5. Pass/Fail Criteria

*   **PASS:** The observed behavior matches the STD requirements. UI interactions (clicks, modals, page loads) work without throwing unhandled JavaScript exceptions.
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
    *   *Mitigation:* Implemented "Optimistic UI" so the frontend always acts as if it succeeded. Automated tests will mock the API response.
*   **Risk:** YouTube API changes break the player.
    *   *Mitigation:* Use official IFrame API methods and monitor console errors during test execution.