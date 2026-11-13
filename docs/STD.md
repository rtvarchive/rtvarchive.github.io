# Software Test Documentation (STD) - RADIUS ARCHIVE

**Document Version:** 2.0  
**Date:** November 13, 2026  
**Status:** Active  
**Project:** RADIUS ARCHIVE (Static Website)  
**Repository:** GitHub Pages (`rtvarchive.github.io`)

---

## 1. Introduction

### 1.1. Purpose
This document defines the testing requirements, environment, and architectural constraints for the RADIUS ARCHIVE website. It serves as the foundation for the Test Plan (STP) and Test Report (STR).

### 1.2. Scope
The testing scope includes the EN and RU versions of the website, focusing on global navigation, the Archive Room (media players), Signal Room (interactive dashboard and forms), and About page (submission forms).

---

## 2. System Architecture & Environment

*   **Frontend Stack:** HTML5, CSS3, Vanilla JavaScript (ES6).
*   **Hosting:** GitHub Pages.
*   **External APIs:** YouTube IFrame Player API (Archive Room), Formspark (Form Submission).
*   **Testing Framework:** Playwright (Chromium, Firefox, WebKit).
*   **Local Environment Constraint:** Testing must be performed via a local HTTP server (e.g., `npx http-server -p 8000`). Opening files directly via `file:///` protocol will block `fetch` requests and JSON loading due to CORS policies, leading to false negatives.

---

## 3. Functional Requirements (Updated)

### 3.1. Global Navigation & Layout
*   **Desktop/Mobile Split:** The full horizontal navigation menu must be visible on desktops. On mobile (screens < 720px), it must be hidden behind a "MENU" toggle button.
*   **Mobile Menu Behavior:** The "MENU" button must always remain visible and clickable (`z-index` > overlays). Clicking it must toggle the `.is-open` class on the navigation list.
*   **Layout Integrity:** Long, unbroken strings (e.g., error logs in Signal Room) must not break the layout. The CSS must enforce `word-break: break-all` and `overflow-wrap: anywhere` to prevent horizontal scrolling that could push the "MENU" button off-screen.

### 3.2. Archive Room (Section 01 - CRT Monitor / Кинескоп)
*   **Desktop:** Clicking a track must hide the standby image and load the YouTube video.
*   **Mobile (iOS/Android):**
    *   The YouTube player must include the `'playsinline': 1` parameter to prevent forced full-screen mode.
    *   No image overlays (e.g., logo placeholders) are allowed to cover the player, as they block mobile users from tapping the YouTube "Play" button when autoplay is restricted.
    *   Clicking a track must immediately trigger the visual change and attempt playback synchronously.

### 3.3. Archive Room (Section 02 - Reel-to-Reel / Бобины)
*   **Desktop:** Uses a visually hidden YouTube player (opacity: 0.01), controlled via custom UI knobs.
*   **Mobile:** Hidden players are blocked by mobile browsers. The player must be visually exposed. 
    *   *Current Implementation:* A "Tape Monitor" UI window (`1:1` aspect ratio on mobile) displays the player. 
    *   Playback commands (`playVideo()`) must be bound synchronously to the click event to satisfy User Gesture requirements.

### 3.4. Forms (About Page & Signal Room)
*   **Service Provider:** All forms are migrated to Formspark (Endpoint: `https://submit-form.com/hiLPOJzWg`).
*   **Optimistic UI Logic:**
    *   Upon submission, the button text changes to "Transmitting..." and is disabled.
    *   **Crucial:** Regardless of the HTTP response (success, rate limit error, network failure), the form MUST reset (`form.reset()`), and the success modal MUST open. This guarantees a stable UI for the user.
    *   Actual API status (success/failure) must be logged to the browser console for debugging purposes.
*   **Modal (Popup) Behavior:**
    *   The modal (`#success-modal`) must receive the `.is-active` class upon form submission.
    *   The modal must be closable via three methods: 
        1. Clicking the "Close" button.
        2. Clicking outside the modal box (on the overlay).
        3. Pressing the `Escape` key.

---

## 4. Non-Functional Requirements

### 4.1. Cross-Browser & Responsiveness
*   The site must be fully functional on Chrome, Firefox, Safari, and Edge.
*   Layout must adapt correctly from 320px (mobile) to 4K resolutions without horizontal scrollbars.

### 4.2. Localization (i18n)
*   The EN (root) and RU (`/ru/`) versions must have 1:1 functional parity. 
*   All scripts (`main.js`), CSS fixes, and form behaviors must apply equally to both language versions.

---

## 5. Defect Management & Known Constraints

*   **Formspark Free Tier:** The free tier has a monthly submission limit. Once exceeded, API requests will fail. The "Optimistic UI" implementation ensures the UI does not break for the user.
*   **GitHub Pages Cache:** After pushing updates, there is a 1–3 minute delay for GitHub Actions to deploy. Testing must be done in Incognito mode or after clearing cache.
*   **Video Autoplay Policies:** Mobile browsers strictly enforce autoplay policies. The system relies on the user interacting with the YouTube player directly on mobile devices.