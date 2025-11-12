# Troubleshooting

## 401 Unauthorized on API Calls
- Ensure `NEXT_PUBLIC_API_URL` is set and reachable.
- Confirm `token` cookie is present and valid.
- For RTK Query calls, headers are set via `prepareHeaders` using `getAuthToken()`.

## Token Cookie Name Mismatch
- `utils/helper.getAuthToken()` reads cookie `token`.
- `utils/tokenHandler.getToken()` looks for cookie `asmc_token`.
- Recommendation: Standardize on `token`. If integrating with mobile, ensure the cookie name matches the one your backend expects, or update `tokenHandler`/`helper` accordingly.

## Images Not Loading
- If remote images 404 or fail optimization, add the domain to `images.domains` in `next.config.mjs` and rebuild.

## AOS not animating
- AOS is initialized in `_app.js` within `useEffect`. Ensure components have proper `data-aos` attributes.

## Tawk Widget Missing
- The chat widget is injected in `_document.js`. Verify network allows `embed.tawk.to` and the widget ID is correct.

## Payment Redirects Fail
- The app posts to `/payment/*` endpoints; backend should return redirect URLs or tokens.
- Ensure `paymentUrl` in `utils/constants.js` is correct (production vs test URL commented).

## CORS Errors
- Backend must allow the frontend origin and include credentials if cookies are used.

## Build/Start Issues
- Run `npm run build` then `npm start`. Ensure Node >= 18.
- Clear `.next/` and reinstall modules if caching issues arise.