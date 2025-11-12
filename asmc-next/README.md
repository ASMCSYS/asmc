# ASMC Frontend (Next.js)

Next.js frontend for Anushaktinagar Sports Management Committee. Built with React, Redux Toolkit (RTK Query), SCSS, and Bootstrap.

## Quick Start

1. Install dependencies
   ```bash
   npm install
   ```
2. Create `.env.local` and set
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:7055
   ```
3. Run in development
   ```bash
   npm run dev
   ```
4. Build and start in production
   ```bash
   npm run build
   npm start
   ```

PM2 (optional)
```bash
pm2 start npm --name "asmc-next" -- start
```

Local: http://localhost:3000

## Scripts
- `dev`: Start Next.js dev server
- `build`: Build for production
- `start`: Start production server
- `lint`: Lint codebase

## Documentation
- Architecture: `docs/ARCHITECTURE.md`
- Environment & Config: `docs/ENVIRONMENT.md`
- State Management: `docs/STATE_MANAGEMENT.md`
- API Layer: `docs/API_LAYER.md`
- Routing: `docs/ROUTING.md`
- Components: `docs/COMPONENTS.md`
- Booking Flows: `docs/BOOKING_FLOWS.md`
- Style Guide: `docs/STYLE_GUIDE.md`
- Troubleshooting: `docs/TROUBLESHOOTING.md`
- Deployment: `docs/DEPLOYMENT.md`

Additional guides included:
- `docs/API_INTEGRATION_GUIDE.md`
- `docs/FRONTEND_USER_GUIDE.md`

## Tech Stack
- Next.js 14 (Pages Router)
- React 18
- Redux Toolkit + RTK Query
- Axios
- Bootstrap 5 / SCSS

## License
Private project. All rights reserved.
