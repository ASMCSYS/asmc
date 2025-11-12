# Environment & Configuration

## Environment Variables

- NEXT_PUBLIC_API_URL: Base URL for backend API. Used by `utils/constants.BaseUrl`.
- BASE_URL: Exposed in `next.config.mjs` but not used directly; prefer `NEXT_PUBLIC_API_URL`.

How they are wired:
- `utils/constants.js`:
  - `export const BaseUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.asmcdae.in";`
- `redux/*Apis.js` and `apis/*.api.js` use `BaseUrl` for HTTP calls.

## Next.js Config
- File: `next.config.mjs`
  - `reactStrictMode: true`
  - `images.domains`: `['localhost', 'api.asmcdae.in', 'ik.imagekit.io']`
  - `env`: Exposes `BASE_URL`, `NEXT_PUBLIC_API_URL` to the client bundle

## Runtime Cookies
- `token`: JWT token stored via `cookies-next` (primary for auth and axios headers)
- `fromMobileApp`: Signals WebView close behavior in `_app.js`
- `asmc_token`: Referenced in `utils/tokenHandler.getToken` (legacy/alternate). Prefer `token`.

## Node & Tooling
- Node: LTS recommended (>= 18)
- Package manager: npm (package-lock committed)
- Scripts:
  - `npm run dev`: Start dev server
  - `npm run build`: Production build
  - `npm start`: Start production server
  - `npm run lint`: Lint codebase

## Secrets Management
- Do not commit real API URLs or secrets.
- Provide `NEXT_PUBLIC_API_URL` via deployment environment or `.env.local` during development.

## Images & Static Assets
- Place favicons and static assets in `public/`.
- Remote images must be served from whitelisted domains in `next.config.mjs`.