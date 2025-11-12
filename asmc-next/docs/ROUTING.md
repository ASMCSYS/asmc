# Routing

This project uses the Next.js Pages Router. Files under `pages/` map directly to routes.

## Core Routes
- `/` → `pages/index.js` (Home)
- `/events` → `pages/events/index.js` (Events list)
- `/events/booking/[event_id]` → event booking details
- `/facilities/[type]` → list of activities/halls by type
- `/booking/sports-booking/[activity_id]` → sports activity booking
- `/booking/hall-booking/[hall_id]` → hall booking
- Additional pages: `about-us`, `contact-us`, `faqs`, `membership`, `dashboard`, `booked-events`, `booked-halls`, `booked-activity`, `privacy-policy`, etc.

## Route Guards & Auth
- `components/auth/ValidateAuth`:
  - Reads token from cookie/URL and queries `/auth/me`
  - On success, sets `authSlice.isAuth` and `authSlice.authData`
  - Displays loader while fetching
  - Used on pages where being signed-in improves UX (but often with `redirect={false}`)

## Mobile App Integration
- `_app.js` checks `fromMobileApp` cookie. If present and route is not one of the booking routes, it redirects to `asmc-mobile-app:/callback` to close the WebView.
- Allowed paths while in mobile flow:
  - `/booking/sports-booking/[activity_id]`
  - `/events/booking/[event_id]`
  - `/booking/hall-booking/[hall_id]`

## Metadata & Head
- Pages define `<Head>` with title, description, viewport, and favicon links.

## Layout
- Layout is composed in containers with `components/includes/Header` and `Footer` per page/section.