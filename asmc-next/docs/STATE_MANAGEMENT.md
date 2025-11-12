# State Management

This application uses Redux Toolkit for local UI/auth state and RTK Query for server data caching and fetching.

## Store Configuration
- File: `redux/store.js`
  - Combines slices: `auth`, `common`, `masters`
  - Adds RTK Query reducers/middleware: `authApis`, `commonApis`, `mastersApis`
  - Disables serializable checks (cookies, router objects can be non-serializable)

## Slices

### authSlice (`redux/auth/authSlice.js`)
- State:
  - `isAuth: boolean`
  - `authData: object | null`
- Actions:
  - `setIsAuth(boolean)`
  - `setAuthData(object)`

### commonSlice (`redux/common/commonSlice.js`)
- State:
  - `dark_mode: 'light' | 'dark'`
  - `sidebar_open: boolean`
  - `snackbar: { open, message, severity }`
  - `authentication_loading: boolean`
- Actions:
  - `set_dark_mode(mode?)` (toggles when no payload)
  - `setSidebarMenu(boolean)`
  - `setSnackBar(payload)`
  - `setAuthenticationLoading({ state: boolean })`

### mastersSlice (`redux/masters/mastersSlice.js`)
- Currently minimal placeholder for future UI state.

## RTK Query APIs

### authApis (`redux/auth/authApis.js`)
- Base: `BaseUrl`, sets `Authorization` header from cookie token
- Endpoints:
  - `fetchSingleMember({ _id })` → `GET /members`
  - `fetchAuthUser()` → `GET /auth/me`
  - `fetchGuestBooking(params)` → `GET /events/guest-event-booking`
- Hooks:
  - `useFetchSingleMemberQuery`
  - `useFetchAuthUserQuery`
  - `useFetchGuestBookingQuery`

### commonApis (`redux/common/commonApis.js`)
- Endpoints:
  - `fetchPhotoGallery(params)` → `GET /masters/gallery` (parsed to images)
  - `fetchVideoGallery(params)` → `GET /masters/gallery` (YouTube thumb parser)
  - `fetchCommittessList(params)` → `GET /sanstha/members/committees`
  - `fetchMembersList(params)` → `GET /sanstha/members/list`
  - `insertContactUs(body)` → `POST /common/contact-us`
  - `getHomePageCms(params)` → `GET /common/home-page-cms`
  - `getAboutPageCms(params)` → `GET /common/about-page-cms`
  - `getSettings(params)` → `GET /common/settings-default`
- Hooks: `useFetchPhotoGalleryQuery`, `useFetchVideoGalleryQuery`, `useInsertContactUsMutation`, `useGetHomePageCmsQuery`, `useGetAboutPageCmsQuery`, `useGetSettingsQuery`, `useFetchMembersListQuery`, `useFetchCommittessListQuery`

### mastersApis (`redux/masters/mastersApis.js`)
- Endpoints:
  - `fetchBanner(params)` → `GET /masters/banner/list` (returns first banner via parser)
  - `fetchFacilityList(params)` → `GET /masters/facility/list`
  - `fetchActivityList(params)` → `GET /activity/active-list`
  - `fetchSingleActivity(params)` → `GET /activity`
  - `fetchHallsList(params)` → `GET /halls/active`
  - `fetchHallsBooked(params)` → `GET /halls/get-booked-halls-dates`
  - `fetchSingleHall(params)` → `GET /halls`
  - `fetchEventsList(params)` → `GET /events/list`
  - `fetchSingleEvent(params)` → `GET /events`
  - `fetchGallery(params)` → `GET /masters/gallery`
  - `fetchGalleryCategory(params)` → `GET /masters/gallery-category`
  - `fetchFaqs(params)` → `GET /masters/faqs/list`
  - `fetchFaqsCategories()` → `GET /masters/faqs/categories`
  - `fetchNotices(params)` → `GET /masters/notice/list`
  - `fetchTestimonials(params)` → `GET /masters/testimonials/list`
- Hooks exported for each endpoint

## Parsers
- `redux/common/commonParser.js`: transforms gallery and member data; generates YouTube thumbs
- `redux/masters/mastersParser.js`: normalizes facilities and banners; `activityParser` currently passes through `response`

## Usage Patterns

Example: using RTK Query in a component
```javascript
import { useFetchEventsListQuery } from '@/redux/masters/mastersApis';

const Events = () => {
  const { data: events, isLoading, error } = useFetchEventsListQuery({ active: true, sortBy: 1 });
  if (isLoading) return 'Loading...';
  if (error) return 'Failed to load';
  return events?.map(e => <div key={e._id}>{e.event_name}</div>);
};
```

Invalidation & Caching
- Tags (`providesTags`) are used to scope cache entries. Add `invalidatesTags` on mutations when implementing write ops.