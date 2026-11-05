# Software Test Design (STD)
**Project:** RADIUS ARCHIVE Web Application
**Version:** 1.0
**Date:** November 2026

## 1. Introduction
This document contains the detailed test design for the RADIUS ARCHIVE project. It outlines the specific test cases, preconditions, and steps required to verify the functionality, UI, and accessibility of the web application, as defined in the Software Test Plan (STP).

## 2. Test Cases Structure
Each test case includes:
- **ID:** Unique identifier (e.g., TC-NAV-01)
- **Title:** Short description of what is being tested
- **Priority:** High, Medium, Low
- **Preconditions:** What needs to be set up before the test
- **Steps:** Actionable steps to execute
- **Expected Result:** What should happen
- **Type:** Functional, UI, A11y, Regression

---

## 3. Test Suites (Features)

### Suite 1: Navigation & Layout (NAV)
*Checks the global header, menu, and language switcher across the site.*

| ID | Title | Priority | Preconditions | Steps | Expected Result | Type |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-NAV-01** | Header links navigation | High | Open `index.html` | 1. Click "Projects"<br>2. Click "About"<br>3. Click "Home" | User is redirected to the corresponding pages (`projects.html`, `about.html`, `index.html`). The active link has `aria-current="page"`. | Functional |
| **TC-NAV-02** | Language switcher (EN to RU) | High | Open `index.html` (EN) | 1. Click "RU" in the header | Page reloads, URL becomes `/ru/index.html`, language link has `.is-active` class. | Functional |
| **TC-NAV-03** | Mobile menu toggle | High | Set viewport to 375px width | 1. Click "Menu" button<br>2. Click "Projects" | Menu slides down, `aria-expanded="true"`. After clicking link, menu closes and navigates. | Functional |
| **TC-NAV-04** | 404 Page routing | Medium | On production server | 1. Navigate to `/non-existent-page` | Custom 404 page is displayed with "Signal Lost" heading and 404 test card image. | Functional |

### Suite 2: Projects Page (PROJ)
*Validates filters, cards, and data rendering.*

| ID | Title | Priority | Preconditions | Steps | Expected Result | Type |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-PROJ-01** | Filter by genre (Post-punk) | High | Open `projects.html` | 1. Click "Post-punk" filter chip | Grid shows only 605 Mikrorayon. Other cards are hidden (`display: none`). | Functional |
| **TC-PROJ-02** | "More" filters toggle | Medium | Open `projects.html` | 1. Click "+ More"<br>2. Click "- Less" | Hidden filters (Hip-Hop, Reggae, Broadcast, Classical) appear, then hide. Text toggles. | UI |
| **TC-PROJ-03** | Card hover & link | Low | Open `projects.html` | 1. Hover over "605 Mikrorayon" card<br>2. Click the card title | Card gets visual highlight. Clicking navigates to `605.html`. | UI |
| **TC-PROJ-04** | Status badges | High | Open `projects.html` | 1. Scroll to "ФАЗА/НОЛЬ"<br>2. Scroll to "Дима Милан" | ФАЗА/НОЛЬ has `data-status="available"` and text "AVAILABLE / LISTEN". Дима Милан has `data-status="soon"` and text "SOON". | Functional |

### Suite 3: About Page & Form (ABT)
*Validates the Web3Forms submission and custom popup.*

| ID | Title | Priority | Preconditions | Steps | Expected Result | Type |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-ABT-01** | Form validation (Empty) | High | Open `about.html` | 1. Leave fields empty<br>2. Click "Submit Fragment" | Form does not submit. Browser shows validation error on required fields. | Functional |
| **TC-ABT-02** | Form validation (Invalid URL) | High | Open `about.html` | 1. Enter "test" in Link field<br>2. Fill Description<br>3. Click Submit | Browser validates `type="url"` and blocks submission. | Functional |
| **TC-ABT-03** | Form successful submission | High | Open `about.html` (mock API) | 1. Fill Link and Description<br>2. Click Submit | Button text changes to "Transmitting...". Form hides, Popup appears (`submission-popup`). | Functional |
| **TC-ABT-04** | Popup close (Button) | High | Popup is open | 1. Click "Return to Archive" button | Popup disappears. Form remains hidden (or resets). | Functional |
| **TC-ABT-05** | Popup close (Escape key) | High | Popup is open | 1. Press `Escape` | Popup disappears. | Functional |
| **TC-ABT-06** | Popup close (Backdrop) | High | Popup is open | 1. Click outside the popup box (on overlay) | Popup disappears. | Functional |
| **TC-ABT-07** | Signal Room Link | Medium | Open `about.html` | 1. Check the "Signal Check" block | Link with `data-testid="signal-room-link"` exists. | UI |

### Suite 4: Project Detail & Modals (PRJ)
*Validates tracklists, streaming buttons, and modals on project pages.*

| ID | Title | Priority | Preconditions | Steps | Expected Result | Type |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-PRJ-01** | Modal open (Button) | High | Open `605.html` | 1. Click "Listen on all platforms" | Modal `#listen-modal` appears. CSS `display: block`. | Functional |
| **TC-PRJ-02** | Modal open (Deep link) | High | Navigate to `605.html?listen=1` | 1. Wait for page load | Modal opens automatically. | Functional |
| **TC-PRJ-03** | Modal Close (Escape) | High | Open `605.html` | 1. Open modal<br>2. Press `Escape` | Modal disappears. `body` scroll is restored. | Functional |
| **TC-PRJ-04** | Stream links presence | High | Open any project page | 1. Open modal<br>2. Check `platform-links` | Each `a` tag inside has a non-empty `href` attribute. | Functional |
| **TC-PRJ-05** | SOON project page status | High | Open `dimamilan.html` | 1. Check status badge<br>2. Check listen button | Badge says "SOON". Button has `disabled` attribute. | Functional |

### Suite 5: Accessibility (A11Y)
*Automated and manual a11y checks.*

| ID | Title | Priority | Preconditions | Steps | Expected Result | Type |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-A11Y-01** | Axe-core scan (Home) | Medium | Open `index.html` | 1. Run `axe` scan | No critical or serious violations (e.g., missing alt text, bad contrast). | A11y |
| **TC-A11Y-02** | Axe-core scan (About) | Medium | Open `about.html` | 1. Run `axe` scan | No critical violations. Form labels are correctly linked to inputs. | A11y |

### Suite 6: Signal Room (SIG)
*Validates the functionality of the Signal Room (Аппаратная) page.*

| ID | Title | Priority | Preconditions | Steps | Expected Result | Type |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-SIG-01** | Request Latest Report | High | Open `signal-room-en.html` | 1. Click "Request Latest Report" button | Button text changes to "Requesting...", then "Report Received". Date updates to current time. | Functional |
| **TC-SIG-02** | Report Interference Form | High | Open `signal-room-en.html` | 1. Fill "Frequency" and "Description"<br>2. Click "File Report" | Form submits, button text changes to "Report Filed". Form resets. | Functional |
| **TC-SIG-03** | A11y Scan (Signal Room) | Medium | Open `signal-room-en.html` | 1. Run `axe` scan | No critical or serious violations. | A11y |

---

## 4. Out of Scope (for this phase)
*   Visual regression (Screenshot comparison).
*   Testing Web3Forms backend directly (we only mock the successful response).
*   Cross-device testing on real iOS/Android hardware (emulated viewports only).