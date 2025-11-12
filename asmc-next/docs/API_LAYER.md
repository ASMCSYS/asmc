# API Layer

The app uses two complementary approaches for HTTP:
- RTK Query (`redux/*/*Apis.js`) for declarative data fetching and caching
- Axios wrappers in `apis/*.api.js` for imperative flows (payments, file upload, login)

## Axios Configuration
- File: `apis/axios-config.js`
  - Base URL: `utils/constants.BaseUrl`
  - `Authorization` header set from `utils/helper.getAuthToken()` (cookie `token`)
  - Exports `server` instance for reuse

```javascript
import { BaseUrl } from '@/utils/constants';
import { getAuthToken } from '@/utils/helper';
import axios from 'axios';

export const server = axios.create({
  baseURL: BaseUrl,
  headers: { Authorization: `Bearer ${getAuthToken()}` },
});
```

## Auth APIs (`apis/auth.api.js`)
- `login(data)` → `POST /auth/member-login`
- `fetchLoggedInUser()` → `GET /auth/me`
- `updateProfile(data)` → `PUT /members`
- `changePassword(data)` → `PUT /auth/change-password`
- `resetPassword(data)` → `PUT /auth/reset-password`
- `sendResetPasswordOtp(data)` → `POST /auth/send-reset-password-otp`

## Booking & Payment APIs (`apis/bookings.api.js`)
- `fetchSingleBooking(id)` → `GET /bookings?_id=<id>`
- `fetchSingleActivity({ activity_id })` → `GET /activity`
- `fetchAllActivity(params)` → `GET /activity/active-list`
- `addNewBooking(payload)` → `POST /bookings`
- `initiatePaymentApi(payload)` → `POST /payment/initiate-payment`
- `getNextPlan(params)` → `GET /plans/get-next-plan`
- `initiateRenewPaymentApi(payload)` → `POST /payment/renew-payment`
- `initiateBookingPaymentApi(payload)` → `POST /payment/booking-payment`
- Event bookings:
  - `initiateEventBookingApi(payload)` → `POST /events/event-booking`
  - `initiateEventBookingPaymentApi(payload)` → `POST /payment/initiate-event-payment`
- Hall bookings:
  - `initiateHallBookingApi(payload)` → `POST /halls/hall-booking`
  - `initiateHallBookingPaymentApi(payload)` → `POST /payment/initiate-hall-payment`
  - `initiateRemainHallBookingPaymentApi(payload)` → `POST /payment/initiate-remain-hall-payment`

## Common APIs (`apis/common.api.js`)
- `uploadSingleImage(formData)` → `POST /common/upload-single-image` (multipart)

## Events APIs (`apis/events.api.js`)
- `fetchEvents(params = { active: 'true' })` → `GET /events/list`

## Members APIs (`apis/members.api.js`)
- `fetchSingleMember(id)` → `GET /members?_id=<id>`
- `fetchTeamMember()` → `GET /members/team`
- `verifyMember(member_id)` → `GET /members/verify?member_id=<id>`

## Error Handling
- Most wrappers return `res.data`; some catch and return `error.response.data` or throw Error(message). Downstream components should account for both paths.

## When to use which
- Prefer RTK Query for idempotent reads and automatic caching.
- Use axios wrappers for transactional flows (login, uploads, payments) or when you need imperative control.