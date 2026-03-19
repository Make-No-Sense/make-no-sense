@AGENTS.md

# Make No Sense — Claude Code Context

## Project
Food truck website for Make No Sense, Nashville TN.
Live site: makenosense.info

## Stack
- Next.js 14 App Router (TypeScript)
- Tailwind CSS
- Sanity.io (headless CMS)
- Vercel (hosting)
- Resend (contact form emails)
- Google Calendar API (event schedule)
- Street Food App (map embed widget)
- Stripe (Phase 2 — not yet)

## Color Palette
- Brick Red: #B83232 (CTAs, accents, prices)
- Deep Navy: #1B3A5C (headers, structure)
- Navy Black: #12202E (dark hero backgrounds)
- Warm Cream: #FAF7F2 (light page backgrounds)
- Pale Blue: #EAF0F7 (card backgrounds)
- Muted Gold: #D4A853 (prices, decorative accents)
- Soft Charcoal: #2E2E2E (body text)
- Slate: #6B7280 (muted text)

## Typography
- Display: Oswald (bold, all-caps headings)
- Body: Inter
- Mono/prices: Courier New

## File Structure
src/
  app/           → Next.js App Router pages
  components/    → UI components
    ui/          → Reusable primitives
    layout/      → Navbar, Footer
    home/        → Homepage sections
    menu/        → Menu components
    find-us/     → Map + schedule components
    gallery/     → Gallery components
  lib/           → Utilities, API helpers
sanity/
  schemas/       → Content models

## Coding Rules
- Always use TypeScript
- Always use Tailwind for styling — no inline styles, no CSS modules
- Use Next.js App Router patterns (not pages router)
- Server Components by default, Client Components only when needed
- Always use next/image for images
- Use next/font for Oswald and Inter
- All Sanity queries go in sanity/lib/queries.ts
- All Google Calendar logic goes in src/lib/calendar.ts
- Mobile-first responsive design always

## Sanity Schemas
- menuItem (name, slug, category, description, price, image, featured, available, badge)
- menuCategory (name, slug, sortOrder)
- galleryImage (image, alt, caption, category, featured)
- siteSettings (singleton — phone, email, socials, heroHeadline, googleCalendarId)

## Client Info
- Name: Natoya
- Phone: 615-663-3509
- Email: natoya@makenosense.info
- Domain: makenosense.info (GoDaddy DNS — do not touch registrar)