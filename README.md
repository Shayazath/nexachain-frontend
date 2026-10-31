# Nexachain AI — Frontend Dashboard

Responsive React dashboard for the Nexachain investment/referral technical-assessment demo.

## Stack

- React 18
- Vite 6
- React Router
- Recharts
- Lucide React
- CSS/Tailwind tooling

## Features

- User registration and login
- JWT-based API requests
- Dashboard summary cards and earnings chart
- Investment list and investment creation
- Direct referrals and nested referral tree
- ROI history, referral income history, and wallet ledger
- Loading, empty, and error states

## Setup (Windows PowerShell)

```powershell
npm ci
npm run dev
```

Open `http://localhost:5173`. During local development, Vite proxies `/api` requests to `http://localhost:5000`.

## Environment variables

Create `.env.local` for local development or configure the variable in Vercel:

```env
VITE_API_URL=http://localhost:5000
```

For production, set `VITE_API_URL` to the backend origin, without `/api`, for example:

```env
VITE_API_URL=https://nexachain-backend-git-525634051724.asia-south1.run.app
```

`VITE_*` variables are embedded into public browser assets. Never put secrets, database credentials, or JWT signing keys in frontend environment variables.

## Build

```powershell
npm run build
npm run preview
```

## Deployment (Vercel)

Import this repository into Vercel, set the project root to the repository root, use `npm run build` as the build command and `dist` as the output directory. Configure `VITE_API_URL` in Vercel and redeploy after changing it.

`vercel.json` rewrites client-side routes to `index.html`, allowing direct navigation and browser refresh on routes such as `/activity`, `/investments`, and `/referrals`.

Live application: https://nexachain-frontend-brown.vercel.app

## Backend

Backend API repository: https://github.com/Shayazath/nexachain-backend

Backend API: https://nexachain-backend-git-525634051724.asia-south1.run.app

The backend must allow the deployed frontend origin in its `CLIENT_ORIGIN` CORS configuration.
