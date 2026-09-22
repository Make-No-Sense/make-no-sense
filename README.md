# Make No Sense

Website and admin portal for Make No Sense, a Nashville food truck.

Production: [makenosense.info](https://www.makenosense.info)

## Overview

This is a Next.js application serving two audiences from one codebase:

- **Public site**: homepage, menu, find us, gallery, about, shop, contact. Content is managed by the client through Sanity, so menu items and copy can change without a code deploy.
- **Admin portal** (`/admin`): a password-protected inventory management system covering stock, usage, waste, team meals, staff hours, expenses, purchase orders, and a dashboard.

The two pull from different backends by design. Sanity holds editorial content the client edits directly. Supabase holds operational data (inventory counts, staff hours, expenses) which the client shouldn't touch outside the UI.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router), TypeScript |
| Styling | Tailwind CSS |
| CMS | Sanity (public content: menu, gallery, about, shop) |
| Database | Supabase (Postgres, admin portal data) |
| Email | Resend (contact form, low stock alerts) |
| Maps | Google Maps API (next event location) |
| Scheduling | Google Calendar API (live event schedule) |
| Payments | Square API (Phase 2, checkout not yet live) |
| Hosting | Vercel |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

Copy `.env.example` to `.env.local` and fill in values for:

- Sanity project ID, dataset, and API token
- Supabase URL and anon/service keys
- Resend API key
- Google Maps API key
- Google Calendar API credentials and calendar ID
- Site URL (`NEXT_PUBLIC_SITE_URL` or equivalent, used for metadata and redirects)

None of these are committed. Ask a maintainer for a working `.env.local` if `.env.example` doesn't exist yet.

## Scripts

```bash
npm run lint     # ESLint
npm run build    # Production build
npm run start    # Serve the production build locally
```

## Project Structure

```
src/
  app/                  Next.js App Router routes
    admin/              Password-protected IMS (inventory, staff, expenses, dashboard)
    menu/ find-us/ gallery/ about/ shop/ contact/
  sanity/
    schemaTypes/        Sanity content schemas
```

## Architecture Notes

**Content vs. data.** Sanity is treated as a headless CMS for anything the client edits herself: menu items, photos, page copy. Supabase is treated as the system of record for operational numbers that feed reporting: inventory levels, waste logs, hours worked. Keeping these separate means a content typo can't corrupt inventory math, and a bad admin entry can't take down the public site.

**Event location.** The Find Us page combines two live sources: Google Calendar for the schedule (with private/internal events filtered out before rendering) and Google Maps for plotting the next public event's location. Neither is cached long-term, so a schedule change reflects on the site without a redeploy.

**Email.** Resend handles two flows: the public contact form, and automated low-stock alerts triggered from the admin portal when inventory drops below threshold.

**Payments (in progress).** Square integration is scoped for Phase 2: checkout on the shop page plus a webhook that decrements Supabase inventory on sale. Not yet wired up.

## Branching

- `main`: production, deploys to makenosense.info
- `dev`: active development, merge here first

Open a PR from a feature branch into `dev`. Merge `dev` into `main` when ready to ship.

## Deployment

Hosted on Vercel, connected to this repo. Pushes to `main` deploy to production automatically; pushes to `dev` get preview deployments.

## Design System

| Name | Hex |
|---|---|
| Brick Red | `#B83232` |
| Deep Navy | `#1B3A5C` |
| Navy Black | `#12202E` |
| Warm Cream | `#FAF7F2` |
| Pale Blue | `#EAF0F7` |
| Muted Gold | `#D4A853` |

Fonts: Fredoka (display), DM Sans (body).

## Roadmap

- Square checkout and webhook integration
- ML-based demand forecasting and inventory depletion modeling, once enough usage/waste data has accumulated in Supabase
