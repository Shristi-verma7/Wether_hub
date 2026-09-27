# Weather Hub

Ek fullstack weather dashboard — Next.js (App Router) mein bana hua, jisme login/signup,
saved cities, 5-day forecast, custom weather alerts, aur ek interactive map hai.

## Features

- **Auth** — email/password signup & login (NextAuth.js, credentials provider, bcrypt-hashed passwords)
- **Saved cities** — city search (OpenWeatherMap Geocoding API) aur per-user saved list
- **Live weather + forecast** — current conditions aur 5-day outlook chart (Recharts)
- **Alerts** — apne thresholds set karo (temp above/below, rain, wind above) aur dashboard par
  dekho kaunse alerts abhi trigger ho rahe hain
- **Map** — saved cities Leaflet + OpenStreetMap map par, marker click karke temperature dekho

## Tech stack

- Next.js 14 (App Router, API routes as the backend)
- NextAuth.js (JWT sessions)
- Prisma ORM + SQLite (zero-config local database)
- Tailwind CSS
- Recharts (forecast chart) + React-Leaflet (map)
- OpenWeatherMap API (free tier)

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment variables** — copy the example file and fill it in:

   ```bash
   cp .env.example .env
   ```

   - `DATABASE_URL` — already set to a local SQLite file, no changes needed
   - `NEXTAUTH_SECRET` — generate one with `openssl rand -base64 32`
   - `NEXTAUTH_URL` — keep as `http://localhost:3000` for local dev
   - `OPENWEATHER_API_KEY` — free key from https://openweathermap.org/api
     (sign up → API keys tab → copy the default key; it can take a few minutes to activate)

3. **Set up the database**

   ```bash
   npx prisma migrate dev --name init
   ```

   This creates `prisma/dev.db` and the `User`, `City`, `Alert` tables.

4. **Run the dev server**

   ```bash
   npm run dev
   ```

   Open http://localhost:3000, create an account, and start adding cities.

## Project structure

```
src/
  app/
    api/            → backend: auth, register, geocode, weather, cities, alerts
    login/           register/     dashboard/     map/
    page.tsx        → landing page
  components/       → CityCard, ForecastChart, AddCityForm, AlertForm, AlertsPanel, MapView, Navbar
  lib/              → prisma client, NextAuth config, OpenWeatherMap helpers
  types/            → shared TypeScript types
prisma/schema.prisma → User / City / Alert models
```

## Notes

- Alerts check current conditions on demand (when the dashboard loads) rather than sending push
  notifications — there's no server running around the clock in local dev. To turn this into real
  push notifications you'd add a scheduled job (e.g. a cron-triggered API route or a queue) that
  calls `/api/alerts/check` for every user and sends an email/push when something is triggered.
- Switching `DATABASE_URL` to Postgres/MySQL only needs a `provider` change in
  `prisma/schema.prisma` plus a new `prisma migrate dev` — the rest of the app is unaffected.


#run command
#npm run dev