# ASMC Frontend Architecture

Version: 1.0.0
Last Updated: 2025-01

## Overview

This repository contains the ASMC (Anushaktinagar Sports Management Committee) frontend, built with Next.js (Pages Router) and React, styled with SCSS and Bootstrap, and using Redux Toolkit (including RTK Query) for state management and data fetching.

## Tech Stack
- Framework: Next.js 14 (Pages Router)
- Language: JavaScript (ES2020+)
- UI: React 18, Bootstrap 5, SCSS
- State: Redux Toolkit + RTK Query, React-Redux
- HTTP: Axios + RTK Query fetchBaseQuery
- Forms & Validation: Formik, Yup
- UX Libraries: AOS, react-toastify, react-responsive-modal, react-slick, lightgallery
- Date/Time: date-fns, react-datepicker

## Project Layout

```
/workspace
  ├─ pages/                     # Next.js pages (routing)
  │   ├─ _app.js                # App wrapper, global providers & AOS init
  │   ├─ _document.js           # Custom document (Tawk widget)
  │   ├─ index.js               # Home
  │   ├─ events/                # Events list & booking routes
  │   ├─ facilities/            # Facility pages
  │   ├─ booking/               # Sports & Hall booking dynamic routes
  │   └─ ...                    # Auth and other content pages
  ├─ components/                # Reusable presentational components
  │   ├─ common/                # Shared UI (Banner, Loader, Pagination, etc.)
  │   ├─ auth/                  # Auth UI (SignIn, ValidateAuth, etc.)
  │   ├─ home/                  # Home page sections
  │   └─ includes/              # Layout (Header, Footer)
  ├─ container/                 # Page-level containers and composition
  ├─ redux/                     # Redux Toolkit store, slices, and RTK Query APIs
  │   ├─ auth/                  # Auth slice + RTK Query endpoints
  │   ├─ common/                # CMS and common data
  │   └─ masters/               # Masters (facilities, activities, events, etc.)
  ├─ apis/                      # Axios-based API functions (non-RTK)
  ├─ utils/                     # Helpers, axios instance, constants, token handler
  ├─ styles/                    # SCSS and icon fonts
  ├─ public/                    # Static assets
  └─ docs/                      # Documentation
```

## Runtime Flow

1. App bootstrap
   - `pages/_app.js` imports global styles and initializes AOS.
   - Redux `Provider` wraps the app with the configured store (`redux/store.js`).

2. Routing
   - Next.js Pages Router maps files in `pages/` to routes.
   - Dynamic routes handle IDs for bookings/events (e.g., `events/booking/[event_id].js`, `booking/sports-booking/[activity_id].js`).

3. Authentication
   - Token is read from cookie via `utils/helper.getAuthToken()` (cookie key: `token`).
   - `components/auth/ValidateAuth` uses RTK Query (`useFetchAuthUserQuery`) to fetch `/auth/me` and populate `authSlice`.
   - `utils/tokenHandler` supports extracting `token` from URL and setting cookies during mobile app flows.

4. Data Fetching
   - RTK Query slices under `redux/*/*Apis.js` define endpoints and generate hooks (e.g., `useFetchEventsListQuery`).
   - Some screens use `apis/*.api.js` simple axios wrappers for imperative flows (payments, uploads, etc.).

5. State Management
   - `redux/store.js` combines domain slices (`auth`, `common`, `masters`) and RTK Query reducers/middleware.
   - Slices keep lightweight UI and auth state; server data is fetched via RTK Query and cached by tags.

6. Rendering & Layout
   - Layout components in `components/includes` (`Header`, `Footer`) wrap containers/pages.
   - Containers under `container/*` compose page sections and orchestrate data hooks.

## Authentication Flow
- On page mount, `ValidateAuth` (when rendered) triggers `useFetchAuthUserQuery` to call `/auth/me` if a token exists.
- On success, `authSlice` is updated via `setIsAuth(true)` and `setAuthData(authData)`.
- `utils/tokenHandler.handleTokenFromURL` can set `token` and `fromMobileApp` cookies from URL parameters when used in mobile WebView flows.
- `pages/_app.js` checks `fromMobileApp` cookie and triggers deep-link close for non-booking paths.

## API Layer
- RTK Query base URLs come from `utils/constants.BaseUrl` which reads `process.env.NEXT_PUBLIC_API_URL`.
- Additional axios instance (`apis/axios-config.js`) sets `Authorization: Bearer <token>` for ad-hoc requests.
- Key domains: `authApis`, `commonApis`, `mastersApis` cover the majority of GET endpoints; `apis/bookings.api.js` handles payment initiation and booking posts.

## Assets & Images
- Image optimization allows domains: `localhost`, `api.asmcdae.in`, `ik.imagekit.io` (`next.config.mjs`).
- Public static assets are under `public/`.

## Notable Integrations
- Tawk chat widget injected via `pages/_document.js`.
- AOS animations initialized globally in `_app.js`.
- React Toastify container is included within key containers for user feedback.

## Known Constraints
- This app uses the Pages Router (not the App Router). SSR/SSG can be added via data fetching methods if needed.
- Token cookie naming differs across helpers (`token` vs `asmc_token`). See Troubleshooting for details.