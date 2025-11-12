# Components Inventory

Below is a non-exhaustive map of key components and their roles.

## Layout (`components/includes`)
- `Header` (380+ lines): Global navigation, auth-aware links, and responsive menu.
- `Footer`: Site footer and useful links.

## Common (`components/common`)
- `Banner`: Page hero with breadcrumbs.
- `Loader`: Fullscreen or inline loading indicator.
- `Pagination`: Paged navigation control.
- `InputBox`: Styled input with error state (Formik-friendly).
- `ImageLightBox`, `LightboxHeader`: Gallery lightbox.
- `ScrollProgressBar`: Page scroll indicator.
- `Modal`, `TermsConditionModal`, `ImportantNote`: Modal utilities.
- `ToastContainer`: Wrapper to mount react-toastify container.

## Auth (`components/auth`)
- `SignIn`: Sign-in form UI.
- `ForgotPasswordForm`: Password reset form.
- `ValidateAuth`: Route-side auth validation and bootstrap.
- Various modals: `RenewModal`, `SlotsModal`, etc.

## Home (`components/home`)
- `MainBanner`, `VideoBanner`, `HomeAboutUs`, `MissionVision`
- `UpcomingEvents`, `EventsCalendar`, `OurSports`, `OurTeams`
- `Subscription`, `Testimonial`, `JoinSports`

## Facility & Event
- Facility
  - `components/facility/BookingDetails`: Displays activity details and drives sports/hall booking initiation.
  - `components/facility/ActivityCard`: Activity list item.
- Event
  - `components/event/BookingDetails`: Event detail and booking initiation.

## Containers (`container/*`)
- `HomePage`: Assembles home sections.
- `Dashboard`: Member area (profile, family, bookings, payments).
- `BookingDetails`: Activity booking details with facility banner context.
- `EventBookingDetails`: Event booking flow with banner context.
- Additional containers for Notices, Gallery, FAQs, etc.

## Usage Notes
- Most components accept plain props with data already shaped by parsers.
- For server data, prefer using RTK Query hooks within containers and pass results down.
- Use `ToastContainer` once per page/container to avoid duplicate toasts.