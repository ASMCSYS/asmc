# Booking Flows

This document outlines the three primary booking flows: Sports Activity, Hall, and Event.

## Shared Concepts
- Auth: Most bookings require an authenticated member (`token` cookie).
- Pricing/Plans: Retrieved via API (e.g., `getNextPlan`) when renewing.
- Payments: Initiated via `/payment/*` endpoints; integration with CCAvenue at `utils/constants.paymentUrl`.

## Sports Activity Booking
- Route: `/booking/sports-booking/[activity_id]`
- Data:
  - Activity details: `useFetchSingleActivityQuery({ activity_id })`
  - Facility list for breadcrumbs/banner: `useFetchFacilityListQuery`
- UI: `container/BookingDetails/BookingDetailsContainer.jsx` → `components/facility/BookingDetails`
- APIs (imperative):
  - `addNewBooking(payload)` → create booking
  - `initiateBookingPaymentApi(payload)` → start payment

## Hall Booking
- Route: `/booking/hall-booking/[hall_id]`
- Data:
  - Hall details: `useFetchSingleHallQuery({ hall_id })`
  - Booked dates: `useFetchHallsBookedQuery({ hall_id })`
- APIs:
  - `initiateHallBookingApi(payload)` → create hall booking
  - `initiateHallBookingPaymentApi(payload)` / `initiateRemainHallBookingPaymentApi(payload)`

## Event Booking
- Route: `/events/booking/[event_id]`
- Data:
  - Event details: `useFetchSingleEventQuery({ event_id })`
  - Banner: `useFetchBannerQuery({ type: 'events' })`
- UI: `container/EventBookingDetails/EventBookingDetailsContainer.jsx` → `components/event/BookingDetails`
- APIs:
  - `initiateEventBookingApi(payload)` → reserve slot
  - `initiateEventBookingPaymentApi(payload)` → payment

## Post-Payment
- The backend returns payment URLs or tokens for CCAvenue redirect.
- On success/failure, dedicated pages like `payment-status`, `pending-payment` reflect state from backend callbacks.

## Validation & Errors
- Validate auth via `ValidateAuth` component (non-blocking if `redirect={false}`).
- Show errors using `react-toastify`.

## Mobile App Integration
- When launched from the mobile app, `_app.js` ensures only booking routes remain open in WebView and otherwise deep-links back to close the WebView.