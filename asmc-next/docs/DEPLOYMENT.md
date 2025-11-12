# Deployment Guide

## Prerequisites
- Node.js LTS (>= 18)
- npm
- PM2 (optional, for process management)

## Environment
Set the following environment variables on the server:
- `NEXT_PUBLIC_API_URL=https://api.asmcdae.in` (or staging URL)

## Build & Run
```bash
npm ci
npm run build
npm start
```
The server listens on port 3000 by default.

## PM2
Start with PM2 (as in README):
```bash
pm2 start npm --name "asmc-next" -- start
```
Other useful commands:
```bash
pm2 list
pm2 logs asmc-next
pm2 restart asmc-next
pm2 delete asmc-next
```

## Reverse Proxy
- Use nginx or similar to proxy `https://yourdomain` → `http://127.0.0.1:3000`.
- Ensure headers for websockets/upgrade are forwarded (Next dev only).

## Static Assets & Images
- Public assets are served from `public/`.
- Add remote image domains to `next.config.mjs` and rebuild when needed.

## Monitoring & Error Reporting
- PM2 logs: `pm2 logs asmc-next`
- Consider adding external monitoring (uptime, error tracking) if required.