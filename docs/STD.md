# Software Test Documentation (STD) - RADIUS ARCHIVE

**Document Version:** 4.0  
**Date:** November 21, 2026  
**Status:** Active  
**Project:** RADIUS ARCHIVE (Static Website)  
**Repository:** GitHub Pages (`rtvarchive.github.io`)

---

## 1. Introduction

### 1.1. Purpose
This document defines the testing requirements, environment, and architectural constraints for the RADIUS ARCHIVE website. It serves as the foundation for the Test Plan (STP) and Test Report (STR).

### 1.2. Scope
The testing scope includes the EN and RU versions of the website, focusing on global navigation, the Archive Room (CRT & Tape Monitor players), Signal Room (interactive dashboard and forms), About page (submission forms), Project Pages (all 18 projects), Archive Dossiers, and Easter Eggs.

---

## 2. System Architecture & Environment

*   **Frontend Stack:** HTML5, CSS3, Vanilla JavaScript (ES6).
*   **Hosting:** GitHub Pages.
*   **External APIs:** YouTube IFrame Player API (Archive Room), Formspark (Form Submission).
*   **Testing Framework:** Playwright.
*   **Supported Browsers:** Chromium, Firefox, WebKit (Safari).
*   **Local Environment Constraint:** Testing must be performed via a local HTTP server (e.g., `npx http-server -p 8000`). Opening files directly via `file:///` protocol will block `fetch` requests and JSON loading due to CORS policies.

---

## 3. Functional Requirements

### 3.1. Global Navigation & Layout
*   **Desktop/Mobile Split:** The full horizontal navigation menu must be visible on desktops. On mobile (screens < 720px), it must be hidden behind a "MENU" toggle button.
*   **Layout Integrity:** Long, unbroken strings must not break the layout. The CSS must enforce `word-break: break-all` and `overflow-wrap: anywhere`.

### 3.2. Archive Room (Section 01 - CRT Monitor)
*   **Desktop:** Clicking a track must hide the standby image and load the YouTube video.
*   **Mobile (iOS/Android):** The YouTube player must include the `'playsinline': 1` parameter. No image overlays are allowed to cover the player.
*   **Testing Requirements:** Verify folder accordion, track click UI updates, search by project/track, and Next/Prev controls.

### 3.3. Archive Room (Section 02 - Reel-to-Reel)
*   **Desktop:** Uses a visually hidden YouTube player, controlled via custom UI knobs.
*   **Mobile:** The player must be visually exposed via the "Tape Monitor" UI window (`1:1` aspect ratio).
*   **Testing Requirements:** Verify release catalog loading, album click, search, and Stop button reset.

### 3.4. Forms (About Page & Signal Room)
*   **Service Provider:** Formspark.
*   **Optimistic UI Logic:** Regardless of the HTTP response, the form MUST reset, and the success modal MUST open. Actual API status is logged to the browser console.
*   **Modal Behavior:** Closable via "Close", background overlay, and `Escape`.

### 3.5. Project Pages (All 18 Projects)
*   **Album Cards:** Must display the correct number of album cards (1 for single-album projects, 3 for Ritual-84, 2 for Kokle Dub, etc.).
*   **Statuses:** Must correctly show `available` or `soon`.
*   **Tracklists:** Must correctly render tracks in groups (using `.tracklist-group`) and the total count must match the header.
*   **Listen Modal:** Opens via button or deep-link (`?listen=...`). Closes via button, backdrop, or `Escape`.
*   **Archive Dossier:** A collapsible section on each project page with dynamic tabs (e.g., Photos/Documents, Stills/Notes). Must toggle open/close correctly. For projects with >5 images, a "Show all" button must reveal hidden images and change its text (e.g., to "Show less" / "Свернуть").

### 3.6. Easter Eggs
*   **Console Logs:** `main.js` must output specific styled messages (`OPERATOR ID: 7749`).
*   **Hidden Link:** Signal Room (EN & RU) must contain a small, visible link leading to `/resume/`.

---

## 4. Non-Functional Requirements

### 4.1. Cross-Browser & Responsiveness
*   The site must be fully functional on Chrome, Firefox, Safari, and Edge.
*   Layout must adapt correctly from 320px (mobile) to 4K resolutions.
*   **Automated Testing:** All automated tests must pass in Chromium, Firefox, and WebKit environments.

### 4.2. Localization (i18n)
*   The EN (root) and RU (`/ru/`) versions must have 1:1 functional parity.

---

## 5. Defect Management & Known Constraints

*   **Formspark Free Tier:** Has a monthly submission limit. "Optimistic UI" ensures the UI does not break.
*   **GitHub Pages Cache:** 1–3 minute delay for deployment.
*   **Video Autoplay Policies:** Mobile browsers strictly enforce autoplay policies.
*   **Headless Browser Rendering:** Playwright's headless browsers may not trigger CSS animations instantly. Tests must use `scrollIntoViewIfNeeded()` and class assertions.
*   **Clipboard API:** Tests checking the "Copy Link" toast must mock `window.copyLink` via `page.evaluate`.