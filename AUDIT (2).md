# GDG on Campus AITR Portal Audit

**Review scope:** GDG on Campus AITR portal  
**Primary page reviewed:** `https://gdgocaitr.vercel.app/events`  
**Review date:** 2 October 2026  
**Devices:** Desktop and mobile responsive views

## 1. Overview

This audit reviews the GDG on Campus AITR portal for visual/responsive usability and selected functional behavior.

The review covers:
- Desktop and mobile presentation
- Events search
- Event filtering
- Event details navigation
- Recruitment navigation
- Announcements navigation
- Registrations navigation
- Certificate navigation

Only issues that were directly observed or reproducibly tested are listed as confirmed findings.

## 2. Desktop Review

### Positive observations

- The Events page has a clear information hierarchy with a page heading, description, recruitment banner, filters, search, event cards, and footer.
- The active navigation item is visually identifiable.
- Event cards present key information such as event type, date/time, title, description, venue, seat availability, and action buttons.
- The footer provides useful navigation, Google ecosystem links, contact information, and legal links.
- The event details page opened correctly from the Events page.
- The Recruitment page opened correctly from the navigation.

### UX suggestions

#### D-01 — Reduce excess vertical whitespace
**Priority:** Low

Some desktop views contain large areas of unused vertical space around the main content and footer.

**Suggestion:** Review section padding/min-height values so the page remains visually balanced while showing more useful content within the viewport.

#### D-02 — Consider making event cards more compact
**Priority:** Low

The event card uses a large image area, which makes the card vertically long.

**Suggestion:** Consider a slightly shorter image area or a more compact desktop card layout so users can scan multiple events more quickly.

## 3. Mobile Review

### Confirmed responsive observations

#### M-01 — Search controls are cramped on mobile
**Priority:** Medium

On the mobile Events page, the search input and Search button have limited horizontal space, and the placeholder text is truncated.

**Suggestion:** Give the search input more width, or stack the input and button vertically at small breakpoints.

#### M-02 — Footer text is relatively small on mobile
**Priority:** Medium

The mobile footer contains several groups of links and descriptive text at a small size, which can reduce readability.

**Suggestion:** Increase mobile footer body/link text size and line height slightly while preserving the stacked layout.

#### M-03 — Footer is very tall on mobile
**Priority:** Low

The multi-column desktop footer becomes a long vertically stacked section on mobile.

**Suggestion:** Consider collapsible footer groups on small screens, or reduce spacing/repeated content where appropriate.

#### M-04 — Event cards could be more compact on mobile
**Priority:** Low

The event card contains all required information, but its image and spacing make the card occupy a large portion of the viewport.

**Suggestion:** Slightly reduce image height and vertical spacing on mobile to improve event scanning.

## 4. Functional Testing

### F-01 — Events search: valid query
**Status:** Working

Searching for `AI` returned the AI-related workshop event.

### F-02 — Events search: no-result query
**Status:** Working

Searching for `xyzabc123` produced a `No events found` state.

### F-03 — Event filter
**Status:** Working

The Filter control opened and filtering behaved as expected during manual testing.

### F-04 — View Details
**Status:** Working

The `View Details` action for the AI portfolio workshop opened its event details page successfully.

### F-05 — Apply Now
**Status:** Working

The recruitment banner's `Apply Now` action opened the Recruitment page successfully.

### F-06 — Announcements navigation
**Status:** Working

The Announcements navigation opened the announcements page and displayed announcements.

### F-07 — Recruitment navigation
**Status:** Working

The Recruitment navigation opened the recruitment page.

### F-08 — Your Registrations navigation
**Status:** Working as navigation

The `Your Registrations` navigation opened the registrations page successfully.

### F-09 — Browse events link
**Status:** Working

From the empty registrations state, `Browse events` returned to the Events page.

### F-10 — Your Certificate navigation
**Status:** Working as navigation

The `Your Certificate` navigation opened the certificate page successfully.

### F-11 — View your registrations link
**Status:** Working

From the empty certificate state, `View your registrations` returned to the registrations page.

## 5. Confirmed Functional/Data Issues

### I-01 — Registered event missing from Your Registrations
**Priority:** High

**Observed behavior:** The signed-in user's `Your Registrations` page displayed `No registrations yet`.

**Context:** The user reported having previously registered for the Hands-on Workshop: Launch Your Portfolio Website with AI.

**Expected behavior:** A registered event should appear in the user's registrations list, with relevant registration/status information.

**Impact:** Users may be unable to verify their registration history or access associated event information.

**Suggested investigation:** Check registration persistence and account-to-registration data synchronization for past events.

> Note: The audit reports the observed portal state and does not assume the technical cause.

### I-02 — Issued certificate missing from Your Certificate
**Priority:** High

**Observed behavior:** The `Your Certificate` page displayed `No certificates yet`.

**Context:** The user reported that a certificate for the previously attended AI portfolio workshop had already been downloaded.

**Expected behavior:** An issued certificate should appear in the user's certificate/achievements section.

**Impact:** Users may be unable to retrieve or verify previously issued certificates through the portal.

**Suggested investigation:** Check certificate issuance records, user identity mapping, and certificate display/download data.

> Note: The audit reports the observed portal state and does not assume the technical cause.

## 6. Missing / Potentially Useful Features

These are suggestions for consideration rather than confirmed bugs.

### P-01 — Provide clearer empty-state recovery
**Priority:** Medium

The empty registration/certificate states already contain navigation links, which is useful. A small improvement would be to provide clearer guidance such as the relevant event history or a support/contact route when users believe their records are missing.

### P-02 — Provide account/data refresh guidance
**Priority:** Medium

For registration and certificate pages, consider a short troubleshooting option such as:
- refresh/reload data
- verify the signed-in account
- contact the team if an expected record is missing

## 7. Summary

The portal provides a clear responsive structure and several core navigation/search/filter actions work correctly during manual testing.

The most important findings from this review are:
1. A previously registered event was not shown under `Your Registrations`.
2. A previously issued certificate was not shown under `Your Certificate`.
3. The mobile Events search controls are cramped and truncate the placeholder.
4. Mobile footer typography and overall footer height could be improved for readability and scanning.

The functional/data issues should be investigated separately from the visual/UX suggestions, because the screenshots establish the visible behavior but do not establish the underlying technical cause.

## 8. Evidence Checklist

Recommended evidence filenames to add to the repository later:

- `evidence/desktop-events-top.png`
- `evidence/desktop-event-card.png`
- `evidence/desktop-footer.png`
- `evidence/mobile-events-top.png`
- `evidence/mobile-event-card.png`
- `evidence/mobile-footer.png`
- `evidence/search-no-results.png`
- `evidence/event-details.png`
- `evidence/recruitment-page.png`
- `evidence/registrations-empty.png`
- `evidence/certificate-empty.png`

## 9. Testing Note

This audit is based on visual inspection of supplied screenshots and manual functional checks performed during the review. Where the review could not establish an underlying technical cause, the finding is described as an observed behavior rather than a claim about implementation.
