# Software Test Documentation (STD) - RADIUS ARCHIVE

**Document Version:** 2.1  
**Date:** November 14, 2026  
**Status:** Active  
**Project:** RADIUS ARCHIVE (Static Website)  
**Repository:** GitHub Pages (`rtvarchive.github.io`)

---

## 1. Introduction

### 1.1. Purpose
This document defines the testing requirements, environment, and architectural constraints for the RADIUS ARCHIVE website. It serves as the foundation for the Test Plan (STP) and Test Report (STR).

### 1.2. Scope
The testing scope includes the EN and RU versions of the website, focusing on global navigation, the Archive Room (CRT & Tape Monitor players), Signal Room (interactive dashboard and forms), and About page (submission forms).

---

## 2. System Architecture & Environment

*   **Frontend Stack:** HTML5, CSS3, Vanilla JavaScript (ES6).
*   **Hosting:** GitHub Pages.
*   **External APIs:** YouTube IFrame Player API (Archive Room), Formspark (Form Submission).
*   **Testing Framework:** Playwright.
*   **Supported Browsers:** Chromium, Firefox, WebKit (Safari).
*   **Local Environment Constraint:** Testing must be performed via a local HTTP server (e.g., `npx http-server -p 8000`). Opening files directly via `file:///` protocol will block `fetch` requests and JSON loading due to CORS policies, leading to false negatives.

---

## 3. Functional Requirements (Updated)

### 3.1. Global Navigation & Layout
*   **Desktop/Mobile Split:** The full horizontal navigation menu must be visible on desktops. On mobile (screens < 720px), it must be hidden behind a "MENU" toggle button.
*   **Mobile Menu Behavior:** The "MENU" button must always remain visible and clickable (`z-index` > overlays). Clicking it must toggle the `.is-open` class on the navigation list.
*   **Layout Integrity:** Long, unbroken strings (e.g., error logs in Signal Room) must not break the layout. The CSS must enforce `word-break: break-all` and `overflow-wrap: anywhere`.

### 3.2. Archive Room (Section 01 - CRT Monitor / Кинескоп)
*   **Desktop:** Clicking a track must hide the standby image and load the YouTube video.
*   **Mobile (iOS/Android):**
    *   The YouTube player must include the `'playsinline': 1` parameter.
    *   No image overlays are allowed to cover the player.
    *   Clicking a track must immediately trigger the visual change and attempt playback synchronously.
*   **Testing Requirements:**
    *   Verify folder accordion expansion (adding `.is-open` class).
    *   Verify that clicking a track updates the UI (`#archive-log` and `#current-channel`).
    *   Verify catalog search functionality by project name and track name.
    *   Verify Next/Prev controls.

### 3.3. Archive Room (Section 02 - Reel-to-Reel / Бобины)
*   **Desktop:** Uses a visually hidden YouTube player (opacity: 0.01), controlled via custom UI knobs.
*   **Mobile:** Hidden players are blocked. The player must be visually exposed via the "Tape Monitor" UI window (`1:1` aspect ratio on mobile).
*   **Testing Requirements:**
    *   Verify release catalog loading and album accordion expansion.
    *   Verify clicking an album highlights the card and triggers the player window (`#streaming-youtube-player` receives `.is-active`).
    *   Verify release search functionality.
    *   Verify the Stop button resets the UI and stops reel animations.
    *   **Mocking:** Automated tests must intercept YouTube API requests (`https://www.youtube.com/iframe_api` and `embed/**`) to prevent real video loading and flakiness.

### 3.4. Forms (About Page & Signal Room)
*   **Service Provider:** Formspark (Endpoint: `https://submit-form.com/hiLPOJzWg`).
*   **Optimistic UI Logic:**
    *   Upon submission, the button text changes to "Transmitting..." and is disabled.
    *   **Crucial:** Regardless of the HTTP response (success, rate limit error, network failure), the form MUST reset, and the success modal MUST open. This guarantees a stable UI for the user.
    *   Actual API status (success/failure) must be logged to the browser console.
*   **Modal (Popup) Behavior:**
    *   The modal (`#success-modal`) must receive the `.is-active` class upon form submission.
    *   The modal must be closable via three methods: Click "Close", Click background overlay, Press `Escape`.

---

## 4. Non-Functional Requirements

### 4.1. Cross-Browser & Responsiveness
*   The site must be fully functional on Chrome, Firefox, Safari, and Edge.
*   Layout must adapt correctly from 320px (mobile) to 4K resolutions without horizontal scrollbars.
*   **Automated Testing:** All automated tests must pass in Chromium, Firefox, and WebKit environments.

### 4.2. Localization (i18n)
*   The EN (root) and RU (`/ru/`) versions must have 1:1 functional parity. 

---

## 5. Defect Management & Known Constraints

*   **Formspark Free Tier:** The free tier has a monthly submission limit. The "Optimistic UI" implementation ensures the UI does not break for the user.
*   **GitHub Pages Cache:** After pushing updates, there is a 1–3 minute delay for GitHub Actions to deploy. Testing must be done in Incognito mode.
*   **Video Autoplay Policies:** Mobile browsers strictly enforce autoplay policies. The system relies on user interaction with the YouTube player directly.
*   **Headless Browser Rendering:** Playwright's headless browsers may not trigger CSS animations instantly. Tests must use `scrollIntoViewIfNeeded()` and class assertions (`toHaveClass(/is-open/)`) instead of relying on pure visibility timeouts.