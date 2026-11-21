# Software Test Plan (STP) - RADIUS ARCHIVE

**Document Version:** 4.0  
**Date:** November 21, 2026  
**Status:** Active  
**Reference Document:** STD v4.0  

---

## 1. Introduction

### 1.1. Purpose
This Test Plan defines the strategy, approach, and specific test cases required to validate the RADIUS ARCHIVE website. It details how we will verify mobile video functionality, Formspark integration, layout fixes, Project Pages (all 18), Archive Dossiers, Easter Eggs, and automated tests.

### 1.2. Scope
The testing covers both EN (root) and RU (`/ru/`) language versions of the site. The primary focus areas are:
*   Archive Room (CRT Monitor & Tape Monitor players).
*   Form submission and modal interactions.
*   Global responsive navigation.
*   Project Pages (all 18 projects, including tracklists and dossiers).
*   Easter Eggs.

---

## 2. Test Items

*   **HTML Files:** All 18 project pages (e.g., `ritual84.html`, `kokle-dub.html`, `605.html`, `stormfront.html`, `embelion.html`, `dumbravadisko.html`, etc.) and their `/ru/` counterparts.
*   **JavaScript:** `assets/js/main.js`, inline scripts in `archive-room` and project pages.
*   **Data:** `archive-data.json`, `archive-data-ru.json`, `signal-status.json`.

---

## 3. Features to be Tested

### 3.1. Global Navigation & Layout
*   **TC-NAV-MOB-01:** Verify that clicking the "MENU" button on mobile screens toggles the navigation list.
*   **TC-NAV-LAYOUT-01:** Verify that long error strings in Signal Room do not cause horizontal scrolling.

### 3.2. Archive Room (Media Players)
*   **TC-ARC-01 (CRT):** Verify catalog loading and folder expansion.
*   **TC-ARC-02 (CRT):** Verify clicking a track updates the log and channel ID.
*   **TC-ARC-03 (CRT):** Verify search functionality.
*   **TC-ARC-04 (Reel):** Verify release catalog loading and album folder expansion.
*   **TC-ARC-05 (Reel):** Verify clicking an album activates the card and Tape Monitor.
*   **TC-ARC-06 (Reel):** Verify the Stop button resets the status.

### 3.3. Form Submissions (Optimistic UI)
*   **TC-FORM-01:** Verify that submitting a form changes the button text to "Transmitting..." and disables it.
*   **TC-FORM-02:** Verify that the form always resets and opens the `#success-modal`, regardless of the API response.

### 3.4. Modal Accessibility & Interactions
*   **TC-MODAL-01:** Verify the modal closes when clicking the "Close" button.
*   **TC-MODAL-02:** Verify the modal closes when clicking the background overlay.
*   **TC-MODAL-03:** Verify the modal closes when pressing the `Escape` key.

### 3.5. Project Pages (18 Projects)
*   **PP-01:** Verify that the correct number of album cards is rendered.
*   **PP-02:** Verify that statuses are correct for each album.
*   **PP-03:** Verify that tracklists display the correct number of tracks (using `ol.project-tracks li`).
*   **PP-04:** Verify Listen button state.
*   **PP-05:** Verify that clicking a Listen button opens the modal.
*   **PP-06:** Verify modal closes via close button.
*   **PP-07:** Verify modal closes by clicking the backdrop.
*   **PP-08:** Verify deep-link (`?listen=...`) opens the modal automatically.
*   **PP-09:** Verify platform links in the modal have valid `href` attributes.
*   **PP-10:** Verify "Copy Link" button triggers toast notification. (Requires mocking).
*   **PP-11 (New):** Verify Archive Dossier opens and closes correctly on each project page.
*   **PP-12 (New):** Verify that toggling tabs inside the dossier switches content correctly.

### 3.6. Easter Eggs
*   **EG-01:** Verify that `main.js` outputs the `OPERATOR ID: 7749` to the console.
*   **EG-02 (EN):** Verify that the hidden operator link exists in `signal-room-en.html` and leads to `/resume/`.
*   **EG-03 (RU):** Verify that the hidden operator link exists in `ru/signal-room.html` and leads to `/resume/`.

---

## 4. Test Approach & Strategy

### 4.1. Automated Testing (Playwright)
*   **Cross-Browser:** All tests executed against Chromium, Firefox, and WebKit.
*   **Mocking (Network Interception):** Formspark and YouTube API calls are mocked.
*   **Function Mocking (Clipboard):** `window.copyLink` is replaced via `page.evaluate`.
*   **Stability Techniques:** Use `scrollIntoViewIfNeeded()` and class assertions.

---

## 5. Pass/Fail Criteria

*   **PASS:** The observed behavior matches the STD requirements.
*   **FAIL:** The UI breaks, the modal fails to open, or media players fail to initialize.

---

## 6. Test Environment

*   **OS:** Windows 10/11
*   **Local Server:** Node.js `http-server` (port 8000)
*   **Browsers:** Chromium, Firefox, WebKit (via Playwright)
*   **Live Environment:** GitHub Pages (`https://rtvarchive.github.io`)

---

## 7. Risks and Mitigations

*   **Risk:** GitHub Pages deployment delays. *Mitigation:* Wait 2-3 minutes post-push.
*   **Risk:** Formspark API limits. *Mitigation:* Implemented "Optimistic UI" and automated API mocking.
*   **Risk:** YouTube API changes. *Mitigation:* Automated tests use mocked API responses.
*   **Risk:** Clipboard API restrictions. *Mitigation:* `copyLink` is mocked in tests.